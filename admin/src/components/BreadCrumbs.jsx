import React from "react";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import { ChevronRightRounded } from "@mui/icons-material";

function BreadCrumbs({
  links = [], // array of objects with keys: label, onClick
  nonLinkLabel = null, // label for the last breadcrumb (current page)
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Breadcrumbs
        size="sm"
        aria-label="breadcrumbs"
        separator={<ChevronRightRounded fontSize="sm" />}
        sx={{ pl: 0 }}
      >
        {links.map((link, index) => (
          <Link
            underline="hover"
            color="neutral"
            sx={{ fontSize: 12, fontWeight: 500 }}
            onClick={link.onClick}
            key={index}
          >
            {link.label}
          </Link>
        ))}
        {nonLinkLabel && (
          <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
            {nonLinkLabel}
          </Typography>
        )}
      </Breadcrumbs>
    </Box>
  );
}

export default BreadCrumbs;
