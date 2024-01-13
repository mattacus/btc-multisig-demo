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
  AlertTitle,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import ecc from "@bitcoinerlab/secp256k1";
import { ECPairFactory } from "ecpair";
import { crypto, script } from "bitcoinjs-lib";

const ECPair = ECPairFactory(ecc);

const WalletCard = ({ name = "Untitled Key", keyIndex, defaultSecret }) => {
  const [error, setError] = React.useState(null);
  const [secret, setSecret] = React.useState(defaultSecret);
  const [sigHash, setSigHash] = React.useState("");
  const [signature, setSignature] = React.useState("");

  keyPair = ECPair.fromPrivateKey(crypto.hash256(secret), {
    compressed: false,
  });

  const signTransactionHash = () => {
    if (!sigHash) {
      setError("Transaction hash is empty");
      return;
    }

    const sig = keyPair.sign(Buffer.from(sigHash, "hex"));
    setSignature(sig);
    console.log(sig);
    console.log(keyPair.verify(Buffer.from(sigHash, "hex"), sig));

    let r = sig.slice(0, 32);
    let s = sig.slice(32, 64);
    console.log("r", r.toString("hex"));
    console.log("s", s.toString("hex"));
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
                {name + " " + keyIndex}
              </Typography>
              <Grid container direction={"column"} spacing={1}>
                <Grid>
                  <TextField
                    label="Wallet Secret"
                    type="string"
                    spellCheck={false}
                    multiline
                    sx={{ minWidth: 250 }}
                    variant="standard"
                    value={secret}
                    onChange={(e) => {
                      setSecret(e.target.value ?? "");
                    }}
                  />
                </Grid>
                <Grid>
                  <Typography variant="body1">
                    Uncompressed Public Key:{" "}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ overflowWrap: "anywhere" }}
                  >
                    {keyPair.publicKey.toString("hex")}
                  </Typography>
                </Grid>
                <Grid>
                  <TextField
                    label="Transaction Hash"
                    type="string"
                    spellCheck={false}
                    multiline
                    sx={{ minWidth: 250 }}
                    variant="standard"
                    value={sigHash}
                    onChange={(e) => {
                      setSigHash(e.target.value ?? "");
                    }}
                  />
                </Grid>
                <Grid>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setError(null);
                      signTransactionHash();
                    }}
                  >
                    Sign Transaction Hash
                  </Button>
                </Grid>
                {signature && (
                  <Grid>
                    <Typography variant="body1">Signature: </Typography>
                    <Typography
                      variant="caption"
                      sx={{ overflowWrap: "anywhere" }}
                    >
                      {signature.toString("hex")}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Grid>
          <Grid>
            <CardActions></CardActions>
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

export default WalletCard;
