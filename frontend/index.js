import React from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline } from "@mui/material";
import { Container, Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import MultisigDemoApp from "./components/MultisigDemoApp";

const theme = createTheme({
  palette: {
    primary: {
      main: "#F7931A",
      light: "#F8A847",
      dark: "#AC6612",
      contrastText: "#FFFFFF",
    },
  },
});

const container = document.getElementById("react");
const root = createRoot(container);
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Container>
      <Box sx={{ height: "100vh" }}>
        <MultisigDemoApp />
      </Box>
    </Container>
  </ThemeProvider>
);
