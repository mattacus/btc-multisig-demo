from flask import Blueprint
from services import get_latest_block_tip_txn, get_testnet_funding_addresses

api = Blueprint("api", __name__)


@api.route("blocks/latest_txn")
def latest_txn():
    return get_latest_block_tip_txn().__repr__()


@api.route("funding/addresses")
def funding_addresses():
    return get_testnet_funding_addresses()
