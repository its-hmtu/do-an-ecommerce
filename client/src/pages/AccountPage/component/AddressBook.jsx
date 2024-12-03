import { AddRounded } from "@mui/icons-material";
import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/joy";
import { UserContext } from "contexts/UserContext";
import React, { useContext } from "react";

function AddressBook() {
  const { user } = useContext(UserContext);

  return (
    <Box
      sx={{
        backgroundColor: "white",
        padding: 4,
        borderRadius: "8px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        // width: "200px",
      }}
    >
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
        <Button startDecorator={<AddRounded />}>Add new address</Button>
      </Stack>
      <Divider />

      {user?.addresses
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
              {address.is_default && <Chip color="primary">Default</Chip>}
            </Box>

            <Stack gap={1}>
              <Button variant="plain" color="primary">
                Update
              </Button>
              {!address.is_default && (
                <Button variant="outlined" color="neutral">
                  Set as default
                </Button>
              )}
            </Stack>
          </Box>
        ))}
    </Box>
  );
}

export default AddressBook;
