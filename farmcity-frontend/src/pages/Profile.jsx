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
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import { Person, Email, Phone, LocationOn, Map } from '@mui/icons-material';
import { motion } from 'framer-motion';
import GoogleMapPicker from '../components/GoogleMapPicker';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    deliveryAddress: user?.deliveryAddress || '',
    city: user?.city || '',
    county: user?.county || '',
    latitude: user?.latitude || null,
    longitude: user?.longitude || null,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLocationSelect = (location) => {
    setFormData({
      ...formData,
      deliveryAddress: location.address || formData.deliveryAddress,
      latitude: location.lat,
      longitude: location.lng,
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

  const steps = [
    {
      label: 'Personal Information',
      description: 'Update your basic profile information',
    },
    {
      label: 'Delivery Address',
      description: 'Set your delivery location using the map',
    },
    {
      label: 'Review',
      description: 'Review and save your changes',
    },
  ];

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

            <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 4 }}>
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel onClick={() => setActiveStep(index)}>
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {step.description}
                    </Typography>

                    {index === 0 && (
                      <Grid container spacing={2}>
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
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            onClick={() => setActiveStep(1)}
                            sx={{ background: '#4caf50', mt: 2 }}
                          >
                            Next
                          </Button>
                        </Grid>
                      </Grid>
                    )}

                    {index === 1 && (
                      <>
                        <Card variant="outlined" sx={{ mb: 3 }}>
                          <CardContent>
                            <Grid container spacing={2}>
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
                          </CardContent>
                        </Card>

                        <Box sx={{ mb: 2 }}>
                          <Button
                            variant={showMap ? 'outlined' : 'contained'}
                            startIcon={<Map />}
                            onClick={() => setShowMap(!showMap)}
                            sx={{ background: showMap ? 'transparent' : '#4caf50' }}
                          >
                            {showMap ? 'Hide Map' : 'Select on Map'}
                          </Button>
                        </Box>

                        {showMap && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                          >
                            <GoogleMapPicker
                              initialPosition={
                                formData.latitude && formData.longitude
                                  ? { lat: formData.latitude, lng: formData.longitude }
                                  : { lat: -1.2921, lng: 36.8219 }
                              }
                              initialAddress={formData.deliveryAddress}
                              onLocationSelect={handleLocationSelect}
                              height="300px"
                            />
                          </motion.div>
                        )}

                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                          <Button variant="outlined" onClick={() => setActiveStep(0)}>
                            Back
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => setActiveStep(2)}
                            sx={{ background: '#4caf50' }}
                          >
                            Next
                          </Button>
                        </Box>
                      </>
                    )}

                    {index === 2 && (
                      <>
                        <Card variant="outlined" sx={{ mb: 3 }}>
                          <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                              Profile Summary
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                  Name
                                </Typography>
                                <Typography variant="body1">
                                  {formData.firstName} {formData.lastName}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                  Phone
                                </Typography>
                                <Typography variant="body1">
                                  {formData.phoneNumber || 'Not set'}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">
                                  Delivery Address
                                </Typography>
                                <Typography variant="body1">
                                  {formData.deliveryAddress || 'Not set'}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                  City/County
                                </Typography>
                                <Typography variant="body1">
                                  {formData.city}, {formData.county}
                                </Typography>
                              </Grid>
                              {formData.latitude && formData.longitude && (
                                <Grid item xs={12} sm={6}>
                                  <Typography variant="body2" color="text.secondary">
                                    GPS Coordinates
                                  </Typography>
                                  <Typography variant="body1">
                                    <LocationOn sx={{ fontSize: 16, verticalAlign: 'middle' }} />
                                    {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                                  </Typography>
                                </Grid>
                              )}
                            </Grid>
                          </CardContent>
                        </Card>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Button variant="outlined" onClick={() => setActiveStep(1)}>
                            Back
                          </Button>
                          <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={loading}
                            sx={{
                              background: 'linear-gradient(45deg, #4caf50 30%, #81c784 90%)',
                              px: 4,
                            }}
                          >
                            {loading ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </Box>
                      </>
                    )}
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Profile;
