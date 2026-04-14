const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// Helper to get auth token
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

// Generic API helper
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

// Rice Products API
export const riceAPI = {
  getAll: () => apiRequest('/api/rice-products'),
  getById: (id) => apiRequest(`/api/rice-products/${id}`),
  create: (product) => apiRequest('/api/rice-products', {
    method: 'POST',
    body: JSON.stringify(product),
  }),
  update: (id, product) => apiRequest(`/api/rice-products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  }),
  delete: (id) => apiRequest(`/api/rice-products/${id}`, {
    method: 'DELETE',
  }),
  seed: () => apiRequest('/api/rice-products/seed', { method: 'POST' }),
};

// Cart API
export const cartAPI = {
  getItems: () => apiRequest('/api/cart'),
  addItem: (productId, quantity = 1) => apiRequest('/api/cart/add', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  }),
  updateItem: (itemId, quantity) => apiRequest(`/api/cart/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  }),
  removeItem: (itemId) => apiRequest(`/api/cart/${itemId}`, {
    method: 'DELETE',
  }),
  clear: () => apiRequest('/api/cart/clear', { method: 'DELETE' }),
};

// Orders API
export const orderAPI = {
  getAll: () => apiRequest('/api/orders'),
  getById: (id) => apiRequest(`/api/orders/${id}`),
  create: (orderData) => apiRequest('/api/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  updateStatus: (id, status) => apiRequest(`/api/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
};

// Payment API
export const paymentAPI = {
  createIntent: (amount, currency = 'USD', email) => apiRequest('/api/payments/intent', {
    method: 'POST',
    body: JSON.stringify({ amount, currency, email }),
  }),
  confirm: (clientSecret) => apiRequest('/api/payments/confirm', {
    method: 'POST',
    body: JSON.stringify({ clientSecret }),
  }),
  processOrder: (orderData) => apiRequest('/api/payments/process-order', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
};

// MPESA API
export const mpesaAPI = {
  initiateStkPush: (phone, amount, reference = 'ORDER') => apiRequest('/api/mpesa/stkpush', {
    method: 'POST',
    body: JSON.stringify({ phone, amount, reference }),
  }),
  checkStatus: (checkoutRequestId) => apiRequest(`/api/mpesa/status/${checkoutRequestId}`),
};

// Reviews API
export const reviewAPI = {
  getAll: () => apiRequest('/api/reviews'),
  getByProductId: (productId) => apiRequest(`/api/reviews/product/${productId}`),
  create: (review) => apiRequest('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(review),
  }),
  update: (id, review) => apiRequest(`/api/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(review),
  }),
  delete: (id) => apiRequest(`/api/reviews/${id}`, {
    method: 'DELETE',
  }),
};

// FAQ API
export const faqAPI = {
  getAll: () => apiRequest('/api/faqs'),
  create: (faq) => apiRequest('/api/faqs', {
    method: 'POST',
    body: JSON.stringify(faq),
  }),
};

// Newsletter API
export const newsletterAPI = {
  subscribe: (email) => apiRequest('/api/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
};

// Contact API
export const contactAPI = {
  submit: (contactData) => apiRequest('/api/contact', {
    method: 'POST',
    body: JSON.stringify(contactData),
  }),
};

// Testimonials API
export const testimonialAPI = {
  getAll: () => apiRequest('/api/testimonials'),
  create: (testimonial) => apiRequest('/api/testimonials', {
    method: 'POST',
    body: JSON.stringify(testimonial),
  }),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => apiRequest('/api/admin/dashboard-stats'),
  getOrders: (filters = {}) => apiRequest(`/api/admin/orders?${new URLSearchParams(filters)}`),
  getUsers: () => apiRequest('/api/admin/users'),
  updateOrderStatus: (id, status) => apiRequest(`/api/admin/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  getRevenueData: (period = 'month') => apiRequest(`/api/admin/revenue?period=${period}`),
  getOrdersByCounty: () => apiRequest('/api/admin/orders-by-county'),
};

export default {
  riceAPI,
  cartAPI,
  orderAPI,
  paymentAPI,
  mpesaAPI,
  reviewAPI,
  faqAPI,
  newsletterAPI,
  contactAPI,
  testimonialAPI,
  adminAPI,
};
