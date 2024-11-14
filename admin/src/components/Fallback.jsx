import { CircularProgress, Stack } from '@mui/joy'
import React from 'react'

function Fallback() {
  return (
    <Stack spacing={2} sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    }}>
      <CircularProgress color="primary" variant="plain" /> 
    </Stack>
  )
}

export default Fallback