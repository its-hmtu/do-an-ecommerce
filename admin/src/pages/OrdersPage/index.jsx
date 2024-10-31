import React from "react";
import { Box, Breadcrumbs, Link, Typography, Button } from "@mui/joy";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import OrderList from "./components/OrderList";
import OrderTable from "./components/OrderTable";
import { Outlet } from "react-router-dom";

function OrdersPage() {
  return (
    <>
      <Outlet />
      
    </>
  );
}

export default OrdersPage;
