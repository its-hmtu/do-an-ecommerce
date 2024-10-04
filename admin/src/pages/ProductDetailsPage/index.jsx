import {
  Box,
  Breadcrumbs,
  Typography,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from "@mui/joy";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { useQuery } from "@tanstack/react-query";
import { getSingleProduct } from "api/products.api";
import ReactImageGallery from "react-image-gallery";

function ProductDetailsPage() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["product", { id }],
    queryFn: () => getSingleProduct({ id }),
  });
  const imagesRef = React.useRef([]);
  useEffect(() => {
    console.log("Product ID: ", id);
  }, [data, id]);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Breadcrumbs
          size="sm"
          aria-label="breadcrumbs"
          separator={<ChevronRightRoundedIcon fontSize="sm" />}
          sx={{ pl: 0 }}
        >
          <Link
            underline="none"
            color="neutral"
            href="#some-link"
            aria-label="Home"
          >
            <HomeRoundedIcon />
          </Link>
          <Link
            underline="hover"
            color="neutral"
            href="#some-link"
            sx={{ fontSize: 12, fontWeight: 500 }}
          >
            Dashboard
          </Link>
          <Link
            underline="hover"
            color="neutral"
            href="#some-link"
            sx={{ fontSize: 12, fontWeight: 500 }}
          >
            Products
          </Link>
          <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
            {data?.product_name}
          </Typography>
        </Breadcrumbs>
      </Box>
      <Box
        sx={{
          display: "flex",
          mb: 1,
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Typography level="h2" component="h1">
          Product Details
        </Typography>
        <Button
          color="primary"
          startDecorator={<DownloadRoundedIcon />}
          size="sm"
        >
          Download PDF
        </Button>
      </Box>
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Box sx={{ mt: 2 }}>
          <form>
            <Box
              sx={{
                display: "flex",
                justifyContent: "start",
                gap: 4,
              }}
            >
              <ReactImageGallery
                items={[
                  ...data?.images.map((image) => ({
                    original: image.file_path,
                    thumbnail: image.file_path,
                  })),
                ]}
                showPlayButton={false}
                showFullscreenButton={false}
              />

              <Stack
                direction="column"
                spacing={2}
                sx={{
                  gap: 2,
                  width: "50%",
                }}
              >
                <FormControl>
                  <FormLabel>Product name</FormLabel>
                  {/* <Input value={data?.product_name} /> */}

                  <Typography level="h2" sx={{ fontWeight: 500 }}>
                    {data?.product_name}
                  </Typography>
                </FormControl>
                <FormControl>
                  <FormLabel>Product description</FormLabel>
                  {/* <Input value={data?.product_name} /> */}

                  <Typography level="" sx={{ fontWeight: 500 }}>
                    {data?.product_description}
                  </Typography>
                </FormControl>
              </Stack>
            </Box>
          </form>
        </Box>
      )}
    </>
  );
}

export default ProductDetailsPage;
