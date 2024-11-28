import {
  Box,
  Button,
  Checkbox,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/joy";
import React, { useMemo } from "react";
import emptyCartIcon from "assets/images/empty-cart.png";
import { Link as RLink, useNavigate } from "react-router-dom";
import { PATHS } from "config";
import {
  useCreateOrder,
  useGetUserCart,
  useRemoveItemFromCart,
  useUpdateCartSubtotal,
  useUpdateUserCart,
} from "hooks";

function CartPage() {
  const { data, isLoading } = useGetUserCart();
  const [selected, setSelected] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const { mutate: updateUserCart, isPending: isUpdatingUserCart } =
    useUpdateUserCart();
  const { mutate: removeFromCart, isPending: isRemovingFromCart } =
    useRemoveItemFromCart();
  const { mutate: updateCartSubtotal, isPending: isUpdatingCartSubtotal } =
    useUpdateCartSubtotal();

  const navigate = useNavigate();

  React.useEffect(() => {
    if (data?.cart) {
      setCartItems(data?.cart.items);

      const storedSelectedItems = JSON.parse(
        localStorage.getItem("cart_selected")
      );
      if (storedSelectedItems) {
        setSelected(storedSelectedItems);
      }
    }
  }, [data]);

  React.useEffect(() => {
    if (selected.length > 0) {
      localStorage.setItem("cart_selected", JSON.stringify(selected));
    }
  }, [selected]);

  const handleUpdateQuantity = (itemId, quantity) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: quantity,
          };
        }
        return item;
      });
    });

    updateUserCart({
      cart_id: data?.cart.id,
      item_id: itemId,
      quantity: quantity,
    });
  };

  const handleRemoveFromCart = (ids) => {
    removeFromCart(ids);

    setSelected((prevSelected) =>
      prevSelected.filter((id) => !ids.includes(id))
    );

    // Optionally, you can also update the cartItems state to reflect the changes in the cart
    setCartItems((prevItems) =>
      prevItems.filter((item) => !ids.includes(item.id))
    );
  };

  const handleToOrder = (subtotal) => {
    // createOrder(
    //   {
    //     subtotal,
    //     items: selected.map((itemId) => {
    //       const item = cartItems.find((item) => item.id === itemId);
    //       console.log(item)
    //       return {
    //         product_id: item.product.id,
    //         option_id: item.product.options[0].id,
    //         quantity: item.quantity,
    //         cart_id: data.cart.id,
    //         unit_price: item.product.options[0].price,
    //         product_name: item.product.product_name,
    //         color: item.product.options[0].color,
    //         image: item.product.options[0].images[0].file_path,
    //       };
    //     }),
    //   },
    //   {
    //     onSuccess: (orderData) => {
    //       navigate(PATHS.PAYMENT_INFO, { state: { orderData } });
    //     },
    //   }
    // );

    // updateCartSubtotal(subtotal, {
    //   onSuccess: () => {
    //     navigate(PATHS.PAYMENT_INFO);
    //   }
    // });

    navigate(PATHS.PAYMENT_INFO, {
      state: {
        cartId: data.cart.id,
        cartItems: cartItems.filter((item) => selected.includes(item.id)),
        subtotal,
      },
    });
  };

  const subTotal = useMemo(() => {
    return selected.reduce((total, itemId) => {
      const item = cartItems?.find((item) => item.id === itemId);
      if (item) {
        return total + item.quantity * item.product.options[0].price;
      }
      return total;
    }, 0);
  }, [selected, cartItems]);

  const itemsCountToOrder = useMemo(() => {
    return selected.reduce((total, itemId) => {
      const item = cartItems?.find((item) => item.id === itemId);
      return total + item.quantity;
    }, 0);
  }, [selected, cartItems]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          height: "100vh",
        }}
      >
        <LinearProgress />
      </Box>
    );
  }

  if (!data?.cart || data?.cart.items.length === 0) {
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
    <Stack
      sx={{
        maxWidth: 720,
        width: "100%",
        margin: "0 auto",
        paddingTop: 3,
        paddingBottom: 3,
        gap: 2,
      }}
    >
      <Typography level="h3">Your Cart</Typography>

      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack
          direction="row"
          gap={2}
          sx={{
            alignItems: "center",
          }}
        >
          <Checkbox
            label={
              selected.length === data?.cart.items.length
                ? "Deselect all"
                : "Select all"
            }
            indeterminate={
              selected.length > 0 && selected.length !== data?.cart.items.length
            }
            checked={selected.length === data?.cart.items.length}
            onChange={(event) => {
              setSelected(
                event.target.checked
                  ? data?.cart.items.map((item) => item.id)
                  : []
              );
            }}
            color={
              selected.length > 0 || selected.length === data?.cart.items.length
                ? "primary"
                : undefined
            }
            sx={{ verticalAlign: "text-bottom" }}
          />
          <Typography level="body-md">{selected.length} selected</Typography>
        </Stack>

        <Button
          variant="plain"
          color="danger"
          disabled={selected.length === 0}
          onClick={() => handleRemoveFromCart(selected)}
        >
          Remove selected from cart
        </Button>
      </Stack>

      <Stack
        gap={3}
        sx={{
          backgroundColor: "white",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "sm",
        }}
      >
        {cartItems &&
          cartItems.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 2,
                padding: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                {/* Item Checkbox */}
                <Checkbox
                  size="sm"
                  checked={selected.includes(item.id)}
                  color={selected.includes(item.id) ? "primary" : undefined}
                  onChange={(event) => {
                    setSelected((ids) =>
                      event.target.checked
                        ? ids.concat(item.id)
                        : ids.filter((itemId) => itemId !== item.id)
                    );
                  }}
                  slotProps={{
                    checkbox: { sx: { textAlign: "left" } },
                  }}
                  sx={{ verticalAlign: "text-bottom" }}
                />

                <img
                  src={`${process.env.REACT_APP_API_URL}${item.product.options[0].images[0].file_path}`}
                  alt={item.product.product_name}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    marginRight: 2,
                  }}
                />
                <Stack gap={1}>
                  <Typography level="title-md">
                    {item.product.product_name}
                  </Typography>
                  <Typography level="body-sm" color="text.secondary">
                    {item.product.options[0].color}
                  </Typography>
                  <Typography level="title-sm" color="danger">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.product.options[0].price)}
                  </Typography>
                </Stack>
              </Box>
              <Box>
                <Stack
                  gap={1}
                  sx={{
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography level="body-sm">Quantity</Typography>
                  <Stack
                    direction="row"
                    gap={1}
                    sx={{
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Button
                      variant="soft"
                      color="primary"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity === 1}
                    >
                      -
                    </Button>
                    <Typography level="body-md">{item.quantity}</Typography>
                    <Button
                      variant="soft"
                      color="primary"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Box>
          ))}
      </Stack>

      <Stack
        direction="row"
        sx={{
          marginTop: 3,
          justifyContent: "space-between",
        }}
      >
        <Typography level="title-md">
          Subtotal:{" "}
          <Typography level="h4" color="danger">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(subTotal)}
          </Typography>
        </Typography>

        <Button
          variant="solid"
          color="primary"
          disabled={selected.length === 0}
          onClick={() => handleToOrder(subTotal)}
          // loading={}
        >
          Order now {` ${selected.length > 0 ? `(${itemsCountToOrder})` : ""}`}
        </Button>
      </Stack>
    </Stack>
  );
}

export default CartPage;
