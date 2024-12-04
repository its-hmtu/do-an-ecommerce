import {
  Modal,
  ModalDialog,
  ModalClose,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Autocomplete,
  Input,
  Stack,
  Checkbox,
} from "@mui/joy";
import { useUpdateAddress, useCreateAddress, useDeleteAddress } from "hooks";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import citiesData from "utils/cities.json";
import districtsData from "utils/districts.json";
import wardsData from "utils/wards.json";
import ConfirmModal from "./ConfirmModal";

function EditModal({ open, type = "", onCancel, selectedAddress }) {
  const [shippingInfo, setShippingInfo] = React.useState({
    city: null,
    district: null,
    ward: null,
    address: "",
    is_default: false,
  });
  // set districts by city selected
  const [districts, setDistricts] = React.useState([]);
  const [wards, setWards] = React.useState([]);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const { mutate: updateAdrress, isPending } = useUpdateAddress();
  const { mutate: createAddress, isPending: isCreating } = useCreateAddress();
  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddress(); 

  const validate = () => {
    if (type === "update") {
      return (
        // check if ship info changed or not
        (shippingInfo.city?.name_with_type === selectedAddress.city &&
          shippingInfo.district?.name_with_type === selectedAddress.district &&
          shippingInfo.ward?.name_with_type === selectedAddress.ward &&
          shippingInfo.address === selectedAddress.address &&
          shippingInfo.is_default === selectedAddress.is_default) ||
        // check if any field is empty
        !shippingInfo.city ||
        !shippingInfo.district ||
        !shippingInfo.ward ||
        !shippingInfo.address ||
        isPending
      );
    } else if (type === "create") {
      return (
        !shippingInfo.city ||
        !shippingInfo.district ||
        !shippingInfo.ward ||
        !shippingInfo.address ||
        isCreating
      );
    }
  };

  useEffect(() => {
    if (selectedAddress && type === "update") {
      setShippingInfo({
        city: citiesData.find(
          (city) => city.name_with_type === selectedAddress.city
        ),
        district: districtsData.find(
          (district) => district.name_with_type === selectedAddress.district
        ),
        ward: wardsData.find(
          (ward) => ward.name_with_type === selectedAddress.ward
        ),
        address: selectedAddress.address,
        is_default: selectedAddress.is_default,
      });
    }
  }, [selectedAddress, type]);

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

  

  useEffect(() => {
    console.log("selectedAddress", selectedAddress);
    console.log("shippingInfo", shippingInfo);
  }, [selectedAddress, shippingInfo]);

  const renderType = (type) => {
    switch (type) {
      case "update":
        return {
          form: (
            <Stack
              gap={2}
              sx={{
                width: "600px",
                paddingRight: "20px",
                overflowX: "hidden",
              }}
            >
              <FormControl sx={{}}>
                <FormLabel>City/Province</FormLabel>
                <Autocomplete
                  options={citiesData}
                  getOptionLabel={(option) => option.name_with_type}
                  value={shippingInfo.city}
                  onChange={handleCityChange}
                  isOptionEqualToValue={(option, value) =>
                    option.code === value?.code
                  }
                  disabled={isPending}
                />
              </FormControl>
              <FormControl sx={{}}>
                <FormLabel>District</FormLabel>
                <Autocomplete
                  options={districts}
                  getOptionLabel={(option) => option.name_with_type}
                  value={shippingInfo.district}
                  onChange={handleDistrictChange}
                  isOptionEqualToValue={(option, value) =>
                    option.code === value?.code
                  }
                  disabled={!shippingInfo.city || isPending}
                />
              </FormControl>
              <FormControl sx={{}}>
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
                  disabled={!shippingInfo.district || isPending}
                />
              </FormControl>
              <FormControl sx={{}}>
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
                  disabled={isPending}
                />
              </FormControl>
              <FormControl>
                {/* <FormLabel>Set as Default</FormLabel> */}
                <Checkbox
                  disabled={isPending}
                  label="Set as Default"
                  checked={shippingInfo.is_default}
                  onChange={() => {
                    setShippingInfo({
                      ...shippingInfo,
                      is_default: !shippingInfo.is_default,
                    });
                  }}
                />
              </FormControl>
              <FormControl>
                <Button
                  variant="soft"
                  color="danger"
                  onClick={() => {
                    setOpenConfirm(true);
                  }}
                >
                  Delete this address
                </Button>
              </FormControl>
            </Stack>
          ),
          title: "Update Address",
          onClick: () => {
            updateAdrress(
              {
                id: selectedAddress.id,
                data: {
                  city: shippingInfo.city.name_with_type,
                  district: shippingInfo.district.name_with_type,
                  ward: shippingInfo.ward.name_with_type,
                  address: shippingInfo.address,
                  is_default: shippingInfo.is_default,
                },
              },
              {
                onSuccess: () => {
                  onCancel();
                  toast.success("Address updated successfully");
                },
                onError: () => {
                  toast.error("Failed to update address");
                },
              }
            );
          },
        };

      case "create":
        return {
          form: (
            <Stack
              gap={2}
              sx={{
                width: "600px",
                paddingRight: "20px",
                overflowX: "hidden",
              }}
            >
              <FormControl sx={{}}>
                <FormLabel>City/Province</FormLabel>
                <Autocomplete
                  options={citiesData}
                  getOptionLabel={(option) => option.name_with_type}
                  value={shippingInfo.city}
                  onChange={handleCityChange}
                  isOptionEqualToValue={(option, value) =>
                    option.code === value?.code
                  }
                  disabled={isPending || isCreating}
                />
              </FormControl>
              <FormControl sx={{}}>
                <FormLabel>District</FormLabel>
                <Autocomplete
                  options={districts}
                  getOptionLabel={(option) => option.name_with_type}
                  value={shippingInfo.district}
                  onChange={handleDistrictChange}
                  isOptionEqualToValue={(option, value) =>
                    option.code === value?.code
                  }
                  disabled={!shippingInfo.city || isPending || isCreating}
                />
              </FormControl>
              <FormControl sx={{}}>
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
                  disabled={!shippingInfo.district || isPending || isCreating}
                />
              </FormControl>
              <FormControl sx={{}}>
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
                  disabled={isPending || isCreating}
                />
              </FormControl>
              <FormControl>
                {/* <FormLabel>Set as Default</FormLabel> */}
                <Checkbox
                  disabled={isPending || isCreating}
                  label="Set as Default"
                  checked={shippingInfo.is_default}
                  onChange={() => {
                    setShippingInfo({
                      ...shippingInfo,
                      is_default: !shippingInfo.is_default,
                    });
                  }}
                />
              </FormControl>
            </Stack>
          ),
          title: "Create Address",
          onClick: () => {
            createAddress(
              {
                data: {
                  city: shippingInfo.city.name_with_type,
                  district: shippingInfo.district.name_with_type,
                  ward: shippingInfo.ward.name_with_type,
                  address: shippingInfo.address,
                  is_default: shippingInfo.is_default,
                },
              },
              {
                onSuccess: () => {
                  onCancel();
                  toast.success("Address created successfully");
                },
                onError: () => {
                  toast.error("Failed to create address");
                },
              }
            );
          },
        };

      default:
        return {
          form: null,
          title: "",
        };
    }
  };

  return (
    <>
      <Modal open={open} onClose={onCancel}>
        <ModalDialog variant="outlined" role="alertdialog">
          <ModalClose />
          <DialogTitle>{renderType(type)?.title}</DialogTitle>
          <Divider />
          <DialogContent>{renderType(type)?.form}</DialogContent>
          <DialogActions>
            <Button
              variant="solid"
              color="primary"
              onClick={renderType(type)?.onClick}
              loading={isPending || isCreating}
              disabled={validate()}
            >
              Done
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>

      {openConfirm && (
        <ConfirmModal
          open={openConfirm}
          onCancel={() => setOpenConfirm(false)}
          onConfirm={
            () => {
              console.log("selectedAddress", selectedAddress);
              deleteAddress({
                id: selectedAddress.id
              }, {
                onSuccess: () => {
                  onCancel();
                  toast.success("Address deleted successfully");
                },
                onError: () => {
                  toast.error("Failed to delete address");
                }
              })
            }
          }
          color={"danger"}
          title={"Are you sure you want to delete this address?"}
          confirmText={"Delete"}
          cancelText={"Cancel"}
          loading={isDeleting}
          disabled={isDeleting}
        />
      )}
    </>
  );
}

export default EditModal;
