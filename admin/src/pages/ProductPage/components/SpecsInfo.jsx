import { AddRounded, CloseRounded } from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  Select,
  Option,
  Stack,
  Typography,
  IconButton,
  Input,
  Box,
  Tooltip,
} from "@mui/joy";
import React from "react";
import { Divider } from "antd";

const FormItem = ({ label, keyVal, specsValue, onClick, arr }) => (
  <FormControl>
    <Stack gap={2} direction="row" alignItems="center">
      {keyVal === "brand" ? (
        <Tooltip
          arrow
          title="Required"
          placement="top"
          color="neutral"
          variant="outlined"
        >
          <FormLabel
            sx={{
              width: "100%",
              maxWidth: "135px",
              margin: 0,
              alignSelf: "center",
              textAlign: "right",
              justifyContent: "flex-end",
            }}
          >
            {label}
            <Typography color="danger">*</Typography>
          </FormLabel>
        </Tooltip>
      ) : (
        <FormLabel
          sx={{
            width: "100%",
            maxWidth: "135px",
            margin: 0,
            alignSelf: "center",
            textAlign: "right",
            justifyContent: "flex-end",
          }}
        >
          {label}
        </FormLabel>
      )}

      {arr ? (
        <Select
          placeholder="Please select"
          sx={{
            maxHeight: "150px",
            maxWidth: "500px",
            width: "100%",
          }}
          slotProps={{
            listbox: {
              placement: "bottom",
            },
          }}
          required={keyVal === "brand"}
          value={specsValue[keyVal]}
          onChange={(e, newValue) => onClick(newValue, keyVal)}
          {...(specsValue[keyVal] && {
            endDecorator: (
              <IconButton onClick={() => onClick("", keyVal)}>
                <CloseRounded />
              </IconButton>
            ),
          })}
        >
          {/* <Select.Option value="">Select brand</Select.Option> */}
          <Button
            variant="plain"
            color="primary"
            endDecorator={<AddRounded />}
            sx={{
              textAlign: "left",
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "white",
            }}
          >
            Add new{" "}
            {keyVal === "rom" || keyVal === "ram"
              ? label.toUpperCase()
              : label.toLowerCase()}
          </Button>
          {keyVal === "brand" ? (
            <Stack>
              {arr?.map((item, index) => (
                <Option key={index} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Stack>
          ) : (
            <Stack>
              {arr?.map((item, index) => (
                <Option key={index} value={item}>
                  {item}
                </Option>
              ))}
            </Stack>
          )}
        </Select>
      ) : keyVal === "brand" ? (
        <Select
          placeholder="Please select"
          sx={{
            maxHeight: "150px",
            maxWidth: "500px",
            width: "100%",
          }}
          slotProps={{
            listbox: {
              placement: "bottom",
            },
          }}
          required={keyVal === "brand"}
          value={specsValue[keyVal]}
          onChange={(e, newValue) => onClick(newValue, keyVal)}
          {...(specsValue[keyVal] && {
            endDecorator: (
              <IconButton onClick={() => onClick("", keyVal)}>
                <CloseRounded />
              </IconButton>
            ),
          })}
        >
          <Button
            variant="plain"
            color="primary"
            endDecorator={<AddRounded />}
            sx={{
              textAlign: "left",
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "white",
            }}
          >
            Add new{" "}
            {keyVal === "rom" || keyVal === "ram"
              ? label.toUpperCase()
              : label.toLowerCase()}
          </Button>

          {arr?.map((item, index) => (
            <Option key={index} value={item}>
              {item}
            </Option>
          ))}
        </Select>
      ) : (
        <Input
          type={keyVal === "manufacture_date" ? "date" : "text"}
          placeholder="Please input"
          value={specsValue[keyVal]}
          onChange={(e) => onClick(e.target.value, keyVal)}
          sx={{
            width: "100%",
            maxWidth: "500px",
          }}
          startDecorator={
            (keyVal === "dimensions" || keyVal === "battery_capacity") && (
              <Button
                disabled
                color="neutral"
                sx={{
                  color: "black!important",
                  fontWeight: "normal",
                }}
              >
                <Typography variant="caption" color="black">
                  {keyVal === "dimensions" ? "L x W x H" : "mAh"}
                </Typography>
              </Button>
            )
          }
          endDecorator={
            specsValue[keyVal] && (
              <IconButton onClick={() => onClick("", keyVal)}>
                <CloseRounded />
              </IconButton>
            )
          }
        />
      )}
    </Stack>
  </FormControl>
);

const FIELDS = [
  { label: "Brand", key: "brand" },
  {
    label: "Storage capacity",
    key: "storage_capacity",
    arr: ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB", "2TB"],
  },
  {
    label: "Number of cameras",
    key: "number_of_cameras",
    arr: ["1", "2", "3"],
  },
  {
    label: "Camera resolution",
    key: "camera_resolution",
    arr: [
      "8MP",
      "12MP",
      "16MP",
      "20MP",
      "24MP",
      "32MP",
      "48MP",
      "64MP",
      "108MP",
    ],
  },
  {
    label: "Screen size",
    key: "screen_size",
    arr: [
      "4.7 inch",
      "5.0 inch",
      "5.5 inch",
      "6.0 inch",
      "6.5 inch",
      "7.0 inch",
    ],
  },
  {
    label: "RAM",
    key: "ram",
    arr: ["2GB", "4GB", "6GB", "8GB", "12GB", "16GB", "32GB"],
  },
  {
    label: "ROM",
    key: "rom",
    arr: ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB", "2TB"],
  },
  { label: "Battery capacity", key: "battery_capacity" },
  {
    label: "Operating system",
    key: "operating_system",
    arr: ["iOS", "Android", "Windows", "Blackberry"],
  },
  {
    label: "Processor",
    key: "processor",
    arr: [
      "Apple A13 Bionic",
      "Snapdragon 400",
      "Snapdragon 1000",
      "Exynos 800",
      "Exynos 1000",
      "Kirin 400",
      "Kirin 600",
    ],
  },
  { label: "Dimensions", key: "dimensions" },
  {
    label: "Cable type",
    key: "cable_type",
    arr: ["USB-C", "Micro USB", "Lightning"],
  },
  {
    label: "SIM type",
    key: "sim_type",
    arr: ["Nano SIM", "Micro SIM", "eSIM"],
  },
  { label: "Manufacture date", key: "manufacture_date" },
  {
    label: "Warranty duration",
    key: "warranty_duration",
    arr: ["1 year", "2 years", "3 years", "1 month", "2 months", "3 months"],
  },
  { label: "Condition", key: "condition", arr: ["New", "Used", "Refurbished"] },
  { label: "Phone model", key: "phone_model" },
];

function SpecsInfo({ brands, specsValue, onClick }) {
  return (
    <Stack
      gap={2}
      sx={{
        paddingBlock: "1rem",
      }}
    >
      <Typography level="h4" component="h2">
        Specifications
      </Typography>

      <Grid container spacing={3} sx={{ flexGrow: 1 }}>
        <Grid
          size="grow"
          sx={{
            flexBasis: "45%",
            "& > * + *": {
              marginTop: "1rem",
            },
          }}
        >
          {FIELDS.slice(
            0,
            Math.floor(FIELDS.length / 2 + (FIELDS.length % 2))
          ).map((field, index) => (
            <FormItem
              key={index}
              label={field.label}
              keyVal={field.key}
              specsValue={specsValue}
              onClick={onClick}
              arr={field.key === "brand" ? brands : field.arr}
            />
          ))}
        </Grid>
        <Grid
          size="grow"
          sx={{
            flexBasis: "45%",
            "& > * + *": {
              marginTop: "1rem",
            },
          }}
        >
          {FIELDS.slice(
            Math.floor(FIELDS.length / 2 + (FIELDS.length % 2)),
            FIELDS.length
          ).map((field, index) => (
            <FormItem
              key={index}
              label={field.label}
              keyVal={field.key}
              specsValue={specsValue}
              onClick={onClick}
              arr={field.arr}
            />
          ))}
        </Grid>
      </Grid>
    </Stack>
  );
}

export default SpecsInfo;
