import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import backendApi from "../api";

const FundingCard = () => {
  const [fundingAccount, setFundingAccount] = React.useState("");
  const {
    data: fundingAddresses,
    isError: isErrorFundingAddresses,
    error: errorFundingAddresses,
  } = useQuery({
    queryKey: ["fundingAddresses"],
    queryFn: () => backendApi.fetchFundingAddresses(),
  });

  const getErrors = () => {
    let errors = [];
    if (isErrorFundingAddresses) {
      errors.push(errorFundingAddresses.message);
    }
    return errors;
  };

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
              <FormControl
                variant="standard"
                sx={{ m: 1, minWidth: 200 }}
                size="small"
              >
                <InputLabel id="funding-account-select">
                  Funding Address
                </InputLabel>
                <Select
                  labelId="funding-account-select"
                  value={fundingAccount}
                  label="Age"
                  autoWidth
                  onChange={(e) => {
                    setFundingAccount(e.target.value);
                  }}
                >
                  {fundingAddresses
                    ? fundingAddresses.map((address) => {
                        return <MenuItem value={address}>{address}</MenuItem>;
                      })
                    : []}
                </Select>
              </FormControl>
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
      {getErrors().length ? (
        <Typography variant="caption" color="error">
          {getErrors().join(", ")}
        </Typography>
      ) : (
        <p />
      )}
    </>
  );
};

export default FundingCard;
