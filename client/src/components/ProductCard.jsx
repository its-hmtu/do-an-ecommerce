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
import { AddShoppingCartRounded, FavoriteBorderRounded, FavoriteRounded } from "@mui/icons-material";

function ProductCard() {
  return (
    <Card sx={{
      position: "relative",
      padding: "16px",
    }}>
      <img
        src={productImg}
        alt="product"
        style={{
          width: "200px",
          marginTop: "6px"
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

        <Stack direction="row" gap={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
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
          <Rate disabled defaultValue={4.5} />
          <Stack direction="row" gap={1}> 
          <IconButton>
            <FavoriteBorderRounded />
          </IconButton>
          {/* <IconButton>
            <AddShoppingCartRounded />
          </IconButton> */}
          </Stack>
        </Stack>
      </CardContent>

      <div style={{
        position: "absolute",
        padding: "4px",
        backgroundColor: "#f44336",
        top: 0,
        left: 0,
        color: "#fff",
        fontSize: "12px",
      }}>
        Sale 50%
      </div>
    </Card>
  );
}

export default ProductCard;
