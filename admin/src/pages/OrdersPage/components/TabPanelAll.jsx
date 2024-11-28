import {
  AutorenewRounded,
  Block,
  CheckRounded,
  ContentPasteSearchRounded,
  LocalShippingRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  iconButtonClasses,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { Pagination } from "antd";
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

function TabPanelAll({ orders, pageSize, handleSetPage, handleSetPageSize }) {
  const navigate = useNavigate();
  return (
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
          {`${orders?.total || 0} ${orders?.total > 1 ? "Orders" : "Order"}`}
        </Typography>
        <Button
          size="sm"
          color="primary"
          variant="solid"
          sx={{
            padding: "8px 16px",
          }}
          startDecorator={<LocalShippingRounded />}
          onClick={() => navigate("/orders/mass-ship")}
        >
          Mass Ship
        </Button>
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
          }}
        >
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
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "#757575",
                    }}
                  >
                    Order ID: {row.id}
                  </Typography>
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
                              Variation: {item.product.options[0].color}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 12,
                                color: "#757575",
                              }}
                            >
                              x{item.quantity}
                            </Typography>
                          </Stack>
                        </Stack>
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
                          cancelled: <Block />,
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
                        row.status.charAt(0).toUpperCase() + row.status.slice(1)
                      }
                    </Chip>
                    {
                      // if the order is paid, show the ready to ship chip
                      row.status === "paid" && (
                        <Chip
                          variant="soft"
                          size="md"
                          startDecorator={<LocalShippingRounded />}
                          color="warning"
                        >
                          Ready to ship
                        </Chip>
                      )
                    }
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
          current={orders?.current_page || 1}
          total={orders?.total_items || 0}
          onChange={(page) => handleSetPage(page)}
          showSizeChanger
          onShowSizeChange={(current, size) => handleSetPageSize(size)}
          defaultPageSize={pageSize}
          // showTotal={(total, range) =>
          //   `${range[0]}-${range[1]} of ${total} items`
          // }
          // hideOnSinglePage
          // itemRender={itemRender}
        />
      </Box>
    </>
  );
}

export default TabPanelAll;
