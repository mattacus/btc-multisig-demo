import * as React from "react";
import { listen } from "@ledgerhq/logs";
import Btc from "@ledgerhq/hw-app-btc";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {
  useMultisigContext,
  useMultisigDispatchContext,
} from "../MultisigContext";

const DEFAULTS = {
  deviceFormat: "legacy",
  bip32Path: {
    mainnet: "44'/0'/0'/0",
    testnet: "44'/1'/0'/0",
  },
};

const { BITCOIN_NETWORK } = process.env;

const SignatureCard = ({ name = "Untitled Key", keyIndex }) => {
  const multisigContext = useMultisigContext();
  const multisigDispatch = useMultisigDispatchContext();

  const [error, setError] = React.useState(null);
  const [keyDerivationPath, setKeyDerivationPath] = React.useState(
    DEFAULTS.bip32Path[BITCOIN_NETWORK] + "/" + keyIndex
  );

  const connectAndGetSignature = async () => {
    try {
      const transport = await TransportWebUSB.create();
      const currency =
        BITCOIN_NETWORK === "mainnet" ? "bitcoin" : "bitcoin_testnet";

      //listen to the events which are sent by the Ledger packages in order to debug the app
      listen((log) => console.log(log));

      const btc = new Btc({ transport, currency: currency });

      // btc.signP2SHTransaction({})

      const prevTx = btc.splitTransaction(
        "0100000002dbc5368c232934e9fa8453348b80969ce0caeb3c3ec8325d68a42350147360f6000000006b483045022100c59e194824af9601aa5434b5b8a0149b78332047ff6be997fb579a8763ea3e7802202d248fffc2ba3f5473b47704c12a6f45dfb2c523f133142d0ed3feac4a303299012102a397a0f3cb8205072ce56fa04ab87dcbbc719af430143f1e690db3b512f9674effffffff2f614be14548f68467881c3f00d03b71c971b2f24e0affc2d5d915025dc24408010000006a473044022032228a63e66990b7eb71ee11c6f0bdcdd63f95b906be11bfc5faa620a33bdc15022029e981eadf4c494378a9d36edd981c755954aac8022d230998a188afba677679012102a397a0f3cb8205072ce56fa04ab87dcbbc719af430143f1e690db3b512f9674effffffff02a08601000000000017a914e8a482d30c69fb395152ad5c467a59ffb754bbae8722850100000000001976a91484f8e08b00d6bb2cc2f419ea6bd598b68dcbced088ac00000000"
      );

      const tx1 = btc.splitTransaction(
        "01000000014ea60aeac5252c14291d428915bd7ccd1bfc4af009f4d4dc57ae597ed0420b71010000008a47304402201f36a12c240dbf9e566bc04321050b1984cd6eaf6caee8f02bb0bfec08e3354b022012ee2aeadcbbfd1e92959f57c15c1c6debb757b798451b104665aa3010569b49014104090b15bde569386734abf2a2b99f9ca6a50656627e77de663ca7325702769986cf26cc9dd7fdea0af432c8e2becc867c932e1b9dd742f2a108997c2252e2bdebffffffff0281b72e00000000001976a91472a5d75c8d2d0565b656a5232703b167d50d5a2b88aca0860100000000001976a9144533f5fb9b4817f713c48f0bfe96b9f50c476c9b88ac00000000"
      );
      // const prevIndex = 0;
      // const redeemScript =
      //   "87524104abe79ee2c3c4d32b43b38d2043b07908a91efb5c6c5a022256c243e8b14941b0fad97c83b71a5072042ef0062f1ee23016a9c57cb582b7a74f0b1ace7938f9944104cff54e130bd54a843a46ab955852fdbf737e461856a4ecfa73593d188a0faa1ecccf724e3310d881c327a7d11a0f138b18c01b73d15d449523eb0919af04b76952ae";
      // console.log(prevTx);

      // const outputScript =
      //   "88130000000000001976a91484f8e08b00d6bb2cc2f419ea6bd598b68dcbced088acb91200000000000017a914e8a482d30c69fb395152ad5c467a59ffb754bbae87";

      // const signed_tx = await btc.signP2SHTransaction({
      //   inputs: [[prevTx, prevIndex, redeemScript]],
      //   associatedKeysets: [keyDerivationPath],
      //   outputScriptHex: outputScript,
      // });

      const signed_tx = await btc.signP2SHTransaction({
        inputs: [
          [
            tx1,
            0,
            "52210289b4a3ad52a919abd2bdd6920d8a6879b1e788c38aa76f0440a6f32a9f1996d02103a3393b1439d1693b063482c04bd40142db97bdf139eedd1b51ffb7070a37eac321030b9a409a1e476b0d5d17b804fcdb81cf30f9b99c6f3ae1178206e08bc500639853ae",
          ],
        ],
        associatedKeysets: ["49'/1'/0'/0/0"],
        outputScriptHex:
          "01905f0100000000001976a91472a5d75c8d2d0565b656a5232703b167d50d5a2b88ac",
        segwit: false,
      });

      // console.log(signed_tx);

      // TODO
    } catch (e) {
      //Catch any error thrown and displays it on the screen
      setError(String(e.message || e));
    }
  };

  return (
    <>
      <Card sx={{ width: 300 }}>
        <Grid
          sx={{ height: "100%" }}
          container
          direction={"column"}
          justifyContent={"space-between"}
        >
          <Grid>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {name}
              </Typography>
              <Grid container direction={"column"} spacing={1}>
                <Grid>
                  <TextField
                    required
                    label="Key Derivation Path"
                    type="string"
                    sx={{ mt: 2, minWidth: 250 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="standard"
                    value={keyDerivationPath}
                    onChange={(e) => {
                      setKeyDerivationPath(e.target.value);
                    }}
                  />
                </Grid>
                <Grid>
                  <>
                    <Typography
                      variant="body1"
                      sx={{ overflowWrap: "anywhere" }}
                    >
                      Signature Data:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ overflowWrap: "anywhere" }}
                    >
                      {""}
                    </Typography>
                  </>
                </Grid>
              </Grid>
            </CardContent>
          </Grid>
          <Grid>
            <CardActions>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setError(null);
                  connectAndGetSignature();
                }}
              >
                Sign Transaction
              </Button>
            </CardActions>
          </Grid>
        </Grid>
      </Card>
      {error ? (
        <Typography variant="caption" color="error">
          Error: {error}
        </Typography>
      ) : (
        <p />
      )}
    </>
  );
};

export default SignatureCard;
