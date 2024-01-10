from os import environ

BITCOIN_NETWORK = environ.get("BITCOIN_NETWORK")
TESTNET_FUNDING_ADDRESS_SECRETS = environ.get("TESTNET_FUNDING_ADDRESS_SECRETS")
FEE_BUMP_SATS = (
    10  # add some satoshis to fee estimate to help ensure transaction is confirmed
)
