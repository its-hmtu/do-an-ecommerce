import { ChevronRightRounded } from "@mui/icons-material";
import { Box, Stack, Link, Typography, Sheet, Button } from "@mui/joy";
import { PATHS } from "config";
import React from "react";
import { NavLink } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import slickImg from "assets/images/slick-img.png";
import { brands } from "config/constants";
import ProductCard from "components/ProductCard";
import { useProducts } from "hooks/product";

const categories = [
  {
    label: "Mobile phones",
    to: PATHS.MOBILE,
  },
  {
    label: "Tablet",
    to: PATHS.TABLET,
  },
  {
    label: "Laptop",
    to: PATHS.LAPTOP,
  },
  {
    label: "Desktop",
    to: PATHS.DESKTOP,
  },
  {
    label: "Accessories",
    to: PATHS.ACCESSORIES,
  },
];

const settings = {
  dots: true,
  infinite: true,
  arrows: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

function HomePage() {
  const {data, isLoading} = useProducts();

  return (
    <Box
      sx={{
        maxWidth: 1280,
        width: "100%",
        margin: "0 auto",
        paddingBottom: 3,
      }}
    >
      
        <div className="slider-container">
          <Slider {...settings}>
            <div>
              <img src={slickImg} alt="slider" />
            </div>
            <div>
              <img src={slickImg} alt="slider" />
            </div>
            <div>
              <img src={slickImg} alt="slider" />
            </div>
          </Slider>
        </div>
        

      <Stack
        direction="row"
        gap={"15px"}
        sx={{
          justifyContent: "flex-start",
          flexWrap: "wrap",
          marginTop: "50px",
        }}
      >
        {brands.map((brand) => (
          <Button
            variant="outlined"
            key={brand.name}
            color="neutral"
            sx={{
              backgroundColor: "#fff",
              "&:hover": {
                backgroundColor: "#fff",
              },
            }}
          >
            <img
              src={brand.image}
              alt={brand.name}
              style={{
                width: "80px",
              }}
            />
          </Button>
        ))}
      </Stack>

      {/* Featured Mobile Phones */}
      <Box>
        <Typography level="h3" sx={{ mt: 4 }}>
          Featured Mobile Phones
        </Typography>
        <Stack
          direction="row"
          gap={3}
          sx={{ mt: 4, justifyContent: "flex-start", flexWrap: "wrap" }}
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <ProductCard key={index} />
          ))}
        </Stack>
      </Box>

      {/* Featured Tablets */}
      <Box>
        <Typography level="h3" sx={{ mt: 4 }}>
          Featured Tablets
        </Typography>
        <Stack
          direction="row"
          gap={3}
          sx={{ mt: 4, justifyContent: "flex-start", flexWrap: "wrap" }}
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <ProductCard key={index} />
          ))}
        </Stack>
      </Box>

      {/*  */}
    </Box>
  );
}

export default HomePage;
