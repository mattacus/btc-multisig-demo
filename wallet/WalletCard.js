import * as React from "react";
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
import ecc from "@bitcoinerlab/secp256k1";
import { ECPairFactory } from "ecpair";
import { crypto } from "bitcoinjs-lib";

// TEST HASH: 9a0027133f5883cc7d353e3cbad8648a9539ba33a73e59371f896d7225ff7baa

const WalletCard = ({ name = "Untitled Key", keyIndex, defaultSecret }) => {
  const [error, setError] = React.useState(null);
  const [secret, setSecret] = React.useState(defaultSecret);
  const [eccPair, setEccPair] = React.useState(null); // public-private key pair
  const [sigHash, setSigHash] = React.useState("");
  const [signature, setSignature] = React.useState("");

  React.useEffect(() => {
    const ECPair = ECPairFactory(ecc);
    setEccPair(
      ECPair.fromPrivateKey(crypto.hash256(secret), {
        compressed: false,
      })
    );
  }, [secret]);

  const signTransactionHash = () => {
    if (!sigHash) {
      setError("Transaction hash is empty");
      return;
    }

    const sig = eccPair.sign(Buffer.from(sigHash, "hex"));
    setSignature(sig);
    console.log(
      "signature valid:",
      eccPair.verify(Buffer.from(sigHash, "hex"), sig)
    );

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
                    Uncompressed Public Key:
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ overflowWrap: "anywhere" }}
                  >
                    {eccPair ? eccPair.publicKey.toString("hex") : ""}
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
