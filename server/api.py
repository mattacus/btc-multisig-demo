from flask import Blueprint
from blockstream_api import blockstream_api
from btc_util import get_latest_block_tip_txn

api = Blueprint("api", __name__)


@api.route("/tx/<int:tx_id>")
def tx(tx_id):
    return blockstream_api.tx_get_tx(tx_id)


@api.route("blocks/latest_txn")
def latest_txn():
    return get_latest_block_tip_txn().__repr__()


@api.route("/mempool/info")
def mempool_info():
    return blockstream_api.mempool_get_mempool_info()


@api.route("/mempool/fees")
def mempool_fees():
    return blockstream_api.mempool_get_fee_estimates()
