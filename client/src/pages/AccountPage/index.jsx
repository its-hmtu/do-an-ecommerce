import React, { useContext } from "react";
import {
  Container,
  Box,
  Typography,
  Textarea,
  Button,
  Divider,
  Grid,
  Link,
} from "@mui/joy";
import { Link as RLink } from "react-router-dom";
import { PATHS } from "config";
import { UserContext } from "contexts/UserContext";

function AccountPage() {
  const {user } = useContext(UserContext);
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
          <Box sx={{ mb: 2, pl: 2, fontSize: "14px"  }}>
            <Typography>
              My Profile
            </Typography>
            <Typography >Address Book</Typography>
            <Typography >My Payment Options</Typography>
          </Box>

          <Link level="h6" sx={{ mb: 2, color: "black", fontWeight: "bold" }} component={RLink} to={PATHS.MY_ORDERS}>
            My Orders
          </Link>
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
      </Box>
    </Container>
  );
}

export default AccountPage;
