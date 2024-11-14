import {
  Box,
  Button,
  CircularProgress,
  DialogTitle,
  Divider,
  Modal,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import React from "react";

function LoadingModal({
  open,
  onClose,
  title,
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        variant="outlined"
        sx={{
          maxWidth: 600,
          width: 400,
          minHeight: 200,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
          <Stack
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress
              color="primary"
              variant="plain"
              sx={{
                ".MuiCircularProgress-progress": {
                  stroke: "var(--CircularProgress-progressColor)!important",
                },
              }}
            />

            <Typography level="h4" color="primary">
              {title}
            </Typography>
          </Stack>
      </ModalDialog>
    </Modal>
  );
}

export default LoadingModal;
