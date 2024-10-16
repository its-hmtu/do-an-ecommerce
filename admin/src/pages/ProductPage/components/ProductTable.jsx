import React, { useEffect, useState } from "react";
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
  Menu,
  MenuItem,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  Sheet,
  Table,
  Typography,
  iconButtonClasses,
  Dropdown,
  MenuButton,
  CircularProgress,
  Breadcrumbs,
} from "@mui/joy";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import BlockIcon from "@mui/icons-material/Block";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Avatar from "@mui/joy/Avatar";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "api/products.api";
import { getAllCategories, getCategories } from "api/categories.api";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import RowMenu from "components/RowMenu";
import { getComparator } from "utils/helper";
import { AddCircleRounded, ChevronRightRounded, DownloadRounded } from "@mui/icons-material";
import Filter from "components/Filter";
import SearchBox from "components/SearchBox";
import { Pagination } from "antd";

function ProductTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = React.useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["products", { page, pageSize, q, category, sort, order }],
    queryFn: () =>
      getProducts({ page, limit: pageSize, q, category, sort, order }),
  });

  const { data: categoryData } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  useEffect(() => {
    refetch();
  }, [page, pageSize, q, category, sort, order, refetch]);

  const [open, setOpen] = React.useState(false);

  const itemRender = (_, type, originalElement) => {
    if (type === "prev" && data?.current_page > 1) {
      return (
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          startDecorator={<KeyboardArrowLeftIcon />}
          
        >
          Previous
        </Button>
      );
    }

    if (type === "next") {
      return (
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          endDecorator={<KeyboardArrowRightIcon />}
        >
          Next
        </Button>
      );
    }
  
    return originalElement;
  };

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
            Products
          </Typography>
        </Breadcrumbs>
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
        }}
      >
        <Typography level="h2" component="h1">
          Products
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <Button
            color="primary"
            startDecorator={<AddCircleRounded />}
            size="sm"
            onClick={() => navigate("/products/create")}
          >
            Create new product
          </Button>
          <Button
            color="primary"
            startDecorator={<DownloadRounded />}
            size="sm"
          >
            Download PDF
          </Button>
        </Box>
      </Box>
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{ display: { xs: "flex", sm: "none" }, my: 1, gap: 1 }}
      >
        <Input
          size="sm"
          placeholder="Search"
          startDecorator={<SearchIcon />}
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Filter />
              <Button color="primary" onClick={() => setOpen(false)}>
                Submit
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: "sm",
          py: 2,
          display: { xs: "none", sm: "flex" },
          // flexWrap: "wrap",
          alignItems: "end",
          gap: 1.5,
          "& > *": {
            minWidth: { xs: "120px", md: "160px" },
          },
        }}
      >
        <SearchBox
          width={300}
          onChange={(e) => setQ(e.target.value)}
          value={q}
        />
        <Filter isCategoryVisible categoryData={categoryData} />
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: "none", sm: "initial" },
          width: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
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
                style={{ width: 48, textAlign: "center", padding: "12px 6px" }}
              >
                <Checkbox
                  size="sm"
                  indeterminate={
                    selected.length > 0 &&
                    selected.length !== data?.products?.length
                  }
                  checked={selected.length === data?.products?.length}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked
                        ? data?.products?.map((row) => row.id)
                        : []
                    );
                  }}
                  color={
                    selected.length > 0 ||
                    selected.length === data?.products?.length
                      ? "primary"
                      : undefined
                  }
                  sx={{ verticalAlign: "text-bottom" }}
                />
              </th>

              <th style={{ width: 100, padding: "12px 6px" }}> </th>
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
                          order === "desc" ? "rotate(0deg)" : "rotate(180deg)",
                      },
                    },
                    order === "desc"
                      ? { "& svg": { transform: "rotate(0deg)" } }
                      : { "& svg": { transform: "rotate(180deg)" } },
                  ]}
                >
                  Name
                </Link>
              </th>
              {/* <th style={{ width: 140, padding: "12px 6px" }}>Name</th> */}
              <th style={{ width: 140, padding: "12px 16px" }}>Price</th>
              <th style={{ width: 100, padding: "12px 6px" }}>Stock</th>
              <th style={{ width: 140, padding: "12px 6px" }}>Categories</th>
              <th style={{ width: 140, padding: "12px 6px" }}>Created at</th>
              <th
                style={{ width: 60, padding: "12px 6px", textAlign: "center" }}
              >
                {" "}
              </th>
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
              data?.products?.sort(getComparator(order, "name"))?.map((row) => (
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
                    {row.images.length > 0 ? (
                      <Avatar
                        src={`http://localhost:5000${row?.images[0]?.file_path}`}
                        size="100px"
                        sx={{
                          borderRadius: "0",
                          // height: "auto",
                          backgroundColor: "transparent",
                        }}
                      />
                    ) : (
                      <Typography level="body-xs">No Image</Typography>
                    )}
                  </td>
                  <td>
                    <Typography
                      level="body-xs"
                      sx={{
                        "& > a:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      <RouterLink to={`/products/${row.id}`}>
                        <Typography level="body-xs" sx={{
                          "&:hover": {
                            textDecoration: "underline",
                          },
                          fontWeight: "bold"
                        }}>
                          {row.product_name}
                        </Typography>
                      </RouterLink>
                    </Typography>
                  </td>

                  <td
                    style={{
                      padding: "12px 16px",
                    }}
                  >
                    <Typography level="body-xs">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(row.base_price)}
                    </Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">
                      {row.total_in_stock}
                    </Typography>
                  </td>
                  <td>
                    {row.categories
                      .filter((item) => item.id !== 0)
                      .map((category) => (
                        <Chip
                          key={category.id}
                          size="sm"
                          color="primary"
                          sx={{
                            mr: 1,
                            // hover underlined
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          <RouterLink to={`/categories/${category.id}`}>
                            {category.name}
                          </RouterLink>
                        </Chip>
                      ))}
                  </td>
                  <td>
                    <Typography level="body-xs">
                      {new Date(row.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: false,
                      })}
                    </Typography>
                  </td>
                  <td>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <RowMenu />
                    </Box>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  <CircularProgress
                    size="sm"
                    sx={{
                      ".MuiCircularProgress-progress": {
                        stroke:
                          "var(--CircularProgress-progressColor)!important",
                      },
                    }}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Sheet>
      <Box
        className="Pagination-laptopUp"
        sx={{
          pt: 2,
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: "50%" },
          display: {
            xs: "none",
            md: "flex",
          },
        }}
      >
        <Box sx={{ flex: 1 }} />
        <Pagination
          current={data?.current_page || 1}
          total={data?.total_item_count || 0}
          onChange={(page) => setPage(page)}
          showSizeChanger
          onShowSizeChange={(current, size) => setPageSize(size)}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} items`
          }
          // hideOnSinglePage
          itemRender={itemRender}
        />
        <Box sx={{ flex: 1 }} />
      </Box>
    </React.Fragment>
  );
}

export default ProductTable;
