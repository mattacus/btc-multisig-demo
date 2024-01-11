from buidl import PrivateKey
from buidl.helper import hash256, little_endian_to_int
from buidl.script import decode_bech32
from settings import TESTNET_FUNDING_ADDRESS_SECRETS
import math


def format_plaintext_private_key_secret(private_key_text):
    """
    Convert plaintext private keys to an int
    """
    return little_endian_to_int(hash256(private_key_text.encode("utf-8")))


def btc_to_sat(btc_amount):
    """
    Convert a BTC amount to satoshis
    """
    return int(math.ceil(btc_amount * 100_000_000))


def sat_to_btc(sat_amount):
    """
    Convert a satoshi amount to BTC
    """
    return sat_amount / 100_000_000


def get_testnet_funding_private_keys():
    """
    Get the keys used to secure your testnet funding addresses
    Secrets must be a comma-separated list of plaintext strings
    in the environment variable TESTNET_FUNDING_ADDRESS_SECRETS
    """
    keys = []
    for secret in TESTNET_FUNDING_ADDRESS_SECRETS.split(","):
        keys.append(PrivateKey(secret=format_plaintext_private_key_secret(secret)))
    return keys


def get_address_script_type(address):
    """
    Determine the script type of the address,
    for the address types supported by this application
    """
    if address[0] in ["1", "m", "n"]:
        return "P2PKH"
    elif address[0] in ["2", "3"]:
        return "P2SH"
    elif address[0:3] in ["bc1", "tb1"]:
        _, version, h = decode_bech32(address)
        if version == 0:
            if len(h) == 20:
                return "P2WPKH"
            elif len(h) == 32:
                return "P2WSH"
            else:
                raise Exception(f"{address} is not a valid bech32 address")
    else:
        raise Exception(f"Unsupported address type for address: {address}")


def select_utxos_lifo(utxos, transaction_total_sats):
    """
    Select UTXOS to fund a transaction, from a list of spent and unspent UTXOs
    Uses a simple LIFO strategy (use up oldest address UTXOs until transaction is funded)
    """
    selected_utxos = []
    selected_amount = 0
    usable_utxos = [
        utxo for utxo in utxos if utxo["status"]["confirmed"] and utxo["value"] > 0
    ]
    sorted_utxos = sorted(
        usable_utxos, key=lambda utxo: (utxo["status"]["block_height"], utxo["value"])
    )

    for utxo in sorted_utxos:
        selected_utxos.append(utxo)
        selected_amount += utxo["value"]
        if selected_amount > transaction_total_sats:
            break
    if selected_amount < transaction_total_sats:
        raise Exception(
            "Insufficient funds: {} BTC < {} BTC".format(
                sat_to_btc(selected_amount), sat_to_btc(transaction_total_sats)
            )
        )
    return selected_utxos
