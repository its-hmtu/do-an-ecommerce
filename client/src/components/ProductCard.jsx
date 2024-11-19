import {
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/joy";
import React, { useCallback, useContext, useState } from "react";
import productImg from "assets/images/iphone-16-pro-max.webp";
import { Rate } from "antd";
import { FavoriteBorderRounded, FavoriteRounded } from "@mui/icons-material";
import { UserContext } from "contexts/UserContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { PATHS } from "config";

function ProductCard({data}) {
  const { user } = useContext(UserContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const handleAddToFavorite = () => {
    console.log(user);
    if (user) {
      setIsFavorite(!isFavorite);
    } else {
      toast.dismiss();
      toast.warning("Please login to add to favorite", {
        hideProgressBar: true,
      });
    }
  };
  // useCallback(handleAddToFavorite, [user, isFavorite]);

  return (
    <Card
      sx={{
        position: "relative",
        padding: "16px",
        backgroundColor: "#fff",
      }}
    >
      <img
        src={productImg}
        alt="product"
        style={{
          width: "200px",
          marginTop: "6px",
          cursor: "pointer",
        }}
      />

      <CardContent>
        <Typography
          level="body-sm"
          sx={{
            fontWeight: "bold",
          }}
          component={Link}
          to={PATHS.PRODUCT.replace(":id", data?.id)}
        >
          Apple iPhone 16 Pro Max
        </Typography>

        <Stack
          direction="row"
          gap={1}
          sx={{ justifyContent: "space-between", alignItems: "center" }}
          component={Link}
          to={PATHS.PRODUCT.replace(":id", data?.id)}
        >
          <Typography
            level="body-lg"
            sx={{
              color: "text.secondary",
              marginTop: "10px",
              fontWeight: "bold",
            }}
          >
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(30000000)}
          </Typography>
          <Typography
            level="body-xs"
            sx={{
              color: "text.secondary",
              marginTop: "10px",
              textDecoration: "line-through",
            }}
          >
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(30000000)}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          sx={{ marginTop: 1, justifyContent: "space-between" }}
        >
          <Rate disabled defaultValue={4.5} onChange />
          <Stack direction="row" gap={1}>
            <IconButton onClick={handleAddToFavorite}>
              {isFavorite ? <FavoriteRounded /> : <FavoriteBorderRounded />}
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>

      <div
        style={{
          position: "absolute",
          padding: "2px 4px",
          backgroundColor: "#f44336",
          top: 0,
          left: 0,
          color: "#fff",
          fontSize: "12px",
        }}
      >
        Sale 50%
      </div>
    </Card>
  );
}

export default ProductCard;
