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
  Alert,
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

console.log(Buffer.from("test").toString("hex"));

const SignatureCard = ({ name = "Untitled Key", keyIndex }) => {
  const multisigContext = useMultisigContext();
  const multisigDispatch = useMultisigDispatchContext();

  const [error, setError] = React.useState(null);
  const [keyDerivationPath, setKeyDerivationPath] = React.useState(
    DEFAULTS.bip32Path[BITCOIN_NETWORK] + "/" + keyIndex
  );

  const connectAndSignTransaction = async () => {
    try {
      const transport = await TransportWebUSB.create();
      const currency =
        BITCOIN_NETWORK === "mainnet" ? "bitcoin" : "bitcoin_testnet";

      //listen to the events which are sent by the Ledger packages in order to debug the app
      // listen((log) => console.log(log));

      const btc = new Btc({ transport, currency: currency });

      console.log(Buffer.from(multisigContext.sigHashList[0]).toString("hex"));

      const { r, s } = await btc.signMessage(
        keyDerivationPath,
        // multisigContext.sigHashList[0]
        "f03a72ff8bb657e023817857d82a6a3dea9e37b7bffbf4be4e499d4ff8b6bf9a"
      );

      multisigDispatch({
        type: "ADD_SIGNATURE",
        payload: {
          keyIndex,
          value: { r, s },
        },
      });
    } catch (e) {
      //Catch any error thrown and displays it on the screen
      setError(String(e.message || e));
    }
  };

  const isSigningEnabled =
    multisigContext.currentMultisigTransaction &&
    multisigContext.sigHashList.length > 0 &&
    !multisigContext.signatures[keyIndex];

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
                    {multisigContext.signatures[keyIndex] && (
                      <Alert
                        severity="success"
                        sx={{ overflowWrap: "anywhere" }}
                      >
                        Signature Successfully Recorded
                      </Alert>
                    )}
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
                disabled={!isSigningEnabled}
                onClick={() => {
                  setError(null);
                  connectAndSignTransaction();
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
