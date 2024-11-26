import React from "react";
import { Box, LinearProgress } from "@mui/joy";

function SuspenseFallBack() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        height: "100vh",
        // maxWidth: 1280,
      }}
    >
      <LinearProgress />
    </Box>
  );
}

export default SuspenseFallBack;
