import {
  CheckRounded,
  CloseRounded,
  HelpOutlineOutlined,
  LocalShippingRounded,
  QuestionMarkOutlined,
  RefreshRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Sheet,
  Stack,
  Tab,
  tabClasses,
  TabList,
  TabPanel,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/joy";
import PostReviewModal from "components/Modal/PostReviewModal";
import { UserContext } from "contexts/UserContext";
import { useGetUserOrders } from "hooks";
import React, { useContext } from "react";

function OrderPage() {
  const { data, isLoading } = useGetUserOrders();
  const { user } = useContext(UserContext);
  const [userOrders, setUserOrders] = React.useState([]);
  const [openReviewModal, setOpenReviewModal] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);

  const userOrdersList = [
    userOrders.filter((order) => order.status === "pending"),
    userOrders.filter((order) => order.status === "shipped"),
    userOrders.filter((order) => order.status === "delivered"),
    userOrders.filter((order) => order.status === "completed"),
    userOrders.filter((order) => order.status === "cancelled"),
    userOrders.filter((order) => order.status === "refunded"),
  ];

  const renderStatus = (status) => {
    switch (status) {
      case "pending":
        return (
          <Typography color="neutral" startDecorator={<RefreshRounded />}>
            Pending confirmation
          </Typography>
        );
      case "shipped":
        return (
          <Typography color="warning" startDecorator={<LocalShippingRounded />}>
            Shipping
          </Typography>
        );
      case "delivered":
        return (
          <Typography color="primary" startDecorator={<LocalShippingRounded />}>
            Delivered
          </Typography>
        );
      case "completed":
        return (
          <Typography color="success" startDecorator={<CheckRounded />}>
            Completed
          </Typography>
        );

      case "cancelled":
        return (
          <Typography color="error" startDecorator={<CloseRounded />}>
            Cancelled
          </Typography>
        );
      case "refunded":
        return (
          <Typography color="error" startDecorator={<QuestionMarkOutlined />}>
            Refunded
          </Typography>
        );
      default:
        return "";
    }
  };

  const renderButtons = (status, handleOpenReview) => {
    switch (status) {
      case "pending":
        return (
          <Stack direction="row" justifyContent="flex-end" gap={1}>
            <Button variant="outlined" color="neutral">
              Cancel Order
            </Button>
          </Stack>
        );
      case "shipped":
        return null;
      case "delivered":
        return (
          <Stack direction="row" justifyContent="flex-end" gap={1}>
            <Button variant="outlined" color="neutral">
              Return Order
            </Button>
            <Button variant="solid" color="primary">
              I have received my order
            </Button>
          </Stack>
        );
      case "completed":
        return (
          <Stack direction="row" justifyContent="flex-end" gap={1}>
            <Button variant="solid" color="primary" onClick={handleOpenReview}>
              Write a Review
            </Button>
            <Button variant="outlined" color="neutral">
              Request a Refund
            </Button>
          </Stack>
        );
      case "cancelled":
        return (
          <Stack direction="row" justifyContent="flex-end" gap={1}>
            <Button variant="outlined" color="neutral">
              Reorder
            </Button>
          </Stack>
        );
      case "refunded":
        return (
          <Stack direction="row" justifyContent="flex-end" gap={1}>
            <Button variant="outlined" color="neutral">
              Reorder
            </Button>
          </Stack>
        );
      default:
        return null;
    }
  };

  const renderTable = (userOrders) => {
    return (
      <>
        {userOrders.length > 0 ? (
          userOrders?.map((order) => (
            <Box key={order.id}>
              {order.order_items.map((item) => (
                <Sheet key={item.id} sx={{ my: 2 }}>
                  <Box
                    sx={{
                      p: 4,
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between">
                      <Typography level="body-xs">
                        Order ID: {order.id}
                      </Typography>
                      <Typography level="body-xs">
                        {renderStatus(order.status)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography level="body-xs">
                        Address: {`${user.first_name} ${user.last_name} (${user.phone}) - ${order.address.address}, ${order.address.ward}, ${order.address.district}, ${order.address.city}`}
                      </Typography>
                    </Stack>
                    <Divider sx={{ my: 2 }} />
                    <Stack direction="row" justifyContent="space-between">
                      <Stack direction="row" gap={2}>
                        <img
                          src={`${process.env.REACT_APP_API_URL}${item.product.images[0].file_path}`}
                          alt={item.product.product_name}
                          style={{
                            width: 100,
                            height: 100,
                          }}
                        />
                        <Stack>
                          <Typography level="title-md">
                            {item.product.product_name}
                          </Typography>
                          <Typography level="body-sm">
                            Option: {item.product.options[0].color}
                          </Typography>
                          <Typography level="body-xs">
                            x{item.quantity}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Typography>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(parseFloat(item.unit_price))}
                      </Typography>
                    </Stack>
                  </Box>
                  <Divider sx={{ mt: 2 }} />
                  <Box
                    sx={{
                      py: 2,
                      px: 4,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="flex-end"
                      alignItems="center"
                      sx={{
                        mb: 2,
                      }}
                      gap={1}
                    >
                      <Typography level="body-sm">Total:</Typography>
                      <Typography level="title-lg" color="primary">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(parseFloat(order.total))}
                      </Typography>
                    </Stack>

                    {renderButtons(order.status, () =>
                      handleOpenReview(item.product)
                    )}
                  </Box>
                </Sheet>
              ))}
            </Box>
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              borderRadius: "sm",
              backgroundColor: "#fff",
            }}
          >
            <Typography level="title-md">No orders found</Typography>
          </Box>
        )}
      </>
    );
  };

  React.useEffect(() => {
    if (data) {
      setUserOrders(data);
    }
  }, [data]);

  const handleOpenReview = (product) => {
    setSelectedProduct(product);
    setOpenReviewModal(true);
  };

  return (
    <>
      <Box
        sx={{
          maxWidth: 1012,
        }}
      >
        <Stack
          direction="row"
          sx={{
            padding: 4,
            mb: 4,
            backgroundColor: "white",
            borderRadius: "sm",
            borderColor: "transparent",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Stack
            width={"50%"}
            sx={{
              alignItems: "center",
            }}
          >
            <Typography level="h4">{userOrdersList[3].length}</Typography>
            <Tooltip
              title="Your completed orders"
              placement="bottom"
              variant="outlined"
              arrow
            >
              <Typography
                level="body-md"
                endDecorator={
                  <HelpOutlineOutlined
                    fontSize="small"
                    sx={{
                      fontSize: "16px",
                    }}
                  />
                }
              >
                Orders
              </Typography>
            </Tooltip>
          </Stack>
          <Divider orientation="vertical" flexItem />
          <Stack
            width={"50%"}
            sx={{
              alignItems: "center",
            }}
          >
            <Typography level="h4">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(
                userOrdersList[3].reduce(
                  (acc, order) => acc + parseFloat(order.total),
                  0
                )
              )}
            </Typography>
            <Tooltip
              title="Total amount of your completed orders"
              placement="bottom"
              variant="outlined"
              arrow
            >
              <Typography
                level="body-md"
                endDecorator={
                  <HelpOutlineOutlined
                    fontSize="small"
                    sx={{
                      fontSize: "16px",
                    }}
                  />
                }
              >
                Total Spent
              </Typography>
            </Tooltip>
          </Stack>
        </Stack>

        <Tabs
          defaultValue={0}
          sx={{
            backgroundColor: "transparent",
            borderColor: "transparent",
          }}
          color="primary"
        >
          <TabList
            disableUnderline
            sx={{
              p: 0.5,
              gap: 0.5,
              borderRadius: "xl",
              bgcolor: "transparent",
              [`& .${tabClasses.root}[aria-selected="true"]`]: {
                boxShadow: "sm",
                bgcolor: "background.surface",
              },
              justifyContent: "center",
            }}
          >
            <Tab disableIndicator>Pending</Tab>
            <Tab disableIndicator>Shipping</Tab>
            <Tab disableIndicator>Delivered</Tab>
            <Tab disableIndicator>Completed</Tab>
            <Tab disableIndicator>Cancelled</Tab>
            <Tab disableIndicator>Refunded</Tab>
          </TabList>
          {Array.from({ length: 6 }).map((_, index) => (
            <TabPanel
              value={index}
              sx={{
                paddingInline: 0,
              }}
            >
              {isLoading ? (
                <Stack
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 4,
                  }}
                >
                  <CircularProgress />
                </Stack>
              ) : (
                renderTable(userOrdersList[index] || [])
              )}
            </TabPanel>
          ))}
        </Tabs>
      </Box>

      {openReviewModal && (
        <PostReviewModal
          open={openReviewModal}
          onCancel={() => setOpenReviewModal(false)}
          productId={selectedProduct?.id}
        />
      )}
    </>
  );
}

export default OrderPage;
