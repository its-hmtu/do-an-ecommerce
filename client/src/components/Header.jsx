import React, { useContext } from "react";
import {
  Container,
  Box,
  Typography,
  IconButton,
  Sheet,
  Link,
  Button,
  Divider,
} from "@mui/joy";
import { Link as RLink } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { PATHS } from "config";
import { UserContext } from "contexts/UserContext";

function Header() {
  const { user } = useContext(UserContext);
  console.log(user);
  return (
    <Sheet sx={{ width: "100%" }}>
      {/* Top Bar */}
      <Box sx={{ backgroundColor: "#000", color: "#fff", padding: "10px" }}>
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
            }}
          >
            Summer Sale For All Swim Suits And Free Express Delivery – OFF 50%!
            <Link href="#" sx={{ color: "#fff", fontWeight: "bold", ml: 1 }}>
              ShopNow
            </Link>
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
            <Typography sx={{ fontSize: "0.875rem" }}>English</Typography>
            <ArrowDropDownIcon sx={{ fontSize: "1rem", ml: 0.5 }} />
          </Box>
        </Container>
      </Box>

      {/* Main Header */}

      <Box 
        width="100%"
        sx={{
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
          position: "sticky",
          backgroundColor: "#fff",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#fff",
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
          >
            Exclusive
          </Link>

          {/* Navigation Links */}
          {/* <Box sx={{ display: "flex", gap: 3 }}>
          <Link
            href="#"
            underline="none"
            sx={{ color: "Black", position: "relative", ml: 10 }}
          >
            Home
            <Box
              sx={{
                position: "absolute",
                bottom: -2,
                left: 0,
                height: "2px",
                width: "100%",
                backgroundColor: "black",
              }}
            />
          </Link>
          <Link href="#" underline="none" sx={{ color: "Black", ml: 3 }}>
            Contact
          </Link>
          <Link href="#" underline="none" sx={{ color: "Black", ml: 3 }}>
            About
          </Link>
        </Box> */}

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
            {user ? (
              <Button
                variant="outlined"
                sx={{ color: "black", borderColor: "black" }}
                component={RLink}
                to={PATHS.PROFILE}
              >
                Welcome, {user.username}
              </Button>
            ) : (
              <>
                <RLink to={PATHS.LOGIN}>
                  <Typography
                    sx={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "1rem",
                    }}
                  >
                    Sign in
                  </Typography>
                </RLink>
                <Divider orientation="vertical" sx={{
                  margin: "5px 0",
                }}/>
                <RLink to={PATHS.REGISTER}>
                  <Typography
                    sx={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "1rem",
                    }}
                  >
                    Sign up
                  </Typography>
                </RLink>
              </>
            )}
            <IconButton>
              <FavoriteBorderIcon />
            </IconButton>
            <IconButton>
              <ShoppingCartOutlinedIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Sheet>
  );
}

export default Header;
