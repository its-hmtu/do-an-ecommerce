import { ChevronRightRounded } from "@mui/icons-material";
import { Button } from "@mui/joy";
import React from "react";

function ButtonPicker(setPicker, setOpenPicker, type, text) {
  return (
    <Button
      variant="plain"
      color="neutral"
      endDecorator={<ChevronRightRounded />}
      onClick={() => {
        setPicker({ type });
        setOpenPicker(true);
      }}
    >
      By {text}
    </Button>
  );
}

export default ButtonPicker;
