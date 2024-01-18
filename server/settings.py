from os import environ

BITCOIN_NETWORK = environ.get("BITCOIN_NETWORK")
TESTNET_FUNDING_ADDRESS_SECRETS = environ.get("TESTNET_FUNDING_ADDRESS_SECRETS")
TESTNET_FUNDING_PRIVATE_KEYS = environ.get("TESTNET_FUNDING_PRIVATE_KEYS")
TESTNET_FUNDING_ADDRESSES = environ.get("TESTNET_FUNDING_ADDRESSES")
FEE_BUMP_SATS = (
    20  # add some satoshis to fee estimate to help ensure transaction is confirmed
)
