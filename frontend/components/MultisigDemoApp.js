import * as React from "react";
import { listen } from "@ledgerhq/logs";
import Btc from "@ledgerhq/hw-app-btc";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";

const MultisigDemoApp = () => {
  const [error, setError] = React.useState(null);
  const [pubKey, setPubKey] = React.useState(null);

  const connectAndGetAddress = async () => {
    try {
      const transport = await TransportWebUSB.create();
      const bip32Path = "44'/1'/0'";

      //listen to the events which are sent by the Ledger packages in order to debug the app
      listen((log) => console.log(log));

      //When the Ledger device connected it is trying to display the bitcoin address
      const btc = new Btc({ transport, currency: "bitcoin" });
      const { bitcoinAddress } = await btc.getWalletPublicKey(bip32Path, {
        verify: false,
        format: "p2sh",
      });

      // Display the address
      setPubKey(bitcoinAddress);

      //Display the address on the Ledger device and ask to verify the address
      await btc.getWalletPublicKey(bip32Path, {
        format: "p2sh",
        verify: true,
      });
    } catch (e) {
      //Catch any error thrown and displays it on the screen
      setError(String(e.message || e));
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Card sx={{ height: 200, width: 300 }}>
            <Grid
              sx={{ height: "100%" }}
              container
              direction={"column"}
              justifyContent={"space-between"}
            >
              <Grid item>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Bitcoin Public Key 1
                  </Typography>
                  {pubKey && (
                    <Typography
                      variant="body2"
                      sx={{ overflowWrap: "anywhere" }}
                    >
                      {pubKey}
                    </Typography>
                  )}
                </CardContent>
              </Grid>
              <Grid item>
                <CardActions>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={connectAndGetAddress}
                  >
                    Get Address
                  </Button>
                </CardActions>
              </Grid>
            </Grid>
          </Card>
          {error && (
            <Typography variant="caption" color="error">
              Error: {error}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default MultisigDemoApp;
