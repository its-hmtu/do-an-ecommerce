import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Divider,
  Stack,
  Tooltip as MuiTooltip,
  Table,
  Sheet,
} from "@mui/joy";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import SumaryCard from "./components/SumaryCard";
import { useQuery } from "@tanstack/react-query";
import { getStatistics } from "api/sales.api";
import {
  CalendarMonthRounded,
  CloseRounded,
  HelpOutlineRounded,
} from "@mui/icons-material";
import { DatePicker } from "antd";
import moment from "moment";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import TabPanelAll from "pages/OrdersPage/components/TabPanelAll";
import { getOrders } from "api/orders.api";

function DashboardPage() {
  // const [statisticQuery, setStatisticQuery] = useState({
  //   range: "today",
  //   date: null,
  //   week: null,
  //   month: null,
  //   year: null,
  // });
  const statisticQuery = useRef({
    range: "today",
    date: null,
    week: null,
    month: null,
    year: null,
  })
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["statistics", statisticQuery],
    queryFn: () =>
      getStatistics({
        ...statisticQuery.current,
      }),
  });

  const [picker, setPicker] = useState("day");
  const [pickerText, setPickerText] = useState("Today");
  const [open, setOpen] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date, dateString) => {
    setOpen(false);
    setPickerText(dateString);
    setSelectedDate(date);
    if (picker === "day") {
      statisticQuery.current = {
        range: "date",
        date: dateString,
      }
    } else if (picker === "week") {
      // setStatisticQuery({
      //   range: "week",
      //   // replace any letter in the string, but keep the `-`
      //   week: dateString.replace(/[a-zA-Z]/g, ""),
      // });
      statisticQuery.current = {
        range: "week",
        week: dateString.replace(/[a-zA-Z]/g, ""),
      }
    } else if (picker === "month") {
      // setStatisticQuery({
      //   range: "month",
      //   month: dateString.split("-")[1],
      //   year: dateString.split("-")[0],
      // });
      statisticQuery.current = {
        range: "month",
        month: dateString.split("-")[1],
        year: dateString.split("-")[0],
      }
    } else if (picker === "year") {
      // setStatisticQuery({
      //   range: "year",
      //   year: dateString,
      // });

      statisticQuery.current = {
        range: "year",
        year: dateString,
      }
    }
  };

  useEffect(() => {
    console.log(statisticQuery);
  }, [statisticQuery]);

  useEffect(() => {
    if (!open) {
      setOpenPicker(false);
    }
  }, [open]);

  useEffect(() => {
    setSelectedDate(null); // Reset the selected date when the picker type changes
  }, [picker]);

  const buttonPickers = [
    {
      type: "day",
      text: "By Day",
    },
    {
      type: "week",
      text: "By Week",
    },
    {
      type: "month",
      text: "By Month",
    },
    {
      type: "year",
      text: "By Year",
    },
  ];

  const buttonTextPickers = [
    {
      type: "today",
      text: "Today",
    },
    {
      type: "yesterday",
      text: "Yesterday",
    },
    {
      type: "last7days",
      text: "Last 7 days",
    },
    {
      type: "last30days",
      text: "Last 30 days",
    },
  ];

  const sumaryCards = [
    {
      title: "Sales",
      helpTitle:
        "Total value of placed orders (paid and unpaid) over the selected time period, including sales from cancelled and return/refund orders.",
      total: data?.total_sales,
      percentage: data?.sales_percentage_diff,
      type: "sales",
    },
    {
      title: "Orders",
      helpTitle:
        "Total number of placed orders (paid and unpaid) over the selected time period, including cancelled and return/refund orders.",
      total: data?.total_orders,
      percentage: data?.orders_percentage_diff,
      type: "orders",
    },
    {
      title: "Cancelled Orders",
      helpTitle:
        "Total number of placed orders (paid and unpaid) over the selected time period, including cancelled and return/refund orders.",
      total: data?.cancelled_orders,
      percentage: data?.cancelled_orders_percentage_diff,
      type: "cancelled_orders",
    },
    {
      title: "Sales per Order",
      helpTitle:
        "Average value of product(s) from your store sold in a single order, over the selected time period. Total sales divided by total number of orders.",
      total: data?.sales_per_order,
      percentage: data?.sales_per_order_percentage_diff,
      type: "sales_per_order",
    },
    {
      title: "Total Customers",
      helpTitle:
        "Total number of customers who created an account over the selected time period.",
      total: data?.total_customers,
      percentage: data?.total_customers_percentage_diff,
      type: "total_customers",
    },
    {
      title: "New Customers",
      helpTitle:
        "Total number of new customers who created an account over the selected time period.",
      total: data?.new_customers,
      percentage: data?.new_customers_percentage_diff,
      type: "new_customers",
    },
    {
      title: "Existing Customers",
      helpTitle:
        "Total number of existing customers who created an account over the selected time period.",
      total: data?.existing_customers,
      percentage: data?.existing_customers_percentage_diff,
      type: "existing_customers",
    },
    {
      title: "Returning Rate",
      helpTitle:
        "Percentage of customers who made more than one order over the selected time period.",
      total: data?.returning_rate,
      percentage: data?.returning_rate_percentage_diff,
      type: "returning_rate",
    },
  ];

  const renderButtonPickers = () => {
    return buttonPickers.map((item, index) => (
      <Button
        variant="plain"
        color="neutral"
        endDecorator={<ChevronRightRoundedIcon />}
        onClick={() => {
          setPicker(item.type);
          setOpenPicker(true);
        }}
      >
        {item.text}
      </Button>
    ));
  };

  const renderButtonTextPickers = () => {
    return buttonTextPickers.map((item, index) => (
      <Button
        variant="outlined"
        color="neutral"
        // endDecorator={<ChevronRightRoundedIcon />}
        onClick={() => {
          setOpenPicker(false);
          setPickerText(item.text);
          // setStatisticQuery({
          //   range: item.type,
          //   date: null,
          //   week: null,
          //   month: null,
          //   year: null,
          // });
          statisticQuery.current = {
            range: item.type,
            date: null,
            week: null,
            month: null,
            year: null,
          }
          setSelectedDate(null);
        }}
      >
        {item.text}
      </Button>
    ));
  };

  return (
    <>
      <Typography level="h2" component="h1">
        Dashboard
      </Typography>
      <Typography level="h3">Insights</Typography>
      <Box
        sx={{
          display: "flex",
          mb: 1,
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" gap={1} alignItems="center">
          <Box
            sx={{
              position: "relative",
            }}
          >
            <Button
              sx={{
                fontSize: 14,
              }}
              variant="outlined"
              color="neutral"
              endDecorator={<CalendarMonthRounded />}
              onClick={() => {
                setOpen(!open);
                setOpenPicker(false);
              }}
            >
              <Typography level="body-sx">Data Period</Typography>
            </Button>
            <Box
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                zIndex: 9,
                display: open ? "flex" : "none",
                marginTop: "8px",
                backgroundColor: "white",
                boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "sm",
                border: "1px solid #cdd7e1",
                flexDirection: "row",
                minWidth: "500px",
                // width: "100%",
                minHeight: "365px",
              }}
            >
              <Stack
                sx={{
                  padding: "8px",
                  maxWidth: "150px",
                  width: "100%",
                  "& > button": {
                    width: "100%",
                    justifyContent: "space-between",
                    paddingInline: "4px",

                    "& + button": {
                      marginTop: "6px",
                    },
                  },
                }}
              >
                <>{renderButtonPickers()}</>
              </Stack>
              <Divider orientation="vertical" />
              <Box
                sx={{
                  padding: "8px",
                  width: "100%",
                  position: "relative",
                }}
              >
                <Button
                  onClick={() => {
                    setOpenPicker(false);
                    setOpen(false);
                  }}
                  variant="plain"
                  color="neutral"
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    zIndex: 10,
                    padding: "8px",
                    minWidth: "unset",
                  }}
                >
                  <CloseRounded />
                </Button>

                <DatePicker
                  style={{ width: "87%" }}
                  picker={picker}
                  disabledDate={(current) => {
                    return current && current > moment().endOf("day");
                  }}
                  value={selectedDate}
                  open={open}
                  onChange={(date, dateString) =>
                    handleDateChange(date, dateString)
                  }
                />
              </Box>
            </Box>
          </Box>
          <>{renderButtonTextPickers()}</>
        </Stack>
        <Button
          color="primary"
          startDecorator={<DownloadRoundedIcon />}
          size="sm"
        >
          Export Report
        </Button>
      </Box>
      <Typography level="body-md">Showing data for {pickerText} </Typography>
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",
        }}
      >
        {sumaryCards.slice(0, 4).map((item, index) => (
          <SumaryCard
            title={item.title}
            helpTitle={item.helpTitle}
            total={item.total}
            range={statisticQuery.range}
            percentage={item.percentage}
            type={item.type}
          />
        ))}
      </Card>
      <Typography level="h4" component="h2">
        Trend Chart of Each Metric
      </Typography>
      <ResponsiveContainer
        width="100%"
        height={400}
        style={{ marginBottom: "24px" }}
      >
        <LineChart data={data?.line_chart_data}>
          <CartesianGrid strokeDasharray="0 0" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#888888", fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis yAxisId="sales" hide />
          <YAxis yAxisId="orders" hide />
          <Tooltip
            labelFormatter={
              picker === "day"
                ? (value) => {
                    return `${value} ~ ${
                      value === "23:00"
                        ? "00:00"
                        : value.split(":")[0][0] === "0" &&
                          value.split(":")[0] !== "09"
                        ? `0${parseInt(value.split(":")[0]) + 1}:00`
                        : `${parseInt(value.split(":")[0]) + 1}:00`
                    }`;
                  }
                : (value) => {
                    return value;
                  }
            }
          />
          <Legend
            height={36}
            align="center"
            wrapperStyle={{
              bottom: 0,
              left: 0,
              right: 0,
              margin: "0 auto",
            }}
            iconType="circle"
          />
          <Line
            yAxisId={"sales"}
            type="monotone"
            dataKey="orders"
            stroke="#0B6BCB"
            strokeWidth={2}
            dot={{ r: 0 }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId={"orders"}
            type="monotone"
            dataKey="sales"
            stroke="#FF6B6B"
            strokeWidth={2}
            dot={{ r: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <Box>
        <Typography level="h4" component="h2">
          Customers
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            flexWrap: "no-wrap",
            mt: 2,
            gap: 2,
          }}
        >
          <ResponsiveContainer
            width="40%"
            height={300}
            style={{
              marginBottom: "24px",
              border: "2px solid #f0f0f0",
              borderRadius: "8px",
            }}
          >
            <PieChart>
              <Pie
                data={data?.pie_chart_data.map((item) => ({
                  ...item,
                  percentage: parseFloat(item.percentage),
                }))}
                dataKey="percentage"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  value,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = 25 + innerRadius + (outerRadius - innerRadius);
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="black"
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                    >
                      {`${value}%`}
                    </text>
                  );
                }}
              >
                <Cell fill="#FF6B6B" />
                <Cell fill="#0B6BCB" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <Stack width={"60%"} justifyContent="space-between" height={300}>
            <Stack
              gap={2}
              direction="row"
              justifyContent="space-between"
              sx={{
                "& > *": {
                  width: "100%",
                },
              }}
            >
              {sumaryCards.slice(4, 7).map((item, index) => (
                <Card>
                  <SumaryCard
                    title={item.title}
                    helpTitle={item.helpTitle}
                    total={item.total}
                    range={statisticQuery.range}
                    percentage={item.percentage}
                    type={item.type}
                  />
                </Card>
              ))}
            </Stack>
            <Stack
              gap={2}
              direction="row"
              justifyContent="space-between"
              sx={{
                "& > *": {
                  width: "32.23%",
                },
              }}
            >
              {sumaryCards.slice(7).map((item, index) => (
                <Card>
                  <SumaryCard
                    title={item.title}
                    helpTitle={item.helpTitle}
                    total={item.total}
                    range={statisticQuery.range}
                    percentage={item.percentage}
                    type={item.type}
                  />
                </Card>
              ))}
            </Stack>
          </Stack>
        </Box>
      </Box>
      <Stack gap={2} direction="row" justifyContent="space-between">
        <Stack gap={2}>
          <Typography
            level="h4"
            component="h2"
            endDecorator={
              <MuiTooltip
                title="Top 5 products in your shop according to total sales value and units sold of confirmed orders over the selected time period."
                placement="top"
                arrow
                variant="outlined"
              >
                <HelpOutlineRounded
                  sx={{
                    fontSize: 18,
                  }}
                />
              </MuiTooltip>
            }
          >
            Product Ranking
          </Typography>
          <Sheet
            variant="outlined"
            sx={{
              borderRadius: "md",
            }}
          >
            <Table variant="soft" size="lg" stripe="odd">
              <thead>
                <tr>
                  <th>Product</th>
                  <th
                    style={{
                      width: "20%",
                    }}
                  >
                    Units Sold
                  </th>
                  <th
                    style={{
                      width: "20%",
                    }}
                  >
                    Total Sales
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.product_ranking && data?.product_ranking.length > 0 ? (
                  data?.product_ranking.map((item, index) => (
                    <tr>
                      <td>{item.product_name}</td>
                      <td>{item.units_sold}</td>
                      <td>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.total_sales)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      style={{
                        textAlign: "center",
                      }}
                    >
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Sheet>
        </Stack>
        <Stack gap={2}>
          <Typography
            level="h4"
            component="h2"
            endDecorator={
              <MuiTooltip
                title="Top 5 Categories in your shop ranked by total sales value of confirmed orders over the selected time period"
                placement="top"
                arrow
                variant="outlined"
              >
                <HelpOutlineRounded
                  sx={{
                    fontSize: 18,
                  }}
                />
              </MuiTooltip>
            }
          >
            Category Ranking
          </Typography>
          <Sheet
            variant="outlined"
            sx={{
              borderRadius: "md",
            }}
          >
            <Table variant="soft" size="lg" stripe="odd">
              <thead>
                <tr>
                  <th>Category</th>
                  <th
                    style={{
                      width: "20%",
                    }}
                  >
                    Units Sold
                  </th>
                  <th
                    style={{
                      width: "20%",
                    }}
                  >
                    Total Sales
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.category_ranking && data?.category_ranking.length > 0 ? (
                  data?.category_ranking.map((item, index) => (
                    <tr>
                      <td>{item.category_name}</td>
                      <td>{item.units_sold}</td>
                      <td>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.total_sales)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      style={{
                        textAlign: "center",
                      }}
                    >
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Sheet>
        </Stack>
      </Stack>
    </>
  );
}

export default DashboardPage;
