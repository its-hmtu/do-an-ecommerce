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
import { useLocation } from "react-router-dom";
function PaymentPage() {
  const { state } = useLocation();

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
          
        </Box>
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
        ></Box>
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
              <FormControl
                sx={{
                  width: { xs: "100%", md: "calc(50% - 8px)" },
                }}
              >
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
              <FormControl
                sx={{
                  width: { xs: "100%", md: "calc(50% - 8px)" },
                }}
              >
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
              <Input
                variant="outlined"
                fullWidth
                required
                id="address"
                type="text"
                placeholder="Enter address"
              />
            </FormControl>
          </Stack>
        </Box>
      </Stack>

      <Button variant="solid" color="primary" sx={{ marginTop: 3 }}>
        Continue
      </Button>
    </Stack>
  );
}

export default PaymentPage;
