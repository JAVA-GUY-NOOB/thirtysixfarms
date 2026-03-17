import React from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Navbar = () => (
  <nav style={{
    background: 'linear-gradient(90deg, #e3c770 60%, #4caf50 100%)',
    color: '#fff',
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: '0 0 16px 16px',
    boxShadow: '0 2px 8px rgba(76,175,80,0.12)'
  }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{
        fontWeight: 'bold',
        fontSize: '1.5rem',
        marginRight: '2rem',
        letterSpacing: '2px',
        color: '#fff',
        textShadow: '0 2px 8px rgba(76,175,80,0.18)'
      }}>🌾 Farmcity</span>
      <a href="/" style={{ color: '#fff', textDecoration: 'none', marginRight: '1.5rem', fontWeight: '500' }}>Home</a>
      <a href="/products" style={{ color: '#fff', textDecoration: 'none', marginRight: '1.5rem', fontWeight: '500' }}>Products</a>
      <a href="/rice-list" style={{ color: '#fff', textDecoration: 'none', marginRight: '1.5rem', fontWeight: '500' }}>Rice</a>
      <a href="/about-us" style={{ color: '#fff', textDecoration: 'none', marginRight: '1.5rem', fontWeight: '500' }}>About</a>
      <a href="/contact" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>Contact</a>
    </div>
    <div>
      <a href="/cart" className="golden-btn" style={{ textDecoration: 'none', fontSize: '1.5rem', display: 'flex', alignItems: 'center' }}>
        <ShoppingCartIcon style={{ marginRight: '6px', fontSize: '1.7rem' }} />
        Cart
      </a>
    </div>
  </nav>
);

export default Navbar;
