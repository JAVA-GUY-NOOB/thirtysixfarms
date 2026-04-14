import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Alert,
} from '@mui/material';
import { Person, Email, Phone, LocationOn } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    deliveryAddress: user?.deliveryAddress || '',
    city: user?.city || '',
    county: user?.county || '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    const result = await updateProfile(formData);

    setLoading(false);

    if (result.success) {
      setMessage('Profile updated successfully!');
    } else {
      setError(result.error || 'Failed to update profile');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
              p: 4,
              textAlign: 'center',
              color: '#fff',
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 2,
                bgcolor: '#fff',
                color: '#4caf50',
                fontSize: '2.5rem',
              }}
            >
              {user?.firstName?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              @{user?.username}
            </Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            {message && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {message}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Personal Information
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={user?.email}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                Delivery Address
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="County"
                    name="county"
                    value={formData.county}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    px: 6,
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #4caf50 30%, #81c784 90%)',
                    fontWeight: 'bold',
                  }}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Profile;
