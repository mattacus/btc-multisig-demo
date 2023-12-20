import logging
from buidl import Tx, TxFetcher
from blockstream_api import blockstream


def get_latest_block_tip_txn():
    """
    Get the first transaction from the most recent block tip, as a Buidl Tx object.
    """
    latest_block_hash = blockstream.block_get_tip_block_hash()
    latest_txn = blockstream.block_get_transaction_at_index(latest_block_hash, 0)
    tx_obj = TxFetcher.fetch(latest_txn)

    return tx_obj
