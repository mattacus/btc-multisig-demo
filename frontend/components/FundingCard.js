import * as React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  TextField,
  Alert,
  FormControlLabel,
  Switch,
  Snackbar,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import TransactionInfoBox from "./shared/TransactionInfoBox";
import TransactionAmountInputs from "./shared/TransactionAmountInputs";
import AddressSelect from "./shared/AddressSelect";
import backendApi from "../api";
import { useMultisigContext } from "../MultisigContext";
import { DEFAULT_FUNDING_AMOUNT_BTC } from "../const";
import AddressInfoBox from "./shared/AddressInfoBox";
import { getFeeRatesRange } from "../util";

const FundingCard = () => {
  const multisigContext = useMultisigContext();
  const [snackbarStatus, setSnackbarStatus] = React.useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [fundingAddress, setfundingAddress] = React.useState("");
  const [fundingAmount, setFundingAmount] = React.useState(
    DEFAULT_FUNDING_AMOUNT_BTC
  );
  const [feeRate, setFeeRate] = React.useState(1);
  const [isDebugTransaction, setIsDebugTransaction] = React.useState(true);
  const [sendAddress, setSendAddress] = React.useState("");

  // Update sendAddress when multisigContext.address changes
  React.useEffect(() => {
    if (multisigContext.multisigAddress) {
      setSendAddress(multisigContext.multisigAddress);
    }
  }, [multisigContext]);

  const {
    data: addressInfo,
    isError: isErrorAddressInfo,
    error: errorAddressInfo,
  } = useQuery({
    queryKey: ["addressInfo", fundingAddress],
    queryFn: () => backendApi.fetchAddressInfo(fundingAddress),
    keepPreviousData: true,
    enabled: !!fundingAddress,
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
    mutationFn: ({
      fundingAddress,
      multisigAddress,
      amount,
      feeRate,
      publish,
    }) =>
      backendApi.createFundingTransaction(
        fundingAddress,
        multisigAddress,
        amount,
        feeRate,
        publish
      ),
  });
  const {
    data: fundingTransactionData,
    isSuccess: isSuccessCreateFundingTransaction,
    isError: isErrorCreateFundingTransaction,
    error: errorCreateFundingTransaction,
  } = createFundingTransactionMutation;

  const isFundingEnabled =
    fundingAddress && addressInfo && fundingAmount > 0 && sendAddress;

  const getErrors = () => {
    let errors = [];
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

  const handleSnackbarClose = () => {
    setSnackbarStatus({ ...snackbarStatus, open: false });
  };

  return (
    <>
      <Card>
        <CardContent>
          <Grid container direction={"column"} spacing={1}>
            <Grid>
              <Typography gutterBottom>Testnet Funding Details</Typography>
            </Grid>
            <Grid
              container
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
              wrap="nowrap"
              sx={{ width: "100%" }}
            >
              <Grid>
                <AddressSelect
                  label={"Testnet Funding Address"}
                  selectedAddress={fundingAddress}
                  setSelectedAddress={setfundingAddress}
                />
              </Grid>
              <Grid>
                <AddressInfoBox addressInfo={addressInfo} />
              </Grid>
              <Grid>
                <TextField
                  required
                  label="Multisig Address"
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
            <Grid>
              <TransactionAmountInputs
                feeRate={feeRate}
                handleFeeRateChange={setFeeRate}
                fundingAmount={fundingAmount}
                handleFundingAmountChange={setFundingAmount}
                feeMin={getFeeRatesRange(feeEstimates).min}
                feeMax={getFeeRatesRange(feeEstimates).max}
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
                disabled={!isFundingEnabled}
                onClick={() => {
                  createFundingTransactionMutation.mutate({
                    fundingAddress: fundingAddress,
                    multisigAddress: sendAddress,
                    amount: fundingAmount,
                    feeRate: feeRate,
                    publish: !isDebugTransaction,
                  });
                }}
              >
                Fund Multisig Address
              </Button>
              <FormControlLabel
                control={
                  <Switch
                    sx={{ ml: 6 }}
                    checked={isDebugTransaction}
                    onChange={(e) => setIsDebugTransaction(e.target.checked)}
                  />
                }
                label="Debug"
              />
            </Grid>
            <Grid sx={{ mt: -8 }}>
              <TransactionInfoBox
                setParentSnackbarStatus={setSnackbarStatus}
                transactionID={
                  isSuccessCreateFundingTransaction && fundingTransactionData
                    ? fundingTransactionData.tx_id
                    : undefined
                }
              />
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
      <Snackbar
        open={snackbarStatus.open}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarStatus.severity}
          sx={{ width: "100%" }}
        >
          {snackbarStatus.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FundingCard;
