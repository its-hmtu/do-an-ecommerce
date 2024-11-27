import React from "react";
import {
  Container,
  Box,
  Typography,
  Textarea,
  Button,
  Divider,
  Grid,
} from "@mui/joy";

function AccountPage() {
  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: "flex", gap: 4 }}>
        {/* Sidebar */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#f9f9f9",
            padding: 3,
            borderRadius: "8px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            minWidth: "200px",
          }}
        >
          <Typography level="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Manage My Account
          </Typography>
          <Box sx={{ mb: 2, ml: 3, fontSize: "14px"  }}>
            <Typography  sx={{ fontWeight: "bold", color: "red" }}>
              My Profile
            </Typography>
            <Typography >Address Book</Typography>
            <Typography >My Payment Options</Typography>
          </Box>

          <Typography level="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            My Orders
          </Typography>
          <Box sx={{ mb: 2, ml: 3, fontSize: "14px"  }}>
            <Typography level="body2">My Returns</Typography>
            <Typography level="body2">My Cancellations</Typography>
          </Box>

          <Typography level="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            My WishList
          </Typography>
        </Box>

        {/* Edit Profile Section */}
        <Box
          sx={{
            flex: 3,
            backgroundColor: "#ffffff",
            padding: 4,
            borderRadius: "8px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography level="h5" sx={{ mb: 3, color: "red", fontWeight: "bold" }}>
            Edit Your Profile
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Textarea
                label="First Name"
                placeholder="First Name"
                fullWidth
                sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
              />
            </Grid>
            <Grid item xs={6}>
              <Textarea
                label="Last Name"
                placeholder="Last Name"
                fullWidth
                sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
              />
            </Grid>
            <Grid item xs={12}>
              <Textarea
                label="Email"
                placeholder="Your Email"
                fullWidth
                sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
              />
            </Grid>
            <Grid item xs={12}>
              <Textarea
                label="Address"
                placeholder="Address"
                fullWidth
                sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
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

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="plain"
              sx={{ color: "red", borderColor: "red", borderWidth: 1 }}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="danger"
              sx={{ px: 4 }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default AccountPage;
