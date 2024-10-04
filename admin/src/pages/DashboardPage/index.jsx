import React from "react";
import { Box, Breadcrumbs, Typography, Button, Card, Divider } from "@mui/joy";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import {Link} from 'react-router-dom'
import SumaryCard from "./components/SumaryCard";

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
          Dashboard
        </Typography>
        <Button
          color="primary"
          startDecorator={<DownloadRoundedIcon />}
          size="sm"
        >
          Download PDF
        </Button>
        
      </Box>
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row", // Make children horizontal
        }}
      >
        <SumaryCard title="Weekly sales" total="746k" />
        <Divider orientation="vertical" sx={{
          margin: '10px 0'
        }}/>
        <SumaryCard k/>
        <Divider orientation="vertical" sx={{
          margin: '10px 0'
        }}/>
        <SumaryCard />
        <Divider orientation="vertical" sx={{
          margin: '10px 0'
        }}/>
        <SumaryCard />
      </Card>
    </>
  );
}

export default DashboardPage;
