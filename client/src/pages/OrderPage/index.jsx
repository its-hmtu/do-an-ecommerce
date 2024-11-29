import {
  Box,
  Divider,
  Sheet,
  Stack,
  Tab,
  tabClasses,
  Table,
  TabList,
  TabPanel,
  Tabs,
  Typography,
} from "@mui/joy";
import { useGetUserOrders } from "hooks";
import React from "react";

const renderTable = (userOrders) => {
  return (<Table 
    variant="outlined"
    stripe="odd"
    sx={{
      backgroundColor: "white",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    }}
  >
    <thead>
      <tr>
        <th>Order ID</th>
        <th style={{
          width: "35%",
        }}>Items</th>
        <th>Quantity</th>
        <th>Total</th>
        <th>Status</th>
      </tr>
    </thead>

    <tbody>
      {userOrders.length > 0 ? (
        userOrders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>
              {order.order_items.map((item) => (
                <Typography key={item.id}>
                  {item.product.product_name} -{" "}
                  {item.product.options[0].color}
                </Typography>
              ))}
            </td>

            <td>
              {order.order_items.map((item) => (
                <Typography key={item.id}>
                  {item.quantity}
                </Typography>
              ))}
            </td>
            <td>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(order.total)}
            </td>
            <td>{order.status}</td>
          </tr>
        ))
      ) : (
        <Typography>No orders</Typography>
      )}
    </tbody>
  </Table>)
}

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
        maxWidth: 1280,
        width: "100%",
        margin: "0 auto",
        paddingBlock: 4,
      }}
    >
      <Box
        sx={{
          width: 720,
          margin: "0 auto",
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
                userOrders.reduce(
                  (acc, order) => acc + parseFloat(order.subtotal),
                  0
                )
              )}
            </Typography>
            <Typography level="subtitle">Total Spent</Typography>
          </Stack>
        </Stack>
      </Box>

      <Sheet
        variant="outlined"
        sx={{
          mt: 4,
          padding: 4,
          backgroundColor: "transparent",
          borderRadius: "sm",
          borderColor: "transparent",
          // width: 1280,
          // margin: "0 auto",
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
              borderRadius: "xl",
              bgcolor: "transparent",
              [`& .${tabClasses.root}[aria-selected="true"]`]: {
                boxShadow: "sm",
                bgcolor: "background.surface",
              },
              justifyContent: "center",
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
              renderTable(userOrders)
            )}
          </TabPanel>
          <TabPanel value={1}>
            {isLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              renderTable(userOrders.filter((order) => order.status === "pending"))
            )}
          </TabPanel>
          <TabPanel value={2}>
            {isLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              renderTable(userOrders.filter((order) => order.status === "shipped"))
            )}
          </TabPanel>
          <TabPanel value={3}>
            {isLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              renderTable(userOrders.filter((order) => order.status === "delivered"))
            )}
          </TabPanel>
          <TabPanel value={4}>
            {isLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              renderTable(userOrders.filter((order) => order.status === "completed"))
            )}
          </TabPanel>
        </Tabs>
      </Sheet>
    </Box>
  );
}

export default OrderPage;
