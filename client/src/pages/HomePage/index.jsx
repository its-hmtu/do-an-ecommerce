import { ChevronRightRounded } from "@mui/icons-material";
import { Box, Stack, Link, Typography, Sheet, Button } from "@mui/joy";
import { PATHS } from "config";
import React from "react";
import { NavLink, Link as RLink } from "react-router-dom";
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
  const { data, isLoading } = useProducts();
  const [featuredMobile, setFeaturedMobile] = React.useState([]);
  const [featuredTablet, setFeaturedTablet] = React.useState([]);

  React.useEffect(() => {
    if (data) {
      const categoryMobile = data?.featured.find((product) => product.category === "Mobile phone");
      setFeaturedMobile(categoryMobile?.products);

      const categoryTablet = data?.featured.find(product => product.category === "Tablet")
      setFeaturedTablet(categoryTablet?.products);
    }
  }, [data]);

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
            component={RLink}
            to={
              PATHS.BROWSE_BRAND.replace(":brand", brand.to)
            }
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
        <Stack direction="row" gap={3} sx={{ mt: 4, justifyContent: "space-between" }} >
        <Typography level="h3">
          Featured Mobile Phones
        </Typography>
        <Link component={RLink} to={PATHS.MOBILE}>
          <Typography level="body-lg" endDecorator={<ChevronRightRounded />}>
            View all
          </Typography>
        </Link>
        </Stack>
        <Stack
          direction="row"
          gap={3}
          sx={{ mt: 4, justifyContent: "flex-start", flexWrap: "wrap" }}
        >
          {featuredMobile.map((product) => {
            return (
              <ProductCard key={product.id} data={product} />
            )
          }
          )}
        </Stack>
      </Box>

      {/* Featured Tablets */}
      <Box>
      <Stack direction="row" gap={3} sx={{ mt: 4, justifyContent: "space-between" }} >
        <Typography level="h3">
          Featured Tablets
        </Typography>
        <Link component={RLink} to={PATHS.TABLET}>
          <Typography level="body-lg" endDecorator={<ChevronRightRounded />}>
            View all
          </Typography>
        </Link>
        </Stack>
        <Stack
          direction="row"
          gap={3}
          sx={{ mt: 4, justifyContent: "flex-start", flexWrap: "wrap" }}
        >
          {featuredTablet.map((product) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </Stack>
      </Box>

      <Box>
        <Typography level="h3" sx={{ mt: 4 }}>
          You may also like
        </Typography>
        <Stack
          direction="row"
          gap={3}
          sx={{ mt: 4, justifyContent: "flex-start", flexWrap: "wrap" }}
        >
          {data?.products.map((product) => {
            return (
              <ProductCard key={product.id} data={product} />
            )
          }
          )}
        </Stack>
      </Box>
    </Box>
  );
}

export default HomePage;
