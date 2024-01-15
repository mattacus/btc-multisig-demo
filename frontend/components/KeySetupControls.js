import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { TwoKeysIcon } from "@bitcoin-design/bitcoin-icons-react/filled";
import { saveAs } from "file-saver";

import NumberInput from "./shared/NumberInput";
import {
  useMultisigContext,
  useMultisigDispatchContext,
} from "../MultisigContext";
import { MULTISIG_ADDRESS_TYPES } from "../const";
import backendApi from "../api";
import { MIN_KEYS, MAX_KEYS } from "../const";
import { Download } from "@mui/icons-material";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const KeySetupControls = () => {
  const multisigContext = useMultisigContext();
  const multisigDispatch = useMultisigDispatchContext();

  const [error, setError] = React.useState(null);

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
    return errors.concat(error);
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = () => {
      try {
        const parsedData = JSON.parse(fileReader.result);
        // TODO better input sanitization
        if (
          parsedData.addressType &&
          parsedData.publicKeys &&
          parsedData.quorum
        ) {
          multisigDispatch({
            type: "UPDATE_QUORUM",
            payload: parsedData.quorum,
          });

          multisigDispatch({
            type: "SET_MULTISIG_ADDRESS_TYPE",
            payload: parsedData.addressType,
          });
          multisigDispatch({
            type: "SET_PUBLIC_KEYS",
            payload: parsedData.publicKeys,
          });

          createMultisigAddressMutation.mutate({
            pubKeys: parsedData.publicKeys,
            quorum: parsedData.quorum.m,
          });
        } else {
          throw new Error("Invalid file format");
        }
      } catch (e) {
        setError(e);
      }
    };
  };

  const handleDownload = () => {
    const data = JSON.stringify(
      {
        addressType: multisigContext.multisigAddressType, // TODO make this dynamic
        publicKeys: multisigContext.publicKeyList,
        quorum: multisigContext.quorum,
      },
      null,
      4
    );

    const blob = new Blob([data], { type: "application/json;charset=utf-8" });
    saveAs(blob, "multisig_address_backup.json");
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
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
              >
                Import From File
                <VisuallyHiddenInput type="file" onChange={handleFileImport} />
              </Button>
            </Grid>
            <Grid>
              <NumberInput
                label="Required Keys (Quorum M)"
                min={1}
                max={multisigContext.quorum.n}
                decimalScale={0}
                value={multisigContext.quorum.m}
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
                value={multisigContext.quorum.n}
                onChange={(val) => {
                  multisigDispatch({
                    type: "UPDATE_QUORUM",
                    payload: { n: val },
                  });
                }}
              />
            </Grid>
            <Grid>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="select-address-type">Address Type</InputLabel>
                <Select
                  labelId="select-address-type"
                  value={multisigContext.multisigAddressType}
                  label="Address Type"
                  onChange={(e) =>
                    multisigDispatch({
                      type: "SET_MULTISIG_ADDRESS_TYPE",
                      payload: e.target.value,
                    })
                  }
                >
                  {Object.values(MULTISIG_ADDRESS_TYPES).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
          <AlertTitle>
            <Grid container spacing={1} sx={{ m: 0 }}>
              <Grid>Multisig Address Successfully Created!</Grid>
              <Grid>
                <TwoKeysIcon
                  style={{
                    width: 24,
                    height: 24,
                  }}
                />
              </Grid>
            </Grid>
          </AlertTitle>
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
            onClick={handleDownload}
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
