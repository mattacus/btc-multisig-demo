import logging

from flask import jsonify
from buidl import PrivateKey
from buidl.tx import Tx, TxIn, TxOut
from buidl.script import RedeemScript
from blockstream_api import blockstream
from util import (
    get_testnet_funding_private_keys,
    sat_to_btc,
    btc_to_sat,
    select_address_utxos_lifo,
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


def create_address_p2sh(pubkeys, quorum):
    """
    Given a list of public keys, create a P2SH address and return it as well as the redeem script
    """
    try:
        sorted_pubkeys = [pubkeys[i] for i in sorted(pubkeys)]

        if len(sorted_pubkeys) < 2:
            raise ValueError("Must provide at least two public keys")

        redeem_script = RedeemScript.create_p2sh_multisig(
            quorum_m=quorum,
            pubkey_hexes=sorted_pubkeys,
            sort_keys=False,
        )

        return {
            "address": redeem_script.address(BITCOIN_NETWORK),
            "redeem_script": redeem_script.__repr__(),
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
        is_segwit = False
        for key in funding_keys:
            if key.point.address(network=BITCOIN_NETWORK) == funding_address:
                funding_private_key = key
                break
            elif key.point.p2wpkh_address(network=BITCOIN_NETWORK) == funding_address:
                funding_private_key = key
                is_segwit = True
                break
        if not funding_private_key:
            raise Exception(f"No matching private key for address {funding_address}")

        funding_address_utxos = blockstream.addr_get_address_utxo(funding_address)
        funding_amount_sats = btc_to_sat(funding_amount_btc)
        spending_utxos = select_address_utxos_lifo(
            funding_address_utxos, btc_to_sat(funding_amount_btc)
        )
        logging.info(f"Selected spending UTXOs: {spending_utxos}")
        spending_amount_sats = sum([utxo["value"] for utxo in spending_utxos])

        # Get TX Size Upper Bound
        tx_size_stats = calc_tx_size(
            input_script=("P2PKH" if not is_segwit else "P2WPKH"),
            input_count=1,
            p2pkh_output_count=(1 if not is_segwit else 0),
            p2wpkh_output_count=(1 if is_segwit else 0),
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
            1, tx_ins, tx_outs, 0, network=BITCOIN_NETWORK, segwit=is_segwit
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
