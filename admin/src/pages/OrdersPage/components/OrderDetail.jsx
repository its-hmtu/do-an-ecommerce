import {
  AutorenewRounded,
  BlockRounded,
  CheckRounded,
  ChevronRightRounded,
  DownloadRounded,
  LocalShippingRounded,
} from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Link,
  Sheet,
  Stack,
  Table,
  Typography,
} from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { getSingleOrder } from "api/orders.api";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getSingleOrder(id),
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

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
            Order Details
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
          Order Details
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <Button
            color="primary"
            startDecorator={<DownloadRounded />}
            size="sm"
          >
            Export
          </Button>
        </Box>
      </Box>

      <Stack
        direction="row"
        gap={2}
        sx={{
          justifyContent: "space-between",
        }}
      >
        <Stack gap={4}>
          <Sheet
            variant="outlined"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: "24px",
              borderRadius: "md",
              maxWidth: "1280px",
            }}
          >
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Stack direction="column" gap={1}>
                <Stack direction="row" gap={2}>
                  <Typography
                    level="h4"
                    sx={{
                      fontSize: 16,
                    }}
                  >
                    Order ID: {data?.data.id}
                  </Typography>
                  {data?.data.status === "paid" && (
                    <Chip variant="soft" size="md" color="primary">
                      Ready to ship
                    </Chip>
                  )}
                </Stack>
                <Typography
                  level=""
                  sx={{
                    fontSize: 14,
                  }}
                >
                  {new Date(data?.data.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </Typography>
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
                    }[data?.data.status]
                  }
                  color={
                    {
                      paid: "success",
                      pending: "neutral",
                      shipped: "success",
                      delivered: "success",
                      cancelled: "danger",
                    }[data?.data.status]
                  }
                >
                  {
                    // Capitalize the first letter of the status
                    data?.data.status.charAt(0).toUpperCase() +
                      data?.data.status.slice(1)
                  }
                </Chip>
              </Stack>
              <Button size="sm" color="primary" variant="plain">
                Edit Order
              </Button>
            </Stack>
          </Sheet>
          <Sheet
            variant="outlined"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: "24px 32px",
              borderRadius: "md",
              maxWidth: "1280px",
            }}
          >
            <Stack direction="column" gap={2}>
              <Typography level="h4">Order Items</Typography>
              <Table
                // variant="outlined"
                sx={{
                  "--TableCell-paddingY": "16px",
                  "--TableCell-paddingX": "8px",
                  "--TableCell-headBackground":
                    "var(--joy-palette-background-level1)",
                  "--Table-headerUnderlineThickness": "1px",
                }}
              >
                <thead
                  style={{
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <tr>
                    <th>Items name</th>
                    <th>Variation</th>
                    <th>Quantity</th>
                    <th style={{ width: "15%" }}>Price (per unit)</th>
                    <th style={{ width: "15%" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.order_items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <Stack
                          direction="row"
                          gap={4}
                          sx={{
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={`${process.env.REACT_APP_API_URL}${
                              item.product.images.find(
                                (img) => img.id === item.product.main_image_id
                              ).file_path
                            }`}
                            alt={item.product.product_name}
                            width="50"
                            height="50"
                            style={{
                              objectFit: "cover",
                              borderRadius: "md",
                            }}
                          />
                          <Typography
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            {item.product.product_name}
                          </Typography>
                        </Stack>
                      </td>
                      <td>{item.product.product_name}</td>
                      <td>{item.quantity}</td>
                      <td>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.product.base_price)}
                      </td>
                      <td>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.product.base_price)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3}></td>
                    <td>
                      <Typography
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        Subtotal
                      </Typography>
                    </td>
                    <td>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(data?.data.total)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3}></td>
                    <td>
                      <Typography
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        VAT
                      </Typography>
                    </td>
                    <td>8%</td>
                  </tr>
                  <tr>
                    <td colSpan={3}></td>
                    <td>
                      <Typography
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        Total
                      </Typography>
                    </td>
                    <td>
                      <Typography level="h4">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(data?.data.total * 1.08)}
                      </Typography>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Stack>
          </Sheet>
          <Stack direction="row" gap={2} sx={{ justifyContent: "flex-end" }}>
            <Button size="md" color="neutral" variant="plain" onClick={() => navigate('/orders')}>
              Back
            </Button>
            <Button size="md" color="primary" variant="solid">
              Ship Order
            </Button>
          </Stack>
        </Stack>
        <Box>
          <Stack direction="column" gap={2}>
            <Sheet
              variant="outlined"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                padding: "16px",
                borderRadius: "md",
              }}
            >
              <Stack direction="column" gap={1}>
                <Typography level="h4">Customer</Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    Name:{" "}
                  </span>
                  {data?.data.user.first_name} {data?.data.user.last_name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    Email:{" "}
                  </span>
                  {data?.data.user.email}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 14,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    Phone:{" "}
                  </span>
                  {data?.data.user.first_name}
                </Typography>
              </Stack>
            </Sheet>
            <Sheet
              variant="outlined"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                padding: "16px",
                borderRadius: "md",
              }}
            >
              <Stack direction="column" gap={1}>
                <Typography level="h4">Shipping Address</Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                  }}
                >{`${data?.data.address.address}, ${data?.data.address.province}, ${data?.data.address.city}`}</Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    Postal code:{" "}
                  </span>
                  {`${data?.data.address.postal_code}`}
                </Typography>
              </Stack>
            </Sheet>
          </Stack>
        </Box>
      </Stack>
    </>
  );
}

export default OrderDetail;