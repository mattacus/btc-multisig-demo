import { TextField, Slider, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

const TransactionAmountInputs = ({
  feeRate,
  handleFeeRateChange,
  fundingAmount,
  handleFundingAmountChange,
  feeMin,
  feeMax,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid>
        <TextField
          required
          label="Send Amount (BTC)"
          type="number"
          sx={{ mt: 2, width: 200 }}
          variant="standard"
          value={fundingAmount}
          onChange={(e) => handleFundingAmountChange(e.target.value)}
        />
      </Grid>
      <Grid sx={{ mt: 1, ml: 2 }}>
        <Grid>
          <Typography variant="caption" color="text.secondary">
            {"Fee Rate (sat/vB)"}
          </Typography>
        </Grid>
        <Grid container spacing={2}>
          <Grid>
            <Slider
              sx={{ width: 100 }}
              value={feeRate}
              step={1}
              min={feeMin}
              max={feeMax}
              onChange={(e, val) => {
                handleFeeRateChange(val);
              }}
            />
          </Grid>
          <Grid>
            <Typography variant="overline">{feeRate}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TransactionAmountInputs;
