import Grid from "@mui/material/Unstable_Grid2";

import WalletCard from "./WalletCard";

const fakeHardwareKeys = [
  {
    name: "Hardware Key Emulator",
    defaultSecret: process.env.WALLET_DEFAULT_SECRET_REACH ?? "",
  },
  {
    name: "Hardware Key Emulator",
    defaultSecret: process.env.WALLET_DEFAULT_SECRET_HARVEST ?? "",
  },
];

const WalletApp = () => {
  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {fakeHardwareKeys.map((hwKey, index) => {
        return (
          <Grid>
            <WalletCard
              key={hwKey.name + index}
              name={hwKey.name}
              keyIndex={index}
              defaultSecret={hwKey.defaultSecret}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default WalletApp;
