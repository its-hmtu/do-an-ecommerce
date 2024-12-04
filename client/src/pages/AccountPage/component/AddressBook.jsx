import { AddRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/joy";
import ConfirmModal from "components/Modal/ConfirmModal";
import EditModal from "components/Modal/EditModal";
import LoadingModal from "components/Modal/LoadingModal";
import { UserContext } from "contexts/UserContext";
import { useSetDefaultAddress } from "hooks";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";

function AddressBook() {
  const { user, isLoading } = useContext(UserContext);
  const { mutate: setDefault, isPending } = useSetDefaultAddress();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [type, setType] = useState("update");
  const handleSetDefault = () => {
    setDefault(selectedAddress.id, {
      onSuccess: () => {
        setSelectedAddress(null);
        toast.success("Set default address successfully");
      },
      onError: () => {
        toast.error("Set default address failed");
      },
    });
    setOpenConfirm(false);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "white",
          padding: 4,
          borderRadius: "8px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          // width: "200px",
        }}
      >
        {isLoading ? (
          <Stack sx={{
            justifyContent: "center",
            alignItems: "center",
            padding: 4
          }}>
            <CircularProgress />
          </Stack>
        ) : (
          <>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography level="h5" sx={{ fontWeight: "bold" }}>
                My addresses book
              </Typography>
              <Button
                startDecorator={<AddRounded />}
                onClick={() => {
                  setSelectedAddress(null);
                  setType("create");
                  setOpenUpdate(true);
                }}
              >
                Add new address
              </Button>
            </Stack>
            <Divider />
            {user?.addresses.length === 0 ? (
              <Stack
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 4,
                  mt: 2,
                }}
              >
                <Typography level="title-sm">
                  You don't have any address yet
                </Typography>
              </Stack>
            ) : (
              user?.addresses
                .sort((a, b) =>
                  a.is_default === b.is_default ? 0 : a.is_default ? -1 : 1
                )
                .map((address, index) => (
                  <Box
                    key={index}
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      "& + &": {
                        mt: 2,
                        pt: 2,
                        borderTop: "1px solid rgba(99 107 116 / 0.2)",
                      },
                    }}
                  >
                    <Box>
                      <Typography>{address.address}</Typography>
                      <Typography>
                        {address.ward}, {address.district}, {address.city}
                      </Typography>
                      {address.is_default && (
                        <Chip color="primary">Default</Chip>
                      )}
                    </Box>

                    <Stack gap={1}>
                      <Button
                        variant="plain"
                        color="primary"
                        onClick={() => {
                          setSelectedAddress(address);
                          setType("update");
                          setOpenUpdate(true);
                        }}
                      >
                        Update
                      </Button>
                      {!address.is_default && (
                        <Button
                          variant="outlined"
                          color="neutral"
                          onClick={() => {
                            setSelectedAddress(address);
                            setOpenConfirm(true);
                          }}
                          disabled={isPending}
                        >
                          Set as default
                        </Button>
                      )}
                    </Stack>
                  </Box>
                ))
            )}
          </>
        )}
      </Box>

      {openConfirm && (
        <ConfirmModal
          open={openConfirm}
          color="primary"
          title={"Are you sure you want to set this address as default?"}
          cancelText={"Cancel"}
          confirmText={"Set as default"}
          onCancel={() => {
            setSelectedAddress(null);
            setOpenConfirm(false);
          }}
          onConfirm={handleSetDefault}
        />
      )}

      {isPending && (
        <LoadingModal open={isPending} title="Setting default address..." />
      )}

      {openUpdate && (
        <EditModal
          open={openUpdate}
          type={type}
          onCancel={() => {
            setSelectedAddress(null);
            setOpenUpdate(false);
          }}
          selectedAddress={selectedAddress}
        />
      )}
    </>
  );
}

export default AddressBook;
