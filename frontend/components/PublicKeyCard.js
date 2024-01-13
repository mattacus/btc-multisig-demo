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

const PublicKeyCard = ({ name = "Untitled Key", keyIndex }) => {
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
                    label="Uncompressed Public Key Format"
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
