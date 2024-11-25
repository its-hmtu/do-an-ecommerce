import { WarningRounded } from "@mui/icons-material";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";
import React from "react";

function BaseModal({ children, onClose, open, width }) {
  return (
    <Modal onClose={onClose} open={open} sx={{
    }}>
      <ModalDialog variant="outlined" role="alertdialog">
        {children}
      </ModalDialog>

    </Modal>
  );
}

export default BaseModal;
