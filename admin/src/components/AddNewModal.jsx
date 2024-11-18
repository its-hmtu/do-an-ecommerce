import { DeleteRounded } from '@mui/icons-material'
import { Box, Button, DialogTitle, Divider, Input, Modal, ModalDialog, Typography } from '@mui/joy'
import React from 'react'

function AddNewModal({
  open,
  onClose,
  onConfirm,
  description,
  newValue,
  setNewValue,
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
            Add new value
          </DialogTitle>
          <Divider
            sx={{
              backgroundColor: 'grey',
            }}
          />
          <Input placeholder="Please enter" required name="newValue"
            onChange={(e) => setNewValue(e.target.value)}
          />

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
            <Button variant="solid" color="primary" onClick={onConfirm}
              // {...(confirmText === 'Delete' && { startIcon: <DeleteRounded /> })}
            >
              
              {/* {confirmText} */} Add
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
  )
}

export default AddNewModal