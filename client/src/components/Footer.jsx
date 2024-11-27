import React from "react";
import {
  Container,
  Box,
  Typography,
  Link,
  Input,
  IconButton,
  Divider,
  Stack,
} from "@mui/joy";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import qrCode from "assets/images/qrcode.png";
import appleIcon from "assets/images/appstore.png";
import googlePlay from "assets/images/googleplay.png";
// import GoogleIcon from "@mui/icons-material/Google";
// import AppleIcon from "@mui/icons-material/Apple";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#000",
        color: "#fff",
        py: 6,
      }}
       as="footer"
    >
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            rowGap: 4,
            columnGap: 6,
          }}
        >
          {/* Subscription Section */}
          <Box>
            <Typography
              level="h4"
              sx={{ mb: 2, fontWeight: "bold", letterSpacing: "2px", color: "white" }}
            >
              Exclusive
            </Typography>
            <Typography sx={{ mb: 2, fontWeight: "600", letterSpacing: "1px",  color: "white"  }}>
              Subscribe
            </Typography>
            <Typography sx={{ mb: 2,  color: "white"  }}>Get 10% off your first order</Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #fff",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <Input
                placeholder="Enter your email"
                sx={{
                  backgroundColor: "transparent",
                  color: "white" ,
                  border: "none",
                  flexGrow: 1,
                  px: 2,
                }}
              />
              <IconButton
                sx={{
                  color: "#fff",
                  borderRadius: "0 4px 4px 0",
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Support Section */}
          <Box>
            <Typography
              level="h5"  
              sx={{ mb: 2, fontWeight: "600", letterSpacing: "1px" }}
            >
              Support
            </Typography>
            <Typography sx = {{ color: "white" }}>111 Bijoy Sarani, Dhaka,</Typography>
            <Typography sx = {{ color: "white" }}>DH 1515, Bangladesh.</Typography>
            <Typography sx={{ my: 1,  color: "white"  }}>exclusive@gmail.com</Typography>
            <Typography sx = {{ color: "white" }}>+88015-88888-9999</Typography>
          </Box>

          {/* Account Section */}
          <Box>
            <Typography
              level="h5"
              sx={{ mb: 2, fontWeight: "600", letterSpacing: "1px" }}
            >
              Account
            </Typography>
            <Link href="#" sx={{ color: "#fff", display: "block", mb: 1 }}>
              My Account
            </Link>
            <Link href="#" sx={{ color: "#fff", display: "block", mb: 1 }}>
              Login / Register
            </Link>
            <Link href="#" sx={{ color: "#fff", display: "block", mb: 1 }}>
              Cart
            </Link>
            <Link href="#" sx={{ color: "#fff", display: "block", mb: 1 }}>
              Wishlist
            </Link>
            <Link href="#" sx={{ color: "#fff", display: "block", mb: 1 }}>
              Shop
            </Link>
          </Box>

          {/* Quick Link Section */}
          <Box>
            <Typography
              level="h5"
              sx={{ mb: 2, fontWeight: "600", letterSpacing: "1px" }}
            >
              Quick Link
            </Typography>
            <Link href="#" sx={{ color: "#fff", display: "block", mb: 1 }}>
              Privacy Policy
            </Link>
            <Link href="#" sx={{ color: "#fff", display: "block", mb: 1 }}>
              Terms Of Use
            </Link>
            <Link href="#" sx={{ color: "#fff", display: "block", mb: 1 }}>
              FAQ
            </Link>
            <Link href="#" sx={{ color: "#fff", display: "block", mb: 1 }}>
              Contact
            </Link>
          </Box>

          {/* Download App Section */}
          <Box>
            <Typography
              level="h5"
              sx={{ mb: 2, fontWeight: "600", letterSpacing: "1px" }}
            >
              Download App
            </Typography>
            <Typography sx={{ mb: 2, fontSize: "12px",  color: "white"  }}>
              Save $3 with App New User Only
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <img src={qrCode} style={{ width: "100px", height: "100px" }} />
              <Stack direction="column" spacing={1} sx={{ mb: 2 }}>
                <img
                  src={appleIcon}
                  sx={{ width: "120px", cursor: "pointer" }}
                />
                <img
                  src={googlePlay}
                  sx={{ width: "120px", cursor: "pointer" }}
                />
              </Stack>
            </Box>
            <Stack direction="row" spacing={2}>
              <FacebookIcon sx={{ fontSize: 32, color: "#fff" }} />
              <TwitterIcon sx={{ fontSize: 32, color: "#fff" }} />
              <InstagramIcon sx={{ fontSize: 32, color: "#fff" }} />
              <LinkedInIcon sx={{ fontSize: 32, color: "#fff" }} />
            </Stack>
          </Box>
        </Box>
        <Divider sx={{ my: 4, borderColor: "#444" }} />
        <Typography
          level="body3"
          textAlign="center"
          sx={{
            color: "grey",
            fontSize: "16px",
            lineHeight: "24px",
            weight: "400",
          }}
        >
          © Copyright Rimel 2022. All rights reserved
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
