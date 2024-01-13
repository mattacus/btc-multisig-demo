import React from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline } from "@mui/material";
import { Container, Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WalletApp from "./WalletApp";

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

const queryClient = new QueryClient();

const container = document.getElementById("react");
const root = createRoot(container);
root.render(
  <ThemeProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <Container>
        <Box sx={{ height: "100vh" }}>
          <WalletApp />
        </Box>
      </Container>
    </QueryClientProvider>
  </ThemeProvider>
);
