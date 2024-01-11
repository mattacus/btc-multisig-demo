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
  useMultisigKeyContext,
  useMultisigKeyDispatchContext,
} from "../multisigKeyContext";

const DEFAULTS = {
  deviceFormat: "legacy",
  bip32Path: {
    mainnet: "44'/0'/0'/0",
    testnet: "44'/1'/0'/0",
  },
};

const { BITCOIN_NETWORK } = process.env;

const SignatureCard = ({ name = "Untitled Key", keyIndex }) => {
  const multisigKeyState = useMultisigKeyContext();
  const multisigKeyDispatch = useMultisigKeyDispatchContext();

  const [error, setError] = React.useState(null);
  const [keyDerivationPath, setKeyDerivationPath] = React.useState(
    DEFAULTS.bip32Path[BITCOIN_NETWORK] + "/" + keyIndex
  );

  const connectAndGetSignature = async () => {
    try {
      const transport = await TransportWebUSB.create();
      const format = DEFAULTS.deviceFormat;
      const currency =
        BITCOIN_NETWORK === "mainnet" ? "bitcoin" : "bitcoin_testnet";

      //listen to the events which are sent by the Ledger packages in order to debug the app
      listen((log) => console.log(log));

      const btc = new Btc({ transport, currency: currency });

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
