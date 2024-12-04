import React from "react";
import {
  Modal,
  ModalDialog,
  ModalClose,
  DialogTitle,
  Divider,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/joy";
import { WarningRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { PATHS } from "config";

function LoginModal({ open, onCancel }) {
  const navigate = useNavigate();
  return (
    <Modal onClose={onCancel} open={open} sx={{
      
    }}>
      <ModalDialog variant="outlined" role="alertdialog">
        <ModalClose />
        <DialogTitle>
          <WarningRounded />
          Sign In
        </DialogTitle>
        <Divider /> 
        <DialogContent>
          You need to sign in to continue
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <Button
            variant="solid"
            color="primary"
            onClick={() => navigate(PATHS.LOGIN)}
          >
            Sign In
          </Button>
          <Button
            variant="plain"
            color="neutral"
            onClick={() => navigate(PATHS.REGISTER)}
          >
            Register
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}

export default LoginModal;
