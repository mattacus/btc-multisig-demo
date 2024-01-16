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
import PublishIcon from "@mui/icons-material/Publish";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Unstable_Grid2";
import { useTheme } from "@mui/material/styles";
import { SignIcon } from "@bitcoin-design/bitcoin-icons-react/filled";

import {
  useMultisigContext,
  useMultisigDispatchContext,
} from "../MultisigContext";

const SignatureCard = ({ name = "Untitled Key", keyIndex }) => {
  const theme = useTheme();
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
      setError(String(e.message || e));
    }
  };

  const clearSignature = () => {
    multisigDispatch({
      type: "REMOVE_SIGNATURE",
      payload: keyIndex,
    });
    setSignatureData("");
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
              <Grid container direction={"column"} spacing={1}>
                <Grid container>
                  <Grid>
                    <Typography color="text.secondary" gutterBottom>
                      {name}
                    </Typography>
                  </Grid>
                  <Grid>
                    <SignIcon
                      style={{
                        width: 24,
                        height: 24,
                        color: theme.palette.text.secondary,
                      }}
                    />
                  </Grid>
                </Grid>
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
                startIcon={<PublishIcon />}
                disabled={!isSigningEnabled}
                onClick={() => {
                  setError(null);
                  applySignature();
                }}
              >
                Record Signature
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => {
                  setError(null);
                  clearSignature();
                }}
              >
                Clear
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
