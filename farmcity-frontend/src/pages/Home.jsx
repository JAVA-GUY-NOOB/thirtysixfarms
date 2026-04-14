import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Paper,
} from '@mui/material';
import { ShoppingCart, LocalShipping, Verified, Agriculture } from '@mui/icons-material';
import RiceCard from '../components/RiceCard';
import TestimonialSection from '../components/TestimonialSection';
import NewsletterSignup from '../components/NewsletterSignup';
import FAQSection from '../components/FAQSection';
import { riceAPI } from '../api/farmcityApi';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const products = await riceAPI.getAll();
      setFeaturedProducts(products.slice(0, 4));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <LocalShipping sx={{ fontSize: 48, color: '#4caf50' }} />,
      title: 'Free Delivery',
      description: 'Free delivery on all orders over KSh 5,000. Fast and reliable to your doorstep.',
    },
    {
      icon: <Verified sx={{ fontSize: 48, color: '#e3c770' }} />,
      title: 'KEBS Certified',
      description: 'All our rice products are certified by Kenya Bureau of Standards for quality.',
    },
    {
      icon: <Agriculture sx={{ fontSize: 48, color: '#4caf50' }} />,
      title: 'Direct from Farmers',
      description: 'Supporting local farmers by sourcing directly, ensuring freshness and fair prices.',
    },
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4caf50 0%, #81c784 50%, #e3c770 100%)',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Chip
                  label="✨ Now with M-Pesa & Card Payments"
                  sx={{
                    mb: 3,
                    background: 'rgba(255,255,255,0.9)',
                    color: '#4caf50',
                    fontWeight: 'bold',
                  }}
                />

                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 'bold',
                    color: '#fff',
                    mb: 2,
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                  }}
                >
                  Premium Quality Rice
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    mb: 4,
                    lineHeight: 1.6,
                  }}
                >
                  Discover premium rice varieties, fresh from Kenyan farms.
                  Organic, sustainable, and delivered with love.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    component={Link}
                    to="/products"
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCart />}
                    sx={{
                      background: '#fff',
                      color: '#4caf50',
                      px: 4,
                      py: 1.5,
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      '&:hover': {
                        background: '#f5f5f5',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Shop Now
                  </Button>
                  <Button
                    component={Link}
                    to="/about"
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: '#fff',
                      color: '#fff',
                      px: 4,
                      py: 1.5,
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      '&:hover': {
                        borderColor: '#fff',
                        background: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Learn More
                  </Button>
                </Box>

                {/* Quality Badges */}
                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                  <Chip
                    icon={<Verified />}
                    label="KEBS Certified"
                    sx={{ background: 'rgba(255,255,255,0.9)', color: '#333' }}
                  />
                  <Chip
                    label="☪ HALAL"
                    sx={{ background: 'rgba(255,255,255,0.9)', color: '#333' }}
                  />
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80"
                  alt="Premium Rice"
                  sx={{
                    maxWidth: '100%',
                    borderRadius: 4,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Promotional Banner */}
      <Box sx={{ background: '#ff6f00', py: 2 }}>
        <Container>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{ color: '#fff', fontWeight: 'bold' }}
          >
            🎉 SPECIAL OFFER: Get 10% OFF on your first order! Use code: WELCOME10
          </Typography>
        </Container>
      </Box>

      {/* Featured Products */}
      <Container sx={{ py: 8 }}>
        <Typography
          variant="h3"
          textAlign="center"
          sx={{ fontWeight: 'bold', mb: 1, color: '#4caf50' }}
        >
          Featured Products
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          sx={{ color: 'text.secondary', mb: 4 }}
        >
          Discover our most popular rice varieties
        </Typography>

        <Grid container spacing={4}>
          {loading
            ? Array.from(new Array(4)).map((_, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Card sx={{ height: 300, background: '#f5f5f5' }} />
                </Grid>
              ))
            : featuredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product.id}>
                  <RiceCard {...product} />
                </Grid>
              ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            size="large"
            sx={{
              background: 'linear-gradient(45deg, #4caf50 30%, #81c784 90%)',
              px: 6,
              fontWeight: 'bold',
            }}
          >
            View All Products
          </Button>
        </Box>
      </Container>

      {/* Features Section */}
      <Box sx={{ background: '#f5f5f5', py: 8 }}>
        <Container>
          <Typography
            variant="h3"
            textAlign="center"
            sx={{ fontWeight: 'bold', mb: 6, color: '#4caf50' }}
          >
            Why Choose Farmcity?
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 3,
                      boxShadow: 2,
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 4,
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Social Proof Section */}
      <TestimonialSection />

      {/* Newsletter */}
      <NewsletterSignup />

      {/* FAQ */}
      <FAQSection />
    </Box>
  );
};

export default Home;
