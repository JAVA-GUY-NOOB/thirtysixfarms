import React, { useState } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  Box,
  Button,
  CircularProgress,
  Alert,
  Typography,
  Paper,
} from '@mui/material';
import { paymentAPI } from '../api/farmcityApi';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const StripePaymentForm = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create payment intent
      const { clientSecret } = await paymentAPI.createIntent(amount, 'KES');

      // Confirm card payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: 'Customer',
            },
          },
        }
      );

      if (confirmError) {
        setError(confirmError.message);
        onError?.(confirmError.message);
      } else {
        setSucceeded(true);
        onSuccess?.(paymentIntent);
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      onError?.(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Card Payment
      </Typography>

      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        Amount to pay: <strong>KES {amount?.toLocaleString()}</strong>
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {succeeded ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          Payment successful! Thank you for your purchase.
        </Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!stripe || processing}
            sx={{
              py: 1.5,
              background: 'linear-gradient(45deg, #4caf50 30%, #81c784 90%)',
              fontWeight: 'bold',
            }}
          >
            {processing ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: '#fff' }} />
                Processing...
              </>
            ) : (
              `Pay KES ${amount?.toLocaleString()}`
            )}
          </Button>
        </form>
      )}
    </Paper>
  );
};

export default StripePaymentForm;
