from buidl.helper import hash256, little_endian_to_int
import math


def format_plaintext_private_key_secret(private_key_text):
    """
    Convert plaintext testnet private keys to an int
    """
    return little_endian_to_int(hash256(private_key_text.encode("utf-8")))


def btc_to_sat(btc_amount):
    """
    Convert a BTC amount to satoshis
    """
    return int(math.ceil(btc_amount * 100_000_000))
