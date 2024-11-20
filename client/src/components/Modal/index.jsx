import { WarningRounded } from "@mui/icons-material";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Modal,
  ModalDialog,
} from "@mui/joy";
import React from "react";

function BaseModal({ children, onClose, open }) {
  return (
    <Modal onClose={onClose} open={open}>
      <ModalDialog variant="outlined" role="alertdialog">
        {children}
      </ModalDialog>
    </Modal>
  );
}

export default BaseModal;
