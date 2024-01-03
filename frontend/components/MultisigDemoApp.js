import * as React from "react";
import { Divider, Grid, Typography, Collapse, IconButton } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2";
import WalletKeyCard from "./WalletKeyCard";
import FundingCard from "./FundingCard";
import SendingCard from "./SendingCard";
const btcLogo = new URL("../img/bitcoin-symbol.png", import.meta.url);

const CollapseDivider = ({ visible, onClick }) => {
  return (
    <Divider sx={{ mt: 2, mb: 2 }}>
      <IconButton onClick={onClick}>
        {visible ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      </IconButton>
    </Divider>
  );
};

const MultisigDemoApp = () => {
  const [showKeySetup, setShowKeySetup] = React.useState(true);
  const [showWalletRecieve, setShowWalletRecieve] = React.useState(true);
  const [showWalletSend, setShowWalletSend] = React.useState(true);

  return (
    <Grid container flexDirection={"column"} spacing={2} sx={{ mt: 1 }}>
      <Grid
        sx={{
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img src={btcLogo} width={50} height={50} alt="logo" />
        <Typography variant="h3">BTC Multisig Demo</Typography>
      </Grid>
      <Grid>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Key Setup
        </Typography>
        <Collapse in={showKeySetup}>
          <Grid container spacing={2}>
            <Grid xs={4}>
              <WalletKeyCard name={"Hardware Key 1"} />
            </Grid>
            <Grid xs={4}>
              <WalletKeyCard name={"Hardware Key 2"} />
            </Grid>
          </Grid>
        </Collapse>
        <CollapseDivider
          visible={showKeySetup}
          onClick={(e) => {
            e.preventDefault();
            setShowKeySetup(!showKeySetup);
          }}
        />
      </Grid>
      <Grid>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Recieve To Multisig Wallet
        </Typography>
        <Collapse in={showWalletRecieve}>
          <FundingCard />
        </Collapse>
        <CollapseDivider
          visible={showWalletRecieve}
          onClick={(e) => {
            e.preventDefault();
            setShowWalletRecieve(!showWalletRecieve);
          }}
        />
      </Grid>
      <Grid>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Send From Multisig Wallet
        </Typography>
        <Collapse in={showWalletSend}>
          <SendingCard />
        </Collapse>
        <CollapseDivider
          visible={showWalletSend}
          onClick={(e) => {
            e.preventDefault();
            setShowWalletSend(!showWalletSend);
          }}
        />
      </Grid>
    </Grid>
  );
};

export default MultisigDemoApp;
