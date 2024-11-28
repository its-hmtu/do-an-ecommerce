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
        >
          <Typography level="title-sm">

          </Typography>
        </Box>
      </Stack>
      <Button
        variant="solid"
        color="primary"
        sx={{ marginTop: 3 }}
        onClick={() => {
          
        }}
      >
        Checkout
      </Button>
    </Stack>
  );
}

export default PaymentPage;
