import { Box, Button, LinearProgress, Stack, Typography } from "@mui/joy";
import React from "react";
import emptyCartIcon from "assets/images/empty-cart.png";
import { Link as RLink } from "react-router-dom";
import { PATHS } from "config";
import { useGetUserCart } from "hooks";
import { ShoppingBagRounded } from "@mui/icons-material";

function CartPage() {
  const { data, isLoading } = useGetUserCart();
  if (isLoading) {
    return (
      <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        height: "100vh",
        // maxWidth: 1280,
      }}
    >
      <LinearProgress />
    </Box>
    )
  }

  if (!data?.cart) {
    return (
      <Box
        sx={{
          maxWidth: 1280,
          width: "100%",
          margin: "0 auto",
          paddingTop: 3,
          paddingBottom: 3,
        }}
      >
        <Stack
          sx={{
            justifyContent: "center",
            alignItems: "center",
            marginBlock: 3,
          }}
          gap={3}
        >
          <img
            src={emptyCartIcon}
            alt="Empty cart"
            style={{
              width: "200px",
            }}
          />
          <Typography level="h4">Your cart is empty</Typography>
          <Typography level="body-lg">
            Looks like you haven't added anything to your cart yet.
          </Typography>

          <Button
            variant="outlined"
            color="primary"
            component={RLink}
            to={PATHS.HOME}
          >
            Continue shopping
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 1280,
        width: "100%",
        margin: "0 auto",
        paddingTop: 3,
        paddingBottom: 3,
      }}
    >
      <Typography level="h3" startDecorator={<ShoppingBagRounded />}>
        Your Cart
      </Typography>
      <Stack gap={3} sx={{
        backgroundColor: "white",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}>
        {data?.cart.items.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                // src={item.product.image}
                alt={item.product.product_name}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  marginRight: 2,
                }}
              />
              <Box>
                <Typography level="body-md">{item.product.product_name}</Typography>
                <Typography level="body-sm" color="text.secondary">
                  {item.product.options[0].price}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography level="body-md">Qty: {item.quantity}</Typography>
            </Box>

          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export default CartPage;
