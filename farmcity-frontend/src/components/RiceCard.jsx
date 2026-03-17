import React from 'react';
import { motion } from 'framer-motion';
import { cartAPI } from '../api/farmcityApi';
import { formatKES } from '../utils/currency';

const RiceCard = ({ 
  id,
  name = "Premium Rice", 
  price = 12.99, 
  description = "High quality rice",
  image = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
  onAddToCart 
}) => {
  
  const handleAddToCart = async () => {
    try {
      if (id) {
        await cartAPI.addItem(id, 1);
        if (onAddToCart) onAddToCart();
        alert(`${name} added to cart successfully!`);
      } else {
        alert('Product ID not available');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  const formatPrice = (v) => formatKES(v);

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 6px 24px rgba(16,24,40,0.08)' }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: '#fff',
        color: '#1f2937',
        borderRadius: '14px',
        border: '1px solid #eef2f3',
        boxShadow: '0 2px 10px rgba(16,24,40,0.06)',
        padding: '1rem',
        margin: '0.5rem',
        maxWidth: '280px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <img src={image} alt={name} style={{
        width: '100%',
        height: '160px',
        objectFit: 'cover',
        borderRadius: '10px',
        marginBottom: '0.75rem'
      }} />
      <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem' }}>{name}</h3>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '.5rem', marginBottom: '.5rem' }}>
        <span style={{
          display: 'inline-block',
          background: 'rgba(76,175,80,0.08)',
          color: '#2e7d32',
          border: '1px solid rgba(46,125,50,0.15)',
          borderRadius: '999px',
          padding: '.25rem .6rem',
          fontWeight: 700,
          fontSize: '.9rem'
        }}>{formatPrice(price)}</span>
        <span style={{ color: '#6b7280', fontSize: '.8rem' }}>(1kg)</span>
      </div>
      {description && (
        <p style={{ fontSize: '.9rem', marginBottom: '.9rem', color: '#4b5563' }}>{description}</p>
      )}
      <motion.button
        className="golden-btn"
        whileTap={{ scale: 0.97 }}
        onClick={handleAddToCart}
        style={{ 
          cursor: 'pointer'
        }}
      >
        Add to Cart
      </motion.button>
    </motion.div>
  );
};

export default RiceCard;
