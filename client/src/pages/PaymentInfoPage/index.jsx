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
import citiesData from "utils/cities.json";
import districtsData from "utils/districts.json";
import wardsData from "utils/wards.json";
import { useCreateOrder } from "hooks";

function PaymentInfoPage() {
  // get state from react-router-dom navigate
  const { state } = useLocation();
  const { cartItems, subtotal, cartId } = state;
  const { user } = useContext(UserContext);
  const { mutate: createOrder, isPending: isCreatingOrder, data: orderData } = useCreateOrder();
  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = React.useState({
    city: null,
    district: null,
    ward: null,
    address: "",
  });
  // set districts by city selected
  const [districts, setDistricts] = React.useState([]);
  const [wards, setWards] = React.useState([]);

  const handleCityChange = (event, value) => {
    setShippingInfo((prevState) => ({
      ...prevState,
      city: value,
      district: null,
      ward: null,
    }));

    if (value) {
      const selectedCity = citiesData.find((city) => city.name === value.name);
      if (selectedCity) {
        const filteredDistricts = districtsData.filter(
          (district) => district.parent_code === selectedCity.code
        );
        setDistricts(filteredDistricts);
      } else {
        setDistricts([]);
      }
    } else {
      setDistricts([]);
    }
  };

  const handleDistrictChange = (event, value) => {
    setShippingInfo((prevState) => ({
      ...prevState,
      district: value,
      ward: null,
    }));

    if (value) {
      const selectedDistrict = districtsData.find(
        (district) => district.name === value.name
      );
      if (selectedDistrict) {
        const filteredWards = wardsData.filter(
          (ward) => ward.parent_code === selectedDistrict.code
        );
        setWards(filteredWards);
      } else {
        setWards([]);
      }
    } else {
      setWards([]);
    }
  };

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
        {cartItems &&
          cartItems?.map((item) => (
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
              <FormControl
                sx={{
                  width: { xs: "100%", md: "calc(50% - 8px)" },
                }}
              >
                <FormLabel>City/Province</FormLabel>
                <Autocomplete
                  options={citiesData}
                  getOptionLabel={(option) => option.name_with_type}
                  value={shippingInfo.city}
                  onChange={handleCityChange}
                  isOptionEqualToValue={(option, value) =>
                    option.code === value?.code
                  }
                />
              </FormControl>
              <FormControl
                sx={{
                  width: { xs: "100%", md: "calc(50% - 8px)" },
                }}
              >
                <FormLabel>District</FormLabel>
                <Autocomplete
                  options={districts}
                  getOptionLabel={(option) => option.name_with_type}
                  value={shippingInfo.district}
                  onChange={handleDistrictChange}
                  isOptionEqualToValue={(option, value) =>
                    option.code === value?.code
                  }
                  disabled={!shippingInfo.city}
                />
              </FormControl>
              <FormControl
                sx={{
                  width: { xs: "100%", md: "calc(50% - 8px)" },
                }}
              >
                <FormLabel>Ward</FormLabel>
                <Autocomplete
                  options={wards}
                  getOptionLabel={(option) => option.name_with_type}
                  value={shippingInfo.ward}
                  onChange={(event, value) =>
                    setShippingInfo((prevState) => ({
                      ...prevState,
                      ward: value,
                    }))
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.code === value?.code
                  }
                  disabled={!shippingInfo.district}
                />
              </FormControl>
              <FormControl
                sx={{
                  width: { xs: "100%", md: "calc(50% - 8px)" },
                }}
              >
                <FormLabel>Address</FormLabel>
                <Input
                  variant="outlined"
                  required
                  id="address"
                  type="text"
                  placeholder="Enter address"
                  value={shippingInfo.address}
                  onChange={(e) => {
                    setShippingInfo({
                      ...shippingInfo,
                      address: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Stack>
          </Stack>
        </Box>
      </Stack>

      <Button
        variant="solid"
        color="primary"
        sx={{ marginTop: 3 }}
        disabled={isCreatingOrder}
        loading={isCreatingOrder}
        onClick={() => {
          navigate(PATHS.PAYMENT, {
            state: {
              cartItems,
              subtotal,
              cartId,
              shippingInfo,
            },
          })
        }}
      >
        Continue
      </Button>
    </Stack>
  );
}

export default PaymentInfoPage;
