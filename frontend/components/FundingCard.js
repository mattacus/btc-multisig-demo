import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import backendApi from "../api";
import { DEFAULT_FUNDING_AMOUNT_BTC } from "../const";

const FundingCard = () => {
  const [fundingAccount, setFundingAccount] = React.useState("");
  const [fundingAmount, setFundingAmount] = React.useState(
    DEFAULT_FUNDING_AMOUNT_BTC
  );

  const {
    data: fundingAddresses,
    isError: isErrorFundingAddresses,
    error: errorFundingAddresses,
  } = useQuery({
    queryKey: ["fundingAddresses"],
    queryFn: () => backendApi.fetchFundingAddresses(),
  });

  const {
    data: addressInfo,
    isError: isErrorAddressInfo,
    error: errorAddressInfo,
  } = useQuery({
    queryKey: ["addressInfo", fundingAccount],
    queryFn: () => backendApi.fetchAddressInfo(fundingAccount),
    keepPreviousData: true,
    enabled: !!fundingAccount,
  });

  const formatAddressInfo = (addressInfo) => {
    return (
      <Box sx={{ mt: 1, mb: 1, ml: 2 }}>
        <Typography variant="body1" sx={{ overflowWrap: "anywhere" }}>
          {`Address Balance: ${addressInfo?.funded_utxo_sum} BTC`}
        </Typography>
        <Typography variant="body1" sx={{ overflowWrap: "anywhere" }}>
          {`UTXO Count: ${addressInfo?.utxo_count}`}
        </Typography>
      </Box>
    );
  };

  const isFundingEnabled = () => {
    return fundingAccount && addressInfo && fundingAmount > 0;
  };

  const getErrors = () => {
    let errors = [];
    if (isErrorFundingAddresses) {
      errors.push(errorFundingAddresses.message);
    }
    if (isErrorAddressInfo) {
      errors.push(errorAddressInfo.message);
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
              <Grid container direction={"column"} spacing={1}>
                <Grid container spacing={2}>
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
                            return (
                              <MenuItem key={address} value={address}>
                                {address}
                              </MenuItem>
                            );
                          })
                        : []}
                    </Select>
                  </FormControl>
                  <Grid>{addressInfo && formatAddressInfo(addressInfo)}</Grid>
                </Grid>
                <Grid>
                  <TextField
                    required
                    label="Funding Amount (BTC)"
                    type="number"
                    sx={{ mt: 2, minWidth: 200 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="standard"
                    value={fundingAmount}
                    onChange={(e) => {
                      setFundingAmount(e.target.value);
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Grid>
          <Grid>
            <CardActions>
              <Button
                size="small"
                variant="contained"
                disabled={!isFundingEnabled()}
              >
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
