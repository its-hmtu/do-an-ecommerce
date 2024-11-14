import React from "react";
import {
  Card,
  Typography,
  Box,
  Stack,
  Tooltip,
  Chip,
  Badge,
  IconButton,
} from "@mui/joy";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useColorScheme } from "@mui/joy/styles";
import Title from "antd/es/skeleton/Title";
import {
  AddRounded,
  HelpOutlineRounded,
  TrendingUpRounded,
} from "@mui/icons-material";

const renderTypes = (total, type) => {
  switch (type) {
    case "sales":
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(total || 0);

    case "orders":
      return total || 0;

    default:
      return total || 0;
  }
};

function SumaryCard({
  title = "",
  helpTitle = "",
  total = 0,
  percentage = 0,
  type = "sales",
}) {
  return (
    <Box
      sx={{
        padding: "8px",
        width: "100%",
        maxWidth: "400px",
      }}
    >
      <Stack direction="column" alignItems="start">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={1}
          width="100%"
        >
          <Stack direction="row" gap={1} alignItems="center">
            <Typography level="h4">{title}</Typography>
            <Tooltip
              title={helpTitle}
              placement="top"
              arrow
              variant="outlined"
              sx={{
                maxWidth: "500px",
              }}
            >
              <HelpOutlineRounded />
            </Tooltip>
          </Stack>

          {/* <Tooltip title="Add metric" placement="top" arrow variant="outlined">
            <IconButton size="sm">
              <AddRounded />
            </IconButton>
          </Tooltip> */}
        </Stack>
        <Typography variant="body2" sx={{}}>
          {renderTypes(total, type)}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: 12,
            padding: 0,
          }}
        >
          vs Previous day
        </Typography>
        <Stack gap={1} direction="row" alignItems="center">
          {percentage ? (
            <TrendingUpRounded
              color={percentage > 0 ? "success" : percentage < 0 ? "error" : ""}
            />
          ) : null}
          <Typography
            color={percentage > 0 ? "success" : percentage < 0 ? "error" : ""}
            sx={{
              fontSize: 12,
            }}
          >
            {percentage}%
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

export default SumaryCard;
