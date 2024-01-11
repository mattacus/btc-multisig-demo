const { SERVER_BASE_URL } = process.env;

class BackendAPI {
  constructor() {
    this.fetchConfig = {
      basePath: SERVER_BASE_URL,
      headers: {},
    };
  }

  defaultErrorHandler(status, statusText, label) {
    throw new Error(`${label} [${status} - ${statusText}]`);
  }

  async fetchFeeEstimates() {
    let fetchUrl = `${this.fetchConfig.basePath}/api/mempool/fee-estimates`;

    const response = await fetch(fetchUrl, {
      headers: this.fetchConfig.headers,
    });
    if (!response.ok) {
      this.defaultErrorHandler(
        response.status,
        response.statusText,
        "Fetch Fee Estimates"
      );
    }
    return response.json();
  }

  async fetchTestnetFundingAddresses() {
    let fetchUrl = `${this.fetchConfig.basePath}/api/funding/addresses`;

    const response = await fetch(fetchUrl, {
      headers: this.fetchConfig.headers,
    });
    if (!response.ok) {
      try {
        const responseBody = await response.json();
        this.defaultErrorHandler(
          response.status,
          JSON.stringify(responseBody),
          "Fetch Testnet Funding Address"
        );
      } catch {
        this.defaultErrorHandler(
          response.status,
          response.statusText,
          "Fetch Testnet Funding Addresses"
        );
      }
    }
    return response.json();
  }

  async fetchAddressInfo(address) {
    let fetchUrl = `${this.fetchConfig.basePath}/api/address/${address}/info`;

    const response = await fetch(fetchUrl, {
      headers: this.fetchConfig.headers,
    });
    if (!response.ok) {
      try {
        const responseBody = await response.json();
        this.defaultErrorHandler(
          response.status,
          JSON.stringify(responseBody),
          "Fetch Address Info"
        );
      } catch {
        this.defaultErrorHandler(
          response.status,
          response.statusText,
          "Fetch Address Info"
        );
      }
    }
    return response.json();
  }

  async createMultisigAddress(publicKeys, quorum_m) {
    let fetchUrl = `${this.fetchConfig.basePath}/api/multisig/create_p2sh_multisig_address`;

    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        ...this.fetchConfig.headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicKeys, quorum: quorum_m }),
    });
    if (!response.ok) {
      const responseBody = await response.json();
      this.defaultErrorHandler(
        response.status,
        JSON.stringify(responseBody),
        "Create Multisig Address"
      );
    }
    return response.json();
  }

  async createFundingTransaction(
    fundingAddress,
    multisigAddress,
    amount,
    feeRate,
    publish
  ) {
    let fetchUrl = `${this.fetchConfig.basePath}/api/multisig/fund_multisig_address`;

    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        ...this.fetchConfig.headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        funding_address: fundingAddress,
        destination_address: multisigAddress,
        funding_amount: amount,
        fee_rate: feeRate,
        publish: publish.toString(),
      }),
    });
    if (!response.ok) {
      const responseBody = await response.json();
      this.defaultErrorHandler(
        response.status,
        JSON.stringify(responseBody),
        "Send Funding Payment"
      );
    }
    return response.json();
  }

  async createUnsignedTransaction(
    sendAddress,
    receiveAddress,
    amount,
    feeRate
  ) {
    let fetchUrl = `${this.fetchConfig.basePath}/api/multisig/create_unsigned_transaction`;

    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        ...this.fetchConfig.headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        send_address: sendAddress,
        receive_address: receiveAddress,
        send_amount: amount,
        fee_rate: feeRate,
      }),
    });
    if (!response.ok) {
      const responseBody = await response.json();
      this.defaultErrorHandler(
        response.status,
        JSON.stringify(responseBody),
        "Create Unsigned Transaction"
      );
    }
    return response.json();
  }
}

const backendApi = new BackendAPI();

Object.freeze(backendApi);

export default backendApi;
