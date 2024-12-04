import { Box, CircularProgress, Modal, ModalDialog, Typography } from '@mui/joy'
import React from 'react'

function LoadingModal({
  open,
  title = "Loading...",
}) {
  return (
    <Modal open={open}>
      <ModalDialog>
        <Box 
          sx={{
            width: "300px",
            height: "200px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2
          }}
        >
          <CircularProgress />
          <Typography level='title-lg'>{title}</Typography>
        </Box>
      </ModalDialog>
    </Modal>
  )
}

export default LoadingModal