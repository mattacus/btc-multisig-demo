// import Cookies from "js-cookie";

const { SERVER_BASE_URL } = process.env;

class BackendAPI {
  constructor() {
    this.fetchConfig = {
      basePath: SERVER_BASE_URL,
      headers: {},
    };
  }

  defaultErrorHandler(status, statusText, label) {
    throw new Error(`Failed to fetch ${label} [${status} - ${statusText}]`);
  }

  async fetchFundingAddresses() {
    let fetchUrl = `${this.fetchConfig.basePath}/api/funding/addresses`;

    const response = await fetch(fetchUrl, {
      headers: this.fetchConfig.headers,
    });
    if (!response.ok) {
      this.defaultErrorHandler(
        response.status,
        response.statusText,
        "Fetch Funding Addresses"
      );
    }
    return response.json();
  }
}

const backendApi = new BackendAPI();

Object.freeze(backendApi);

export default backendApi;
