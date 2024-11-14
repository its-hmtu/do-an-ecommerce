import React, { useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
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
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/joy";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories, deleteCategory } from "api/categories.api";
import { useNavigate } from "react-router-dom";
import {
  AddCircleRounded,
  ChevronRightRounded,
  DownloadRounded,
} from "@mui/icons-material";
import RowMenu from "components/RowMenu";
import { getComparator } from "utils/helper";
import Filter from "components/Filter";
import SearchBox from "components/SearchBox";
import ConfirmModal from "components/ConfirmModal";
import { ToastMessageContext } from "contexts/ToastMessageContext";
import { Pagination } from "antd";
import { toast } from "react-toastify";

const CategoryTable = () => {
  const navigate = useNavigate();
  const [order, setOrder] = React.useState("asc");
  const [selected, setSelected] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedCategory, setSelectedCategory] = React.useState({});
  const [searchValue, setSearchValue] = React.useState("");
  const [dataFilteredList, setDataFilteredList] = React.useState([]);
  const { toastMessage, setToastMessage } =
    React.useContext(ToastMessageContext);

  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["categories", { page, limit: pageSize, q: searchValue }],
    queryFn: () =>
      getCategories({ page: page, limit: pageSize, q: searchValue }),
  });

  // delete category using tanstack/react-query
  const mutation = useMutation({
    mutationFn: (id) => deleteCategory({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries("categories");
    },
  });

  const handleDelete = (id) => {
    mutation.mutate(id);
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const isNewlyCreated = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diff = now - created;
    return diff < 1000 * 60 * 60 * 24;
  };

  useEffect(() => {
    if (data?.categories) {
      setDataFilteredList(data.categories);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [page, pageSize, refetch, searchValue]);

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Breadcrumbs
          size="sm"
          aria-label="breadcrumbs"
          separator={<ChevronRightRounded fontSize="sm" />}
          sx={{ pl: 0 }}
        >
          <MuiLink
            underline="hover"
            color="neutral"
            onClick={() => navigate("/dashboard")}
            sx={{ fontSize: 12, fontWeight: 500 }}
          >
            Dashboard
          </MuiLink>
          <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
            Categories
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
          Categories
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
            onClick={() => navigate("/categories/create")}
          >
            Create new category
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
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": {
            minWidth: { xs: "120px", md: "160px" },
          },
        }}
      >
        <SearchBox width={240} onChange={handleSearch} value={searchValue} />
        <Filter />
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
                    selected?.length > 0 &&
                    selected?.length !== dataFilteredList?.length
                  }
                  checked={selected?.length === dataFilteredList?.length}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked
                        ? data?.categories.map((row) => row.id)
                        : []
                    );
                  }}
                  color={
                    selected.length > 0 ||
                    selected.length === data?.categories.length
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
              <th style={{ width: 140, padding: "12px 6px" }}>Description</th>
              <th style={{ width: 140, padding: "12px 6px" }}>Created at</th>
              <th style={{ width: 240, padding: "12px 6px" }}>Updated at</th>
              <th style={{ width: 140, padding: "12px 6px" }}> </th>
            </tr>
          </thead>
          <tbody>
            {dataFilteredList.length > 0 ? (
              dataFilteredList
                ?.sort(getComparator(order, "name"))
                .map((row) => (
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
                        slotProps={{ checkbox: { sx: { textAlign: "left" } } }}
                        sx={{ verticalAlign: "text-bottom" }}
                      />
                    </td>
                    <td>
                      <Typography
                        level="body-xs"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        {/* if the row is the last of the list then is must be the newly created then add a badge to it */}
                        {row.name}
                        {isNewlyCreated(row.createdAt) ? (
                          <Chip color="success" size="sm">
                            New
                          </Chip>
                        ) : null}
                      </Typography>
                    </td>
                    <td>
                      <Typography level="body-xs">{row.description}</Typography>
                    </td>
                    <td>
                      <Typography level="body-xs">
                        {new Date(row.createdAt).toLocaleString("en-US", {
                          month: "numeric",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: false,
                        })}
                      </Typography>
                    </td>
                    <td>
                      <Typography level="body-xs">
                        {new Date(row.updatedAt).toLocaleString("en-US", {
                          month: "numeric",
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
                        sx={{ display: "flex", gap: 2, alignItems: "center" }}
                      >
                        <Link level="body-xs" component="button">
                          Download
                        </Link>
                        <RowMenu
                          onEdit={() => {
                            navigate(`/categories/${row.id}/edit`);
                          }}
                          onDelete={() => {
                            setOpenDelete(true);
                            setSelectedCategory(row);
                          }}
                        />
                      </Box>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={6}>
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
                      No categories found
                    </Typography>

                    <Button size="sm" color="primary" variant="plain">
                      Refresh
                    </Button>
                  </Box>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Sheet>
      {dataFilteredList.length > 0 && (
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
            defaultPageSize={pageSize}
            
          />
          <Box sx={{ flex: 1 }} />
        </Box>
      )}
      <ConfirmModal
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setSelectedCategory({});
        }}
        onConfirm={() => {
          handleDelete(selectedCategory?.id);
          setToastMessage({
            open: true,
            message: `Category "${selectedCategory?.name}" has been deleted`,
            type: "danger",
          });
          // toast.error(<Snackbar
          //   open={toastMessage.open}
          //   autoHideDuration={6000}
          //   color={toastMessage.type}
          //   variant="soft"
          //   anchorOrigin={{ vertical: "top", horizontal: "right" }}
          //   startDecorator={toastMessage.type === "danger" ? <Warning /> : toastMessage.type === 'success' ? <CheckCircle /> : <Info />}
          //   endDecorator={
          //     <IconButton
          //       size="small"
          //       aria-label="close"
          //       color="inherit"
          //       onClick={() =>
          //         setToastMessage({ ...toastMessage, open: false })
          //       }
          //     >
          //       <Close fontSize="small" color="neutral" />
          //     </IconButton>
          //   }
          //   onClose={() => setToastMessage({ ...toastMessage, open: false })}
          // >
          //   {toastMessage.message || "Success"}
          // </Snackbar>);
          setOpenDelete(false);
        }}
        title={`Delete "${selectedCategory?.name}" category`}
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </React.Fragment>
  );
};

export default CategoryTable;
