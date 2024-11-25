import React, { useContext, useState } from "react";
import {
  Container,
  Box,
  Typography,
  IconButton,
  Sheet,
  Link,
  Button,
  Divider,
  Avatar,
  Dropdown,
  MenuButton,
  Menu,
  MenuItem,
  ListDivider,
  ListItemDecorator,
  Badge,
  Tooltip,
} from "@mui/joy";
import { Link as RLink } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { PATHS } from "config";
import { UserContext } from "contexts/UserContext";
import {
  AccountCircleRounded,
  ArrowDropDownRounded,
  Inventory2Rounded,
  LogoutRounded,
  ProductionQuantityLimitsRounded,
} from "@mui/icons-material";
import { useLogout } from "hooks";
import ConfirmModal from "./Modal/ConfirmModal";

function Header() {
  const { user, setUser } = useContext(UserContext);
  const [openModal, setOpenModal] = useState(false);
  const { mutate: logout, isPending } = useLogout();
  return (
    <>
      <Box
        sx={{
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        {/* Top Bar */}

        <Box
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            color: "#fff",
            padding: "10px",
            backdropFilter: "blur(10px)",
          }}
        >
          <Container
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                ml: 40,
                color: "#f5f5f7",
              }}
            >
              Summer Sale For All Products And Free Express Delivery – OFF 50%!
              <Link href="#" sx={{ color: "#fff", fontWeight: "bold", ml: 1 }}>
                Shop Now
              </Link>
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
              <Typography sx={{ fontSize: "0.875rem", color: "#f5f5f7" }}>
                English
              </Typography>
              <ArrowDropDownIcon sx={{ fontSize: "1rem", ml: 0.5 }} />
            </Box>
          </Container>
        </Box>

        {/* Main Header */}
        <Box
          width="100%"
          sx={{
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            backgroundColor: "rgba(255, 255, 255, .85)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Box
            sx={{
              backgroundColor: "transparent",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2,
              paddingTop: "20px",
              margin: "0 auto",
              maxWidth: 1280,
              width: "100%",
            }}
          >
            {/* Logo */}
            <Link
              variant="h3"
              sx={{
                fontWeight: "bold",
                color: "Black",
                fontSize: "1.5rem",
              }}
              component={RLink}
              to="/"
            >
              Exclusive
            </Link>

            {/* Navigation Links */}
            <Box sx={{ display: "flex", gap: 3 }}>
              <Link
                component={RLink}
                to={PATHS.MOBILE}
                sx={{ color: "Black", position: "relative", ml: 10 }}
              >
                Mobile Phones
              </Link>
              <Link
                component={RLink}
                to={PATHS.TABLET}
                sx={{ color: "Black", ml: 3 }}>
                Tablets
              </Link>
              <Link 
                component={RLink}
                to={PATHS.ACCESSORIES}
                sx={{ color: "Black", ml: 3 }}>
                Accessories
              </Link>
              <Link 
                component={RLink}
                to={PATHS.ABOUT_US}
              sx={{ color: "Black", ml: 3 }}>
                About Us
              </Link>
            </Box>

            {/* Search Bar and Icons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "4px",
                  padding: "0 8px",
                  height: "36px",
                }}
              >
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  style={{
                    border: "none",
                    outline: "none",
                    backgroundColor: "transparent",
                    padding: "0 5px",
                    fontSize: "14px",
                    flexGrow: 1,
                    width: "180px",
                  }}
                />
                <SearchIcon style={{ color: "#888" }} />
              </Box>

              <IconButton>
                <FavoriteBorderIcon />
              </IconButton>
              <IconButton>
                <Tooltip
                  arrow
                  variant="outlined"
                  title={
                    <Box
                      sx={{
                        width: "200px",
                        height: "100px",
                        padding: "10px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ProductionQuantityLimitsRounded />
                      <Typography level="body-sm">
                        Your cart is empty
                      </Typography>
                    </Box>
                  }
                >
                  <Badge badgeContent={0} color="primary" showZero size="sm">
                    <ShoppingCartOutlinedIcon />
                  </Badge>
                </Tooltip>
              </IconButton>

              {user ? (
                <Dropdown>
                  <MenuButton
                    variant="plain"
                    sx={{ padding: "8px" }}
                    endDecorator={<ArrowDropDownRounded />}
                  >
                    <Avatar
                      variant="soft"
                      sx={{ marginRight: "10px" }}
                      size="sm"
                    />
                    {user?.username}
                  </MenuButton>
                  <Menu
                    placement="bottom-end"
                    sx={{
                      maxWidth: "200px",
                      width: "100%",
                    }}
                  >
                    <MenuItem>
                      <ListItemDecorator>
                        <AccountCircleRounded />
                      </ListItemDecorator>
                      Profile
                    </MenuItem>
                    <MenuItem>
                      <ListItemDecorator>
                        <Inventory2Rounded />
                      </ListItemDecorator>
                      My Orders
                    </MenuItem>
                    <ListDivider />
                    <MenuItem
                      variant="soft"
                      color="danger"
                      padding="8px"
                      onClick={() => setOpenModal(true)}
                    >
                      <ListItemDecorator color="danger">
                        <LogoutRounded />
                      </ListItemDecorator>
                      Logout
                    </MenuItem>
                  </Menu>
                </Dropdown>
              ) : (
                <>
                  <Button
                    variant="soft"
                    color="neutral"
                    to={PATHS.LOGIN}
                    component={RLink}
                  >
                    <Typography
                      sx={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "1rem",
                      }}
                    >
                      Sign in
                    </Typography>
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Box>
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
          }}
        />
      )}
    </>
  );
}

export default Header;
