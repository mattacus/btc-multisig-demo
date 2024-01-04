import logging
from buidl import TxFetcher, PrivateKey
from blockstream_api import blockstream
from util import format_plaintext_private_key_secret, sat_to_btc
from settings import TESTNET_SECRET_REACH, TESTNET_SECRET_HARVEST, BITCOIN_NETWORK


def get_latest_block_tip_txn():
    """
    Get the first transaction from the most recent block tip, as a Buidl Tx object.
    """
    latest_block_hash = blockstream.block_get_tip_block_hash()
    latest_txn = blockstream.block_get_transaction_at_index(latest_block_hash, 0)
    if latest_txn:
        tx_obj = TxFetcher.fetch(latest_txn, network="testnet")
        return tx_obj
    return None


def get_testnet_funding_addresses():
    """
    Return a list of available funding addresses for testing purposes
    """
    private_key_reach = PrivateKey(
        secret=format_plaintext_private_key_secret(TESTNET_SECRET_REACH)
    )
    private_key_harvest = PrivateKey(
        secret=format_plaintext_private_key_secret(TESTNET_SECRET_HARVEST)
    )
    funding_keys = [private_key_reach, private_key_harvest]

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
        return {
            "utxo_count": addr_info["chain_stats"]["funded_txo_count"],
            "funded_utxo_sum": sat_to_btc(addr_info["chain_stats"]["funded_txo_sum"]),
        }
    return {}
