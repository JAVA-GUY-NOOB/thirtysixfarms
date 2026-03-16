
import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import RiceList from './pages/RiceList';
import AboutUs from './pages/AboutUs';
import CartPage from './pages/CartPage';
import Login from './pages/Login';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import PaymentModal from './components/PaymentModal';

const themes = {
  light: {
    bodyBg: 'linear-gradient(135deg, #e3c770 0%, #4caf50 100%)',
    appBg: 'rgba(255,255,255,0.85)',
    color: '#222',
    accent: '#4caf50',
    btn: 'Switch to Dark Mode',
    name: 'Light'
  },
  dark: {
    bodyBg: 'linear-gradient(135deg, #222 0%, #4caf50 100%)',
    appBg: 'rgba(34,34,34,0.95)',
    color: '#e3c770',
    accent: '#e3c770',
    btn: 'Switch to Golden-Green',
    name: 'Dark'
  },
  gold: {
    bodyBg: 'linear-gradient(135deg, #e3c770 0%, #4caf50 100%)',
    appBg: 'rgba(227,199,112,0.95)',
    color: '#222',
    accent: '#e3c770',
    btn: 'Switch to Light Mode',
    name: 'Golden-Green'
  }
};

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.style.background = themes[theme].bodyBg;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const nextTheme = () => {
    if (theme === 'light') return setTheme('dark');
    if (theme === 'dark') return setTheme('gold');
    return setTheme('light');
  };

  return (
    <Router>
      <CartProvider>
      <div className="App" style={{
        background: themes[theme].appBg,
        color: themes[theme].color,
        minHeight: '100vh',
        transition: 'background 0.3s, color 0.3s'
      }}>
        <Navbar />
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <h1 style={{ color: themes[theme].accent, margin: 0 }}>Farmcity</h1>
            <div>
              <button className="golden-btn" onClick={nextTheme} style={{ marginRight: '1rem' }}>
                {themes[theme].btn}
              </button>
              <span style={{ fontWeight: 'bold' }}>Theme: {themes[theme].name}</span>
            </div>
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/rice-list" element={<RiceList />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          <PaymentModal />
        </div>
      </div>
      </CartProvider>
    </Router>
  );
}

export default App;
