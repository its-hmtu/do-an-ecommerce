import React from 'react'
import { Box, Breadcrumbs, Typography, Button } from '@mui/joy';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import AddCircle from '@mui/icons-material/AddCircle';
import { Link } from 'react-router-dom';


function UserPage() {

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Breadcrumbs
          size="sm"
          aria-label="breadcrumbs"
          separator={<ChevronRightRoundedIcon fontSize="sm" />}
          sx={{ pl: 0 }}
        >
          <Typography
            underline="hover"
            color="neutral"
            sx={{ fontSize: 12, fontWeight: 500 }}
          >
            <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
            Dashboard
            </Link>
          </Typography>
          <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
            Users
          </Typography>
        </Breadcrumbs>
      </Box>
      <Box
        sx={{
          display: "flex",
          mb: 1,
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Typography level="h2" component="h1">
          Roles and Permissions
        </Typography>
        <Button
          color="primary"
          startDecorator={
            <AddCircle />
          }
          size="sm"
        >
          Create new user
        </Button>
      </Box>
      {/* <RolesTable />
      {
        isMobile && <RolesList />
      } */}
    </>
  )
}

export default UserPage