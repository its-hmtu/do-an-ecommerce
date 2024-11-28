import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  Input,
  Link,
  Modal,
  ModalClose,
  ModalDialog,
  Sheet,
  Table,
  Typography,
  iconButtonClasses,
  CircularProgress,
  Breadcrumbs,
  Stack,
} from "@mui/joy";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteMultipleProducts,
  deleteProduct,
  getProducts,
} from "api/products.api";
import { getAllCategories, getCategories } from "api/categories.api";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import RowMenu from "components/RowMenu";
import { getComparator } from "utils/helper";
import {
  AddCircleRounded,
  AutorenewRounded,
  ChevronRightRounded,
  DownloadRounded,
} from "@mui/icons-material";
import Filter from "components/Filter";
import SearchBox from "components/SearchBox";
import { Pagination } from "antd";
import ConfirmModal from "components/ConfirmModal";
import { toast } from "react-toastify";

function ProductTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = React.useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState({});
  const [openDelete, setOpenDelete] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["products", { page, pageSize, q, category, sort, order }],
    queryFn: () =>
      getProducts({ page, limit: pageSize, q, category, sort, order }),
  });

  const { data: categoryData } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id) => deleteProduct({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries("products");
    },
  });

  const deleteMultipleProductsMutation = useMutation({
    mutationFn: (ids) => deleteMultipleProducts({ product_ids: ids }),
    onSuccess: () => {
      queryClient.invalidateQueries("products");
    },
  });

  useEffect(() => {
    refetch();
  }, [page, pageSize, q, category, sort, order, refetch]);

  const [open, setOpen] = React.useState(false);

  const mainImage = data?.products?.map((row) =>
    row.images.find((image) => image.id === row.main_image_id)
  );

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  const handleDelete = async (id) => {
    await deleteProductMutation.mutateAsync(id);
  };

  const handleDeleteSelected = async () => {
    await deleteMultipleProductsMutation.mutateAsync(selected);
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
          padding: 0,
        }}
      >
        <Typography level="h2" component="h1">
          My Products
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
              {/* <Filter categoryData={categoryData} /> */}
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
        <Filter
          isCategoryVisible
          categoryData={categoryData}
          categoryValue={category}
          onChange={(e, value) => setCategory(value)}
        />

        <IconButton
          size="sm"
          onClick={() => refetch()}
          variant="outlined"
          sx={{
            borderRadius: "sm",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
          }}
        >
          <AutorenewRounded />
        </IconButton>
      </Box>

      <>
        <Typography level="h4">
          {`${data?.total_item_count || 0} ${
            data?.total_item_count > 1 ? "Products" : "Product"
          }`}
        </Typography>
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
              "--TableCell-paddingY": "16px",
              "--TableCell-paddingX": "8px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    width: 30,
                    textAlign: "center",
                    padding: "12px 6px",
                  }}
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

                {/* <th style={{ width: 100, padding: "12px 6px" }}> </th> */}
                <th style={{ width: 160, padding: "12px 6px" }}>
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
                    Product(s)
                  </Link>
                </th>
                {/* <th style={{ width: 140, padding: "12px 6px" }}>Name</th> */}
                <th style={{ width: 60, padding: "12px 24px" }}>Sales</th>
                <th style={{ width: 80, padding: "12px 16px" }}>Price</th>
                <th style={{ width: 80, padding: "12px 6px" }}>Stock</th>
                <th style={{ width: 80, padding: "12px 6px" }}>Created at</th>
                <th style={{ width: 30, padding: "12px 6px" }}> </th>
              </tr>
            </thead>
            <tbody>
              {data?.products.length > 0 ? (
                data?.products
                  ?.sort(getComparator(order, "name"))
                  ?.map((row, index) => (
                    <tr key={row.id}>
                      <td style={{ textAlign: "center", width: 120 }}>
                        <Checkbox
                          size="sm"
                          checked={selected.includes(row.id)}
                          color={
                            selected.includes(row.id) ? "primary" : undefined
                          }
                          onChange={(event) => {
                            setSelected((ids) =>
                              event.target.checked
                                ? ids.concat(row.id)
                                : ids.filter((itemId) => itemId !== row.id)
                            );
                          }}
                          slotProps={{
                            checkbox: { sx: { textAlign: "left" } },
                          }}
                          sx={{ verticalAlign: "text-bottom" }}
                        />
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
                            <Stack
                              direction="row"
                              gap={2}
                              justifyItems="center"
                              alignItems="center"
                            >
                              {(
                                <img
                                  src={`${process.env.REACT_APP_API_URL}${
                                    row.images.find(image => image.id === row.main_image_id).file_path
                                  }`}
                                  alt="product"
                                  style={{ width: 100, height: 100 }}
                                />
                              )}

                              <Stack>
                                <Typography
                                  level="body-xs"
                                  sx={{
                                    "&:hover": {
                                      textDecoration: "underline",
                                    },
                                    fontWeight: "bold",
                                    fontSize: "1rem",
                                  }}
                                >
                                  {row.product_name}
                                </Typography>
                                <Typography level="body-xs">
                                  Item ID: {row.id}
                                </Typography>
                              </Stack>
                            </Stack>
                          </RouterLink>
                        </Typography>
                      </td>
                      <td
                        style={{
                          padding: "12px 24px",
                        }}
                      >
                        <Typography level="body-xs">
                          {row.total_sold || 0}
                        </Typography>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                        }}
                      >
                        <Typography level="body-xs">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(row.base_price)}
                        </Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">
                          {row.total_in_stock}
                        </Typography>
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
                          <RowMenu
                            onEdit={() => navigate(`/products/${row.id}`)}
                            onDelete={() => {
                              setSelectedProduct(row);
                              setOpenDelete(true);
                            }}
                          />
                        </Box>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 1,
                        alignItems: "center",
                        height: 200,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 16,
                          color: "#757575",
                        }}
                      >
                        No products found
                      </Typography>

                      <Button size="sm" color="primary" variant="plain">
                        Refresh
                      </Button>
                    </Box>
                  </td>
                </tr>
              )}
              {selected.length > 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 2,
                      }}
                    >
                      <Typography level="body-xs">
                        {selected.length} selected
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                        }}
                      >
                        <Button
                          color="neutral"
                          variant="outlined"
                          size="sm"
                          onClick={() => {
                            setSelected(data?.products?.map((row) => row.id));
                          }}
                        >
                          Select all
                        </Button>

                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => setOpenDelete(true)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Box>
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
            justifyContent: "flex-end",
          }}
        >
          <Pagination
            current={data?.current_page || 1}
            total={data?.total_item_count || 0}
            onChange={(page) => setPage(page)}
            showSizeChanger
            onShowSizeChange={(current, size) => setPageSize(size)}
            defaultPageSize={pageSize}
            // showTotal={(total, range) =>
            //   `${range[0]}-${range[1]} of ${total} items`
            // }
            // hideOnSinglePage
            // itemRender={itemRender}
          />
        </Box>
      </>

      <ConfirmModal
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setSelectedProduct({});
        }}
        onConfirm={async () => {
          if (selected.length > 0) {
            await handleDeleteSelected().then(() => {
              toast.success("Products deleted successfully");
            });
            console.log("deleting multiple products");
            setSelected([]);
          } else {
            await handleDelete(selectedProduct.id).then(() => {
              toast.success("Product deleted successfully");
            });
          }

          setOpenDelete(false);
        }}
        title={
          selected.length > 0
            ? "Delete selected products?"
            : `Delete ${selectedProduct.product_name}?`
        }
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </React.Fragment>
  );
}

export default ProductTable;
