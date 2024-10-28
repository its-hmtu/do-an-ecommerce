import { Search } from "@mui/icons-material";
import { FormControl, Input } from "@mui/joy";
import React from "react";

function SearchBox({width, onChange, value}) {
  return (
    <FormControl size="sm">
      {/* <FormLabel></FormLabel> */}
      <Input
        size="sm"
        placeholder="Search"
        startDecorator={<Search />}
        sx={{ maxWidth: width ? width : "100%" }}
        name="search"
        value={value}
        onChange={onChange}
      />
    </FormControl>
  );
}

export default SearchBox;
