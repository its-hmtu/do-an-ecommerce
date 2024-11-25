import React from "react";
import BaseModal from ".";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/joy";
import { WarningRounded } from "@mui/icons-material";

function ConfirmModal({ open, onCancel, onConfirm, title, color, confirmText, cancelText }) {
  return (
    <BaseModal onClose={onCancel} open={open}>
      <DialogTitle>
        <WarningRounded />
        Confirmation
      </DialogTitle>
      <Divider />
      <DialogContent>{title}</DialogContent>
      <DialogActions>
        <Button variant="solid" color={color} onClick={onConfirm}>
          {confirmText}
        </Button>
        <Button variant="plain" color="neutral" onClick={onCancel}>
          {cancelText}
        </Button>
      </DialogActions>
    </BaseModal>
  );
}

export default ConfirmModal;
