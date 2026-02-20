import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MpesaPayment = ({ amount, onPaymentComplete, onCancel }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);

  const formatPhoneNumber = (phone) => {
    // Convert phone number to international format (254...)
    if (phone.startsWith('0')) {
      return '254' + phone.substring(1);
    }
    if (phone.startsWith('+254')) {
      return phone.substring(1);
    }
    if (phone.startsWith('254')) {
      return phone;
    }
    return '254' + phone;
  };

  const initiatePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setPaymentStatus('INITIATING');

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const response = await fetch('http://localhost:8080/api/mpesa/stkpush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formattedPhone,
          amount: Math.round(amount),
          reference: `ORDER_${Date.now()}`,
          description: `Payment for Farmcity Order - KES ${amount}`
        })
      });

      const result = await response.json();
      
      if (result.CheckoutRequestID) {
        setCheckoutRequestId(result.CheckoutRequestID);
        setPaymentStatus('STK_SENT');
        // Start polling for payment status
        pollPaymentStatus(result.CheckoutRequestID);
      } else {
        setPaymentStatus('FAILED');
        alert('Failed to initiate payment: ' + (result.errorMessage || 'Unknown error'));
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('FAILED');
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (requestId) => {
    let attempts = 0;
    const maxAttempts = 30; // Poll for 5 minutes (10s intervals)
    
    const poll = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/mpesa/status/${requestId}`);
        const status = await response.json();
        
        if (status.status === 'CALLBACK_SUCCESS') {
          setPaymentStatus('SUCCESS');
          onPaymentComplete(status);
          return;
        } else if (status.status === 'CALLBACK_FAILED') {
          setPaymentStatus('FAILED');
          return;
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else {
          setPaymentStatus('TIMEOUT');
        }
      } catch (error) {
        console.error('Error polling payment status:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000);
        } else {
          setPaymentStatus('TIMEOUT');
        }
      }
    };
    
    setTimeout(poll, 5000); // Start polling after 5 seconds
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'INITIATING':
        return 'Initiating payment...';
      case 'STK_SENT':
        return 'Payment request sent to your phone. Please enter your M-Pesa PIN to complete the payment.';
      case 'SUCCESS':
        return 'Payment successful! Your order has been confirmed.';
      case 'FAILED':
        return 'Payment failed. Please try again or use a different payment method.';
      case 'TIMEOUT':
        return 'Payment timeout. Please try again or contact support.';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'SUCCESS':
        return '#4caf50';
      case 'FAILED':
      case 'TIMEOUT':
        return '#f44336';
      default:
        return '#ff9800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: 'linear-gradient(135deg, #e3c770 0%, #4caf50 100%)',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(76,175,80,0.2)',
        color: '#fff',
        maxWidth: '500px',
        margin: '0 auto'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
          M-Pesa Payment
        </h2>
        <p style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
          KES {amount.toLocaleString()}
        </p>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '1.5rem'
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="e.g., 0712345678"
            disabled={loading || paymentStatus === 'STK_SENT'}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1rem',
              backgroundColor: '#fff',
              color: '#333'
            }}
          />
          <small style={{ opacity: 0.8, display: 'block', marginTop: '0.5rem' }}>
            Enter your M-Pesa registered phone number
          </small>
        </div>
      </div>

      {paymentStatus && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'center',
            border: `2px solid ${getStatusColor()}`
          }}
        >
          <p style={{ margin: 0, fontWeight: 'bold' }}>
            {getStatusMessage()}
          </p>
          {paymentStatus === 'STK_SENT' && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{
                width: '20px',
                height: '20px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid #fff',
                borderRadius: '50%',
                margin: '1rem auto'
              }}
            />
          )}
        </motion.div>
      )}

      <div style={{ display: 'flex', gap: '1rem' }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={initiatePayment}
          disabled={loading || paymentStatus === 'STK_SENT' || paymentStatus === 'SUCCESS'}
          style={{
            flex: 1,
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            backgroundColor: paymentStatus === 'SUCCESS' ? '#4caf50' : '#fff',
            color: paymentStatus === 'SUCCESS' ? '#fff' : '#333',
            opacity: loading || paymentStatus === 'STK_SENT' ? 0.7 : 1
          }}
        >
          {loading ? 'Processing...' : 
           paymentStatus === 'SUCCESS' ? '✓ Payment Complete' : 
           paymentStatus === 'STK_SENT' ? 'Waiting for Payment...' : 
           'Pay with M-Pesa'}
        </motion.button>

        {(paymentStatus === 'FAILED' || paymentStatus === 'TIMEOUT' || !paymentStatus) && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: '2px solid rgba(255,255,255,0.5)',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              color: '#fff'
            }}
          >
            Cancel
          </motion.button>
        )}
      </div>

      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '8px',
        fontSize: '0.9rem'
      }}>
        <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>📱 How to pay:</p>
        <ol style={{ margin: 0, paddingLeft: '1.2rem' }}>
          <li>Click "Pay with M-Pesa"</li>
          <li>Check your phone for M-Pesa prompt</li>
          <li>Enter your M-Pesa PIN</li>
          <li>Confirm the payment</li>
        </ol>
      </div>
    </motion.div>
  );
};

export default MpesaPayment;