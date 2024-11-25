import {
  Box,
  Card,
  CardContent,
  CssVarsProvider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import React, { useCallback, useContext, useState } from "react";
import productImg from "assets/images/iphone-16-pro-max.webp";
import { Rate } from "antd";
import {
  AddShoppingCartOutlined,
  AddShoppingCartRounded,
  FavoriteBorderRounded,
  FavoriteRounded,
} from "@mui/icons-material";
import { UserContext } from "contexts/UserContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { PATHS } from "config";

function ProductCard({ data }) {
  const { user } = useContext(UserContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const handleAddToFavorite = () => {
    console.log(user);
    if (user) {
      setIsFavorite(!isFavorite);
    } else {
      toast.dismiss();
      toast.warning("Please sign in to use this feature", {
        hideProgressBar: true,
      });
    }
  };
  // useCallback(handleAddToFavorite, [user, isFavorite]);
  const mainImage = data?.images.find(
    (image) => image.id === data?.main_image_id
  ).file_path;
  return (
    <Card
      sx={{
        position: "relative",
        padding: "16px",
        backgroundColor: "#fff",
        width: "300px",
        borderRadius: "10px",
      }}
    >
      <Box
        sx={{
          width: "250px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
        }}
        component={Link}
        to={PATHS.PRODUCT.replace(":path", data?.slug)}
      >
        <img
          src={`${process.env.REACT_APP_API_URL}${mainImage}`}
          alt="product"
          style={{
            marginTop: "6px",
            cursor: "pointer",
          }}
        />
      </Box>

      <CardContent>
        <Typography
          level="title-lg"
          sx={{
            fontWeight: "bold",
          }}
          component={Link}
          to={PATHS.PRODUCT.replace(":path", data?.slug)}
        >
          {data?.product_name}
        </Typography>

        <Stack
          direction="row"
          gap={2}
          sx={{ justifyContent: "flex-start", alignItems: "center" }}
          component={Link}
          to={PATHS.PRODUCT.replace(":path", data?.slug)}
        >
          <Typography
            level="body-lg"
            sx={{
              marginTop: "10px",
              fontWeight: "bold",
              color: "#DB4444",
            }}
          >
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(Number(data?.base_price))}
          </Typography>
          {data?.special_base_price && (
            <Typography
              level="body-md"
              sx={{
                color: "text.secondary",
                marginTop: "10px",
                textDecoration: "line-through",
              }}
            >
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(Number(data?.special_base_price))}
            </Typography>
          )}
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          sx={{ marginTop: 1, justifyContent: "space-between" }}
        >
          <Stack direction="row" gap={1}>
            <Rate
              defaultValue={0}
              allowHalf
              disabled
              value={data?.average_rating || 0}
            />
            <Typography level="body-sm" sx={{ color: "text.secondary" }}>
              ({data?.total_reviews})
            </Typography>
          </Stack>

          <Stack direction="row" gap={1}>
            <Tooltip title="Add to wishlist" arrow variant="outlined">
              <IconButton onClick={handleAddToFavorite}>
                {isFavorite ? <FavoriteRounded /> : <FavoriteBorderRounded />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Add to cart" arrow variant="outlined">
              <IconButton onClick={handleAddToFavorite}>
                {isFavorite ? (
                  <AddShoppingCartRounded />
                ) : (
                  <AddShoppingCartOutlined />
                )}
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </CardContent>

      <div
        style={{
          position: "absolute",
          padding: "4px 12px",
          backgroundColor: "#DB4444",
          top: "6px",
          left: "6px",
          color: "#fff",
          fontSize: "12px",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        50%
      </div>
    </Card>
  );
}

export default ProductCard;
