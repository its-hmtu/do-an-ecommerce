import { EditNoteRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Input,
  Stack,
  Textarea,
  Tooltip,
  Typography,
} from "@mui/joy";
import { UserContext } from "contexts/UserContext";
import { useChangePassword, useUpdateUser } from "hooks";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

function AccountManage() {
  const { user } = useContext(UserContext);
  const [profileInfo, setProfileInfo] = useState({
    username: user?.username,
    first_name: user?.first_name,
    last_name: user?.last_name,
    email: user?.email,
    phone: user?.phone,
  });
  const [profilePassword, setProfilePassword] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [openEdit, setOpenEdit] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const { mutate: updateProfile, isPending } = useUpdateUser();
  const { mutate: updatePassword, isPending: isPasswordPending} = useChangePassword();
  const oldPasswordRef = useRef()

  useEffect(() => {
    if (user) {
      setProfileInfo({
        username: user?.username,
        first_name: user?.first_name,
        last_name: user?.last_name,
        email: user?.email,
        phone: user?.phone,
      });
    }
  }, [user]);

  useEffect(() => {
    if (openChangePassword) {
      oldPasswordRef.current.focus();
    }
  }, [openChangePassword])
 
  const handleOnChange = (e) => {
    setProfileInfo({
      ...profileInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnChangePassword = (e) => {
    setProfilePassword({
      ...profilePassword,
      [e.target.name]: e.target.value,
    });
  };

  

  return (
    <Box
      sx={{
        flex: 3,
        backgroundColor: "#ffffff",
        padding: 4,
        borderRadius: "8px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Stack
        direction="row"
        gap={1}
        sx={{
          justifyContent: "flex-start",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography level="h5" sx={{ fontWeight: "bold" }}>
          Your Profile
        </Typography>
        {openEdit ? null : (
          <Tooltip
            title="Edit"
            arrow
            variant="outlined"
            color="neutral"
            placement="top"
          >
            <IconButton onClick={() => {}}>
              <EditNoteRounded />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Input
            label="Username"
            placeholder="Username"
            name="username"
            type="text"
            fullWidth
            sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
            value={profileInfo.username}
            disabled={!openEdit || isPending}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            label="First Name"
            placeholder="First Name"
            name="first_name"
            type="text"
            fullWidth
            sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
            value={profileInfo.first_name}
            disabled={!openEdit || isPending}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            label="Last Name"
            placeholder="Last Name"
            name="last_name"
            type="text"
            fullWidth
            sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
            value={profileInfo.last_name}
            disabled={!openEdit || isPending}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            label="Email"
            placeholder="Your Email"
            type="email"
            name="email"
            fullWidth
            sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
            value={profileInfo.email}
            disabled={true}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            label="Phone"
            placeholder="Your Phone"
            name="phone"
            type="tel"
            fullWidth
            sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
            value={profileInfo.phone}
            disabled={!openEdit || isPending}
            onChange={handleOnChange}
          />
        </Grid>

        {openEdit && (
          <Stack
            direction="row"
            gap={2}
            sx={{
              mb: 3,
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => {
                setOpenEdit(false);
                setProfileInfo({
                  username: user?.username,
                  first_name: user?.first_name,
                  last_name: user?.last_name,
                  email: user?.email,
                  phone: user?.phone,
                });
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="primary"
              loading={isPending}
              disabled={
                profileInfo.username === user?.username &&
                profileInfo.first_name === user?.first_name &&
                profileInfo.last_name === user?.last_name &&
                // profileInfo.email === user?.email &&
                profileInfo.phone === user?.phone &&
                !isPending
              }
              onClick={() => {
                updateProfile(profileInfo, {
                  onSuccess: () => {
                    toast.success("Profile updated successfully");
                    setOpenEdit(false);
                  },
                });
              }}
            >
              Save Changes
            </Button>
          </Stack>
        )}
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Stack
        direction="row"
        gap={1}
        sx={{
          justifyContent: "flex-start",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography level="h5" sx={{ fontWeight: "bold" }}>
          Password Changes
        </Typography>
        {openChangePassword ? null : (
          <Tooltip
            title="Edit"
            arrow
            variant="outlined"
            color="neutral"
            placement="top"
          >
            <IconButton onClick={() => {
              setOpenChangePassword(true);
              setOpenEdit(false);
              setProfileInfo({
                username: user?.username,
                first_name: user?.first_name,
                last_name: user?.last_name,
                email: user?.email,
                phone: user?.phone,
              })
            }}>
              <EditNoteRounded />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
      <Box sx={{ mb: 2 }}>
        <Input
          label="Current Password"
          placeholder="Current Password"
          type="password"
          name="old_password"
          fullWidth
          sx={{ mb: 2, backgroundColor: "#f5f5f5", 
            
           }}
          slotProps={{
            input: {
              ref: oldPasswordRef
            }
          }}
          value={profilePassword.old_password}
          onChange={handleOnChangePassword}
          disabled={isPasswordPending || !openChangePassword}
        />
        <Input
          label="New Password"
          placeholder="New Password"
          type="password"
          name="new_password"
          fullWidth
          sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
          value={profilePassword.new_password}
          onChange={handleOnChangePassword}
          disabled={isPasswordPending || !openChangePassword}
        />
        <Input
          label="Confirm New Password"
          placeholder="Confirm New Password"
          type="password"
          name="confirm_password"
          fullWidth
          sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
          value={profilePassword.confirm_password}
          onChange={handleOnChangePassword}
          disabled={isPasswordPending || !openChangePassword}
        />

        {openChangePassword && (
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="plain"
              sx={{ borderColor: "red", borderWidth: 1 }}
              color="neutral"
              onClick={() => {
                setOpenChangePassword(false);
                setProfilePassword({
                  old_password: "",
                  new_password: "",
                  confirm_password: "",
                });
              }}
            >
              Cancel
            </Button>
            <Button variant="solid" color="primary" sx={{ px: 4 }}
              loading={isPasswordPending}
              disabled={
                profilePassword.old_password === "" ||
                profilePassword.new_password === "" ||
                profilePassword.confirm_password === "" ||
                profilePassword.new_password !== profilePassword.confirm_password ||
                !profilePassword.new_password ||
                !profilePassword.confirm_password ||
                isPasswordPending
              }
              onClick={() => {
                updatePassword(profilePassword, {
                  onSuccess: () => {
                    toast.success("Password updated successfully");
                    setOpenChangePassword(false);
                    setProfilePassword({
                      old_password: "",
                      new_password: "",
                      confirm_password: "",
                    });
                  },
                });
              }}
            >
              Save Changes
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default AccountManage;
