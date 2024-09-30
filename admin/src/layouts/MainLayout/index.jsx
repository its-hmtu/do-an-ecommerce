import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Box, Breadcrumbs, Link, Typography, Button } from "@mui/joy";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
// import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentAdmin } from "api";
// import OrderList from './components/OrderList';
// import { OrderTable } from './components/OrderTable';

function MainLayout() {
  const queryClient = useQueryClient();
  const isUser = sessionStorage.getItem('token');
  
  const {data, isLoading} = useQuery({
    queryKey: 'admin',
    queryFn: getCurrentAdmin,
    onSuccess: (data) => {
      queryClient.setQueryData('admin', data);
    },
    enabled: !!isUser
  })

  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      <Header />
      <Sidebar user={data?.user}/>
      <Box
        component="main"
        className="MainContent"
        sx={{
          px: { xs: 2, md: 6 },
          pt: {
            xs: "calc(12px + var(--Header-height))",
            sm: "calc(12px + var(--Header-height))",
            md: 3,
          },
          pb: { xs: 2, sm: 2, md: 3 },
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100dvh",
          gap: 1,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainLayout;
