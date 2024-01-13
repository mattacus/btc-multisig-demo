import * as React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  TextField,
  Alert,
  AlertTitle,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

const WalletCard = ({ name = "Untitled Key", keyIndex }) => {
  const [error, setError] = React.useState(null);

  return (
    <>
      <Card sx={{ width: 300 }}>
        <Grid
          sx={{ height: "100%" }}
          container
          direction={"column"}
          justifyContent={"space-between"}
        >
          <Grid>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {name}
              </Typography>
              <Grid container direction={"column"} spacing={1}>
                <Grid></Grid>
              </Grid>
            </CardContent>
          </Grid>
          <Grid>
            <CardActions>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setError(null);
                }}
              >
                Get Public Key
              </Button>
            </CardActions>
          </Grid>
        </Grid>
      </Card>
      {error ? (
        <Typography variant="caption" color="error">
          Error: {error}
        </Typography>
      ) : (
        <p />
      )}
    </>
  );
};

export default WalletCard;
