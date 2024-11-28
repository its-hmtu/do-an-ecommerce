import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axiosInstance from "api";
import { Box, Button } from "@mui/joy";
import { CheckCircleOutlineRounded } from "@mui/icons-material";
import { PATHS } from "config";
const ReturnPage = () => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');
    const orderId = urlParams.get('order_id');
    const cartId = urlParams.get('cart_id');
    const itemIds = urlParams.get('item_ids');
    axiosInstance.get("/api/orders/check-status", {
      params: {
        session_id: sessionId,
        order_id: orderId,
        cart_id: cartId,
        item_ids: itemIds
      }
    }).then((res) => {
      setStatus(res.data.status);
    });
  }, []);

  if (status === 'open') {
    return (
      <Navigate to="/checkout" />
    )
  }

  if (status === 'complete') {
    return (
      <section id="success" style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}>
        <Box sx={{ textAlign: "center", padding: 3, 
          width: 720,
          margin: "0 auto",
          backgroundColor: "white",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "sm",
         }}>
          <CheckCircleOutlineRounded color="success" sx={{ fontSize: 50 }} />
          <h1>Payment Successful</h1>
          <p>Thank you for your order!</p>
          <Button component={Link} to={PATHS.HOME}>
            To Home Page
          </Button>
        </Box>
      </section>
    )
  }

  return null;
}

export default ReturnPage;