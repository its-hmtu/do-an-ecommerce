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
  return (
    <Box
      sx={{
        maxWidth: 1280,
        width: "100%",
        margin: "0 auto",
        paddingBottom: 3,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "48px",
        }}
      >
        <Box
          sx={{
            maxWidth: 217,
            width: "100%",
          }}
        >
          <Stack
            sx={{
              borderRight: "2px solid #e0e0e0",

              padding: "24px 16px 16px 6px",
              gap: 2,
            }}
          >
            {categories.map((category) => (
              <Link
                to={category.to}
                sx={{
                  width: "100%",
                }}
                component={NavLink}
              >
                <Typography
                  color="neutral"
                  sx={{
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                  endDecorator={<ChevronRightRounded />}
                >
                  {category.label}
                </Typography>
              </Link>
            ))}
          </Stack>
        </Box>

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
      </div>

      <Box>
        <Typography level="h3" sx={{ mt: 4 }}>
          Featured Mobile Phones
        </Typography>
        <Stack direction="row" gap={2} sx={{ mt: 2 }}>
          {brands.slice(0, 10).map((brand) => (
            <Button variant="outlined" key={brand.name} color="neutral">
              {brand.name}
            </Button>
          ))}
          <Button variant="outlined" color="neutral">
            View All
          </Button>
        </Stack>
      </Box>

      <Box>
        <Stack direction="row" gap={1} sx={{ mt: 4, justifyContent: "space-between", flexWrap: "wrap"  }}>
          {Array.from({ length: 10 }).map((_, index) => (
            <Stack sx={{ width: "calc(100% / )"}}>
              <ProductCard key={index} />
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

export default HomePage;
