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
import { PATHS } from "config";
import { UserContext } from "contexts/UserContext";
import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PaymentInfoPage() {
  // get state from react-router-dom navigate
  const { state } = useLocation();
  const { orderData } = state;
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  console.log(state);
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
        <Step indicator={<StepIndicator variant="outlined">2</StepIndicator>}>
          Checkout
        </Step>
      </Stepper>
      <Typography level="h4">Product Infomation</Typography>
      <Stack
        gap={3}
        sx={{
          backgroundColor: "white",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "sm",
        }}
      >
        {orderData?.items &&
          orderData?.items.map((item) => (
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
                <img
                  src={`${process.env.REACT_APP_API_URL}${item.image}`}
                  alt={item.product_name}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    marginRight: 2,
                  }}
                />
                <Stack gap={1}>
                  <Typography level="title-md">{item.product_name}</Typography>
                  <Typography level="body-sm" color="text.secondary">
                    {item.color}
                  </Typography>
                  <Typography level="title-sm" color="danger">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.unit_price)}
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
                  <Typography level="body-sm">
                    Quantity:{" "}
                    <Typography level="title-md">{item.quantity}</Typography>
                  </Typography>
                </Stack>
              </Box>
            </Box>
          ))}
      </Stack>
      <Typography level="h4">Customer Infomation</Typography>
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
          <Stack
            gap={1}
            sx={{
              width: "100%",
              // gap: 2,
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              sx={{
                justifyContent: "space-between",
              }}
              gap={2}
            >
              <Typography level="title-md">
                {user?.first_name} {user?.last_name}
              </Typography>
              <Typography level="title-md">Phone: {user?.phone}</Typography>
            </Stack>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                value={user?.email}
                disabled
                variant="outlined"
                fullWidth
              />
              <Typography
                level="body-xs"
                sx={{
                  fontStyle: "italic",
                  marginTop: 1,
                }}
              >
                (*) VAT invoice will be sent to this email
              </Typography>
            </FormControl>
          </Stack>
        </Box>
      </Stack>
      <Typography level="h4">Shipping Infomation</Typography>
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
          <Stack
            gap={1}
            sx={{
              width: "100%",
              // gap: 2,
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              sx={{
                flexWrap: "wrap",
                width: "100%",
              }}
              gap={2}
            >
              <FormControl sx={{
                width: { xs: "100%", md: "calc(50% - 8px)" },
              }}>
                <FormLabel>City</FormLabel>
                <Autocomplete
                  options={["Hanoi", "Ho Chi Minh City", "Da Nang"]}
                  fullWidth
                  required
                  id="city"
                  type="text"
                  placeholder="Select city"
                />
              </FormControl>
              <FormControl sx={{
                width: { xs: "100%", md: "calc(50% - 8px)" },
              }}>
                <FormLabel>District</FormLabel>
                <Autocomplete
                  options={[
                    "Ba Dinh",
                    "Cau Giay",
                    "Dong Da",
                    "Hai Ba Trung",
                    "Hoan Kiem",
                    "Tay Ho",
                  ]}
                  fullWidth
                  required
                  id="district"
                  type="text"
                  placeholder="Select district"
                />
              </FormControl>
            </Stack>
            <FormControl>
              <FormLabel>Address</FormLabel>
              <Input variant="outlined" fullWidth required id="address" type="text" placeholder="Enter address" />
            </FormControl>
          </Stack>
        </Box>
      </Stack>

      <Button
        variant="solid"
        color="primary"
        sx={{ marginTop: 3 }}
        onClick={() => navigate(PATHS.PAYMENT, { state: state })}
      >
        Continue
      </Button>
    </Stack>
  );
}

export default PaymentInfoPage;
