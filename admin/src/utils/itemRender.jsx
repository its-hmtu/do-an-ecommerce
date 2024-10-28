import React from "react";
import { Button } from "@mui/joy";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

const itemRender = (_, type, originalElement) => {
  if (type === "prev") {
    return (
      <Button
        size="sm"
        variant="outlined"
        color="neutral"
        startDecorator={<KeyboardArrowLeft/>}
      >
        Previous
      </Button>
    );
  }

  if (type === "next") {
    return (
      <Button
        size="sm"
        variant="outlined"
        color="neutral"
        endDecorator={<KeyboardArrowRight />}
        disabled
        // sx={{
        //   "."
        // }}
      >
        Next
      </Button>
    );
  }

  return originalElement;
};

export default itemRender;