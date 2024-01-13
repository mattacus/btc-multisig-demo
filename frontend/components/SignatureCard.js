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

const SignatureCard = ({ name = "Untitled Key", keyIndex }) => {
  const multisigContext = useMultisigContext();
  const multisigDispatch = useMultisigDispatchContext();

  const [error, setError] = React.useState(null);
  const [signatureData, setSignatureData] = React.useState(
    multisigContext.signatures[keyIndex]
      ? multisigContext.signatures[keyIndex].r +
          multisigContext.signatures[keyIndex].s
      : ""
  );

  const applySignature = () => {
    try {
      multisigDispatch({
        type: "ADD_SIGNATURE",
        payload: {
          keyIndex,
          value: {
            // split signature into r and s values for easier serialization
            r: signatureData.slice(0, 64),
            s: signatureData.slice(64, 128),
          },
        },
      });
    } catch (e) {
      //Catch any error thrown and displays it on the screen
      setError(String(e.message || e));
    }
  };

  const isSigningEnabled = multisigContext.currentMultisigTransaction;

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
                    label="Signature Data"
                    type="string"
                    spellCheck={false}
                    multiline
                    sx={{ minWidth: 250 }}
                    variant="standard"
                    value={signatureData}
                    onChange={(e) => {
                      setSignatureData(e.target.value ?? "");
                    }}
                  />
                </Grid>
                <Grid>
                  {multisigContext.signatures[keyIndex] && (
                    <Alert severity="success" sx={{ overflowWrap: "anywhere" }}>
                      Signature Successfully Recorded
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
                disabled={!isSigningEnabled}
                onClick={() => {
                  setError(null);
                  applySignature();
                }}
              >
                Record Signature
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
