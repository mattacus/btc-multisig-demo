import * as React from "react";
const btcLogo = new URL("../img/bitcoin-symbol.png", import.meta.url);
import { Divider, Grid, Typography, Collapse, IconButton } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2";
import PublicKeyCard from "./PublicKeyCard";
import FundingCard from "./FundingCard";
import SendingCard from "./SendingCard";
import KeySetupControls from "./KeySetupControls";
import { useMultisigKeyContext } from "../multisigKeyContext";

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
  const multisigKeyState = useMultisigKeyContext();
  const [showKeySetup, setShowKeySetup] = React.useState(true);
  const [showAddressRecieve, setShowAddressRecieve] = React.useState(true);
  const [showAddressSend, setShowAddressSend] = React.useState(true);

  console.log(multisigKeyState);

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
          <Grid container flexDirection={"column"} spacing={2}>
            <Grid>
              <KeySetupControls />
            </Grid>
            <Grid container wrap="wrap" spacing={2}>
              <Grid xs={4}>
                <PublicKeyCard name={"Hardware Key 1"} keyIndex={0} />
              </Grid>
              <Grid xs={4}>
                <PublicKeyCard name={"Hardware Key 2"} keyIndex={1} />
              </Grid>
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
          Recieve To Multisig Address
        </Typography>
        <Collapse in={showAddressRecieve}>
          <FundingCard />
        </Collapse>
        <CollapseDivider
          visible={showAddressRecieve}
          onClick={(e) => {
            e.preventDefault();
            setShowAddressRecieve(!showAddressRecieve);
          }}
        />
      </Grid>
      <Grid>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Send From Multisig Address
        </Typography>
        <Collapse in={showAddressSend}>
          <SendingCard />
        </Collapse>
        <CollapseDivider
          visible={showAddressSend}
          onClick={(e) => {
            e.preventDefault();
            setShowAddressSend(!showAddressSend);
          }}
        />
      </Grid>
    </Grid>
  );
};

export default MultisigDemoApp;
