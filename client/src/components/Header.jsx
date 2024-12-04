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
import { useGetUserCart, useLogout } from "hooks";
import ConfirmModal from "./Modal/ConfirmModal";
import SearchBox from "./SearchBox";
import { useSearchProducts } from "hooks/product";
import LoginModal from "./Modal/LoginModal";

function Header() {
  const { user, setUser } = useContext(UserContext);
  const [openLoginModal, setOpenLoginModal] = useState(false)
  const { data: cartData } = useGetUserCart();
  const [searchValue, setSearchValue] = useState("");
  const {
    data: searchData,
    isLoading,
    refetch,
  } = useSearchProducts(searchValue);
  const navigate = useNavigate()

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };


  useEffect(() => {
    if (searchValue === "") return;
    refetch();
  }, [searchValue, refetch]);

  const handleMustLogin = (to) => {
    if (user) {
      navigate(to)
    } else {
      setOpenLoginModal(true)
    }
  }

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

              <IconButton 
                onClick={() => handleMustLogin(PATHS.FAVORITES)}
              >
                <FavoriteBorderIcon />
              </IconButton>
              <IconButton 
                onClick={() => handleMustLogin(PATHS.CART)}
              >
                <Badge
                  badgeContent={cartData?.cart.total_items}
                  color="primary"
                  showZero
                  size="sm"
                >
                  <ShoppingCartOutlinedIcon />
                </Badge>
              </IconButton>

              {user ? (
                // <Button variant="plain" color="primary" size="sm"
                //   onClick={() => navigate(PATHS.ACCOUNT_PAGE)}
                // >

                // </Button>
                <Link component={RLink} to={PATHS.ACCOUNT_PAGE}>
                  <Avatar
                    variant="soft"
                    sx={{ marginRight: "10px" }}
                    size="sm"
                  />
                </Link>
              ) : (
                <>
                  <Button
                    variant="soft"
                    color="neutral"
                    to={PATHS.LOGIN}
                    component={RLink}
                    size="sm"
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

      {
        openLoginModal && (
          <LoginModal
           open={openLoginModal}
           onCancel={() => setOpenLoginModal(false)}
          />
        )
      }
    </>
  );
}

export default Header;
