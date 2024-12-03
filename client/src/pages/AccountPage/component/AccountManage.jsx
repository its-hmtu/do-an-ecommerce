import { Box, Button, Divider, Grid, Textarea, Typography } from '@mui/joy'
import { UserContext } from 'contexts/UserContext'
import React, { useContext } from 'react'

function AccountManage() {
  const {user} = useContext(UserContext)
  return (
    <Box
    sx={{
      flex: 3,
      backgroundColor: "#ffffff",
      padding: 4,
      borderRadius: "8px",
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    }}
  >
    <Typography level="h5" sx={{ mb: 3, fontWeight: "bold" }}>
      Edit Your Profile
    </Typography>

    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Textarea
          label="First Name"
          placeholder="First Name"
          fullWidth
          sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
          value={user?.first_name}
        />
      </Grid>
      <Grid item xs={6}>
        <Textarea
          label="Last Name"
          placeholder="Last Name"
          fullWidth
          sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
          value={user?.last_name}
        />
      </Grid>
      <Grid item xs={12}>
        <Textarea
          label="Email"
          placeholder="Your Email"
          fullWidth
          sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
          value={user?.email}
        />
      </Grid>
      <Grid item xs={12}>
        <Textarea
          label="Address"
          placeholder="Address"
          fullWidth
          sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
          value={`${user?.addresses[1].address}, ${user?.addresses[1].ward}, ${user?.addresses[1].district}, ${user?.addresses[1].city}`}
        />
      </Grid>
    </Grid>

    <Divider sx={{ my: 3 }} />

    <Typography level="h6" sx={{ mb: 2, fontWeight: "bold" }}>
      Password Changes
    </Typography>
    <Box sx={{ mb: 2 }}>
      <Textarea
        label="Current Password"
        placeholder="Current Password"
        type="password"
        fullWidth
        sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
      />
      <Textarea
        label="New Password"
        placeholder="New Password"
        type="password"
        fullWidth
        sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
      />
      <Textarea
        label="Confirm New Password"
        placeholder="Confirm New Password"
        type="password"
        fullWidth
        sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
      />
    </Box>

    <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
      <Button
        variant="plain"
        sx={{ borderColor: "red", borderWidth: 1 }}
        color="neutral"
      >
        Cancel
      </Button>
      <Button
        variant="solid"
        color="primary"
        sx={{ px: 4 }}
      >
        Save Changes
      </Button>
    </Box>
  </Box>
  )
}

export default AccountManage