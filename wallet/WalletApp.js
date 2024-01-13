import Grid from "@mui/material/Unstable_Grid2";

import WalletCard from "./WalletCard";

const WalletApp = () => {
  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid>
        <WalletCard keyIndex={0} />
      </Grid>
    </Grid>
  );
};

export default WalletApp;
