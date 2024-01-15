import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const AddressInfoBox = ({ addressInfo }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: 300,
        mt: 1,
        mb: 1,
        background: theme.palette.grey["200"],
        padding: 1,
      }}
    >
      <Typography variant="body1" sx={{ overflowWrap: "anywhere" }}>
        {`Address Balance (BTC): ${addressInfo?.unspent_utxo_sum ?? ""}`}
      </Typography>
      <Typography variant="body1" sx={{ overflowWrap: "anywhere" }}>
        {`UTXO Count: ${addressInfo?.unspent_utxo_count ?? ""}`}
      </Typography>
    </Box>
  );
};

export default AddressInfoBox;
