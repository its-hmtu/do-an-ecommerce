import React from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Step,
  StepIndicator,
  Stepper,
  Typography,
} from "@mui/joy";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCreateOrder } from "hooks";
import { PATHS } from "config";

function PaymentPage() {
  const { state } = useLocation();
  const { mutate: createOrder, isPending, data: orderData } = useCreateOrder();
  const navigate = useNavigate();
  const { cartId, cartItems, subtotal, shippingInfo } = state;

  console.log("payment", state);

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
      <Stepper sx={{ width: "100%" }}>
        <Step
          indicator={
            <StepIndicator variant="solid" color="primary">
              1
            </StepIndicator>
          }
        >
          Information
        </Step>
        <Step
          indicator={
            <StepIndicator variant="solid" color="primary">
              2
            </StepIndicator>
          }
        >
          Checkout
        </Step>
      </Stepper>
      <Stack
        gap={3}
        sx={{
          backgroundColor: "white",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "sm",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            padding: 2,
          }}
        ></Box>
      </Stack>
      <Typography level="h4">Customer Infomation</Typography>
      <Link to={"/checkout"}>Checkout</Link>
      <Button
        variant="solid"
        color="primary"
        sx={{ marginTop: 3 }}
        onClick={() => {
          createOrder(
            {
              subtotal,
              items: cartItems.map((item) => ({
                product_id: item.product.id,
                option_id: item.product.options[0].id,
                quantity: item.quantity,
                unit_price: item.product.options[0].price,
              })),
              address: {
                city: shippingInfo.city.name_with_type,
                district: shippingInfo.district.name_with_type,
                ward: shippingInfo.ward.name_with_type,
                address: shippingInfo.address,
              },
            },
            {
              onSuccess: (orderData) => {
                // console.log("orderData", orderData.order_id);
                navigate("/checkout", {
                  state: {
                    orderId: orderData.order_id,
                    items: cartItems.map((item) => ({
                      product_id: item.product.id,
                      option_id: item.product.options[0].id,
                      product_name: item.product.product_name,
                      color: item.product.options[0].color,
                      quantity: item.quantity,
                      unit_price: item.product.options[0].price,
                    })),
                  },
                });
              },
            }
          );
        }}
      >
        Checkout
      </Button>
    </Stack>
  );
}

export default PaymentPage;
