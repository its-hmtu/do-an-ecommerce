import { CircularProgress, LinearProgress, Stack } from '@mui/joy'
import React from 'react'

function Fallback() {
  return (
    <Stack sx={{
      // display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      height: "100vh",
    }}>
      <LinearProgress />
    </Stack>
  )
}

export default Fallback