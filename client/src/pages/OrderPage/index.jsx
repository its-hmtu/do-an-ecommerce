import {
  Box,
  Divider,
  Sheet,
  Stack,
  Tab,
  tabClasses,
  TabList,
  TabPanel,
  Tabs,
  Typography,
} from "@mui/joy";
import { useGetUserOrders } from "hooks";
import React from "react";

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
        maxWidth: 720,
        width: "100%",
        margin: "0 auto",
        paddingBlock: 4,
      }}
    >
      <Typography level="h3">My Order</Typography>
      <Stack
        direction="row"
        sx={{
          mt: 4,
          padding: 4,
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
          <Typography level="h4">{userOrders.length}</Typography>
          <Typography level="subtitle">Orders</Typography>
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
              userOrders.reduce((acc, order) => acc + parseFloat(order.subtotal), 0)
            )}
          </Typography>
          <Typography level="subtitle">Total Spent</Typography>
        </Stack>
      </Stack>

      <Sheet
        variant="outlined"
        sx={{
          mt: 4,
          padding: 4,
          backgroundColor: "transparent",
          borderRadius: "sm",
          borderColor: "transparent",
        }}
      >
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
            borderRadius: 'xl',
            bgcolor: 'background.level1',
            [`& .${tabClasses.root}[aria-selected="true"]`]: {
              boxShadow: 'sm',
              bgcolor: 'background.surface',
            },
          }}
          >
            <Tab disableIndicator>All</Tab>
            <Tab disableIndicator>Pending</Tab>
            <Tab disableIndicator>Shipping</Tab>
            <Tab disableIndicator>Delivered</Tab>
            <Tab disableIndicator>Completed</Tab>
          </TabList>
          <TabPanel value={0}>
            {isLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              <Stack spacing={4}>
                {
                  userOrders.length > 0 ? (
                    userOrders.map((order) => (
                      <Stack key={order.id} spacing={1}
                        sx={{
                          bgcolor: 'white',
                          p: 2,
                          borderRadius: 'sm',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <Typography level="h5">Order ID: {order.id}</Typography>
                        <Typography level="subtitle">
                          Total:{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(order.total)}
                        </Typography>
                        <Typography level="subtitle">
                          Status: {order.status}
                        </Typography>
                      </Stack>
                    ))
                  ) : (
                    <Typography>No orders</Typography>
                  )
                }
              </Stack>
            )}
          </TabPanel>
          <TabPanel value={1}>
            {isLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              <Stack spacing={4}>
                {userOrders.filter((order) => order.status === "pending")
                  .length > 0 ? (
                  userOrders
                    .filter((order) => order.status === "pending")
                    .map((order) => (
                      <Stack key={order.id} spacing={1}
                        sx={{
                          bgcolor: 'white',
                          p: 2,
                          borderRadius: 'sm',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <Typography level="h5">Order ID: {order.id}</Typography>
                        <Typography level="subtitle">
                          Total:{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(order.total)}
                        </Typography>
                        <Typography level="subtitle">
                          Status: {order.status}
                        </Typography>
                      </Stack>
                    ))
                ) : (
                  <Typography>No pending orders</Typography>
                )}
              </Stack>
            )}
          </TabPanel>
          <TabPanel value={2}>
            {isLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              <Stack spacing={4}>
                {userOrders.filter((order) => order.status === "shipped")
                  .length > 0 ? (
                  userOrders
                    .filter((order) => order.status === "shipped")
                    .map((order) => (
                      <Stack key={order.id} spacing={1}
                        sx={{
                          bgcolor: 'white',
                          p: 2,
                          borderRadius: 'sm',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <Typography level="h5">Order ID: {order.id}</Typography>
                        <Typography level="subtitle">
                          Total:{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(order.total)}
                        </Typography>
                        <Typography level="subtitle">
                          Status: {order.status}
                        </Typography>
                      </Stack>
                    ))
                ) : (
                  <Typography>No shipping orders</Typography>
                )}
              </Stack>
            )}
          </TabPanel>
          <TabPanel value={3}>
            {isLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              <Stack spacing={4}>
                {userOrders.filter((order) => order.status === "delivered")
                  .length > 0 ? (
                  userOrders
                    .filter((order) => order.status === "delivered")
                    .map((order) => (
                      <Stack key={order.id} spacing={1}
                        sx={{
                          bgcolor: 'white',
                          p: 2,
                          borderRadius: 'sm',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <Typography level="h5">Order ID: {order.id}</Typography>
                        <Typography level="subtitle">
                          Total:{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(order.total)}
                        </Typography>
                        <Typography level="subtitle">
                          Status: {order.status}
                        </Typography>
                      </Stack>
                    ))
                ) : (
                  <Typography>No delivered orders</Typography>
                )}
              </Stack>
            )}
          </TabPanel>
          <TabPanel value={4}>
            {isLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              <Stack spacing={4}>
                {userOrders.filter((order) => order.status === "completed")
                  .length > 0 ? (
                  userOrders
                    .filter((order) => order.status === "completed")
                    .map((order) => (
                      <Stack key={order.id} spacing={1}
                        sx={{
                          bgcolor: 'white',
                          p: 2,
                          borderRadius: 'sm',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <Typography level="h5">Order ID: {order.id}</Typography>
                        <Typography level="subtitle">
                          Total:{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(order.total)}
                        </Typography>
                        <Typography level="subtitle">
                          Status: {order.status}
                        </Typography>
                      </Stack>
                    ))
                ) : (
                  <Typography>No completed orders</Typography>
                )}
              </Stack>
            )}
          </TabPanel>
        </Tabs>
      </Sheet>
    </Box>
  );
}

export default OrderPage;
