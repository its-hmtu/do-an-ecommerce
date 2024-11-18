import React from "react";
import TabPanelAll from "./TabPanelAll";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrders, getOrdersByStatus, massShipOrder } from "api/orders.api";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  iconButtonClasses,
  Link,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import {
  AutorenewRounded,
  Block,
  BlockRounded,
  CheckRounded,
  ChevronRightRounded,
  ContentPasteSearchRounded,
  LocalShippingRounded,
} from "@mui/icons-material";
import { Pagination } from "antd";
import LoadingModal from "components/LoadingModal";

function OrderMassShip() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [order, setOrder] = React.useState("desc");
  const [selected, setSelected] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const massShipOrderMutation = useMutation({
    mutationFn: () => massShipOrder(selected),
    onSuccess: () => {
      queryClient.invalidateQueries("orders?status=pending");
      setSelected([]);
    }
  });

  const {
    data: orders,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: `orders?status=pending`,
    queryFn: () =>
      getOrdersByStatus("pending"),
  });
  return (
    <>
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
          <Link
            underline="hover"
            color="neutral"
            onClick={() => navigate("/orders")}
            sx={{ fontSize: 12, fontWeight: 500 }}
          >
            Orders
          </Link>
          <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
            Mass ship
          </Typography>
        </Breadcrumbs>
      </Box>
      <>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <Typography level="h4">
            {`${orders?.data.length || 0} ${
              orders?.data.length > 1 ? "Orders" : "Order"
            }`}
          </Typography>
        </Stack>
        <Sheet className="OrderTableContainer">
          <Box
            sx={{
              display: "flex",
              backgroundColor: "#f6f6f6",
              border: "1px solid #e0e0e0",
              padding: "12px 16px",
              borderRadius: "sm",
              color: "#757575",
              marginBottom: 2,
              gap: 2,
              alignItems: "center",
            }}
          >
            <Checkbox
              size="sm"
              indeterminate={
                selected.length > 0 && selected.length !== orders?.data?.length
              }
              checked={selected.length === orders?.data?.length}
              onChange={(event) => {
                setSelected(
                  event.target.checked ? orders?.data?.map((row) => row.id) : []
                );
              }}
              color={
                selected.length > 0 || selected.length === orders?.data?.length
                  ? "primary"
                  : undefined
              }
              sx={{ verticalAlign: "text-bottom" }}
            />
            <Typography level="h5" sx={{ width: "30%" }}>
              Product(s)
            </Typography>
            <Typography level="h5" sx={{ width: "15%" }}>
              Total
            </Typography>
            <Typography level="h5" sx={{ width: "15%" }}>
              Status
            </Typography>
            <Typography level="h5" sx={{ width: "20%" }}>
              Date
            </Typography>
            <Typography level="h5" sx={{ width: "15%" }}>
              Actions
            </Typography>
          </Box>
          {orders?.data.length > 0 ? (
            orders?.data?.map((row) => (
              <Box
                key={row.id}
                sx={{
                  display: "flex",
                  backgroundColor: "#fff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "sm",
                  color: "#757575",
                  marginBottom: 2,
                }}
              >
                <Stack
                  sx={{
                    flex: 1,
                  }}
                >
                  <Stack
                    direction="row"
                    gap={1}
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #e0e0e0",
                      padding: "12px 16px",
                      backgroundColor: "#f6f6f6",
                    }}
                  >
                    <Stack
                      direction="row"
                      gap={1}
                      sx={{
                        alignItems: "center",
                      }}
                    >
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
                      <Avatar />
                      {row.user ? (
                        <Typography
                          sx={{
                            fontSize: 14,
                            fontWeight: 500,
                          }}
                        >
                          {row.user.first_name + " " + row.user.last_name}
                        </Typography>
                      ) : (
                        <Typography
                          sx={{
                            fontSize: 14,
                            fontWeight: 500,
                          }}
                        >
                          {row.guest_first_name + " " + row.guest_last_name}
                        </Typography>
                      )}
                    </Stack>

                    <Stack
                      direction="row"
                      gap={1}
                      sx={{
                        alignItems: "center",
                      }}
                    >
                      <Chip
                        variant="soft"
                        size="md"
                        startDecorator={<LocalShippingRounded />}
                        color="warning"
                      >
                        Ready to ship
                      </Chip>

                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "#757575",
                        }}
                      >
                        Order ID: {row.id}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      padding: "24px",
                    }}
                  >
                    <Box sx={{ width: "30%" }}>
                      {row.order_items.map((item) => (
                        <Stack
                          key={item.id}
                          direction="row"
                          gap={6}
                          sx={{
                            justifyContent: "flex-start",
                            "& + &": {
                              marginTop: 4,
                            },
                          }}
                        >
                          <Stack direction="row" gap={3}>
                            <img
                              src={`${process.env.REACT_APP_API_URL}${
                                item.product.images.find(
                                  (image) =>
                                    image.id === item.product.main_image_id
                                )?.file_path
                              }`}
                              alt="Cover"
                              style={{ width: 75, height: 75 }}
                            />
                            <Stack>
                              <Typography
                                sx={{
                                  fontSize: 14,
                                  fontWeight: 500,
                                }}
                              >
                                {item.product.product_name}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: 12,
                                  color: "#757575",
                                }}
                              >
                                Variation: {}
                              </Typography>
                            </Stack>
                          </Stack>
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: "#757575",
                            }}
                          >
                            x{item.quantity}
                          </Typography>
                        </Stack>
                      ))}
                    </Box>
                    <Box sx={{ width: "15%" }}>
                      <Typography level="h5">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(row.total)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "15%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Chip
                        variant="soft"
                        size="md"
                        startDecorator={
                          {
                            paid: <CheckRounded />,
                            pending: <AutorenewRounded />,
                            shipped: <LocalShippingRounded />,
                            delivered: <CheckRounded />,
                            cancelled: <BlockRounded />,
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
                        {
                          // Capitalize the first letter of the status
                          row.status.charAt(0).toUpperCase() +
                            row.status.slice(1)
                        }
                      </Chip>
                    </Box>
                    <Box sx={{ width: "20%" }}>
                      <Typography level="h5">
                        {new Date(row.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          second: "numeric",
                          hour12: true,
                        })}
                      </Typography>
                    </Box>
                    <Box sx={{ width: "15%" }}>
                      <Button
                        size="sm"
                        color="primary"
                        variant="plain"
                        startDecorator={<ContentPasteSearchRounded />}
                        onClick={() => navigate(`/orders/${row.id}`)}
                      >
                        Check Details
                      </Button>
                    </Box>
                  </Box>
                </Stack>
              </Box>
            ))
          ) : isLoading ? (
            <Stack
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress
                color="primary"
                variant="plain"
                sx={{
                  ".MuiCircularProgress-progress": {
                    stroke: "var(--CircularProgress-progressColor)!important",
                  },
                }}
              />
            </Stack>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                gap: 1,
                alignItems: "center",
                height: 200,
                border: "1px solid #e0e0e0",
                borderRadius: "sm",
              }}
            >
              <Typography
                sx={{
                  fontSize: 16,
                  color: "#757575",
                }}
              >
                No orders found
              </Typography>

              <Button size="sm" color="primary" variant="plain">
                Refresh
              </Button>
            </Box>
          )}
        </Sheet>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{
            justifyContent: "flex-end",
            alignItems: "center",
          }}
          gap={2}
        >
          <Button size="sm" color="neutral" variant="plain">
            Cancel
          </Button>
          <Button
            size="sm"
            color="primary"
            variant="solid"
            sx={{
              padding: "8px 16px",
            }}
            onClick={() => {
              massShipOrderMutation.mutate();
            }}
          >
            Mass Ship
          </Button>

          
        </Stack>
      </>
      <LoadingModal open={massShipOrderMutation.isPending} title="Shipping orders" />
    </>
  );
}

export default OrderMassShip;
