from flask import Blueprint
from btc_util import get_latest_block_tip_txn

api = Blueprint("api", __name__)


@api.route("blocks/latest_txn")
def latest_txn():
    return get_latest_block_tip_txn().__repr__()
