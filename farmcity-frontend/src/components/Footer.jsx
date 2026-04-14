import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Instagram,
  Twitter,
  YouTube,
  WhatsApp,
  LocationOn,
  Phone,
  Email,
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Facebook />, url: 'https://facebook.com/farmcity', label: 'Facebook' },
    { icon: <Instagram />, url: 'https://instagram.com/farmcity', label: 'Instagram' },
    { icon: <Twitter />, url: 'https://twitter.com/farmcity', label: 'Twitter' },
    { icon: <YouTube />, url: 'https://youtube.com/farmcity', label: 'YouTube' },
    { icon: <WhatsApp />, url: 'https://wa.me/254712345678', label: 'WhatsApp' },
  ];

  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/about', label: 'About Us' },
    { to: '/blog', label: 'Blog' },
  ];

  const customerLinks = [
    { to: '/cart', label: 'Cart' },
    { to: '/orders', label: 'My Orders' },
    { to: '/profile', label: 'Profile' },
    { to: '#', label: 'FAQ' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: '#fff',
        pt: 6,
        pb: 3,
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Brand Column */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#e3c770' }}>
              🌾 Farmcity
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
              Your trusted source for premium quality rice in Kenya.
              We deliver fresh, organic, and authentic rice varieties
              straight from the farm to your doorstep.
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: '#fff',
                    background: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      background: '#4caf50',
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#4caf50' }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {quickLinks.map((link) => (
                <Typography
                  key={link.to}
                  component={Link}
                  to={link.to}
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    '&:hover': { color: '#e3c770' },
                    transition: 'color 0.3s',
                  }}
                >
                  {link.label}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#4caf50' }}>
              Customer Service
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {customerLinks.map((link) => (
                <Typography
                  key={link.label}
                  component={Link}
                  to={link.to}
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    '&:hover': { color: '#e3c770' },
                    transition: 'color 0.3s',
                  }}
                >
                  {link.label}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#4caf50' }}>
              Contact Us
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ color: '#e3c770' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  123 Kimathi Street, Nairobi, Kenya
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ color: '#e3c770' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  +254 712 345 678
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ color: '#e3c770' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  info@farmcity.co.ke
                </Typography>
              </Box>
            </Box>

            {/* Quality Badges */}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Box
                sx={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                  ✓ KEBS Certified
                </Typography>
              </Box>
              <Box
                sx={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                  ☪ HALAL
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Copyright */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            © {currentYear} Farmcity. All rights reserved. | Made with 💚 in Kenya
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
