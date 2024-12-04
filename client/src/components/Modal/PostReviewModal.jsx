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
import { toast } from "react-toastify";
const TextArea = Input.TextArea;

function PostReviewModal({ open, onCancel, productId }) {
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
              disabled={isPending}
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
              placeholder="Please write your review here... (min 15 characters)"
              autoSize={{ minRows: 3, maxRows: 5 }}
              style={{
                marginTop: "16px",
              }}
              value={reviewData.review}
              onChange={(e) =>
                setReviewData({ ...reviewData, review: e.target.value })
              }
              disabled={isPending}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="solid"
              color="primary"
              onClick={() => {
                if (reviewData.review.length < 15) {
                  alert("Review must be at least 25 characters long");
                  return;
                }
                mutate(reviewData, {
                  onSuccess: () => {
                    toast.success("Review submitted successfully! Thank you!");
                    onCancel();
                  },
                  onError: (error) => {
                    toast.error("Failed to submit review");
                  },
                });
              }}
              disabled={
                isPending ||
                reviewData.review.length < 15 ||
                reviewData.rating === 0 ||
                reviewData.rating === null ||
                reviewData.review === "" ||
                reviewData.review === null ||
                reviewData.product_id === "" ||
                reviewData.product_id === null ||
                reviewData.product_id === 0
              }
              loading={isPending}
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
