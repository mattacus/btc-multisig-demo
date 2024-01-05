from flask import Blueprint, request
from services import (
    get_latest_block_tip_txn,
    get_testnet_funding_addresses,
    get_address_basic_info,
    create_address_p2sh,
)
from blockstream_api import blockstream

api = Blueprint("api", __name__)


@api.route("blocks/latest_txn")
def latest_txn():
    return get_latest_block_tip_txn().__repr__()


@api.route("funding/addresses")
def funding_addresses():
    return get_testnet_funding_addresses()


@api.route("address/<address>/info")
def address_info(address):
    return get_address_basic_info(address)


@api.route("address/get_p2sh_multisig_address", methods=["POST"])
def get_p2sh_multisig_address():
    data = request.get_json()
    pubkeys = data.get("pubkeyList")
    quorum = data.get("quorum")
    return create_address_p2sh(pubkeys, quorum)
