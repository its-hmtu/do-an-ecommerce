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

const OrderTable = () => {
  const navigate = useNavigate();
  const [order, setOrder] = React.useState("desc");
  const [selected, setSelected] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  const { data: orders, isLoading } = useQuery({
    queryKey: "orders",
    queryFn: getOrders,
  });

  useEffect(() => {
    console.log(orders);
  }, [orders]);

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

      <Tabs defaultValue={0}>
        <TabList 
          sx={{
            bgcolor: 'transparent',
          }}
        >
          <Tab>All</Tab>
          <Tab>Paid</Tab>
          <Tab>To ship</Tab>
          <Tab>Shipped</Tab>
          <Tab>Delivered</Tab>
          <Tab>Cancelled</Tab>
        </TabList>
        <TabPanel value={0}>
          <Table
            aria-labelledby="tableTitle"
            stickyHeader
            hoverRow
            sx={{
              "--TableCell-headBackground":
                "var(--joy-palette-background-level1)",
              "--Table-headerUnderlineThickness": "1px",
              "--TableRow-hoverBackground":
                "var(--joy-palette-background-level1)",
              "--TableCell-paddingY": "4px",
              "--TableCell-paddingX": "8px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    width: 48,
                    textAlign: "center",
                    padding: "12px 6px",
                  }}
                >
                  <Checkbox
                    size="sm"
                    indeterminate={
                      selected.length > 0 && selected.length !== orders?.length
                    }
                    checked={selected.length === orders?.length}
                    onChange={(event) => {
                      setSelected(
                        event.target.checked ? orders?.map((row) => row.id) : []
                      );
                    }}
                    color={
                      selected.length > 0 || selected.length === orders?.length
                        ? "primary"
                        : undefined
                    }
                    sx={{ verticalAlign: "text-bottom" }}
                  />
                </th>
                <th style={{ width: 120, padding: "12px 6px" }}>
                  <Link
                    underline="none"
                    color="primary"
                    component="button"
                    onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                    endDecorator={<ArrowDropDownIcon />}
                    sx={[
                      {
                        fontWeight: "lg",
                        "& svg": {
                          transition: "0.2s",
                          transform:
                            order === "desc"
                              ? "rotate(0deg)"
                              : "rotate(180deg)",
                        },
                      },
                      order === "desc"
                        ? { "& svg": { transform: "rotate(0deg)" } }
                        : { "& svg": { transform: "rotate(180deg)" } },
                    ]}
                  >
                    Order ID
                  </Link>
                </th>
                <th style={{ width: 140, padding: "12px 6px" }}>Date</th>
                <th style={{ width: 140, padding: "12px 6px" }}>Status</th>
                <th style={{ width: 240, padding: "12px 6px" }}>Customer</th>
                <th style={{ width: 140, padding: "12px 6px" }}> </th>
              </tr>
            </thead>
            <tbody>
              {orders?.sort(getComparator(order, "id")).map((row) => (
                <tr key={row.id}>
                  <td style={{ textAlign: "center", width: 120 }}>
                    <Checkbox
                      size="sm"
                      checked={selected.includes(row.id)}
                      color={selected.includes(row.id) ? "primary" : undefined}
                      onChange={(event) => {
                        setSelected((ids) =>
                          event.target.checked
                            ? ids.concat(row.id)
                            : ids.filter((itemId) => itemId !== row.id)
                        );
                      }}
                      slotProps={{ checkbox: { sx: { textAlign: "left" } } }}
                      sx={{ verticalAlign: "text-bottom" }}
                    />
                  </td>
                  <td>
                    <Typography level="body-xs">{row.id}</Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">
                      {new Date(row.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </Typography>
                  </td>
                  <td>
                    <Chip
                      variant="soft"
                      size="sm"
                      startDecorator={
                        {
                          paid: <CheckRoundedIcon />,
                          pending: <AutorenewRoundedIcon />,
                          shipped: <LocalShippingRounded />,
                          delivered: <CheckRoundedIcon />,
                          cancelled: <BlockIcon />,
                        }[row.status]
                      }
                      color={
                        {
                          paid: "success",
                          pending: "neutral",
                          shipped: "success",
                          delivered: "success",
                          cancelled: "danger",
                        }[row.status]
                      }
                    >
                      {row.status}
                    </Chip>
                  </td>
                  <td>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Avatar size="sm">{row.user.first_name}</Avatar>
                      <div>
                        <Typography level="body-xs">
                          {row.user.first_name + " " + row.user.last_name}
                        </Typography>
                        <Typography level="body-xs">
                          {row.user.email}
                        </Typography>
                      </div>
                    </Box>
                  </td>
                  <td>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Link level="body-xs" component="button">
                        Download
                      </Link>
                      <RowMenu />
                    </Box>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TabPanel>
      </Tabs>
    </React.Fragment>
  );
};

export default OrderTable;
