from buidl import PrivateKey
from buidl.helper import hash256, little_endian_to_int
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


def select_address_utxos_lifo(utxos, transaction_total_sats):
    """
    Select UTXOS to fund a transaction, from a single address
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


def sign_all_transactions(tx_obj, private_key):
    """
    Sign all inputs in a transaction and make sure they are all valid
    """
    signatures_valid = True
    for i in range(len(tx_obj.tx_ins)):
        sig_valid = tx_obj.sign_input(i, private_key)
        if not sig_valid:
            signatures_valid = False
            break
    if not signatures_valid:
        raise Exception("Unable to sign transaction inputs")
