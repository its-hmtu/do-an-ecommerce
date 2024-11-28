import React, { useContext, useEffect, useState } from "react";
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
import { Link as RLink, useNavigate } from "react-router-dom";
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
import { useGetUserCart, useLogout } from "hooks";
import ConfirmModal from "./Modal/ConfirmModal";
import SearchBox from "./SearchBox";
import { useSearchProducts } from "hooks/product";

function Header() {
  const { user, setUser } = useContext(UserContext);
  const {data: cartData} = useGetUserCart();
  const [openModal, setOpenModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { mutate: logout, isPending } = useLogout();
  const {
    data: searchData,
    isLoading,
    refetch,
  } = useSearchProducts(searchValue);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (searchValue === "") return;
    refetch();
  }, [searchValue, refetch]);

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
              to={PATHS.HOME}
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
                sx={{ color: "Black", ml: 3 }}
              >
                Tablets
              </Link>
              <Link
                component={RLink}
                to={PATHS.ACCESSORIES}
                sx={{ color: "Black", ml: 3 }}
              >
                Accessories
              </Link>
              <Link
                component={RLink}
                to={PATHS.ABOUT_US}
                sx={{ color: "Black", ml: 3 }}
              >
                About Us
              </Link>
            </Box>

            {/* Search Bar and Icons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <SearchBox
                value={searchValue}
                onChange={handleSearchChange}
                searchData={searchData}
                isLoading={isLoading}
              />

              <IconButton>
                <FavoriteBorderIcon />
              </IconButton>
              <IconButton component={RLink} to={PATHS.CART}>
                <Badge badgeContent={
                  cartData?.cart.total_items
                } color="primary" showZero size="sm">
                  <ShoppingCartOutlinedIcon />
                </Badge>
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
                    <MenuItem
                      onClick={() => navigate(PATHS.ACCOUNT_PAGE)}
                    >
                      <ListItemDecorator>
                        <AccountCircleRounded />
                      </ListItemDecorator>
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={() => navigate(PATHS.MY_ORDERS)}
                    >
                      <ListItemDecorator>
                        <Inventory2Rounded />
                      </ListItemDecorator>
                      My Orders
                    </MenuItem>
                    <ListDivider sx={{
                      paddingBottom: 0,
                    }} />
                    <MenuItem
                      // padding="8px"
                      onClick={() => setOpenModal(true)}
                    >
                      <ListItemDecorator color="danger">
                        <LogoutRounded color="danger" />
                      </ListItemDecorator>
                      <Typography color="danger">Sign out</Typography>
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
