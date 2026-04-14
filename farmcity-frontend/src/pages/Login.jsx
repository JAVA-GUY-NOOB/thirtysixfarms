import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.username, formData.password);

    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={3}
          sx={{
            marginTop: 8,
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #fff 0%, #f5f5f5 100%)',
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#4caf50',
              mb: 3,
            }}
          >
            Welcome Back
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #4caf50 30%, #81c784 90%)',
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1.1rem',
                '&:hover': {
                  background: 'linear-gradient(45deg, #388e3c 30%, #66bb6a 90%)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                style={{
                  color: '#4caf50',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Login;
