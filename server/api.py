from flask import Blueprint, jsonify, request
from services import (
    get_testnet_funding_addresses,
    get_address_basic_info,
    create_p2sh_address_details,
    send_testnet_payment_from_funding_address,
    create_unsigned_transaction_multisig,
    finalize_signed_multisig_transaction,
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


@api.route("multisig/create_p2sh_multisig", methods=["POST"])
def get_p2sh_multisig_address():
    data = request.get_json()
    pubkeys = data.get("public_keys")
    quorum = data.get("quorum")
    return create_p2sh_address_details(pubkeys, quorum)


@api.route("multisig/create_p2wsh_multisig", methods=["POST"])
def get_p2wsh_multisig_address():
    return jsonify(error=str("Not yet implemented")), 400


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


@api.route("multisig/create_unsigned_transaction", methods=["POST"])
def create_unsigned_multisig_transaction():
    data = request.get_json()
    send_address = data.get("send_address")
    receive_address = data.get("receive_address")
    send_amount_btc = data.get("send_amount")
    fee_rate = data.get("fee_rate")
    pubkeys = data.get("public_keys")
    quorum = data.get("quorum")

    return create_unsigned_transaction_multisig(
        send_address,
        receive_address,
        float(send_amount_btc),
        int(fee_rate),
        public_keys=pubkeys,
        quorum=quorum,
    )


@api.route("multisig/finalize_transaction", methods=["POST"])
def finalize_transaction():
    data = request.get_json()
    signature_data = data.get("signature_data")
    transaction_data = data.get("transaction_data")
    sec_public_keys = data.get("public_keys")
    redeem_script_hex = data.get("redeem_script")
    return finalize_signed_multisig_transaction(
        signature_data, transaction_data, sec_public_keys, redeem_script_hex
    )
