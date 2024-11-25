import { Box, Button, Stack, Typography } from "@mui/joy";
import { PATHS } from "config";
import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <Box
      sx={{
        maxWidth: 1280,
        width: "100%",
        margin: "0 auto",
        padding: "48px",
        // height: "100vh"
      }}
    >
      <Stack
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography level="h1">404 Not Found</Typography>
        <p>Your visited page not found. You may go home page.</p>
        <Button
          to={PATHS.HOME}
          component={Link}
          sx={{
            padding: "16px 24px",
          }}
        >
          Go to Home page
        </Button>
      </Stack>
    </Box>
  );
}

export default NotFoundPage;
