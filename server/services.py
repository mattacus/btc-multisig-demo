import logging

from flask import jsonify
from buidl import PrivateKey
from buidl.tx import Tx, TxIn, TxOut
from buidl.script import RedeemScript
from buidl.helper import int_to_big_endian
from blockstream_api import blockstream
from util import (
    get_testnet_funding_private_keys,
    sat_to_btc,
    btc_to_sat,
    select_utxos_lifo,
    get_address_script_type
)
from calc_tx_size import calc_tx_size
from settings import BITCOIN_NETWORK, FEE_BUMP_SATS


def get_testnet_funding_addresses():
    """
    Return a list of available funding addresses for testing purposes
    """

    funding_keys = get_testnet_funding_private_keys()
    legacy_addresses = [
        key.point.address(network=BITCOIN_NETWORK) for key in funding_keys
    ]
    segwit_addresses = [
        key.point.p2wpkh_address(network=BITCOIN_NETWORK) for key in funding_keys
    ]

    return legacy_addresses + segwit_addresses


def get_address_basic_info(address):
    """
    Given an address, return basic info about it
    """
    addr_info = blockstream.addr_get_address_info(address)
    if addr_info:
        chain_stats = addr_info["chain_stats"]
        return {
            "unspent_utxo_count": chain_stats["funded_txo_count"]
            - chain_stats["spent_txo_count"],
            "unspent_utxo_sum": sat_to_btc(
                chain_stats["funded_txo_sum"] - chain_stats["spent_txo_sum"]
            ),
        }
    return {}


def construct_p2sh_address_redeem_script(pubkeys, quorum):
    """
    Reconstruct a Redeem Script from a combination of public keys and a quorum
    """
    sorted_pubkeys = [pubkeys[i] for i in sorted(pubkeys)]

    if len(sorted_pubkeys) < 2:
        raise ValueError("Must provide at least two public keys")

    return RedeemScript.create_p2sh_multisig(
        quorum_m=quorum,
        pubkey_hexes=sorted_pubkeys,
        sort_keys=False,
    )


def create_p2sh_address_details(pubkeys, quorum):
    """
    Given a list of public keys, create a P2SH address and return it as well as the redeem script
    """
    try:
        redeem_script = construct_p2sh_address_redeem_script(pubkeys, quorum)

        return {
            "address": redeem_script.address(BITCOIN_NETWORK),
            "redeem_script": redeem_script.__repr__()
        }

    except Exception as e:
        logging.exception(e)
        return jsonify(error=str(e)), 400


def send_testnet_payment_from_funding_address(
    funding_address, destination_address, funding_amount_btc, fee_rate, publish=False
):
    """
    Send a payment from a special (funding) address to a destination address
    Only supports P2PKH and P2WPKH addresses
    """
    try:
        funding_keys = get_testnet_funding_private_keys()
        funding_private_key = None
        funding_address_type = get_address_script_type(funding_address)
        for key in funding_keys:
            if funding_address_type == "P2PKH":
                if key.point.address(network=BITCOIN_NETWORK) == funding_address:
                    funding_private_key = key
                    break
            elif funding_address_type == "P2WPKH":
                if key.point.p2wpkh_address(network=BITCOIN_NETWORK) == funding_address:
                    funding_private_key = key
                    break
        if not funding_private_key:
            raise Exception(f"No matching private key for address {funding_address}")

        funding_address_utxos = blockstream.addr_get_address_utxo(funding_address)
        funding_amount_sats = btc_to_sat(funding_amount_btc)
        spending_utxos = select_utxos_lifo(
            funding_address_utxos, funding_amount_sats
        )
        logging.info(f"Selected spending UTXOs: {spending_utxos}")
        spending_amount_sats = sum([utxo["value"] for utxo in spending_utxos])

        # Get TX Size Upper Bound
        tx_size_stats = calc_tx_size(
            input_script=(funding_address_type),
            input_count=len(spending_utxos),
            p2pkh_output_count=(1 if funding_address_type == "P2PKH" else 0),
            p2wpkh_output_count=(1 if funding_address_type == "P2WPKH" else 0),
            p2sh_output_count=1
        )
        tx_size = tx_size_stats["tx_vbytes"]
        logging.info(f"Calculated transaction size upper bound: {tx_size_stats["tx_vbytes"]} vbytes")

        tx_fees = tx_size * fee_rate + FEE_BUMP_SATS
        final_change_amount = spending_amount_sats - funding_amount_sats - tx_fees
        if final_change_amount < 0:
            raise Exception(
                f"Insufficient UTXO total to cover transaction fees. \
                Short by {abs(final_change_amount)} sats. Try a lower fee rate, or reduce the transaction amount"
            )

        tx_ins = []
        for utxo in spending_utxos:
            tx_ins.append(TxIn(bytes.fromhex(utxo["txid"]), utxo["vout"]))
        tx_outs = [
            TxOut.to_address(destination_address, funding_amount_sats),
            TxOut.to_address(
                funding_address, final_change_amount
            ),  # change address is funding address, these are testnet coins for funding so not worried about address reuse
        ]
        funding_tx = Tx(
            1, tx_ins, tx_outs, 0, network=BITCOIN_NETWORK,
            segwit=(funding_address_type == "P2WPKH")
        )

        for i in range(len(funding_tx.tx_ins)):
            sig_valid = funding_tx.sign_input(i, funding_private_key)
            if not sig_valid:
                raise Exception("Unable to sign transaction inputs")

            logging.info(f"Funding transaction: {funding_tx}")

        if publish:
            tx_raw = funding_tx.serialize().hex()
            logging.info(f"Publishing transaction: {tx_raw}")
            response = blockstream.tx_post_tx(tx_raw)
            if response and response.status_code == 200:
                logging.info("Transaction published successfully!")
                return {"tx_id": funding_tx.id(), "status": "success"}
            else:
                logging.error("Error publishing transaction")
                return jsonify(error="Error publishing transaction"), 400

        return {"tx_id": funding_tx.id(), "status": "debug"}
    except Exception as e:
        logging.exception(e)
        return jsonify(error=str(e)), 400


def create_unsigned_transaction_multisig(send_address, receive_address, send_amount_btc, fee_rate, public_keys, quorum):
    """
    Create an unsigned transaction for sending coins from a multisig address to another single address
    Return the raw transaction object as well as the signature hashes for signing on the frontend with a hardware wallet
    """
    try:
        send_address_script_type = get_address_script_type(send_address)
        receive_address_script_type = get_address_script_type(receive_address)
        if send_address_script_type not in ["P2SH", "P2WSH"]:
            raise Exception("This endpoint only supports P2SH and P2WSH multisig spending addresses")
        is_segwit_tx = send_address_script_type == "P2WSH"

        if not public_keys or not quorum:
            raise Exception("Must provide public keys and quorum for redeem script construction")

        if send_address_script_type == "P2SH":
            redeem_script = construct_p2sh_address_redeem_script(public_keys, quorum)
        else:
            raise Exception("P2WSH not yet implemented")

        if redeem_script.address(BITCOIN_NETWORK) != send_address:
            raise Exception(f"Reconstructed multisig address does not match provided send address: {redeem_script.address(BITCOIN_NETWORK)} != {send_address}")

        sending_address_utxos = blockstream.addr_get_address_utxo(send_address)
        sending_amount_sats = btc_to_sat(send_amount_btc)
        spending_utxos = select_utxos_lifo(
            sending_address_utxos, sending_amount_sats
        )
        logging.info(f"Selected spending UTXOs: {spending_utxos}")
        available_spending_amount_sats = sum([utxo["value"] for utxo in spending_utxos])

        # Get TX Size Upper Bound
        tx_size_stats = calc_tx_size(
            input_script=(send_address_script_type),
            input_count=len(spending_utxos),
            p2pkh_output_count=(1 if receive_address_script_type == "P2PKH" else 0),
            p2wpkh_output_count=(1 if receive_address_script_type == "P2WPKH" else 0),
        )
        tx_size = tx_size_stats["tx_vbytes"]
        logging.info(f"Calculated transaction size upper bound: {tx_size} vbytes")

        tx_fees = tx_size * fee_rate + FEE_BUMP_SATS
        final_change_amount = available_spending_amount_sats - sending_amount_sats - tx_fees
        if final_change_amount < 0:
            raise Exception(
                f"Insufficient UTXO total to cover transaction fees. \
                Short by {abs(final_change_amount)} sats. Try a lower fee rate, or reduce the transaction amount"
            )

        tx_ins = []
        for utxo in spending_utxos:
            tx_ins.append(TxIn(bytes.fromhex(utxo["txid"]), utxo["vout"]))
        tx_outs = [
            TxOut.to_address(receive_address, sending_amount_sats),
            TxOut.to_address(
                send_address, final_change_amount
            ),  # change goes back to the same sending address for now
        ]
        unsigned_tx_obj = Tx(1, tx_ins, tx_outs, 0, network=BITCOIN_NETWORK, segwit=is_segwit_tx)
        logging.info(f"Created unsigned transaction: {unsigned_tx_obj}")

        signature_hashes = []
        if is_segwit_tx:
            raise Exception("P2WSH not yet implemented")
            # for i in range(len(unsigned_tx_obj.tx_ins)):
            #     # TODO: Add redeemscript, witness script
            #     signature_hashes.append(int_to_big_endian(unsigned_tx_obj.sig_hash_bip143(i), 32).hex())
        else:
            for i in range(len(unsigned_tx_obj.tx_ins)):
                signature_hashes.append(int_to_big_endian(unsigned_tx_obj.sig_hash_legacy(i, redeem_script), 32).hex())

        print("REDEEM SCRIPT")
        print(redeem_script.serialize().hex())

        print("OUTPUT SCRIPT")
        outputs_serialized = [tx_out.serialize().hex() for tx_out in unsigned_tx_obj.tx_outs]
        print(unsigned_tx_obj.tx_outs)
        print("".join(outputs_serialized))

        return {"tx_raw": unsigned_tx_obj.serialize().hex(), "sig_hash_list": signature_hashes}

    except Exception as e:
        logging.exception(e)
        return jsonify(error=str(e)), 400
