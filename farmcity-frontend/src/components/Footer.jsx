import React from 'react';

const Footer = () => (
  <footer style={{
    background: 'linear-gradient(90deg, #4caf50 0%, #e3c770 100%)',
    color: '#fff',
    padding: '2rem 1rem',
    borderRadius: '16px 16px 0 0',
    boxShadow: '0 -2px 8px rgba(76,175,80,0.12)',
    marginTop: '2rem',
    textAlign: 'center'
  }}>
    <p style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem' }}>
      &copy; {new Date().getFullYear()} Farmcity. All rights reserved.
    </p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '1.5rem' }}>
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>
        <span role="img" aria-label="Facebook">&#x1F426;</span>
      </a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>
        <span role="img" aria-label="Twitter">&#x1F426;</span>
      </a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>
        <span role="img" aria-label="Instagram">&#x1F33F;</span>
      </a>
    </div>
  </footer>
);

export default Footer;
