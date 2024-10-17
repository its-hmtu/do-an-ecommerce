import {
  Box,
  Breadcrumbs,
  Typography,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Chip,
  Badge,
  Tooltip,
  Table,
} from "@mui/joy";
import React, { lazy, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
import { useQuery } from "@tanstack/react-query";
import { getSingleProduct } from "api/products.api";
import ReactImageGallery from "react-image-gallery";
import {
  LineChart,
  Line,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from "recharts";

function ProductDetail() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["product", { id }],
    queryFn: () => getSingleProduct({ id }),
  });
  // const imagesRef = React.useRef([]);
  const [isEdit, setIsEdit] = React.useState(false);

  useEffect(() => {
    console.log("Product ID: ", id);
  }, [data, id]);

  const navigate = useNavigate();

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
            underline="hover"
            color="neutral"
            sx={{ fontSize: 12, fontWeight: 500 }}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </Link>
          <Link
            underline="hover"
            color="neutral"
            sx={{ fontSize: 12, fontWeight: 500 }}
            onClick={() => navigate("/products")}
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
        <Stack direction="row" spacing={1}>
          <Button
            color="primary"
            startDecorator={<DownloadRoundedIcon />}
            size="sm"
          >
            Download PDF
          </Button>
          <Button color="primary" size="sm" 
            startDecorator={<ModeEditRoundedIcon />}
          >
            Edit
          </Button>
          <Button color="danger" size="sm">
            Delete
          </Button>
        </Stack>
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
                  <Typography level="h2" sx={{ fontWeight: 500 }}>
                    {data?.product_name}
                  </Typography>
                </FormControl>

                <FormControl>
                  <FormLabel>Base price</FormLabel>
                  <Typography level="h2" sx={{ fontWeight: 500 }}>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(data?.base_price)}
                  </Typography>
                </FormControl>

                <FormControl>
                  <FormLabel>Product description</FormLabel>
                  {/* <Input value={data?.product_name} /> */}

                  <Typography level="" sx={{ fontWeight: 500 }}>
                    {data?.product_description}
                  </Typography>
                </FormControl>

                <FormControl>
                  <FormLabel>Colors</FormLabel>
                  <Stack direction="row" spacing={2}>
                    {data?.options.map((option, index) => (
                      <Chip key={index} variant="outlined">
                        {option.color}
                      </Chip>
                    ))}
                  </Stack>
                </FormControl>

                <Stack direction="row" spacing={2}>
                  <FormControl>
                    <FormLabel>Availability</FormLabel>
                    <Chip
                      color={
                        data?.availability === "in-stock" ? "success" : "danger"
                      }
                    >
                      {data?.availability === "in-stock"
                        ? "In stock"
                        : "Out of stock"}
                    </Chip>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Total available</FormLabel>
                    <Typography level="" sx={{ fontWeight: 500 }}>
                      {data?.total_in_stock}
                    </Typography>
                  </FormControl>
                </Stack>

                <FormControl>
                  <FormLabel>Available in stock by color</FormLabel>
                  <Table size="md" borderAxis="bothBetween">
                    <thead>
                      <tr>
                        <th>Color</th>
                        <th>Option</th>
                        <th>Stock</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.options.map((option, index) => (
                        <tr key={index}>
                          <td>{option.color}</td>
                          <td>{option.value}</td>
                          <td>{option.stock}</td>
                          <td>
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(option.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </FormControl>
              </Stack>
              <Stack
                direction="column"
                spacing={1}
                sx={{
                  gap: 1,
                  width: "50%",
                }}
              >
                <Box>
                  <Typography level="h3" component="h2">
                    Product images
                  </Typography>
                </Box>
                <ReactImageGallery
                  items={data?.images.map((image) => ({
                    original: `http://localhost:5000${image.file_path}` || image.file_path,
                    thumbnail: `http://localhost:5000${image.file_path}` || image.file_path,
                  }))}
                  showPlayButton={false}
                  showFullscreenButton={false}
                  loading={lazy}
                />
              </Stack>
            </Box>
          </form>

          {/* Render chart based on how many orders have been made for this product
           *
           *
           */}

          <Box sx={{ mt: 2 }}>
            <Typography level="h3" component="h2">
              Orders
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data?.orders}>
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#8884d8"
                  dot={false}
                />
                <ChartTooltip />
              </LineChart>
            </ResponsiveContainer>

            <Box sx={{ mt: 2 }}>
              <Typography level="h3" component="h2">
                Sales
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data?.sales}>
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#8884d8"
                    dot={false}
                  />
                  <ChartTooltip />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}

export default ProductDetail;
