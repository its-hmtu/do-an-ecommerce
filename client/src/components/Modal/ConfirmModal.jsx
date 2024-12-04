import React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Modal,
  ModalDialog,
  ModalClose,
} from "@mui/joy";
import { WarningRounded } from "@mui/icons-material";

function ConfirmModal({
  open,
  onCancel,
  onConfirm,
  title,
  color,
  confirmText,
  cancelText,
  loading = false,
  disabled = false,
}) {
  return (
    <Modal onClose={onCancel} open={open} sx={{}}>
      <ModalDialog variant="outlined" role="alertdialog">
        <ModalClose />
        <DialogTitle>
          <WarningRounded />
          Confirmation
        </DialogTitle>
        <Divider />
        <DialogContent>{title}</DialogContent>
        <DialogActions>
          <Button
            variant="solid"
            color={color}
            onClick={onConfirm}
            loading={loading}
            disabled={disabled}
          >
            {confirmText}
          </Button>
          <Button variant="plain" color="neutral" onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}

export default ConfirmModal;
