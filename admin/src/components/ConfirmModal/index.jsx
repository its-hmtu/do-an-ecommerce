import { DeleteRounded } from '@mui/icons-material'
import { Box, Button, DialogTitle, Divider, Modal, ModalDialog, Typography } from '@mui/joy'
import React from 'react'

function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
}) {
  return (
    <Modal
        open={open}
        onClose={onClose}
      >
        <ModalDialog
          variant="outlined"
          sx={{ maxWidth: 600, width: 400, borderRadius: 'md', p: 3, boxShadow: 'lg' }}
        >
          <DialogTitle
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            sx={{ fontWeight: 'lg'}}
          >
            {title}
          </DialogTitle>
          <Divider
            sx={{
              backgroundColor: 'grey',
            }}
          />
          <Typography
            component="p"
            id="modal-description"
            level="body"
            textColor="inherit"
            sx={{ mb: 1 }}
          >
            {description}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              mt: 2,
            }}
          >
            <Button variant="outlined" color="neutral" onClick={onClose}>
              {cancelText}
            </Button>
            <Button variant="solid" color="danger" onClick={onConfirm}
              {...(confirmText === 'Delete' && { startIcon: <DeleteRounded /> })}
            >
              
              {confirmText}
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
  )
}

export default ConfirmModal