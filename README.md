# Bitcoin Multisig Demo

This is a simple app to demonstrate how multisignature Bitcoin addresses can be created, funded, and unlocked and spent from. Currently it supports legacy (P2SH) and SegWit (P2WSH) multisig addresses.

The 'wallets' app is a minimal emulation of what a hardware wallet does (with single public key generation for simplicity, and mnemonic text secrets). These are used to build the multisig addresses and sign for transactions.

The frontend is a form for the flow of building the address (along with backup/import), funding from an account (if run under tesnet), and spending from the multisig address.

The backend is a simple stateless python server which uses the buidl library for handling bitcoin transactions and network info. The blockstream API is used to gather on-chain information.

## Disclaimers

TLDR: I recommend not using real bitcoin as this is purely to illustrate the concept of multisig. While the bitcoin network flag could be set to mainnet, please only use testnet/signet coins if you're test driving it.

- The wallet emulation secrets are not guaranteed to be secure and should not be relied upon to protect real bitcoin (they are essentially simple 'brain wallets')
- For simplicity addresses are derived from single public keys, and the multisig address is reused. This is not standard practice for privacy reasons but it makes the demo easier to follow
- Ideally this would optionally connect to a user's full node, rather than blockstream's api. Another decision made for simplicity of the demo
- The buidl library version is not locked in, and might drift (unless the same commit hash is used below)

## Installation

First step is to install the [buidl-python](https://github.com/buidl-bitcoin/buidl-python) library. Unfortunately the pypi package hasn't been updated in a while, but the good news is the project doesn't appear to have any dependencies. So, the easiest method of installation is to simply copy the `buidl` directory into the `server/` folder of the project. Since there are no tagged releases, I will include the commit hash the latest version of the code was tested against here: [c0b7d57](https://github.com/buidl-bitcoin/buidl-python/commit/c0b7d573a6411341be0485606ea17c75ec631aaa)

Create a .env following the template provided and fill it out (more details in Setup and Walkthrough).

The simplest way to get everything running should be running the docker compose file: `docker compose up -d`. The main frontend app is at `localhost:3000` and the wallets app is at `localhost:3001`.

## Setup and Walkthrough

### Environment

First step is to fill out the .env file. For testnet funding, you can either add your funding addresses directly to the TESTNET_FUNDING_ADDRESSES, or if they are derived from simple mnemonic secrets you can add those secrets to the TESTNET_FUNDING_ADDRESS_SECRETS variable. If you provide the addresses directly you will also need to add the corresponding Private Keys in integer format to TESTNET_FUNDING_PRIVATE_KEYS or the automated funding transactions won't work. Currently only P2PKH and P2WPKH funding addresses are supported. You will need to grab some testnet bitcoin from a [faucet](https://bitcoinfaucet.uo1.net/) first if you don't already have some, and add at least one address with an unspent UTXO. If you want to prefill the wallet secrets, you can do that with the WALLET_EMULATOR_SECRETS variable.

### Wallet Emulator Setup

In the wallets app, you can create some emulated 'wallets' for the multisig address construction. Simply add as many as you'd like and give each one a secret phrase. [Diceware](https://diceware.dmuth.org/) is a quick and easy option for making a secret phrase. These public keys generated will be used for signing later so make sure to keep the secrets handy. Nothing is saved on the page, and no network requests are being made here (by design, to mimic hardware), so if you refresh without saving the secrets they will be lost (or you can save them in the .env variable above).

### Multisig Key Setup

On the main app, copy and paste the public keys from each wallet into the Public Key cards and click 'Import Public Key' for each. This mimics the process of connecting different hardware wallets for key import. Pick an address type and click 'Create Multisig Address' to build the multisig vault. You'll have an option to save the multisig address details if the address creation was successful.

### Fund from Existing Account

On this card, pick one of the testnet addresses provided earlier for sending some testnet bitcoin to the newly created multisig address. This address should automatically be populated in the Multisig Address field. Set a send amount and fee rate (for testnet this shouldn't need to be more than 2 sat/vB. Click 'Fund Multisig Address' to generate a Transaction ID and validate everything before publishing to the network (this is the default behavior when 'Debug' is toggled). Deselect 'Debug' to send the transaction to the network.

### Send from Multisig Address

Once the funding transaction has settled and you've verified that the address is funded, you should now be ready to send from the multisig address and go through the signing process. Select the multisig address to send from (should be already filled from before). Set a receiving address (for simplicity, this is populated from the funding addresses so you can just send bitcoin back and forth). Set the amount and rate as usual. This time you'll need to click 'Create Transaction For Signing' first. You should get an Unsigned Transaction Hash back from the server. Copy this over to the Transaction Hash field for your keys; for each key that you want to sign with, you'll need to paste this hash and generate a signature. Once generated, copy the signatures back over to the Signature cards for the corresponding keys used previously. This mimics the back and forth process of getting a signature from a hardware wallet. Once your signatures are recorded, click 'Finalize Multisig Transaction'. If everything was entered correctly, you should get valid signatures, and you can broadcast your transaction by deselecting 'Debug' and spend from the multisig address!
