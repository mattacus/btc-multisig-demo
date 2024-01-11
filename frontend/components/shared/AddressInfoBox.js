import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const AddressInfoBox = (addressInfo) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        mt: 1,
        mb: 1,
        ml: 2,
        background: theme.palette.grey["200"],
        padding: 1,
      }}
    >
      <Typography variant="body1" sx={{ overflowWrap: "anywhere" }}>
        {`Address Balance: ${addressInfo?.unspent_utxo_sum} BTC`}
      </Typography>
      <Typography variant="body1" sx={{ overflowWrap: "anywhere" }}>
        {`UTXO Count: ${addressInfo?.unspent_utxo_count}`}
      </Typography>
    </Box>
  );
};

export default AddressInfoBox;
