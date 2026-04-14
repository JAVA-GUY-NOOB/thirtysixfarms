import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import RiceList from './pages/RiceList';
import AboutUs from './pages/AboutUs';
import CartPage from './pages/CartPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Blog from './pages/Blog';
import AdminDashboard from './pages/AdminDashboard';

// Components
import Navbar from './components/Navbar';
import Checkout from './components/Checkout';
import PaymentModal from './components/PaymentModal';
import Footer from './components/Footer';

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    secondary: {
      main: '#e3c770',
      light: '#ebd896',
      dark: '#b89a4b',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);

  const handlePayment = (amount) => {
    setPaymentAmount(amount);
    setShowPaymentModal(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1, paddingBottom: '2rem' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/rice" element={<RiceList />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout onPayment={handlePayment} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>

            <Footer />

            <PaymentModal
              open={showPaymentModal}
              onClose={() => setShowPaymentModal(false)}
              amount={paymentAmount}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
