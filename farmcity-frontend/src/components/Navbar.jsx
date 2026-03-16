import React from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Navbar = () => {
  const userName = localStorage.getItem('farmcity_name');
  const userEmail = localStorage.getItem('farmcity_email');

  const handleLogout = () => {
    localStorage.removeItem('farmcity_token');
    localStorage.removeItem('farmcity_userId');
    localStorage.removeItem('farmcity_email');
    localStorage.removeItem('farmcity_name');
    window.location.href = '/login';
  };

  return (
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
        <a href="/" style={{ color: '#fff', textDecoration: 'none', marginRight: '1.25rem', fontWeight: '500' }}>Home</a>
        <a href="/products" style={{ color: '#fff', textDecoration: 'none', marginRight: '1.25rem', fontWeight: '500' }}>Products</a>
        <a href="/rice-list" style={{ color: '#fff', textDecoration: 'none', marginRight: '1.25rem', fontWeight: '500' }}>Rice</a>
        <a href="/about-us" style={{ color: '#fff', textDecoration: 'none', marginRight: '1.25rem', fontWeight: '500' }}>About</a>
        <a href="/contact" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>Contact</a>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {userName ? (
          <span style={{ fontWeight: '600', color: '#fff', marginRight: '0.4rem' }} title={userEmail}>
            Hi, {userName}
          </span>
        ) : null}
        {userName ? (
          <button onClick={handleLogout} style={{ borderRadius: '8px', border: 'none', background: '#fff', color: '#4caf50', padding: '0.35rem 0.7rem', fontWeight: 'bold', cursor: 'pointer' }}>
            Logout
          </button>
        ) : (
          <a href="/login" style={{ borderRadius: '8px', background: '#fff', color: '#4caf50', padding: '0.35rem 0.7rem', textDecoration: 'none', fontWeight: 'bold' }}>
            Login
          </a>
        )}
        <a href="/cart" className="golden-btn" style={{ textDecoration: 'none', fontSize: '1rem', display: 'flex', alignItems: 'center', marginLeft: '0.4rem' }}>
          <ShoppingCartIcon style={{ marginRight: '5px', fontSize: '1.35rem' }} /> Cart
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
