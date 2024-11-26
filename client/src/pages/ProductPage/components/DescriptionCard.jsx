import React from "react";
import { Box, Typography, Button } from "@mui/joy";
function DescriptionCard({
  data,
  openDescription,
  setOpenDescription,
}) {
  return (
    <Box
      sx={{
        border: "1px solid #cdd7e1",
        padding: "16px",
        borderRadius: "6px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        height: openDescription ? "auto" : "400px",
        overflowY: openDescription ? "visible" : "hidden",
        position: "relative",
      }}
    >
      <Typography level="title-md">Description</Typography>
      <div
        style={{
          textAlign: "justify",
        }}
        dangerouslySetInnerHTML={{
          __html: data?.product_description,
        }}
      ></div>
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          display: openDescription ? "none" : "flex",
          justifyContent: "center",
          paddingTop: "64px",
          paddingBottom: "16px",
          background:
            "linear-gradient(180deg,hsla(0,0%,100%,0),hsla(0,0%,100%,.91) 50%,#fff 55%)",
        }}
      >
        <Button onClick={() => setOpenDescription(true)}>View more</Button>
      </Box>
    </Box>
  );
}

export default DescriptionCard;
