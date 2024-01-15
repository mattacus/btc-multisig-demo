import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Alert } from "@mui/material";

import WalletCard from "./WalletCard";
import AddWalletButton from "./AddWalletButtton";

const walletSecretsLoaded =
  !!process.env.WALLET_EMULATOR_SECRETS &&
  String(process.env.WALLET_EMULATOR_SECRETS).split(",").length >= 1;

const initialWallets = walletSecretsLoaded
  ? String(process.env.WALLET_EMULATOR_SECRETS)
      .split(",")
      .map((secret, i) => {
        return { index: i, secret: secret };
      })
  : [];

const WalletApp = () => {
  const [wallets, updateWallets] = React.useState(initialWallets);

  handleRemoveWallet = (index) => {
    updateWallets(wallets.filter((wallet) => wallet.index !== index));
  };

  handleAddWallet = () => {
    updateWallets([...wallets, { index: wallets.length, secret: "" }]);
  };

  return (
    <>
      {walletSecretsLoaded ? (
        <Grid container spacing={4} sx={{ mt: 1 }}>
          {wallets.map((wallet) => {
            return (
              <Grid key={"HW" + wallet.index}>
                <WalletCard
                  name={"Hardware Wallet Emulator" + " " + wallet.index}
                  walletIndex={wallet.index}
                  defaultSecret={wallet.secret}
                  handleRemoveWallet={handleRemoveWallet}
                />
              </Grid>
            );
          })}
          <Grid>
            <AddWalletButton handleAddWallet={handleAddWallet} />
          </Grid>
        </Grid>
      ) : (
        <Alert severity="error">
          No wallet secrets found. Add at least one string to a comma-separated
          list of secrets in 'process.env.WALLET_EMULATOR_SECRETS'
        </Alert>
      )}
    </>
  );
};

export default WalletApp;
