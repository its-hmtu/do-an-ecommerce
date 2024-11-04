import React, { useEffect } from "react";
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
import { getOrders } from "api/orders.api";
import { getComparator } from "utils/helper";
import RowMenu from "components/RowMenu";
import { useNavigate } from "react-router-dom";
import SearchBox from "components/SearchBox";
import { Pagination } from "antd";
import TabPanelAll from "./TabPanelAll";

const OrderTable = () => {
  const navigate = useNavigate();
  const [order, setOrder] = React.useState("desc");
  const [selected, setSelected] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const {
    data: orders,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: "orders",
    queryFn: getOrders,
  });

  return (
    <React.Fragment>
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
          <Button
            color="primary"
            startDecorator={<DownloadRounded />}
            size="sm"
          >
            Export
          </Button>
        </Box>
      </Box>
      <Tabs
        defaultValue={0}
        sx={{
          borderRadius: "sm",
          backgroundColor: "transparent",
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
              {orders?.data.filter((order) => order.status === "paid").length || 0}
            </Chip>
          </Tab>
          <Tab>Shipped</Tab>
          <Tab>Delivered</Tab>
          <Tab>Cancelled</Tab>
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
        <TabPanel value={1} sx={{
            paddingInline: 0,
          }}>
          <TabPanelAll
            orders={{
              ...orders,
              data: orders?.data.filter((order) => order.status === "paid"),
            }}
            pageSize={pageSize}
            handleSetPage={(page) => setPage(page)}
            handleSetPageSize={(pageSize) => setPageSize(pageSize)}
          />
        </TabPanel>
        <TabPanel value={2} sx={{
            paddingInline: 0,
          }}>
          <TabPanelAll
            orders={{
              ...orders,
              data: orders?.data.filter((order) => order.status === "paid"),
            }}
            pageSize={pageSize}
            handleSetPage={(page) => setPage(page)}
            handleSetPageSize={(pageSize) => setPageSize(pageSize)}
          />
        </TabPanel>

        <TabPanel value={3} sx={{
            paddingInline: 0,
          }}>
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

        <TabPanel value={4} sx={{
            paddingInline: 0,
          }}>
          <TabPanelAll
            orders={{
              ...orders,
              data: orders?.data.filter((order) => order.status === "delivered"),
            }}
            pageSize={pageSize}
            handleSetPage={(page) => setPage(page)}
            handleSetPageSize={(pageSize) => setPageSize(pageSize)}
          />
        </TabPanel>

        <TabPanel value={5} sx={{
            paddingInline: 0,
          }}s>
          <TabPanelAll
            orders={{
              ...orders,
              data: orders?.data.filter((order) => order.status === "cancelled"),
            }}
            pageSize={pageSize}
            handleSetPage={(page) => setPage(page)}
            handleSetPageSize={(pageSize) => setPageSize(pageSize)}
          />
        </TabPanel>
      </Tabs>
    </React.Fragment>
  );
};

export default OrderTable;
