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
  FormControlLabel,
  Switch,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import backendApi from "../api";
import { useMultisigKeyContext } from "../multisigKeyContext";
import { DEFAULT_SENDING_AMOUNT_BTC } from "../const";
import AddressInfoBox from "./shared/AddressInfoBox";
import TransactionInfoBox from "./shared/TransactionInfoBox";
import TransactionAmountInputs from "./shared/TransactionAmountInputs";
import AddressSelect from "./shared/AddressSelect";
import { getFeeRatesRange } from "../util";

const SendingCard = () => {
  const multisigKeyState = useMultisigKeyContext();

  const [sendingAddress, setSendingAddress] = React.useState("");
  const [sendingAmount, setSendingAmount] = React.useState(
    DEFAULT_SENDING_AMOUNT_BTC
  );
  const [feeRate, setFeeRate] = React.useState(1);
  const [receivingAddress, setReceivingAddress] = React.useState("");
  const [isDebugTransaction, setIsDebugTransaction] = React.useState(true);

  // Update sendAddress when multisigKeyState.address changes
  React.useEffect(() => {
    if (multisigKeyState.multisigAddress) {
      setSendingAddress(multisigKeyState.multisigAddress);
    }
  }, [multisigKeyState]);

  const {
    data: addressInfo,
    isError: isErrorAddressInfo,
    error: errorAddressInfo,
  } = useQuery({
    queryKey: ["addressInfo", sendingAddress],
    queryFn: () => backendApi.fetchAddressInfo(sendingAddress),
    keepPreviousData: true,
    enabled: !!sendingAddress,
  });

  // const isSendingEnabled =
  //   sendingAddress && addressInfo && sendingAmount > 0 && receivingAddress;
  const isSendingEnabled = false;

  const {
    data: feeEstimates,
    isError: isErrorFeeEstimates,
    error: errorFeeEstimates,
  } = useQuery({
    queryKey: ["feeEstimates"],
    queryFn: () => backendApi.fetchFeeEstimates(),
  });

  const getErrors = () => {
    let errors = [];
    if (isErrorAddressInfo) {
      errors.push(errorAddressInfo.message);
    }
    if (isErrorFeeEstimates) {
      errors.push(errorFeeEstimates.message);
    }

    return errors;
  };

  return (
    <>
      <Card>
        <CardContent>
          <Typography gutterBottom>Multisig Sending Details</Typography>
          <Grid container wrap="nowrap">
            <Grid container direction={"column"} spacing={1} xs={8}>
              <Grid container spacing={2}>
                <Grid>
                  <TextField
                    required
                    label="Multisig Address"
                    type="string"
                    multiline
                    sx={{ minWidth: 250 }}
                    variant="standard"
                    value={sendingAddress}
                    onChange={(e) => {
                      setSendingAddress(e.target.value);
                    }}
                  />
                </Grid>
                <Grid>{addressInfo && AddressInfoBox(addressInfo)}</Grid>
              </Grid>
              <Grid>
                <TransactionAmountInputs
                  feeRate={feeRate}
                  handleFeeRateChange={setFeeRate}
                  fundingAmount={sendingAmount}
                  handleFundingAmountChange={setSendingAmount}
                  feeMin={getFeeRatesRange(feeEstimates).min}
                  feeMax={getFeeRatesRange(feeEstimates).max}
                />
              </Grid>
            </Grid>
            <Grid container direction={"column"} spacing={1}>
              <AddressSelect
                label={"Receiving Address"}
                selectedAddress={receivingAddress}
                setSelectedAddress={setReceivingAddress}
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
                disabled={!isSendingEnabled}
                onClick={() => {}}
              >
                Send From Multisig Address
              </Button>
              <FormControlLabel
                control={
                  <Switch
                    sx={{ ml: 2 }}
                    checked={isDebugTransaction}
                    onChange={(e) => setIsDebugTransaction(e.target.checked)}
                  />
                }
                label="Debug"
              />
            </Grid>
            <Grid sx={{ mt: -8 }}>
              {/* {isSuccessCreateFundingTransaction && fundingTransactionData && (
                <TransactionInfoBox
                  setParentSnackbarStatus={setSnackbarStatus}
                  transactionID={fundingTransactionData.tx_id}
                />
              )} */}
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

export default SendingCard;
