import logging
import json
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
            response = urlopen(req)
            return json.load(response)
        except ValueError:
            raise ValueError(f"unexpected response: {response}")

    # --------------- Transactions ---------------

    def tx_get_tx(self, tx_id):
        """Get basic information about a transaction"""
        return self.fetch(f"tx/{tx_id}")

    def tx_get_tx_status(self, tx_id):
        """Get transaction confirmation status"""
        return self.fetch(f"/tx/{tx_id}/status")

    def tx_get_tx_data(self, tx_id, raw=False):
        """Get the raw transaction in hex (default) or binary"""
        url = f"/tx/{tx_id}"
        if raw:
            url += "/raw"
        else:
            url += "/hex"
        return self.fetch(url)

    def tx_get_tx_merkle_block_proof(self, tx_id):
        """Get the merkle block proof that can be used to prove
        the transaction was included into a block"""
        return self.fetch(f"/tx/{tx_id}/merkle-proof")

    def tx_get_tx_outspend(self, tx_id, vout):
        """Return the spending status of a given transaction output"""
        return self.fetch(f"/tx/{tx_id}/outspend/{vout}")

    def tx_get_tx_outspends(self, tx_id):
        """Return the spending status of all transaction outputs"""
        return self.fetch(f"/tx/{tx_id}/outspends")

    # --------------- Addresses ---------------

    def addr_get_address_info(self, address, scripthash=False):
        """Get basic information about an address/scripthash"""
        if scripthash:
            return self.fetch(f"scripthash/{address}")
        return self.fetch(f"address/{address}")

    def addr_get_address_tx_history(self, address, scripthash=False):
        """Get transaction history for an address/scripthash,
        sorted with newest first"""
        if scripthash:
            return self.fetch(f"scripthash/{address}/txs")
        return self.fetch(f"address/{address}/txs")

    def addr_get_address_confirmed_tx_history(
        self, address, last_seen_tx_id=None, scripthash=False
    ):
        """Get confirmed transaction history for an address/scripthash,
        sorted with newest first"""
        url = ""
        if scripthash:
            url = f"scripthash/{address}/txs/chain"
        else:
            url = f"address/{address}/txs/chain"
        if last_seen_tx_id is not None:
            url += f"/{last_seen_tx_id}"
        return self.fetch(url)

    def addr_get_address_unconfirmed_tx_history(self, address, scripthash=False):
        """Get unconfirmed (mempool) transaction history for an address/scripthash"""
        if scripthash:
            return self.fetch(f"scripthash/{address}/txs/mempool")
        return self.fetch(f"address/{address}/txs/mempool")

    def addr_get_address_utxo(self, address, scripthash=False):
        """Get list of unspent transaction outputs
        associated with an address/scripthash"""
        if scripthash:
            return self.fetch(f"scripthash/{address}/utxo")
        return self.fetch(f"address/{address}/utxo")

    # --------------- Blocks ---------------

    def block_get_block_info(self, block_hash):
        """Get basic information about a block"""
        return self.fetch(f"block/{block_hash}")

    def block_get_block_header(self, block_hash):
        """Get the hex-encoded block header for a given block"""
        return self.fetch(f"block/{block_hash}/header")

    def block_get_block_status(self, block_hash):
        """Get block confirmation status"""
        return self.fetch(f"block/{block_hash}/status")

    def block_get_block_txs(self, block_hash, start_index=None):
        """Get up to 25 transactions in a block, beginning at start_index"""
        url = f"block/{block_hash}/txs"
        if start_index is not None:
            url += f"/{start_index}"
        return self.fetch(url)

    def block_get_block_txids(self, block_hash):
        """Get the transaction IDs for all transactions in a block"""
        return self.fetch(f"block/{block_hash}/txids")

    def block_get_transaction_at_index(self, block_hash, index):
        """Get the transaction at a given index in a block"""
        return self.fetch(f"block/{block_hash}/txid/{index}")

    def block_get_block_raw(self, block_hash):
        """Get the raw block data for a given block in binary form"""
        return self.fetch(f"block/{block_hash}/raw")

    def block_get_block_hash_at_height(self, height):
        """Get the block hash for a given block height"""
        return self.fetch(f"block-height/{height}")

    def block_get_blocks(self, start_height=None):
        """Get 10 newest blocks at the tip or from a given block height"""
        url = "blocks"
        if start_height is not None:
            url += f"/{start_height}"
        return self.fetch(url)

    def block_get_block_tip_height(self):
        """Get the height of the last block"""
        return self.fetch("blocks/tip/height")

    def block_get_tip_block_hash(self):
        """Get the hash of the last block"""
        return self.fetch("blocks/tip/hash")

    # --------------- Mempool ---------------

    def mempool_get_mempool_info(self):
        """Get mempool backlog statistics"""
        return self.fetch("mempool")

    def mempool_get_txids(self):
        """Get full list of transaction IDs in mempool"""
        return self.fetch("mempool/txids")

    def mempool_get_fee_estimates(self):
        """
        Get an object where the keys are the confirmation target (number of blocks)
        and the values are estimated feerate (in sat/vB) to use for the target
        """
        return self.fetch("fee-estimates")


blockstream = BlockstreamApi()
