import React from "react";
import { Box, Breadcrumbs, Typography, Button } from "@mui/joy";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import Sidebar from "../../layouts/MainLayout/components/Sidebar";
import Header from "../../layouts/MainLayout/components/Header";
import OrderList from "../OrdersPage/components/OrderList";
import OrderTable from "../OrdersPage/components/OrderTable";
import {Link} from 'react-router-dom'

function DashboardPage() {
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Breadcrumbs
          size="sm"
          aria-label="breadcrumbs"
          separator={<ChevronRightRoundedIcon fontSize="sm" />}
          sx={{ pl: 0 }}
        >
          <Link
            underline="none"
            color="neutral"
            href="#some-link"
            aria-label="Home"
          >
            <HomeRoundedIcon />
          </Link>
          <Typography
            underline="hover"
            color="neutral"
            sx={{ fontSize: 12, fontWeight: 500 }}
          >
            <Link to={'/dashboard'}>Dashboard</Link>
          </Typography>
        </Breadcrumbs>
      </Box>
      <Box
        sx={{
          display: "flex",
          mb: 1,
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Typography level="h2" component="h1">
          Orders
        </Typography>
        <Button
          color="primary"
          startDecorator={<DownloadRoundedIcon />}
          size="sm"
        >
          Download PDF
        </Button>
        
      </Box>
      <OrderTable />
      <OrderList />
    </>
  );
}

export default DashboardPage;
