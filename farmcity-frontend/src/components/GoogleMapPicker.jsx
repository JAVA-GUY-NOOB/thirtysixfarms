import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import { LocationOn, MyLocation } from '@mui/icons-material';

const GoogleMapPicker = ({
  initialPosition = { lat: -1.2921, lng: 36.8219 }, // Nairobi default
  initialAddress = '',
  onLocationSelect,
  height = '400px',
  readOnly = false,
  showRoute = false,
  deliveryLocation = null, // { lat, lng } for delivery tracking
  apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''
}) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [position, setPosition] = useState(initialPosition);
  const [address, setAddress] = useState(initialAddress);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Reverse geocode to get address
  const reverseGeocode = useCallback((lat, lng) => {
    if (!window.google) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const newAddress = results[0].formatted_address;
        setAddress(newAddress);
        if (onLocationSelect) {
          onLocationSelect({ lat, lng, address: newAddress });
        }
      }
    });
  }, [onLocationSelect]);

  // Load Google Maps API
  const initMap = useCallback(() => {
    if (!window.google) return;

    const mapInstance = new window.google.maps.Map(document.getElementById('google-map-container'), {
      center: initialPosition,
      zoom: 14,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    });

    setMap(mapInstance);

    // Create marker
    const markerInstance = new window.google.maps.Marker({
      position: initialPosition,
      map: mapInstance,
      draggable: !readOnly,
      animation: window.google.maps.Animation.DROP,
    });

    setMarker(markerInstance);

    // Add click listener for marker
    if (!readOnly) {
      markerInstance.addListener('dragend', () => {
        const newPos = markerInstance.getPosition();
        setPosition({ lat: newPos.lat(), lng: newPos.lng() });
        reverseGeocode(newPos.lat(), newPos.lng());
      });

      mapInstance.addListener('click', (e) => {
        markerInstance.setPosition(e.latLng);
        setPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        reverseGeocode(e.latLng.lat(), e.latLng.lng());
      });
    }

    // Initialize directions renderer if showing route
    if (showRoute) {
      const directionsRendererInstance = new window.google.maps.DirectionsRenderer({
        map: mapInstance,
        suppressMarkers: false,
      });
      setDirectionsRenderer(directionsRendererInstance);
    }

    setLoading(false);
  }, [initialPosition, readOnly, showRoute, reverseGeocode]);

  useEffect(() => {
    if (!apiKey) {
      setError('Google Maps API key not configured');
      setLoading(false);
      return;
    }

    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.onerror = () => {
        setError('Failed to load Google Maps');
        setLoading(false);
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, [apiKey, initMap]);

  // Geocode address to get coordinates
  const geocodeAddress = useCallback(() => {
    if (!window.google || !address) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        const newPos = { lat: location.lat(), lng: location.lng() };
        setPosition(newPos);
        if (marker) {
          marker.setPosition(newPos);
        }
        if (map) {
          map.panTo(newPos);
        }
        if (onLocationSelect) {
          onLocationSelect({ ...newPos, address });
        }
      }
    });
  }, [address, map, marker, onLocationSelect]);

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setPosition(newPos);
        if (marker) {
          marker.setPosition(newPos);
        }
        if (map) {
          map.panTo(newPos);
        }
        reverseGeocode(newPos.lat, newPos.lng);
      },
      () => {
        setError('Unable to retrieve your location');
      }
    );
  };

  // Show delivery route
  useEffect(() => {
    if (showRoute && directionsRenderer && map && deliveryLocation && window.google) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: initialPosition, // Store location
          destination: deliveryLocation, // Customer location
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK') {
            directionsRenderer.setDirections(result);

            // Fit bounds to show the entire route
            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend(initialPosition);
            bounds.extend(deliveryLocation);
            map.fitBounds(bounds);
          }
        }
      );
    }
  }, [showRoute, directionsRenderer, map, deliveryLocation, initialPosition]);

  if (error) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', height }}>
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please enter your delivery address manually or try again later.
        </Typography>
        <TextField
          fullWidth
          label="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          sx={{ mt: 2 }}
          multiline
          rows={2}
        />
      </Paper>
    );
  }

  return (
    <Box>
      {!readOnly && (
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Search Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && geocodeAddress()}
          />
          <Button variant="contained" onClick={geocodeAddress}>
            Search
          </Button>
          <Button
            variant="outlined"
            startIcon={<MyLocation />}
            onClick={getCurrentLocation}
          >
            Current
          </Button>
        </Box>
      )}

      <Paper
        elevation={3}
        sx={{
          position: 'relative',
          height,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.8)',
              zIndex: 1,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <div id="google-map-container" style={{ width: '100%', height: '100%' }} />
      </Paper>

      {position && (
        <Box sx={{ mt: 2, p: 2, background: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <LocationOn sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
            Selected Location: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
          </Typography>
          {address && (
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {address}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default GoogleMapPicker;
