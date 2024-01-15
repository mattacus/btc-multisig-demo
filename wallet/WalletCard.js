import * as React from "react";
import {
  Alert,
  AlertTitle,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  TextField,
  AlertTitle,
} from "@mui/material";
import { KeyIcon } from "@bitcoin-design/bitcoin-icons-react/filled";
import { DevicesIcon } from "@bitcoin-design/bitcoin-icons-react/filled";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Unstable_Grid2";
import { useTheme } from "@mui/material/styles";

import ecc from "@bitcoinerlab/secp256k1";
import { ECPairFactory } from "ecpair";
import { crypto } from "bitcoinjs-lib";

// TEST HASH: 9a0027133f5883cc7d353e3cbad8648a9539ba33a73e59371f896d7225ff7baa

const WalletCard = ({
  name = "Untitled Wallet",
  walletIndex,
  defaultSecret,
  handleRemoveWallet,
}) => {
  const theme = useTheme();
  const [error, setError] = React.useState(null);
  const [secret, setSecret] = React.useState(defaultSecret);
  const [eccPair, setEccPair] = React.useState(null); // public-private key pair
  const [sigHash, setSigHash] = React.useState("");
  const [signature, setSignature] = React.useState("");

  React.useEffect(() => {
    const ECPair = ECPairFactory(ecc);
    if (secret) {
      setEccPair(
        ECPair.fromPrivateKey(crypto.hash256(Buffer.from(secret)), {
          compressed: false,
        })
      );
    } else {
      setEccPair(null);
    }
  }, [secret]);

  const signTransactionHash = () => {
    try {
      if (!sigHash) {
        setError("Transaction hash is empty");
        return;
      }

      if (!eccPair) {
        setError("No Keypair found");
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
    } catch (e) {
      setError(String(e.message || e));
    }
  };

  return (
    <>
      <Card sx={{ width: 300, height: "100%" }}>
        <Grid sx={{ height: "100%" }} container direction={"column"}>
          <Grid>
            <CardContent>
              <Grid
                container
                direction={"column"}
                alignItems="center"
                spacing={3}
              >
                <Grid>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography color="text.secondary">{name}</Typography>
                    <DevicesIcon
                      style={{
                        width: 32,
                        height: 32,
                        color: theme.palette.text.secondary,
                      }}
                    />
                  </div>
                </Grid>
                <Grid>
                  <TextField
                    label="Wallet Secret"
                    type="string"
                    spellCheck={false}
                    multiline
                    sx={{ minWidth: 275 }}
                    variant="outlined"
                    value={secret}
                    onChange={(e) => {
                      setSecret(e.target.value ?? "");
                    }}
                  />
                </Grid>
                <Grid>
                  <Alert severity="warning" icon={false}>
                    <AlertTitle>
                      <Grid
                        container
                        justifyContent="space-around"
                        alignContent="center"
                      >
                        <KeyIcon width={24} height={24} />
                        Uncompressed Public Key:
                      </Grid>
                    </AlertTitle>
                    <Typography
                      variant="caption"
                      sx={{ overflowWrap: "anywhere" }}
                    >
                      {eccPair ? eccPair.publicKey.toString("hex") : ""}
                    </Typography>
                  </Alert>
                </Grid>
                <Grid>
                  <TextField
                    label="Transaction Hash"
                    type="string"
                    spellCheck={false}
                    multiline
                    sx={{ minWidth: 275 }}
                    variant="outlined"
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
                    sx={{ minWidth: 275 }}
                    onClick={() => {
                      setError(null);
                      signTransactionHash();
                    }}
                    startIcon={<BorderColorIcon />}
                  >
                    Sign Transaction Hash
                  </Button>
                </Grid>
                {signature && (
                  <Grid>
                    <Alert severity="success" icon={false}>
                      <AlertTitle>Signature:</AlertTitle>
                      <Typography
                        variant="caption"
                        sx={{ overflowWrap: "anywhere" }}
                      >
                        {signature.toString("hex")}
                      </Typography>
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Grid>
          <Grid>
            <CardActions>
              <Button
                size="small"
                variant="outlined"
                color="error"
                sx={{ minWidth: 275 }}
                onClick={() => {
                  setError(null);
                  handleRemoveWallet(walletIndex);
                }}
                startIcon={<DeleteIcon />}
              >
                Delete Wallet
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

export default WalletCard;
