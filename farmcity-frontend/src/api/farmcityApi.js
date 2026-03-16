const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

function getAuth() {
  return {
    token: localStorage.getItem('farmcity_token'),
    userId: localStorage.getItem('farmcity_userId'),
    email: localStorage.getItem('farmcity_email')
  };
}

function withUserParams(endpoint) {
  const { userId } = getAuth();
  if (!userId) return endpoint;
  const separator = endpoint.includes('?') ? '&' : '?';
  return `${endpoint}${separator}userId=${encodeURIComponent(userId)}`;
}

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const { token } = getAuth();
  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };
  if (options.body && typeof options.body !== 'string') {
    config.body = JSON.stringify(options.body);
  }
  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errText}`);
    }
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

export const authAPI = {
  register: (data) => apiRequest('/api/auth/register', { method: 'POST', body: data }),
  login: (credentials) => apiRequest('/api/auth/login', { method: 'POST', body: credentials }),
  logout: () => apiRequest('/api/auth/logout', { method: 'POST' }),
  session: () => apiRequest('/api/auth/session'),
};

export const riceAPI = {
  getAll: () => apiRequest('/api/rice-products'),
  search: (q) => apiRequest(`/api/rice-products/search?q=${encodeURIComponent(q)}`),
  getByCategory: (category) => apiRequest(`/api/rice-products/category/${encodeURIComponent(category)}`),
  getById: (id) => apiRequest(`/api/rice-products/${id}`),
  create: (product) => apiRequest('/api/rice-products', { method: 'POST', body: product }),
  update: (id, product) => apiRequest(`/api/rice-products/${id}`, { method: 'PUT', body: product }),
  delete: (id) => apiRequest(`/api/rice-products/${id}`, { method: 'DELETE' }),
};

export const cartAPI = {
  getItems: () => apiRequest(withUserParams('/api/cart')),
  addItem: (productId, quantity = 1) => apiRequest(withUserParams('/api/cart/add'), { method: 'POST', body: { productId, quantity } }),
  updateItem: (itemId, quantity) => apiRequest(withUserParams(`/api/cart/${itemId}`), { method: 'PUT', body: { quantity } }),
  removeItem: (itemId) => apiRequest(withUserParams(`/api/cart/${itemId}`), { method: 'DELETE' }),
  clear: () => apiRequest(withUserParams('/api/cart/clear'), { method: 'DELETE' }),
};

export const orderAPI = {
  getAll: () => apiRequest(withUserParams('/api/orders')),
  getById: (id) => apiRequest(withUserParams(`/api/orders/${id}`)),
  create: (orderData) => {
    const data = {
      ...orderData,
      customerId: getAuth().userId,
    };
    return apiRequest(withUserParams('/api/orders'), { method: 'POST', body: data });
  },
  updateStatus: (id, status) => apiRequest(withUserParams(`/api/orders/${id}/status`), { method: 'PUT', body: { status } }),
};

export const paymentAPI = {
  createIntent: (amount, currency = 'USD', email = '') => apiRequest('/api/payments/intent', { method: 'POST', body: { amount, currency, email } }),
  confirm: (clientSecret) => apiRequest('/api/payments/confirm', { method: 'POST', body: { clientSecret } }),
  processOrder: (orderData) => {
    const data = {
      ...orderData,
      customerId: getAuth().userId,
    };
    return apiRequest('/api/payments/process-order', { method: 'POST', body: data });
  },
};

export const reviewAPI = {
  getAll: () => apiRequest('/api/reviews'),
  getByProductId: (productId) => apiRequest(`/api/reviews/product/${productId}`),
  create: (review) => apiRequest('/api/reviews', { method: 'POST', body: review }),
  update: (id, review) => apiRequest(`/api/reviews/${id}`, { method: 'PUT', body: review }),
  delete: (id) => apiRequest(`/api/reviews/${id}`, { method: 'DELETE' }),
};

export const faqAPI = {
  getAll: () => apiRequest('/api/faqs'),
  create: (faq) => apiRequest('/api/faqs', { method: 'POST', body: faq }),
};

export const newsletterAPI = {
  subscribe: (email) => apiRequest('/api/newsletter/subscribe', { method: 'POST', body: { email } }),
};

export const contactAPI = {
  submit: (contactData) => apiRequest('/api/contact', { method: 'POST', body: contactData }),
};

export const testimonialAPI = {
  getAll: () => apiRequest('/api/testimonials'),
  create: (testimonial) => apiRequest('/api/testimonials', { method: 'POST', body: testimonial }),
};

export const mpesaAPI = {
  initiateStkPush: (phone, amount, reference, description) => apiRequest('/api/mpesa/stk-push', { method: 'POST', body: { phone, amount, reference, description } }),
  callback: (callbackData) => apiRequest('/api/mpesa/callback', { method: 'POST', body: callbackData }),
};

export default {
  authAPI,
  riceAPI,
  cartAPI,
  orderAPI,
  paymentAPI,
  reviewAPI,
  faqAPI,
  newsletterAPI,
  contactAPI,
  testimonialAPI,
  mpesaAPI,
};