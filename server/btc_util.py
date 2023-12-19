import logging
from lib.buidl.buidl import Tx, TxFetcher
from blockstream_api import blockstream_api


def get_latest_block_tip_txn():
    """
    Get the first transaction from the most recent block tip, as a Buidl Tx object.
    """
    latest_block_hash = blockstream_api.block_get_tip_block_hash()
    latest_txn = blockstream_api.block_get_block_transaction_by_id(latest_block_hash, 0)
    tx_obj = TxFetcher.fetch(latest_txn)

    return tx_obj
