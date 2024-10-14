import { Search } from "@mui/icons-material";
import { FormControl, Input } from "@mui/joy";
import React from "react";

function SearchBox({width}) {
  return (
    <FormControl sx={{ flex: 1 }} size="sm">
      {/* <FormLabel></FormLabel> */}
      <Input
        size="sm"
        placeholder="Search"
        startDecorator={<Search />}
        sx={{ maxWidth: width }}
      />
    </FormControl>
  );
}

export default SearchBox;
