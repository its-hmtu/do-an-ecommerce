import {
  ArrowDownwardRounded,
  ArrowUpwardRounded,
  SortRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/joy";
import ProductCard from "components/ProductCard";
import { PATHS } from "config";
import { brands } from "config/constants";
import { useProductByBrand, useProductByCategory } from "hooks/product";
import React from "react";
import { useLocation, Link, useParams } from "react-router-dom";

function BrowseCategoryPage() {
  const { pathname } = useLocation();
  const { data, isLoading } = useProductByCategory(pathname.split("/")[1]);
  const [products, setProducts] = React.useState([]);
  const [isSortByPriceHigh, setIsSortByPriceHigh] = React.useState(false);
  const [isSortByPriceLow, setIsSortByPriceLow] = React.useState(false);
  const [isSortByViews, setIsSortByViews] = React.useState(true);

  React.useEffect(() => {
    if (data) {
      setProducts(data.products.sort((a, b) => b.views - a.views));
    }
  }, [data]);

  if (!data || data?.products.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 64px)",
        }}
      >
        <Typography level="title-lg">No products found</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 1280,
        width: "100%",
        margin: "0 auto",
        paddingBottom: 4,
      }}
    >
      <Box
        sx={{
          mt: 4,
        }}
      >
        {/* <Stack direction="row" gap={2} sx={{ mt: 2, mb: 4 }}>
          {data?.series.map((series) => {
            return (
              <Button
                key={series.id}
                variant="outlined"
                color="neutral"
                sx={{
                  backgroundColor: "#fff",
                }}
                component={Link}
                to={PATHS.BROWSE_SERIES.replace(":series", series.slug)}
              >
                {series.series_name}
              </Button>
            );
          })}
        </Stack> */}
        <Stack
          direction="row"
          gap={"15px"}
          sx={{
            justifyContent: "flex-start",
            flexWrap: "wrap",
            mb: 4,
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
              component={Link}
              to={PATHS.BROWSE_BRAND.replace(":brand", brand.to)}
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
        <Typography level="title-sm" startDecorator={<SortRounded />}>
          Sort by
        </Typography>
        <Stack
          direction="row"
          gap={2}
          sx={{
            mt: 1,
            justifyContent: "flex-start",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Button
            variant="outlined"
            color={isSortByPriceLow ? "primary" : "neutral"}
            sx={{ backgroundColor: "#fff" }}
            onClick={() => {
              setIsSortByPriceLow(true);
              setIsSortByPriceHigh(false);
              setIsSortByViews(false);
              setProducts(
                [...products].sort((a, b) => a.base_price - b.base_price)
              );
            }}
            startDecorator={<ArrowUpwardRounded />}
          >
            Price - Low to High
          </Button>
          <Button
            variant="outlined"
            color={isSortByPriceHigh ? "primary" : "neutral"}
            sx={{ backgroundColor: "#fff" }}
            onClick={() => {
              setIsSortByPriceLow(false);
              setIsSortByPriceHigh(true);
              setIsSortByViews(false);
              setProducts(
                [...products].sort((a, b) => b.base_price - a.base_price)
              );
            }}
            startDecorator={<ArrowDownwardRounded />}
          >
            Price - High to Low
          </Button>
          <Button
            variant="outlined"
            color={isSortByViews ? "primary" : "neutral"}
            sx={{ backgroundColor: "#fff" }}
            onClick={() => {
              setIsSortByPriceLow(false);
              setIsSortByPriceHigh(false);
              setIsSortByViews(true);
              setProducts([...products].sort((a, b) => b.views - a.views));
            }}
            startDecorator={<VisibilityRounded />}
          >
            Views
          </Button>
        </Stack>
        <Stack
          direction="row"
          gap={3}
          sx={{ mt: 4, justifyContent: "flex-start", flexWrap: "wrap" }}
        >
          {products.map((product) => {
            return <ProductCard key={product.id} data={product} />;
          })}
        </Stack>
      </Box>
    </Box>
  );
}

export default BrowseCategoryPage;
