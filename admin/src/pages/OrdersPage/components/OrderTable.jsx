import React, { lazy, Suspense, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Link,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  Sheet,
  Table,
  Typography,
  Avatar,
  Dropdown,
  MenuButton,
  Menu,
  MenuItem,
  iconButtonClasses,
  Breadcrumbs,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  tabClasses,
  Stack,
  TextField,
} from "@mui/joy";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import BlockIcon from "@mui/icons-material/Block";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  ChevronRightRounded,
  DownloadRounded,
  HomeRounded,
  LocalShippingRounded,
} from "@mui/icons-material";
import Filter from "components/Filter";
import { useQuery } from "@tanstack/react-query";
import { exportToExcel, getOrders } from "api/orders.api";
import { getComparator } from "utils/helper";
import RowMenu from "components/RowMenu";
import { useNavigate } from "react-router-dom";
import SearchBox from "components/SearchBox";
import { Pagination, DatePicker } from "antd";
import { CircularProgress } from "@mui/material";
import { saveAs } from "file-saver";
import moment from "moment";
// import TabPanelAll from "./TabPanelAll";
const TabPanelAll = lazy(() => import("./TabPanelAll"));

const OrderTable = () => {
  const { RangePicker } = DatePicker;
  const navigate = useNavigate();
  const [order, setOrder] = React.useState("desc");
  const [selected, setSelected] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [status, setStatus] = React.useState("");
  const [paid, setPaid] = React.useState(null);
  const [startDate, setStartDate] = React.useState(
    // a month ago
    null
  );
  const [endDate, setEndDate] = React.useState(null);

  const {
    data: orders,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: "orders",
    queryFn: getOrders,
  });

  const handleExport = async () => {
    try {
      const response = await exportToExcel({
        status,
        paid,
        start_date: startDate,
        end_date: endDate,
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "orders.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  return (
    <Suspense
      fallback={
        <Stack
          spacing={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress color="primary" variant="plain" />
        </Stack>
      }
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Breadcrumbs
          size="sm"
          aria-label="breadcrumbs"
          separator={<ChevronRightRounded fontSize="sm" />}
          sx={{ pl: 0 }}
        >
          <Link
            underline="hover"
            color="neutral"
            onClick={() => navigate("/dashboard")}
            sx={{ fontSize: 12, fontWeight: 500 }}
          >
            Dashboard
          </Link>
          <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
            Orders
          </Typography>
        </Breadcrumbs>
      </Box>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: "sm",
          py: 2,
          display: { xs: "none", sm: "flex" },
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": {
            minWidth: { xs: "120px", md: "160px" },
          },
        }}
      >
        <SearchBox width={250} />
        <Filter />
      </Box>
      <Box
        sx={{
          display: "flex",
          mb: 1,
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
          flexWrap: "wrap",
          justifyContent: "space-between",
          padding: 0,
        }}
      >
        <Typography level="h2" component="h1">
          My Orders
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <DatePicker
            placeholder="Start Date"
            onChange={(date, dateString) => setStartDate(dateString)}
          />
          <DatePicker
            placeholder="End Date"
            onChange={(date, dateString) => setEndDate(dateString)}
          />
          <Button
            color="primary"
            startDecorator={<DownloadRounded />}
            size="sm"
            onClick={handleExport}
          >
            Export report
          </Button>
        </Box>
      </Box>
      <Tabs
        defaultValue={0}
        sx={{
          borderRadius: "sm",
          backgroundColor: "transparent",
        }}
        onChange={(e, value) => {
          if (value === 0) {
            setStatus("");
            setPaid(null);
          } else if (value === 1) {
            setStatus("");
            setPaid(1);
          } else if (value === 2) {
            setStatus("pending");
            setPaid(null);
          } else if (value === 3) {
            setStatus("shipped");
            setPaid(null);
          } else if (value === 4) {
            setStatus("delivered");
            setPaid(null);
          } else if (value === 5) {
            setStatus("completed");
            setPaid(null);
          } else if (value === 6) {
            setStatus("cancelled");
            setPaid(null);
          } else if (value === 7) {
            setStatus("refunded");
            setPaid(null);
          } else {
            setStatus("");
            setPaid(null);
          }
        }}
      >
        <TabList
          color="primary"
          disableUnderline
          sx={{
            pt: 1,
            justifyContent: "flex-start",
            [`&& .${tabClasses.root}`]: {
              flex: "initial",
              bgcolor: "transparent",
              "&:hover": {
                bgcolor: "transparent",
              },
              [`&.${tabClasses.selected}`]: {
                color: "primary.plainColor",
                "&::after": {
                  height: 3,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  bgcolor: "primary.500",
                },
              },
            },
          }}
        >
          <Tab>All</Tab>
          <Tab>Paid</Tab>
          <Tab>
            To ship
            <Chip
              color="primary"
              size="sm"
              sx={{
                ml: 1,
              }}
            >
              {orders?.data.filter((order) => order.status === "pending")
                .length || 0}
            </Chip>
          </Tab>
          <Tab>Shipped</Tab>
          <Tab>Delivered</Tab>
          <Tab>Completed</Tab>
          <Tab>Cancelled</Tab>
          <Tab>Return/Refunded</Tab>
        </TabList>
        <TabPanel
          value={0}
          sx={{
            paddingInline: 0,
          }}
        >
          <TabPanelAll
            orders={orders}
            pageSize={pageSize}
            handleSetPage={(page) => setPage(page)}
            handleSetPageSize={(pageSize) => setPageSize(pageSize)}
          />
        </TabPanel>
        <TabPanel
          value={1}
          sx={{
            paddingInline: 0,
          }}
        >
          <TabPanelAll
            orders={{
              ...orders,
              data: orders?.data.filter((order) => order.is_paid === true),
            }}
            pageSize={pageSize}
            handleSetPage={(page) => setPage(page)}
            handleSetPageSize={(pageSize) => setPageSize(pageSize)}
          />
        </TabPanel>
        <TabPanel
          value={2}
          sx={{
            paddingInline: 0,
          }}
        >
          <TabPanelAll
            orders={{
              ...orders,
              data: orders?.data.filter((order) => order.status === "pending"),
            }}
            pageSize={pageSize}
            handleSetPage={(page) => setPage(page)}
            handleSetPageSize={(pageSize) => setPageSize(pageSize)}
          />
        </TabPanel>

        <TabPanel
          value={3}
          sx={{
            paddingInline: 0,
          }}
        >
          <TabPanelAll
            orders={{
              ...orders,
              data: orders?.data.filter((order) => order.status === "shipped"),
            }}
            pageSize={pageSize}
            handleSetPage={(page) => setPage(page)}
            handleSetPageSize={(pageSize) => setPageSize(pageSize)}
          />
        </TabPanel>

        <TabPanel
          value={4}
          sx={{
            paddingInline: 0,
          }}
        >
          <TabPanelAll
            orders={{
              ...orders,
              data: orders?.data.filter(
                (order) => order.status === "delivered"
              ),
            }}
            pageSize={pageSize}
            handleSetPage={(page) => setPage(page)}
            handleSetPageSize={(pageSize) => setPageSize(pageSize)}
          />
        </TabPanel>

        <TabPanel
          value={5}
          sx={{
            paddingInline: 0,
          }}
        >
          <TabPanelAll
            orders={{
              ...orders,
              data: orders?.data.filter(
                (order) => order.status === "completed"
              ),
            }}
            pageSize={pageSize}
            handleSetPage={(page) => setPage(page)}
            handleSetPageSize={(pageSize) => setPageSize(pageSize)}
          />
        </TabPanel>

        <TabPanel
          value={6}
          sx={{
            paddingInline: 0,
          }}
          s
        >
          <TabPanelAll
            orders={{
              ...orders,
              data: orders?.data.filter(
                (order) => order.status === "cancelled"
              ),
            }}
            pageSize={pageSize}
            handleSetPage={(page) => setPage(page)}
            handleSetPageSize={(pageSize) => setPageSize(pageSize)}
          />
        </TabPanel>

        <TabPanel
          value={7}
          sx={{
            paddingInline: 0,
          }}
        >
          <TabPanelAll
            orders={{
              ...orders,
              data: orders?.data.filter((order) => order.status === "refunded"),
            }}
            pageSize={pageSize}
            handleSetPage={(page) => setPage(page)}
            handleSetPageSize={(pageSize) => setPageSize(pageSize)}
          />
        </TabPanel>
      </Tabs>
    </Suspense>
  );
};

export default OrderTable;
