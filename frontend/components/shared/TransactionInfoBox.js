import {
  IconButton,
  Tooltip,
  Alert,
  AlertTitle,
  Skeleton,
} from "@mui/material";
import { ContentCopy, OpenInNew } from "@mui/icons-material";

const TransactionInfoBox = ({ setParentSnackbarStatus, transactionID }) => {
  const handleTxClipboardCopy = async () => {
    const permissions = await navigator.permissions.query({
      name: "clipboard-write",
    });
    if (!permissions.state || permissions.state !== "granted") {
      setParentSnackbarStatus({
        open: true,
        severity: "error",
        message:
          "Clipboard write permission denied.  Try enabling it in your browser settings.",
      });
    }
    await navigator.clipboard.writeText(transactionID);
    setParentSnackbarStatus({
      open: true,
      severity: "info",
      message: "Transaction ID Copied to Clipboard",
    });
  };

  const handleTxOpenBlockExplorer = () => {
    window.open(`${process.env.BLOCK_EXPLORER_URL}/${transactionID}`, "_blank");
  };

  return (
    <Alert
      severity="info"
      sx={{ maxWidth: 500, overflowWrap: "anywhere" }}
      action={
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Tooltip title="Copy to Clipboard">
            <IconButton
              color="inherit"
              size="small"
              disabled={!transactionID}
              onClick={handleTxClipboardCopy}
            >
              <ContentCopy />
            </IconButton>
          </Tooltip>
          <Tooltip title="Open in Block Explorer">
            <IconButton
              color="inherit"
              size="small"
              disabled={!transactionID}
              onClick={handleTxOpenBlockExplorer}
            >
              <OpenInNew />
            </IconButton>
          </Tooltip>
        </div>
      }
    >
      <AlertTitle>Transaction ID:</AlertTitle>
      {transactionID ? (
        transactionID
      ) : (
        <>
          <Skeleton width={350} />
          <Skeleton width={350} />
        </>
      )}
    </Alert>
  );
};

export default TransactionInfoBox;
