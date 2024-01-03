import "core-js/actual";
import { listen } from "@ledgerhq/logs";
import AppBtc from "@ledgerhq/hw-app-btc";

// Keep this import if you want to use a Ledger Nano S/X/S Plus with the USB protocol and delete the @ledgerhq/hw-transport-webhid import
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";

//Display the header in the div which has the ID "main"
const initial =
  "<h1>Connect your Nano and open the Bitcoin app. Click anywhere to start...</h1>";
const $main = document.getElementById("main");
$main.innerHTML = initial;

document.body.addEventListener("click", async () => {
  $main.innerHTML = initial;
  try {
    // Keep if you chose the USB protocol
    const transport = await TransportWebUSB.create();

    //listen to the events which are sent by the Ledger packages in order to debug the app
    listen((log) => console.log(log));

    //When the Ledger device connected it is trying to display the bitcoin address
    const appBtc = new AppBtc(transport);
    const { bitcoinAddress } = await appBtc.getWalletPublicKey(
      "44'/0'/0'/0/0",
      { verify: false, format: "legacy" }
    );

    //Display your bitcoin address on the screen
    const h2 = document.createElement("h2");
    h2.textContent = bitcoinAddress;
    $main.innerHTML = "<h1>Your first Bitcoin address:</h1>";
    $main.appendChild(h2);

    //Display the address on the Ledger device and ask to verify the address
    await appBtc.getWalletPublicKey("44'/0'/0'/0/0", {
      format: "legacy",
      verify: true,
    });
  } catch (e) {
    //Catch any error thrown and displays it on the screen
    const $err = document.createElement("code");
    $err.style.color = "#f66";
    $err.textContent = String(e.message || e);
    $main.appendChild($err);
  }
});
