import React from "react";
import { Stack, Avatar, Typography, Box } from "@mui/joy";
import { Rate } from "antd";

function ReviewCard({review, user}) {
  return (
    <Stack
      gap={1}
      sx={{
        padding: "16px",
        "& + &": {
          borderTop: "1px solid #cdd7e1",
        },
      }}
    >
      <Stack
        gap={1}
        direction="row"
        sx={{
          alignItems: "center",
        }}
      >
        <Avatar size="sm" />
        <Typography level="title-sm">
          {review.user.id === user?.id
            ? "You"
            : `${review.user.first_name} ${review.user.last_name}`}
        </Typography>
        <Typography level="body-xs">
          {new Date(review.createdAt).toLocaleDateString('vi-VN', {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </Typography>
      </Stack>
      <Box
        sx={{
          borderLeft: "2px solid #cdd7e1",
          paddingLeft: "16px",
          marginLeft: "14px",
        }}
      >
        <Rate disabled defaultValue={0} value={review.rating} />
        <Typography level="body-sm">{review.review}</Typography>
      </Box>
    </Stack>
  );
}

export default ReviewCard;
