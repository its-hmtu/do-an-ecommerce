import React from "react";
import { Card, Typography, Box, Stack, Chip, Badge } from "@mui/joy";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { LineChart, Line, Tooltip, ResponsiveContainer } from "recharts";
import {useColorScheme} from "@mui/joy/styles"

function SumaryCard({
  title,
  total
}) {
  // mock data
  const data = [
    { name: "Day 1", sales: 300 },
    { name: "Day 2", sales: 450 },
    { name: "Day 3", sales: 320 },
    { name: "Day 4", sales: 500 },
    { name: "Day 5", sales: 460 },
    { name: "Day 6", sales: 600 },
    { name: "Day 7", sales: 700 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Card
          variant="outlined"
          sx={{
            padding: "10px",
            borderRadius: "10px",
            boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16)",
          }}
        >
          <Typography variant="body2">{label}</Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              padding: "0 5px",
            }}
          >
            <Badge color="primary" />
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Sales: {payload[0].value}
            </Typography>
          </Box>
        </Card>
      );
    }
    return null;
  };

  const { mode, setMode } = useColorScheme();

  return (
    <Box
      sx={{
        padding: "8px",
        // maxWidth: '300px',
        width: "100%",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="start">
        <Stack direction="column" alignItems="start">
          <Typography level="h3" sx={{ fontWeight: "bold" }}>
            {total}
          </Typography>
          <Typography variant="body2" sx={{}}>
            {title}
          </Typography>
        </Stack>
        <ShoppingBagIcon sx={{
          fontSize: 30
        }}/>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <TrendingUpIcon color="success" />
        <Typography color="success">+2.6%</Typography>
      </Stack>

      <Box sx={{    }}>
        {/* Example Line Chart */}
        <ResponsiveContainer width="100%" height={80}>
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#1976D2"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#1976D2",
                strokeWidth: 2,
                strokeDasharray: "5 5",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

export default SumaryCard;
