import { useQuery } from "@tanstack/react-query";
import { Autocomplete, Typography, TextField } from "@mui/material";

import backendApi from "../../api";

const AddressSelect = ({ label, selectedAddress, setSelectedAddress }) => {
  const {
    data: testnetAddresses,
    isError: isErrorTestnetAddresses,
    error: errorTestnetAddresses,
  } = useQuery({
    queryKey: ["testnetAddresses"],
    queryFn: () => backendApi.fetchTestnetFundingAddresses(),
  });

  const getErrors = () => {
    let errors = [];
    if (isErrorTestnetAddresses) {
      errors.push(errorTestnetAddresses.message);
    }
    return errors;
  };

  return (
    <>
      <Autocomplete
        sx={{ minWidth: 300 }}
        freeSolo
        options={testnetAddresses ? testnetAddresses : []}
        value={selectedAddress}
        onChange={(e, value) => {
          setSelectedAddress(value);
        }}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
      {getErrors().length > 0 && (
        <Typography variant="caption" color="error">
          {getErrors().join(", ")}
        </Typography>
      )}
    </>
  );
};

export default AddressSelect;
