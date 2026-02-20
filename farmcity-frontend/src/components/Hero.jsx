import React from 'react';


const Hero = () => (
  <section style={{
    background: 'linear-gradient(120deg, #e3c770 0%, #4caf50 100%)',
    color: '#fff',
    padding: '4rem 2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(76,175,80,0.15)',
    marginBottom: '2rem',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <h1 style={{
      fontSize: '3rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      textShadow: '0 2px 8px rgba(76,175,80,0.18)'
    }}>
      Welcome to Farmcity
    </h1>
    <p style={{
      fontSize: '1.3rem',
      marginBottom: '2rem',
      fontWeight: '500'
    }}>
      Discover premium rice products and farm-fresh deals!
    </p>
    <button className="golden-btn">
      Shop Now
    </button>
  </section>
);

export default Hero;
