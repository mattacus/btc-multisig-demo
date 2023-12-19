import logging
from urllib.request import Request, urlopen
from settings import BITCOIN_NETWORK

URL = {
    "mainnet": "https://blockstream.info/api",
    "testnet": "https://blockstream.info/testnet/api",
    "signet": "https://mempool.space/signet/api",
}


class Singleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class BlockstreamApi(metaclass=Singleton):
    def __init__(self, network=None) -> None:
        if network is None:
            network = BITCOIN_NETWORK
        self.network = network
        if network not in URL.keys():
            logging.warning("Invalid network: %s, switching to testnet", network)
            self.network = "testnet"

    def fetch(self, url):
        base_url = f"{URL[self.network]}/{url}"
        req = Request(base_url, headers={"User-Agent": "Mozilla/5.0"})
        try:
            response = urlopen(req).read().decode("utf-8").strip()
            return response
        except ValueError:
            raise ValueError(f"unexpected response: {response}")

    # --------------- Transactions ---------------

    def tx_get_tx(self, tx_id):
        return self.fetch(f"tx/{tx_id}")

    def tx_get_tx_status(self, tx_id):
        return self.fetch(f"/tx/{tx_id}/status")

    # --------------- Addresses ---------------

    def addr_get_address_info(self, address):
        return self.fetch(f"address/{address}")

    # --------------- Blocks ---------------

    def block_get_block_info(self, block_hash):
        return self.fetch(f"block/{block_hash}")

    def block_get_tip_block_hash(self):
        return self.fetch("blocks/tip/hash")

    # --------------- Mempool ---------------

    def mempool_get_mempool_info(self):
        return self.fetch("mempool")

    def mempool_get_fee_estimates(self):
        return self.fetch("fee-estimates")


blockstream_api = BlockstreamApi()
