import React from 'react'
import { Box, Breadcrumbs, Link, Typography, Button } from '@mui/joy'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import ProductTable from './components/ProductTable'
import { Outlet } from 'react-router-dom'


function ProductPage() {

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
          <Link
            underline="hover"
            color="neutral"
            href="#some-link"
            sx={{ fontSize: 12, fontWeight: 500 }}
          >
            Dashboard
          </Link>
          <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
            Products
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
          Products
        </Typography>
        <Button
          color="primary"
          startDecorator={<DownloadRoundedIcon />}
          size="sm"
        >
          Download PDF
        </Button>
      </Box>
      <ProductTable />
    </>
  )
}

export default ProductPage