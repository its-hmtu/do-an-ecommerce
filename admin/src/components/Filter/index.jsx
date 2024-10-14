import { FormControl, FormLabel, Option, Select } from "@mui/joy";
import React from "react";

function Filter({
  isStatusVisible = false,
  isCategoryVisible = false,
  isCustomerVisible = false,
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
          <Select size="sm" placeholder="All">
            <Option value="all">All</Option>
            <Option value="refund">Refund</Option>
            <Option value="purchase">Purchase</Option>
            <Option value="debit">Debit</Option>
          </Select>
        </FormControl>
      )}
      {isCustomerVisible && (
        <FormControl size="sm">
          <FormLabel>Customer</FormLabel>
          <Select size="sm" placeholder="All">
            <Option value="all">All</Option>
            <Option value="olivia">Olivia Rhye</Option>
            <Option value="steve">Steve Hampton</Option>
            <Option value="ciaran">Ciaran Murray</Option>
            <Option value="marina">Marina Macdonald</Option>
            <Option value="charles">Charles Fulton</Option>
            <Option value="jay">Jay Hoper</Option>
          </Select>
        </FormControl>
      )}
    </React.Fragment>
  );
}

export default Filter;
