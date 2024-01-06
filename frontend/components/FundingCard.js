import * as React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
  Slider,
  Alert,
  AlertTitle,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import backendApi from "../api";
import { useMultisigKeyContext } from "../multisigKeyContext";
import {
  DEFAULT_FUNDING_AMOUNT_BTC,
  FEE_RATE_MIN_CONFIRMATION_TARGET,
  FEE_RATE_MAX_CONFIRMATION_TARGET,
} from "../const";

const FundingCard = () => {
  const multisigKeyState = useMultisigKeyContext();
  const [fundingAccount, setFundingAccount] = React.useState("");
  const [fundingAmount, setFundingAmount] = React.useState(
    DEFAULT_FUNDING_AMOUNT_BTC
  );
  const [sendAddress, setSendAddress] = React.useState("");
  const [feeRate, setFeeRate] = React.useState(1);

  // Update sendAddress when multisigKeyState.address changes
  React.useEffect(() => {
    if (multisigKeyState.multisigAddress) {
      setSendAddress(multisigKeyState.multisigAddress);
    }
  }, [multisigKeyState]);

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

  const {
    data: feeEstimates,
    isError: isErrorFeeEstimates,
    error: errorFeeEstimates,
  } = useQuery({
    queryKey: ["feeEstimates"],
    queryFn: () => backendApi.fetchFeeEstimates(),
    keepPreviousData: true,
  });

  const createFundingTransactionMutation = useMutation({
    mutationFn: ({ fundingAddress, multisigAddress, amount, feeRate }) =>
      backendApi.createFundingTransaction(
        fundingAddress,
        multisigAddress,
        amount,
        feeRate
      ),
  });
  const {
    data: fundingTransactionData,
    isSuccess: isSuccessCreateFundingTransaction,
    isError: isErrorCreateFundingTransaction,
    error: errorCreateFundingTransaction,
  } = createFundingTransactionMutation;

  const formatAddressInfo = (addressInfo) => {
    return (
      <Box sx={{ mt: 1, mb: 1, ml: 2 }}>
        <Typography variant="body1" sx={{ overflowWrap: "anywhere" }}>
          {`Address Balance: ${addressInfo?.unspent_utxo_sum} BTC`}
        </Typography>
        <Typography variant="body1" sx={{ overflowWrap: "anywhere" }}>
          {`UTXO Count: ${addressInfo?.unspent_utxo_count}`}
        </Typography>
      </Box>
    );
  };

  const isFundingEnabled = () => {
    return fundingAccount && addressInfo && fundingAmount > 0 && sendAddress;
  };

  const getFeeRatesRange = () => {
    if (feeEstimates) {
      return {
        min: feeEstimates[FEE_RATE_MIN_CONFIRMATION_TARGET],
        max:
          feeEstimates[FEE_RATE_MAX_CONFIRMATION_TARGET] >
          feeEstimates[FEE_RATE_MIN_CONFIRMATION_TARGET]
            ? feeEstimates[FEE_RATE_MAX_CONFIRMATION_TARGET]
            : feeEstimates[FEE_RATE_MIN_CONFIRMATION_TARGET] + 1,
      };
    }
    return { min: 1, max: 10 };
  };

  const getErrors = () => {
    let errors = [];
    if (isErrorFundingAddresses) {
      errors.push(errorFundingAddresses.message);
    }
    if (isErrorAddressInfo) {
      errors.push(errorAddressInfo.message);
    }
    if (isErrorFeeEstimates) {
      errors.push(errorFeeEstimates.message);
    }
    if (isErrorCreateFundingTransaction) {
      errors.push(errorCreateFundingTransaction);
    }
    return errors;
  };

  return (
    <>
      <Card>
        <CardContent>
          <Typography gutterBottom>Testnet Funding Account</Typography>
          <Grid container wrap="nowrap">
            <Grid container direction={"column"} spacing={1} xs={8}>
              <Grid container spacing={2}>
                <Grid>
                  <FormControl
                    variant="standard"
                    sx={{ minWidth: 200 }}
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
                </Grid>
                <Grid>{addressInfo && formatAddressInfo(addressInfo)}</Grid>
              </Grid>
              <Grid>
                <Grid container spacing={2}>
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
                  <Grid sx={{ mt: 1, ml: 2 }}>
                    <Slider
                      value={feeRate}
                      step={1}
                      min={getFeeRatesRange().min}
                      max={getFeeRatesRange().max}
                      valueLabelDisplay="on"
                      onChange={(e, val) => {
                        setFeeRate(val);
                      }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      gutterBottom
                    >
                      {"Fee Rate (sat/vB)"}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container direction={"column"} spacing={1}>
              <TextField
                required
                label="Multisig Wallet Address"
                type="string"
                multiline
                sx={{ minWidth: 250 }}
                variant="standard"
                value={sendAddress}
                onChange={(e) => {
                  setSendAddress(e.target.value);
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Grid
            container
            sx={{ width: "100%" }}
            alignItems="flex-end"
            justifyContent="space-between"
          >
            <Grid>
              <Button
                size="small"
                variant="contained"
                disabled={!isFundingEnabled()}
                onClick={() => {
                  createFundingTransactionMutation.mutate({
                    fundingAddress: fundingAccount,
                    multisigAddress: sendAddress,
                    amount: fundingAmount,
                    feeRate: feeRate,
                  });
                }}
              >
                Fund Multisig Wallet
              </Button>
            </Grid>
            <Grid sx={{ mt: -8 }}>
              {isSuccessCreateFundingTransaction && fundingTransactionData && (
                <Alert severity="info">
                  <AlertTitle>Transaction Posted to Network</AlertTitle>
                  <strong>Transaction ID: </strong>
                  <br />
                  {fundingTransactionData.tx_id}
                </Alert>
              )}
            </Grid>
          </Grid>
        </CardActions>
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
