import React from 'react';
import { Box, Typography, Link, IconButton } from '@mui/joy';
import { Search, FavoriteBorder, ShoppingCart } from '@mui/icons-material';

const Header = () => {
  // const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <Box
      component="header"
      sx={{
        backgroundColor: 'background.level1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography level="h5">Exclusive</Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Link href="#" color="neutral">
            Home
          </Link>
          <Link href="#" color="neutral">
            Contact
          </Link>
          <Link href="#" color="neutral">
            About
          </Link>
          <Link href="#" color="neutral">
            Sign Up
          </Link>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <IconButton
          variant="solid"
          color="neutral"
          // size={isMobile ? 'sm' : 'md'}
        >
          <Search />
        </IconButton>
        <IconButton
          variant="solid"
          color="neutral"
          // size={isMobile ? 'sm' : 'md'}
        >
          <FavoriteBorder />
        </IconButton>
        <IconButton
          variant="solid"
          color="neutral"
          // size={isMobile ? 'sm' : 'md'}
        >
          <ShoppingCart />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Header;