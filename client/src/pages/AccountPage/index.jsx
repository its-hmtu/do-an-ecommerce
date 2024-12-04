import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Textarea,
  Button,
  Divider,
  Grid,
  Link,
  Stack,
} from "@mui/joy";
import {
  Outlet,
  Link as RLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { PATHS } from "config";
import { Tabs, TabList, TabPanel, Tab } from "@mui/joy";
import AccountManage from "./component/AccountManage";
import OrderPage from "pages/OrderPage";
import { useLogout } from "hooks";
import ConfirmModal from "components/Modal/ConfirmModal";
import { UserContext } from "contexts/UserContext";
import { LogoutRounded } from "@mui/icons-material";
import AddressBook from "./component/AddressBook";

function AccountPage() {
  const { mutate: logout, isPending } = useLogout();
  const [openModal, setOpenModal] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const key = searchParams.get("tab");

  useEffect(() => {
    if (!key) {
      setSearchParams({ tab: "my-profile" });
    }
  }, [key, setSearchParams]);

  return (
    <>
      <Box sx={{ width: 1280, margin: "0 auto", paddingBlock: 4 }}>
        <Tabs
          defaultValue={key ? key : "my-profile"}
          orientation="vertical"
          sx={{
            backgroundColor: "transparent",
          }}
          onChange={(e, value) => {
            setSearchParams({ tab: value });
          }}
        >
          <Stack
            sx={{
              // backgroundColor: "#fff",
              // padding: 3,
              // borderRadius: "8px",
              // boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              width: "250px",
            }}
          >
            <Typography level="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Manage Account
            </Typography>
            <TabList disableUnderline>
              <Tab
                value={"my-profile"}
                sx={{
                  maxWidth: 200,
                }}
              >
                My profile
              </Tab>
              <Tab
                value={"my-addresses"}
                sx={{
                  maxWidth: 200,
                }}
              >
                My addresses
              </Tab>
              <Tab
                value={"my-orders"}
                sx={{
                  maxWidth: 200,
                }}
              >
                My orders
              </Tab>
            </TabList>

            <Box
              sx={{
                width: "200px",
              }}
            >
              <Divider sx={{ my: 2 }} />
              <Button
                variant="plain"
                color="danger"
                onClick={() => setOpenModal(true)}
                disabled={isPending}
                startDecorator={<LogoutRounded />}
                sx={{
                  textAlign: "left",
                  width: "100%",
                  justifyContent: "flex-start",
                }}
              >
                Sign out
              </Button>
            </Box>
          </Stack>

          <TabPanel
            value={"my-profile"}
            sx={{
              padding: 0,
              maxWidth: 1012,
            }}
          >
            <AccountManage />
          </TabPanel>

          <TabPanel
            value={"my-addresses"}
            sx={{
              padding: 0,
              maxWidth: 1012,
            }}
          >
            <AddressBook />
          </TabPanel>

          <TabPanel
            value={"my-orders"}
            sx={{
              padding: 0,
              maxWidth: 1012,
            }}
          >
            <OrderPage />
          </TabPanel>
        </Tabs>
      </Box>
      {openModal && (
        <ConfirmModal
          open={openModal}
          title="Are you sure you want to sign out?"
          confirmText={isPending ? "Signing out..." : "Sign out"}
          cancelText="Cancel"
          color="danger"
          onCancel={() => setOpenModal(false)}
          onConfirm={() => {
            logout();
            setUser(null);
            setOpenModal(false);
            navigate(PATHS.HOME, { replace: true });
          }}
          loading={isPending}
          disabled={isPending}
        />
      )}
    </>
  );
}

export default AccountPage;
