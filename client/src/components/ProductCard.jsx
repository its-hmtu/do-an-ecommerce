import {
  AspectRatio,
  Card,
  CardContent,
  CardOverflow,
  IconButton,
  Stack,
  Typography,
} from "@mui/joy";
import React from "react";
import productImg from "assets/images/iphone-16-pro-max.webp";
import { Rate } from "antd";
import { FavoriteBorderRounded, FavoriteRounded } from "@mui/icons-material";

function ProductCard() {
  return (
    <Card>
      <img
        src={productImg}
        alt="product"
        style={{
          width: "200px",
        }}
      />

      <CardContent>
        <Typography
          level="body-sm"
          sx={{
            fontWeight: "bold",
          }}
        >
          Apple iPhone 16 Pro Max
        </Typography>

        <Typography
          level="body-sm"
          sx={{
            color: "text.secondary",
            marginTop: "10px",
          }}
        >
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(30000000)}
        </Typography>

        <Stack direction="row" alignItems="center" gap={1} sx={{ marginTop: 1, justifyContent: "space-between" }}>
          <Rate disabled defaultValue={4.5} />
          <IconButton>
            <FavoriteBorderRounded />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
