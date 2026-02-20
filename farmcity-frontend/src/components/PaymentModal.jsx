import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { createPaymentIntent, confirmPayment } from '../api/payment';
import { formatKES } from '../utils/currency';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const PaymentModal = () => {
  const { total, items, clear } = useCart();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState('idle'); // idle | intent | confirming | done | error
  const [clientSecret, setClientSecret] = useState(null);
  const [errorDetail, setErrorDetail] = useState(null);
  const [method, setMethod] = useState('card'); // card | mpesa
  const [phone, setPhone] = useState('2547');
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const pollRef = useRef(null);

  useEffect(() => {
    if (method === 'mpesa' && checkoutRequestId && phase === 'done') {
      // Begin polling for callback status
      let attempts = 0;
      pollRef.current = setInterval(async () => {
        attempts++;
        try {
          const r = await fetch(`${API_BASE}/api/mpesa/status/${checkoutRequestId}`);
          if (r.status === 200) {
            const json = await r.json();
            if (json.status && json.status.startsWith('CALLBACK_')) {
              clearInterval(pollRef.current);
              if (json.status === 'CALLBACK_SUCCESS') {
                setStatus('M-Pesa payment successful');
              } else {
                setStatus('M-Pesa payment failed');
                setErrorDetail(JSON.stringify(json, null, 2));
              }
              setPhase('done');
            }
          }
          if (attempts > 30) { // stop after ~30 attempts
            clearInterval(pollRef.current);
            setStatus(s => s + ' (No callback yet)');
          }
        } catch (e) {
          clearInterval(pollRef.current);
        }
      }, 4000);
      return () => clearInterval(pollRef.current);
    }
  }, [method, checkoutRequestId, phase]);

  const startPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setErrorDetail(null);
    setClientSecret(null);
    try {
      if (method === 'card') {
        setPhase('intent');
        console.group('[Payment] Create intent (card)');
        const amount = Math.round(total * 100);
        console.log('Posting intent with amount (cents):', amount);
  const intent = await createPaymentIntent({ amount, currency: 'KES', email });
        console.log('Intent response:', intent);
        setClientSecret(intent.clientSecret);
        setPhase('confirming');
        console.groupEnd();
        console.group('[Payment] Confirm');
        const confirm = await confirmPayment({ clientSecret: intent.clientSecret });
        console.log('Confirm response:', confirm);
        console.groupEnd();
        const success = confirm.status === 'succeeded';
        setStatus(success ? 'Payment successful!' : 'Payment failed');
        setPhase(success ? 'done' : 'error');
        if (success) clear();
      } else {
        // Mpesa Flow
        setPhase('intent');
        console.group('[Payment] Initiate M-Pesa STK Push');
        const orderRef = 'ORDER-' + Date.now(); // placeholder; derive from cart/order system later
        const body = {
          phone,
          amount: Math.round(total),
          reference: orderRef,
          description: 'Cart Payment'
        };
        const resp = await fetch(`${API_BASE}/api/mpesa/stkpush`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await resp.json();
        console.log('STK Push response:', data);
        console.groupEnd();
        if (data.errorCode || data.errorMessage) {
          setStatus('M-Pesa initiation failed');
          setErrorDetail(JSON.stringify(data, null, 2));
          setPhase('error');
        } else {
          setStatus('M-Pesa push sent. Awaiting confirmation…');
          setCheckoutRequestId(data.CheckoutRequestID || null);
          setPhase('done');
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      setStatus('Error processing payment');
      setErrorDetail(err.message || String(err));
      setPhase('error');
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    setStatus(null);
    setErrorDetail(null);
    setClientSecret(null);
    setPhase('idle');
  };

  if (!items.length) {
    return <div style={{ marginTop: '2rem' }}><em>Your cart is empty.</em></div>;
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <button className="golden-btn" onClick={() => setOpen(o => !o)}>
        {open ? 'Close Payment' : 'Proceed to Pay'} ({formatKES(total)})
      </button>
      {open && (
        <form onSubmit={startPayment} style={{
          marginTop: '1rem',
          padding: '1.5rem',
          background: 'rgba(255,255,255,0.9)',
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          maxWidth: '420px'
        }}>
          <h3 style={{ marginTop: 0 }}>Payment</h3>
          <div style={{ marginBottom: '0.75rem' }}>
            <label>Name<br />
              <input required value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
            </label>
          </div>
            <div style={{ marginBottom: '0.75rem' }}>
            <label>Email<br />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
            </label>
          </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label>Method<br />
                <select value={method} onChange={e => setMethod(e.target.value)} style={{ width:'100%', padding:'0.5rem' }}>
                  <option value="card">Card (Mock)</option>
                  <option value="mpesa">M-Pesa</option>
                </select>
              </label>
            </div>
            {method === 'mpesa' && (
              <div style={{ marginBottom: '0.75rem' }}>
                <label>Phone (MSISDN)<br />
                  <input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="2547XXXXXXXX" style={{ width:'100%', padding:'0.5rem' }} />
                </label>
                <div style={{ fontSize:'0.7rem', opacity:0.7, marginTop:'0.25rem' }}>Use sandbox phone format 2547XXXXXXXX</div>
              </div>
            )}
          <div style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>
            Items: {items.map(i => `${i.name} x${i.qty}`).join(', ')}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button className="golden-btn" type="submit" disabled={loading || phase==='done'}>
              {loading ? 'Processing…' : phase==='done' ? 'Completed' : `Pay ${formatKES(total)}`}
            </button>
            {phase === 'error' && (
              <button type="button" onClick={retry} style={{ background:'#fff3cd', border:'1px solid #f0ad4e', padding:'0.5rem 1rem', borderRadius:6 }}>
                Retry
              </button>
            )}
          </div>
          {status && <div style={{ marginTop: '0.75rem', fontWeight: 'bold' }}>{status}</div>}
          {phase !== 'idle' && (
            <div style={{ marginTop: '0.5rem', fontSize:'0.75rem', opacity:0.75 }}>
              Phase: {phase}{clientSecret && phase!=='idle' && <>
                {' '}| clientSecret: <code>{clientSecret.slice(0,8)}…</code>
              </>}
            </div>
          )}
          {errorDetail && (
            <pre style={{ marginTop:'0.5rem', background:'#fff', padding:'0.5rem', fontSize:'0.7rem', maxHeight:120, overflow:'auto', border:'1px solid #eee' }}>{errorDetail}</pre>
          )}
        </form>
      )}
    </div>
  );
};

export default PaymentModal;
