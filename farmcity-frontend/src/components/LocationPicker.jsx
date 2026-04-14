import React, { useState, useCallback } from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker,
} from '@react-google-maps/api';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px',
};

const defaultCenter = {
  lat: -1.2921, // Nairobi, Kenya
  lng: 36.8219,
};

const LocationPicker = ({ onLocationSelect, initialLocation }) => {
  const [marker, setMarker] = useState(initialLocation || defaultCenter);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  });

  const onMapClick = useCallback((e) => {
    const newLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setMarker(newLocation);
    fetchAddress(newLocation);
    onLocationSelect?.(newLocation);
  }, [onLocationSelect]);

  const fetchAddress = async (location) => {
    if (!process.env.REACT_APP_GOOGLE_MAPS_API_KEY) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const formattedAddress = data.results[0].formatted_address;
        setAddress(formattedAddress);
      }
    } catch (err) {
      console.error('Error fetching address:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    onLocationSelect?.({
      lat: marker.lat,
      lng: marker.lng,
      address,
    });
  };

  if (loadError) {
    return (
      <Alert severity="error">
        Error loading Google Maps. Please check your API key.
      </Alert>
    );
  }

  if (!isLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="info">
          Google Maps integration ready. Add REACT_APP_GOOGLE_MAPS_API_KEY to your .env file.
        </Alert>
        <TextField
          fullWidth
          label="Delivery Address"
          placeholder="Enter your delivery address"
          multiline
          rows={3}
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            onLocationSelect?.({ address: e.target.value });
          }}
          sx={{ mt: 2 }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={marker}
        onClick={onMapClick}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        <Marker
          position={marker}
          draggable={true}
          onDragEnd={(e) => {
            const newLocation = {
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            };
            setMarker(newLocation);
            fetchAddress(newLocation);
          }}
        />
      </GoogleMap>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Selected Location: {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} />
            <Typography variant="body2">Fetching address...</Typography>
          </Box>
        ) : (
          <TextField
            fullWidth
            label="Delivery Address"
            multiline
            rows={2}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            InputProps={{
              startAdornment: <LocationOn sx={{ mr: 1, color: '#4caf50' }} />,
            }}
            sx={{ mb: 2 }}
          />
        )}

        <Button
          variant="contained"
          fullWidth
          onClick={handleConfirm}
          sx={{
            background: 'linear-gradient(45deg, #4caf50 30%, #81c784 90%)',
            fontWeight: 'bold',
          }}
        >
          Confirm Location
        </Button>
      </Box>
    </Box>
  );
};

export default LocationPicker;
