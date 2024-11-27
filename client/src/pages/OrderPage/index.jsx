import { Stack } from '@mui/joy'
import React from 'react'
import { useLocation } from 'react-router-dom'

function OrderPage() {
  // get state from react-router-dom navigate
  const { state } = useLocation()
  console.log(state)

  return (
    <Stack
      sx={{
        maxWidth: 720,
        width: "100%",
        margin: "0 auto",
        paddingTop: 3,
        paddingBottom: 3,
        gap: 2,
      }}
    >
      
    </Stack>
  )
}

export default OrderPage