import {
  CheckRounded,
  HelpOutlineOutlined,
  LocalShippingRounded,
  QuestionMarkOutlined,
  RefreshRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Sheet,
  Stack,
  Tab,
  tabClasses,
  Table,
  TabList,
  TabPanel,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/joy";
import { useGetUserOrders } from "hooks";
import React from "react";

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
        <Typography color="error" startDecorator={<QuestionMarkOutlined />}>
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

const renderButtons = (status) => {
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
          <Button variant="solid" color="primary">
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

                  {renderButtons(order.status)}
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

function OrderPage() {
  const { data, isLoading } = useGetUserOrders();
  const [userOrders, setUserOrders] = React.useState([]);

  React.useEffect(() => {
    if (data) {
      setUserOrders(data);
    }
  }, [data]);

  return (
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
          <Typography level="h4">
            {userOrders.filter((order) => order.status === "completed").length}
          </Typography>
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
              userOrders
                .filter((order) => order.status === "completed")
                .reduce((acc, order) => acc + parseFloat(order.total), 0)
            )}
          </Typography>
          <Tooltip title="Total amount of your completed orders" placement="bottom" variant="outlined" arrow>
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
        <TabPanel
          value={0}
          sx={{
            paddingInline: 0,
          }}
        >
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            renderTable(
              userOrders.filter((order) => order.status === "pending")
            )
          )}
        </TabPanel>
        <TabPanel
          value={1}
          sx={{
            paddingInline: 0,
          }}
        >
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            renderTable(
              userOrders.filter((order) => order.status === "shipped")
            )
          )}
        </TabPanel>
        <TabPanel
          value={2}
          sx={{
            paddingInline: 0,
          }}
        >
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            renderTable(
              userOrders.filter((order) => order.status === "delivered")
            )
          )}
        </TabPanel>
        <TabPanel
          value={3}
          sx={{
            paddingInline: 0,
          }}
        >
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            renderTable(
              userOrders.filter((order) => order.status === "completed")
            )
          )}
        </TabPanel>
        <TabPanel
          value={4}
          sx={{
            paddingInline: 0,
          }}
        >
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            renderTable(
              userOrders.filter((order) => order.status === "cancelled")
            )
          )}
        </TabPanel>
        <TabPanel
          value={5}
          sx={{
            paddingInline: 0,
          }}
        >
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            renderTable(
              userOrders.filter((order) => order.status === "refunded")
            )
          )}
        </TabPanel>
      </Tabs>
    </Box>
  );
}

export default OrderPage;
