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
  Alert,
  AlertTitle,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import backendApi from "../api";
import {
  useMultisigContext,
  useMultisigDispatchContext,
} from "../MultisigContext";
import { DEFAULT_SENDING_AMOUNT_BTC } from "../const";
import AddressInfoBox from "./shared/AddressInfoBox";
import TransactionInfoBox from "./shared/TransactionInfoBox";
import TransactionAmountInputs from "./shared/TransactionAmountInputs";
import AddressSelect from "./shared/AddressSelect";
import { getFeeRatesRange } from "../util";

const SendingCard = () => {
  const multisigContext = useMultisigContext();
  const multisigDispatch = useMultisigDispatchContext();

  const [sendingAddress, setSendingAddress] = React.useState("");
  const [sendingAmount, setSendingAmount] = React.useState(
    DEFAULT_SENDING_AMOUNT_BTC
  );
  const [feeRate, setFeeRate] = React.useState(1);
  const [receivingAddress, setReceivingAddress] = React.useState("");
  const [isDebugTransaction, setIsDebugTransaction] = React.useState(true);

  // Update sendAddress when multisigContext.address changes
  React.useEffect(() => {
    if (multisigContext.multisigAddress) {
      setSendingAddress(multisigContext.multisigAddress);
    }
  }, [multisigContext]);

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

  const isTransactionCreationEnabled =
    sendingAddress && addressInfo && sendingAmount > 0 && receivingAddress;
  const isSendingEnabled =
    multisigContext.currentMultisigTransaction &&
    Object.keys(multisigContext.signatures).length >= multisigContext.quorum.m;

  const {
    data: feeEstimates,
    isError: isErrorFeeEstimates,
    error: errorFeeEstimates,
  } = useQuery({
    queryKey: ["feeEstimates"],
    queryFn: () => backendApi.fetchFeeEstimates(),
  });

  const createUnsignedTransactionMutation = useMutation({
    mutationFn: ({ sendAddress, receiveAddress, amount, feeRate }) =>
      backendApi.createUnsignedMultisigTransaction(
        sendAddress,
        receiveAddress,
        amount,
        feeRate,
        multisigContext.publicKeyList,
        multisigContext.quorum.m
      ),
    onSuccess: (data) => {
      multisigDispatch({
        type: "SET_PENDING_TRANSACTION",
        payload: data["tx_raw"],
      });
      multisigDispatch({
        type: "SET_SIG_HASH_LIST",
        payload: data["sig_hash_list"],
      });
    },
  });

  const finalizeMultisigTransactionMutation = useMutation({
    mutationFn: ({ signatures, transactionData }) =>
      backendApi.finalizeMultisigTransaction(
        signatures,
        transactionData,
        multisigContext.publicKeyList,
        multisigContext.quorum.m
      ),
  });

  const {
    data: unsignedTransactionData,
    isError: isErrorCreateUnsignedTransaction,
    error: errorCreateUnsignedTransaction,
  } = createUnsignedTransactionMutation;

  const getErrors = () => {
    let errors = [];
    if (isErrorAddressInfo) {
      errors.push(errorAddressInfo.message);
    }
    if (isErrorFeeEstimates) {
      errors.push(errorFeeEstimates.message);
    }
    if (isErrorCreateUnsignedTransaction) {
      errors.push(errorCreateUnsignedTransaction);
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
              <Grid sx={{ ml: -1 }}>
                <Button
                  size="small"
                  variant="contained"
                  disabled={!isTransactionCreationEnabled}
                  onClick={() => {
                    createUnsignedTransactionMutation.mutate({
                      sendAddress: sendingAddress,
                      receiveAddress: receivingAddress,
                      amount: sendingAmount,
                      feeRate: feeRate,
                    });
                  }}
                >
                  Create Transaction for Signing
                </Button>
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
                onClick={() => {
                  finalizeMultisigTransactionMutation.mutate({
                    signatures: multisigContext.signatures,
                    transactionData: multisigContext.currentMultisigTransaction,
                  });
                }}
              >
                Finalize Multisig Transaction
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
              {unsignedTransactionData && (
                <Alert severity="info">Unsigned Transaction Created</Alert>
              )}
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
