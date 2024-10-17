import React from "react";
import { ToastMessageContext } from "contexts/ToastMessageContext";
import { Alert, IconButton, Snackbar } from "@mui/joy";
import { CheckCircle, Close, Info, Warning } from "@mui/icons-material";

function ToastMessage({ message, type, open }) {
  const { toastMessage, setToastMessage } =
    React.useContext(ToastMessageContext);
  return (
    <Snackbar
      open={toastMessage.open}
      autoHideDuration={6000}
      color={toastMessage.type}
      variant="soft"
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      startDecorator={toastMessage.type === "danger" ? <Warning /> : toastMessage.type === 'success' ? <CheckCircle /> : <Info />}
      endDecorator={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={() =>
            setToastMessage({ ...toastMessage, open: false })
          }
        >
          <Close fontSize="small" color="neutral" />
        </IconButton>
      }
      onClose={() => setToastMessage({ ...toastMessage, open: false })}
    >
      {toastMessage.message || "Success"}
    </Snackbar>
  );
}

export default ToastMessage;
