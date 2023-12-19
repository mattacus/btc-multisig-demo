import logging
from lib.buidl.buidl import Tx, TxFetcher
from blockstream_api import blockstream_api


def get_latest_block_tip_txn():
    """
    Get the first transaction from the most recent block tip, as a Buidl Tx object.
    """
    latest_block = blockstream_api.block_get_tip_block_hash()
    logging.debug("Latest block: %s", latest_block)
