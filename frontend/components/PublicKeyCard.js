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
import { KeyIcon } from "@bitcoin-design/bitcoin-icons-react/filled";
import Grid from "@mui/material/Unstable_Grid2";
import { useTheme } from "@mui/material/styles";

import {
  useMultisigContext,
  useMultisigDispatchContext,
} from "../MultisigContext";

const PublicKeyCard = ({ name = "Untitled Key", keyIndex }) => {
  const theme = useTheme();
  const multisigContext = useMultisigContext();
  const multisigDispatch = useMultisigDispatchContext();

  const [error, setError] = React.useState(null);
  const [pubKeyData, setPubKeyData] = React.useState(
    multisigContext.publicKeyList[keyIndex] ?? ""
  );

  const setPubkey = () => {
    try {
      multisigDispatch({
        type: "SET_PUBLIC_KEY",
        payload: {
          keyIndex,
          value: pubKeyData,
        },
      });
    } catch (e) {
      setError(String(e.message || e));
    }
  };

  // Update the local input field if the public key is updated in the context
  React.useEffect(() => {
    setPubKeyData(multisigContext.publicKeyList[keyIndex] ?? "");
  }, [multisigContext.publicKeyList[keyIndex]]);

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
                    <KeyIcon
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
                    label="Uncompressed Public Key"
                    type="string"
                    spellCheck={false}
                    multiline
                    sx={{ minWidth: 250 }}
                    variant="standard"
                    value={pubKeyData}
                    onChange={(e) => {
                      setPubKeyData(e.target.value ?? "");
                    }}
                  />
                </Grid>
                <Grid>
                  {multisigContext.publicKeyList[keyIndex] && (
                    <Alert severity="success" sx={{ overflowWrap: "anywhere" }}>
                      Public Key Successfully Imported
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
                disabled={!pubKeyData}
                onClick={() => {
                  setError(null);
                  setPubkey();
                }}
              >
                Import Public Key
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
