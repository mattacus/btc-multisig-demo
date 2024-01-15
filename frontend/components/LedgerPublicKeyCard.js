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
  AlertTitle,
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

const PublicKeyCard = ({ name = "Untitled Key", keyIndex }) => {
  const multisigContext = useMultisigContext();
  const multisigDispatch = useMultisigDispatchContext();

  const [error, setError] = React.useState(null);
  const [keyDerivationPath, setKeyDerivationPath] = React.useState(
    DEFAULTS.bip32Path[BITCOIN_NETWORK] + "/" + keyIndex
  );

  const pubKey = multisigContext.publicKeyList[keyIndex];

  const connectAndGetAddress = async () => {
    try {
      const transport = await TransportWebUSB.create();
      const format = DEFAULTS.deviceFormat;
      const currency =
        BITCOIN_NETWORK === "mainnet" ? "bitcoin" : "bitcoin_testnet";

      //listen to the events which are sent by the Ledger packages in order to debug the app
      listen((log) => console.log(log));

      const btc = new Btc({ transport, currency: currency });

      // Display the address
      const response = await btc.getWalletPublicKey(keyDerivationPath, {
        verify: false,
        format: format,
      });
      const { publicKey } = response;
      multisigDispatch({
        type: "SET_PUBLIC_KEY",
        payload: { keyIndex: keyIndex, value: publicKey },
      });
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
                  {pubKey && (
                    <Alert severity="info" sx={{ overflowWrap: "anywhere" }}>
                      <AlertTitle>Public Key:</AlertTitle>
                      <p>{pubKey}</p>
                    </Alert>
                  )}
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
                  connectAndGetAddress();
                }}
              >
                Get Public Key
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

export default PublicKeyCard;
