import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  TextField,
  Grid,
  Divider,
  Chip,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  ArrowForward,
  LocalOffer,
  CheckCircle,
} from '@mui/icons-material';
import { cartAPI, orderAPI, adsOffersAPI } from '../api/farmcityApi';
import AdsBanner from '../components/AdsBanner';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const items = await cartAPI.getItems();
      const normalized = items.map(item => ({
        id: item.id,
        productId: item.productId || item.product_id,
        productName: item.name || item.productName || 'Rice Product',
        image: item.imageUrl || item.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
        price: item.unitPrice || item.price || 0,
        quantity: item.quantity || 1,
      }));
      setCartItems(normalized);
      calculateTotals(normalized, discount);
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
      // Fallback to empty cart
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (items, discountAmount = 0) => {
    const sub = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
    setSubtotal(sub);
    const disc = Math.min(discountAmount, sub);
    setDiscount(disc);
    setTotal(sub - disc);
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await cartAPI.updateItem(itemId, newQuantity);
      const updatedItems = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      calculateTotals(updatedItems, discount);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartAPI.removeItem(itemId);
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      calculateTotals(updatedItems, discount);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCartItems([]);
      setSubtotal(0);
      setDiscount(0);
      setTotal(0);
      setAppliedOffer(null);
      setPromoCode('');
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    try {
      const result = await adsOffersAPI.validatePromoCode(promoCode, subtotal);
      if (result.valid) {
        const discountAmount = result.discount || 0;
        setDiscount(discountAmount);
        setAppliedOffer(result.offer);
        calculateTotals(cartItems, discountAmount);
        setPromoSuccess(`Promo code applied! You saved KES ${discountAmount.toLocaleString()}`);
        setPromoError('');
      } else {
        setPromoError(result.message || 'Invalid promo code');
        setPromoSuccess('');
      }
    } catch (error) {
      setPromoError('Failed to validate promo code');
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setDiscount(0);
    setAppliedOffer(null);
    calculateTotals(cartItems, 0);
    setPromoError('');
    setPromoSuccess('');
  };

  const proceedToCheckout = async () => {
    if (cartItems.length === 0) return;

    setProcessing(true);
    try {
      // Navigate to checkout with order details
      navigate('/checkout', {
        state: {
          items: cartItems,
          subtotal,
          discount,
          total,
          promoCode: appliedOffer?.promoCode,
        }
      });
    } catch (error) {
      console.error('Failed to proceed to checkout:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} sx={{ color: '#4caf50' }} />
        <Typography sx={{ mt: 2 }}>Loading your cart...</Typography>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{ textAlign: 'center', py: 8, borderRadius: 4 }}>
            <CardContent>
              <ShoppingCart sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
              <Typography variant="h4" sx={{ mb: 2, color: '#4caf50', fontWeight: 'bold' }}>
                Your Cart is Empty
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Looks like you haven't added any items to your cart yet.
              </Typography>
              <Button
                variant="contained"
                size="large"
                href="/products"
                endIcon={<ArrowForward />}
                sx={{
                  background: 'linear-gradient(45deg, #4caf50 30%, #81c784 90%)',
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                }}
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Checkout Page Ad */}
      <AdsBanner position="CHECKOUT_PAGE" />

      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#4caf50' }}>
        Shopping Cart ({cartItems.length} items)
      </Typography>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 3,
                    borderBottom: index < cartItems.length - 1 ? '1px solid #eee' : 'none',
                    '&:hover': { background: '#f9f9f9' },
                  }}
                >
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.productName}
                    sx={{
                      width: 100,
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 2,
                      mr: 3,
                    }}
                  />

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {item.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      KES {item.price.toLocaleString()} each
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 3 }}>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      sx={{ border: '1px solid #4caf50', color: '#4caf50' }}
                    >
                      <Remove />
                    </IconButton>
                    <Typography sx={{ minWidth: 40, textAlign: 'center', fontWeight: 'bold' }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      sx={{ border: '1px solid #4caf50', color: '#4caf50' }}
                    >
                      <Add />
                    </IconButton>
                  </Box>

                  <Box sx={{ textAlign: 'right', minWidth: 120 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                      KES {(item.price * item.quantity).toLocaleString()}
                    </Typography>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => removeItem(item.id)}
                      sx={{ mt: 1 }}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Card>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              href="/products"
              sx={{ borderColor: '#4caf50', color: '#4caf50' }}
            >
              Continue Shopping
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          </Box>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 3, position: 'sticky', top: 20 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                Order Summary
              </Typography>

              {/* Promo Code Section */}
              <Box sx={{ mb: 3 }}>
                {appliedOffer ? (
                  <Alert
                    severity="success"
                    icon={<CheckCircle />}
                    action={
                      <Button size="small" onClick={removePromoCode}>
                        Remove
                      </Button>
                    }
                  >
                    <Typography variant="body2">
                      <strong>{appliedOffer.promoCode}</strong> applied
                    </Typography>
                    <Typography variant="caption">
                      You save KES {discount.toLocaleString()}
                    </Typography>
                  </Alert>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        InputProps={{
                          startAdornment: <LocalOffer sx={{ color: '#ccc', mr: 1 }} />,
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={applyPromoCode}
                        sx={{ background: '#4caf50', whiteSpace: 'nowrap' }}
                      >
                        Apply
                      </Button>
                    </Box>
                    {promoError && (
                      <Typography variant="caption" color="error">
                        {promoError}
                      </Typography>
                    )}
                    {promoSuccess && (
                      <Typography variant="caption" color="success.main">
                        {promoSuccess}
                      </Typography>
                    )}
                  </>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Price Breakdown */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography>KES {subtotal.toLocaleString()}</Typography>
              </Box>

              {discount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="success.main">Discount</Typography>
                  <Typography color="success.main">- KES {discount.toLocaleString()}</Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Delivery</Typography>
                <Chip label="FREE" size="small" color="success" />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                  KES {total.toLocaleString()}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={proceedToCheckout}
                disabled={processing || cartItems.length === 0}
                endIcon={<ArrowForward />}
                sx={{
                  background: 'linear-gradient(45deg, #4caf50 30%, #81c784 90%)',
                  py: 1.5,
                  fontWeight: 'bold',
                }}
              >
                {processing ? 'Processing...' : 'Proceed to Checkout'}
              </Button>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
                Secure checkout powered by M-Pesa & Stripe
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
