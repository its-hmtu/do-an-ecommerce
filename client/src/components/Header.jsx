import React from 'react';
import { Container, Box, Typography, IconButton, Link, Sheet } from '@mui/joy';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'; 


function Header() {
  return (
    <Sheet sx={{ width: '100%'}}>
      {/* Top Bar */}
      <Box sx={{ backgroundColor: '#000', color: '#fff', padding: '10px' }}>
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', ml: 40 }}>
            Summer Sale For All Swim Suits And Free Express Delivery – OFF 50%! 
            <Link href="#" sx={{ color: '#fff', fontWeight: 'bold', ml: 1 }}>ShopNow</Link>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
            <Typography sx={{ fontSize: '0.875rem' }}>English</Typography>
            <ArrowDropDownIcon sx={{ fontSize: '1rem', ml: 0.5 }} />
          </Box>
        </Container>
      </Box>

      {/* Main Header */}
      <Box sx={{ backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, PaddingTop: '20px', Margin:'20px 0px'}}>
        {/* Logo */}
        <Link variant="h3" sx={{ fontWeight: 'bold', color: 'Black', fontSize: '1.5rem', ml: 30}}>Exclusive</Link>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Link href="#" underline="none" sx={{ color: 'Black', position: 'relative', ml: 10 }}>
            Home
            <Box sx={{
              position: 'absolute',
              bottom: -2,
              left: 0,
              height: '2px',
              width: '100%',
              backgroundColor: 'black'
            }} />
          </Link>
          <Link href="#" underline="none" sx={{ color: 'Black', ml: 3  }}>Contact</Link>
          <Link href="#" underline="none" sx={{ color: 'Black', ml: 3  }}>About</Link>
          <Link href="#" underline="none" sx={{ color: 'Black', ml: 3  }}>Sign Up</Link>
        </Box>

        {/* Search Bar and Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 , mr: 35}}>
          <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: '4px', padding: '0 8px', height: '36px' }}>
            <input
              type="text"
              placeholder="What are you looking for?"
              style={{
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                padding: '0 5px',
                fontSize: '14px',
                flexGrow: 1,
                width: '180px'
              }}
            />
            <SearchIcon style={{ color: '#888' }} />
          </Box>
          <IconButton>
            <FavoriteBorderIcon />
          </IconButton>
          <IconButton>
            <ShoppingCartOutlinedIcon />
          </IconButton>
        </Box>
      </Box>
    </Sheet>
  );
}

export default Header;