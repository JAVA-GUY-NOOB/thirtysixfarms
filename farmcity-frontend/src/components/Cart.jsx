import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cartAPI } from '../api/farmcityApi';
import MpesaPayment from './MpesaPayment';
import { formatKES } from '../utils/currency';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const userId = localStorage.getItem('farmcity_userId');
    if (!userId) {
      window.location.href = '/login';
      return;
    }
    fetchCartItems();
  }, []);

  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
  const response = await cartAPI.getItems();
      setCartItems(response || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Mock data for testing
      setCartItems([
        { id: 1, name: 'Premium Basmati Rice', price: 1200, quantity: 2,  image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' },
        { id: 2, name: 'Organic Brown Rice', price: 800, quantity: 1, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    try {
  await cartAPI.updateItem(itemId, newQuantity);
      setCartItems(items =>
        items.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Update locally for demo
      setCartItems(items =>
        items.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = async (itemId) => {
    try {
  await cartAPI.removeItem(itemId);
      setCartItems(items => items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
      // Remove locally for demo
      setCartItems(items => items.filter(item => item.id !== itemId));
    }
  };

  const handlePaymentComplete = (paymentResult) => {
    console.log('Payment completed:', paymentResult);
    alert('Payment successful! Your order has been confirmed.');
    setCartItems([]);
    setShowPayment(false);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        fontSize: '1.2rem'
      }}>
        Loading cart...
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '0 1rem'
    }}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          textAlign: 'center',
          marginBottom: '2rem',
          fontSize: '2.5rem',
          background: 'linear-gradient(45deg, #e3c770, #4caf50)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}
      >
        🛒 Your Cart
      </motion.h1>

      <AnimatePresence>
        {showPayment ? (
          <MpesaPayment
            amount={total}
            onPaymentComplete={handlePaymentComplete}
            onCancel={handlePaymentCancel}
          />
        ) : (
          <div>
            {cartItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  textAlign: 'center',
                  padding: '3rem',
                  background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '1rem' }}>
                  Your cart is empty
                </p>
                <motion.a
                  href="/products"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    background: 'linear-gradient(45deg, #e3c770, #4caf50)',
                    color: '#fff',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold'
                  }}
                >
                  Continue Shopping
                </motion.a>
              </motion.div>
            ) : (
              <div>
                <div style={{ marginBottom: '2rem' }}>
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '1.5rem',
                        marginBottom: '1rem',
                        background: 'linear-gradient(135deg, #fff 0%, #f9f9f9 100%)',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        gap: '1rem'
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                      
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
                          {item.name}
                        </h3>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#4caf50' }}>
                          {formatKES(item.price)}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: '2px solid #e3c770',
                            background: '#fff',
                            color: '#e3c770',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          -
                        </motion.button>
                        
                        <span style={{
                          minWidth: '40px',
                          textAlign: 'center',
                          fontSize: '1.1rem',
                          fontWeight: 'bold'
                        }}>
                          {item.quantity}
                        </span>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: '2px solid #4caf50',
                            background: '#4caf50',
                            color: '#fff',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          +
                        </motion.button>
                      </div>

                      <div style={{ textAlign: 'right', minWidth: '100px' }}>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 'bold' }}>
                          {formatKES(item.price * item.quantity)}
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeItem(item.id)}
                          style={{
                            padding: '4px 8px',
                            background: '#ff4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'linear-gradient(135deg, #e3c770 0%, #4caf50 100%)',
                    padding: '2rem',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(76,175,80,0.2)',
                    color: '#fff',
                    textAlign: 'center'
                  }}
                >
                  <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.8rem' }}>
                    Total: {formatKES(total)}
                  </h2>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPayment(true)}
                    style={{
                      padding: '15px 40px',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      background: '#fff',
                      color: '#4caf50',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(255,255,255,0.3)'
                    }}
                  >
                    💳 Pay with M-Pesa
                  </motion.button>
                  
                  <p style={{ margin: '1rem 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
                    Secure payment powered by Safaricom M-Pesa
                  </p>
                </motion.div>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
