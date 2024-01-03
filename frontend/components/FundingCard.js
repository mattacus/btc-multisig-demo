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

const FundingCard = () => {
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
              <Typography gutterBottom>Funding Account</Typography>
            </CardContent>
          </Grid>
          <Grid>
            <CardActions>
              <Button size="small" variant="outlined">
                Fund Multisig Wallet
              </Button>
            </CardActions>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default FundingCard;
