import React from "react";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  ModalClose,
  Modal,
  ModalDialog,
  Typography,
} from "@mui/joy";
import { Rate, Input } from "antd";
import { useSubmitReview } from "hooks/product";
const TextArea = Input.TextArea;

function PostReviewModal({ open, onCancel, color, productId }) {
  const [reviewData, setReviewData] = React.useState({
    rating: 0,
    review: "",
    product_id: productId,
  });

  const { mutate, isPending } = useSubmitReview();

  return (
    <Modal onClose={onCancel} open={open} sx={{}}>
      <ModalDialog variant="outlined">
        <ModalClose />

        <DialogTitle>Post a Review</DialogTitle>
        <Divider />
        <Box
          sx={{
            width: "600px",
          }}
        >
          <DialogContent sx={{}}>
            <Typography
              level="title-sm"
              sx={{
                marginBottom: "16px",
              }}
            >
              How would you rate this product?
            </Typography>
            <Rate
              className="custom-rate"
              defaultValue={0}
              value={reviewData.rating}
              onChange={(value) =>
                setReviewData({ ...reviewData, rating: value })
              }
              tooltips={["Terrible", "Bad", "Normal", "Good", "Wonderful"]}
            />
            <span
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "12px",
                fontWeight: "bold",
              }}
            >
              {
                ["Terrible", "Bad", "Normal", "Good", "Wonderful"][
                  reviewData.rating - 1
                ]
              }
            </span>
            <TextArea
              placeholder="Please write your review here... (min 25 characters)"
              autoSize={{ minRows: 3, maxRows: 5 }}
              style={{
                marginTop: "16px",
              }}
              value={reviewData.review}
              onChange={(e) =>
                setReviewData({ ...reviewData, review: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="solid"
              color={color}
              onClick={() => {
                if (reviewData.review.length < 25) {
                  alert("Review must be at least 25 characters long");
                  return;
                }
                mutate(reviewData);
                onCancel();
              }}
              disabled={
                isPending ||
                reviewData.review.length < 25 ||
                reviewData.rating === 0 ||
                reviewData.rating === null ||
                reviewData.review === "" ||
                reviewData.review === null ||
                reviewData.product_id === "" ||
                reviewData.product_id === null ||
                reviewData.product_id === 0
              }
            >
              Submit Review
            </Button>
          </DialogActions>
        </Box>
      </ModalDialog>
    </Modal>
  );
}

export default PostReviewModal;
