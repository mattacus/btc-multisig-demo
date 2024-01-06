from flask import Blueprint, request
from services import (
    get_testnet_funding_addresses,
    get_address_basic_info,
    create_address_p2sh,
    send_testnet_payment_from_funding_address,
)
from blockstream_api import blockstream

api = Blueprint("api", __name__)


@api.route("mempool/fee-estimates")
def fee_estimates():
    return blockstream.mempool_get_fee_estimates()


@api.route("funding/addresses")
def funding_addresses():
    return get_testnet_funding_addresses()


@api.route("address/<address>/info")
def address_info(address):
    return get_address_basic_info(address)


@api.route("multisig/get_p2sh_multisig_address", methods=["POST"])
def get_p2sh_multisig_address():
    data = request.get_json()
    pubkeys = data.get("publicKeys")
    quorum = data.get("quorum")
    return create_address_p2sh(pubkeys, quorum)


@api.route("multisig/fund_multisig_address", methods=["POST"])
def fund_multisig_address():
    data = request.get_json()
    funding_address = data.get("funding_address")
    destination_address = data.get("destination_address")
    funding_amount_btc = data.get("funding_amount")
    fee_rate = data.get("fee_rate")
    publish = data.get(
        "publish"
    )  # use for debugging transactions without publishing to the network
    return send_testnet_payment_from_funding_address(
        funding_address,
        destination_address,
        float(funding_amount_btc),
        int(fee_rate),
        publish.lower() == "true",
    )
