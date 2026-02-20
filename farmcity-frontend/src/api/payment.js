const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export async function createPaymentIntent({ amount, currency = 'KES', email }) {
  const res = await fetch(`${API_BASE}/api/payments/intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, currency, email })
  });
  if (!res.ok) throw new Error(`Intent failed: ${res.status}`);
  return res.json();
}

export async function confirmPayment({ clientSecret }) {
  const res = await fetch(`${API_BASE}/api/payments/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientSecret })
  });
  if (!res.ok) throw new Error(`Confirm failed: ${res.status}`);
  return res.json();
}

// Convenience end-to-end helper (optional)
export async function mockCharge({ amount, currency = 'KES', email }) {
  const intent = await createPaymentIntent({ amount, currency, email });
  return confirmPayment({ clientSecret: intent.clientSecret });
}

export default { createPaymentIntent, confirmPayment, mockCharge };