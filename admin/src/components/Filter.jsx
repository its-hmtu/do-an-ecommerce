import { CloseRounded } from "@mui/icons-material";
import { FormControl, FormLabel, IconButton, Option, Select } from "@mui/joy";
import React from "react";

function Filter({
  isStatusVisible = false,
  isCategoryVisible = false,
  categoryData,
  categoryValue,
  onChange,
  disabled,
}) {
  return (
    <React.Fragment>
      {isStatusVisible && (
        <FormControl size="sm">
          <FormLabel>Status</FormLabel>
          <Select
            size="sm"
            placeholder="Filter by status"
            slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
          >
            <Option value="paid">Paid</Option>
            <Option value="pending">Pending</Option>
            <Option value="refunded">Refunded</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        </FormControl>
      )}
      {isCategoryVisible && (
        <FormControl size="sm">
          <FormLabel>Category</FormLabel>
          <Select size="sm" placeholder="All" 
            onChange={onChange}
            value={categoryValue}
            disabled={disabled}
            {...(
              categoryValue
              && {
              endDecorator: (
                <IconButton onClick={(e) => onChange(e, "")}>
                  <CloseRounded />
                </IconButton>
              ),
            })}
          >
            {categoryData?.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </FormControl>
      )}
    </React.Fragment>
  );
}

export default Filter;
