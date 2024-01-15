import { Button, Box } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useTheme } from "@mui/material/styles";

const AddWalletButton = ({ handleAddWallet }) => {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight={500}
      height="100%"
      width={300}
      sx={{ border: `2px dashed ${theme.palette.grey["400"]}` }}
      borderRadius={2}
    >
      <Button
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleAddWallet}
      >
        Add Wallet
      </Button>
    </Box>
  );
};

export default AddWalletButton;
