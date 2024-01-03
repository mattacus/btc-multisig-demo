import * as React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

const SendingCard = () => {
  return (
    <>
      <Card sx={{ height: 300 }}>
        <Grid
          sx={{ height: "100%" }}
          container
          direction={"column"}
          justifyContent={"space-between"}
        >
          <Grid>
            <CardContent>
              <Typography gutterBottom>Spend from Multisig Wallet</Typography>
            </CardContent>
          </Grid>
          <Grid>
            <CardActions>
              <Button size="small" variant="outlined">
                Send From Wallet
              </Button>
            </CardActions>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default SendingCard;
