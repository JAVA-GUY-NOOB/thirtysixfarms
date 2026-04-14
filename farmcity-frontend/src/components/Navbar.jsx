import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Container,
  useScrollTrigger,
  Slide,
} from '@mui/material';
import {
  ShoppingCart,
  Person,
  AdminPanelSettings,
  Logout,
  Menu as MenuIcon,
} from '@mui/icons-material';

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/rice', label: 'Rice' },
    { to: '/about', label: 'About' },
    { to: '/blog', label: 'Blog' },
  ];

  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'linear-gradient(90deg, #e3c770 0%, #4caf50 100%)',
          borderRadius: '0 0 16px 16px',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="h5"
                component={Link}
                to="/"
                sx={{
                  textDecoration: 'none',
                  color: '#fff',
                  fontWeight: 'bold',
                  letterSpacing: 2,
                  textShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                🌾 Farmcity
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.to}
                  component={Link}
                  to={link.to}
                  sx={{
                    color: '#fff',
                    fontWeight: 500,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  {link.label}
                </Button>
              ))}

              {/* Admin Link */}
              {isAdmin() && (
                <Button
                  component={Link}
                  to="/admin"
                  startIcon={<AdminPanelSettings />}
                  sx={{
                    color: '#fff',
                    fontWeight: 500,
                    textTransform: 'none',
                    fontSize: '1rem',
                    background: 'rgba(255,255,255,0.15)',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.25)',
                    },
                  }}
                >
                  Admin
                </Button>
              )}
            </Box>

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Cart */}
              <IconButton
                component={Link}
                to="/cart"
                sx={{
                  color: '#fff',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <Badge badgeContent={0} color="secondary">
                  <ShoppingCart />
                </Badge>
              </IconButton>

              {/* Auth Buttons */}
              {isAuthenticated ? (
                <>
                  <IconButton
                    onClick={handleMenuOpen}
                    sx={{
                      color: '#fff',
                      background: 'rgba(255,255,255,0.1)',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.2)',
                      },
                    }}
                  >
                    {user?.firstName ? (
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#fff', color: '#4caf50' }}>
                        {user.firstName[0].toUpperCase()}
                      </Avatar>
                    ) : (
                      <Person />
                    )}
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        borderRadius: 2,
                        minWidth: 180,
                      },
                    }}
                  >
                    <MenuItem
                      component={Link}
                      to="/profile"
                      onClick={handleMenuClose}
                      sx={{ py: 1 }}
                    >
                      <Person sx={{ mr: 1, color: '#4caf50' }} />
                      Profile
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/orders"
                      onClick={handleMenuClose}
                      sx={{ py: 1 }}
                    >
                      <ShoppingCart sx={{ mr: 1, color: '#4caf50' }} />
                      My Orders
                    </MenuItem>
                    <MenuItem
                      onClick={handleLogout}
                      sx={{ py: 1, color: '#d32f2f' }}
                    >
                      <Logout sx={{ mr: 1 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    sx={{
                      color: '#fff',
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        background: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    sx={{
                      ml: 1,
                      background: '#fff',
                      color: '#4caf50',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        background: '#f5f5f5',
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;
