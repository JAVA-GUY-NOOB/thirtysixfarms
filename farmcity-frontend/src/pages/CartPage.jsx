import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cartAPI, paymentAPI } from '../api/farmcityApi';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const items = await cartAPI.getItems();
      setCartItems(items);
      calculateTotal(items);
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
      // Fallback to mock data if API fails
      const mockItems = [
        {
          id: 1,
          productId: 1,
          productName: "Premium Basmati Rice",
          price: 15.99,
          quantity: 2,
          image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
        },
        {
          id: 2,
          productId: 2,
          productName: "Organic Brown Rice",
          price: 12.99,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80"
        }
      ];
      setCartItems(mockItems);
      calculateTotal(mockItems);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(totalAmount);
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await cartAPI.updateItem(itemId, newQuantity);
      const updatedItems = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      alert('Failed to update quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartAPI.removeItem(itemId);
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error) {
      console.error('Failed to remove item:', error);
      alert('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCartItems([]);
      setTotal(0);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      alert('Failed to clear cart');
    }
  };

  const proceedToCheckout = async () => {
    try {
      const orderData = {
        items: cartItems,
        total: total,
        email: 'customer@example.com' // In real app, get from user login
      };
      
      const paymentResult = await paymentAPI.processOrder(orderData);
      alert(`Order placed successfully! Order ID: ${paymentResult.orderId}`);
      
      // Clear cart after successful order
      await clearCart();
    } catch (error) {
      console.error('Failed to process order:', error);
      alert('Failed to process order. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        fontSize: '1.2rem',
        color: '#4caf50'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e3c770',
            borderTop: '4px solid #4caf50',
            borderRadius: '50%',
            marginRight: '1rem'
          }}
        />
        Loading cart...
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          maxWidth: '600px',
          margin: '0 auto'
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🛒</div>
        <h2 style={{ color: '#4caf50', marginBottom: '1rem' }}>Your Cart is Empty</h2>
        <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1.1rem' }}>
          Looks like you haven't added any items to your cart yet.
        </p>
        <motion.a
          href="/products"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'inline-block',
            background: 'linear-gradient(120deg, #e3c770 0%, #4caf50 100%)',
            color: '#fff',
            padding: '1rem 2rem',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}
        >
          Continue Shopping
        </motion.a>
      </motion.div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: '2.5rem',
          color: '#4caf50',
          textAlign: 'center',
          marginBottom: '2rem'
        }}
      >
        🛒 Your Shopping Cart
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {cartItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1.5rem',
              margin: '1rem 0',
              background: 'rgba(76, 175, 80, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(76, 175, 80, 0.2)',
              gap: '1rem'
            }}
          >
            <img
              src={item.image}
              alt={item.productName}
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
            
            <div style={{ flex: 1 }}>
              <h3 style={{ color: '#4caf50', margin: '0 0 0.5rem 0' }}>
                {item.productName}
              </h3>
              <p style={{ color: '#666', margin: 0 }}>
                ${item.price.toFixed(2)} each
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  border: '2px solid #4caf50',
                  background: 'transparent',
                  color: '#4caf50',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                -
              </button>
              
              <span style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                minWidth: '2rem',
                textAlign: 'center'
              }}>
                {item.quantity}
              </span>
              
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  border: '2px solid #4caf50',
                  background: 'transparent',
                  color: '#4caf50',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                +
              </button>
            </div>

            <div style={{ textAlign: 'right' }}>
              <p style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: '#4caf50',
                margin: '0 0 0.5rem 0'
              }}>
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeItem(item.id)}
                style={{
                  background: 'transparent',
                  border: '1px solid #f44336',
                  color: '#f44336',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Remove
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          marginTop: '2rem',
          padding: '2rem',
          background: 'linear-gradient(120deg, rgba(227, 199, 112, 0.1) 0%, rgba(76, 175, 80, 0.1) 100%)',
          borderRadius: '12px',
          textAlign: 'center'
        }}
      >
        <h3 style={{
          fontSize: '1.8rem',
          color: '#4caf50',
          margin: '0 0 1rem 0'
        }}>
          Total: ${total.toFixed(2)}
        </h3>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearCart}
            style={{
              background: 'transparent',
              border: '2px solid #f44336',
              color: '#f44336',
              padding: '0.8rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Clear Cart
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={proceedToCheckout}
            style={{
              background: 'linear-gradient(120deg, #e3c770 0%, #4caf50 100%)',
              border: 'none',
              color: '#fff',
              padding: '0.8rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(76,175,80,0.3)'
            }}
          >
            Proceed to Checkout
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default CartPage;
