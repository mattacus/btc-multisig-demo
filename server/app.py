from flask import Flask
import logging
from api import api
from settings import BITCOIN_NETWORK

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.register_blueprint(api, url_prefix="/api")

app.logger.info("Running on Bitcoin network: %s", BITCOIN_NETWORK)


@app.route("/")
def hello():
    return "<h1>BTC Multisig Demo</h1>"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
