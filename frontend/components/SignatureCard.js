import * as React from "react";

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

  const connectAndSignTransaction = async () => {
    try {
      // multisigDispatch({
      //   type: "ADD_SIGNATURE",
      //   payload: {
      //     keyIndex,
      //     value: { r, s },
      //   },
      // });
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
