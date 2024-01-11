import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  AlertTitle,
} from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2";
import NumberInput from "./shared/NumberInput";
import {
  useMultisigContext,
  useMultisigDispatchContext,
} from "../MultisigContext";
import backendApi from "../api";
import { MIN_KEYS, MAX_KEYS } from "../const";
import { Download } from "@mui/icons-material";

const KeySetupControls = () => {
  const multisigContext = useMultisigContext();
  const multisigDispatch = useMultisigDispatchContext();

  const isCreateMultisigAddressEnabled =
    Object.keys(multisigContext.publicKeyList).length >= 2;

  const createMultisigAddressMutation = useMutation({
    mutationFn: ({ pubKeys, quorum }) =>
      backendApi.createMultisigAddress(pubKeys, quorum, "p2sh"),
    onSuccess: (data) => {
      multisigDispatch({
        type: "SET_MULTISIG_ADDRESS",
        payload: data.address,
      });
    },
  });
  const {
    data: multisigAddressData,
    isSuccess: isSuccessCreateMultisigAddress,
    isError: isErrorCreateMultisigAddress,
    error: errorCreateMultisigAddress,
  } = createMultisigAddressMutation;

  const getErrors = () => {
    let errors = [];
    if (isErrorCreateMultisigAddress) {
      errors.push(errorCreateMultisigAddress);
    }
    return errors;
  };

  return (
    <>
      <Card sx={{ width: "100%" }}>
        <CardContent
          sx={{
            "&:last-child": {
              paddingBottom: 2,
            },
          }}
        >
          <Grid
            sx={{ height: "100%" }}
            container
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid>
              <NumberInput
                label="Required Keys (Quorum M)"
                min={1}
                max={multisigContext.quorum.n}
                decimalScale={0}
                initialValue={multisigContext.quorum.m}
                onChange={(val) => {
                  multisigDispatch({
                    type: "UPDATE_QUORUM",
                    payload: { m: val },
                  });
                }}
              />
            </Grid>
            <Grid>
              <NumberInput
                label="Total Keys (Quorum N)"
                min={MIN_KEYS}
                max={MAX_KEYS}
                decimalScale={0}
                initialValue={multisigContext.quorum.n}
                onChange={(val) => {
                  multisigDispatch({
                    type: "UPDATE_QUORUM",
                    payload: { n: val },
                  });
                }}
              />
            </Grid>
            <Grid>
              <Button
                variant="contained"
                disabled={!isCreateMultisigAddressEnabled}
                onClick={() => {
                  createMultisigAddressMutation.mutate({
                    pubKeys: multisigContext.publicKeyList,
                    quorum: multisigContext.quorum.m,
                  });
                }}
              >
                Create Multisig Address
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {getErrors().length ? (
        <Typography variant="caption" color="error">
          {getErrors().join(", ")}
        </Typography>
      ) : (
        <p />
      )}
      {isSuccessCreateMultisigAddress && multisigAddressData && (
        <Alert severity="success">
          <AlertTitle>Multisig Address Successfully Created!</AlertTitle>
          <strong>Address: </strong>
          <br />
          {multisigAddressData.address}
          <br />
          <strong>Redeem Script: </strong>
          <br />
          {multisigAddressData.redeem_script}
          <br />
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            color="inherit"
            onClick={() => {}}
            startIcon={<Download />}
          >
            Download Multisig Address Details
          </Button>
        </Alert>
      )}
    </>
  );
};

export default KeySetupControls;
