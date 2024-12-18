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
import React, { useCallback, useContext, useEffect, useState } from "react";
import productImg from "assets/images/iphone-16-pro-max.webp";
import { Rate } from "antd";
import {
  AddShoppingCartOutlined,
  AddShoppingCartRounded,
  FavoriteBorderRounded,
  FavoriteRounded,
  ShoppingCartRounded,
} from "@mui/icons-material";
import { UserContext } from "contexts/UserContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { PATHS } from "config";
import { useAddItemToCart, useGetUserCart } from "hooks";

function ProductCard({ data, showTotalReviews = true }) {
  const { user } = useContext(UserContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const {mutate: addToCart, isPending} = useAddItemToCart();
  const {data: cartData} = useGetUserCart();

  useEffect(() => {
    if (user && cartData?.cart && cartData?.cart.items) {
      const isAdded = cartData?.cart.items.find(
        (item) => item.product.id === data?.id
      );
      setIsAdded(isAdded);
    }
  }, [cartData, user, data]);

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
  const handleAddToCart = (cart_id, product_id, option_id, quantity) => {
    if (!isAdded) {
      if (user) {
        setIsAdded(!isAdded);
        addToCart({
          cart_id,
          product_id,
          option_id,
          quantity,
        }, {
          onSuccess: () => {
            toast.dismiss();
            toast.success("Added to cart", {
              hideProgressBar: true,
            });
          },
          onError: () => {
            toast.dismiss();
            toast.error("Failed to add to cart", {
              hideProgressBar: true,
            });
          }
        });
      } else {
        toast.dismiss();
        toast.warning("Please sign in to use this feature", {
          hideProgressBar: true,
        });
      }
    } else {
      toast.dismiss();
      toast.warning("This product is already in your cart", {
        hideProgressBar: true,
      });
    }
  } 
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
          level="title-md"
          sx={{
            fontWeight: "bold",
            height: "40px",
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
            }).format(Number(data?.special_base_price || data?.base_price))}
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
              }).format(Number(data?.base_price))}
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
            {showTotalReviews && (
              <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                ({data?.total_reviews})
              </Typography>
            )}
          </Stack>

          <Stack direction="row" gap={1}>
            <Tooltip title="Add to wishlist" arrow variant="outlined">
              <IconButton onClick={handleAddToFavorite}>
                {isFavorite ? <FavoriteRounded /> : <FavoriteBorderRounded />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Add to cart" arrow variant="outlined">
              <IconButton onClick={
                () => handleAddToCart(cartData?.cart.id, data?.id, data?.options[0].id, 1)
              }>
                {isAdded ? (
                  <ShoppingCartRounded />
                ) : (
                  <AddShoppingCartOutlined />
                )}
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </CardContent>

      { data?.special_base_price_percentage &&
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
        {
          data?.special_base_price_percentage.split(".")[0]
        }%
      </div>
      }
    </Card>
  );
}

export default ProductCard;
