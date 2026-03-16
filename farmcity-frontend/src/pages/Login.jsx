import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/farmcityApi';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const response = await authAPI.login({ email, password });
        localStorage.setItem('farmcity_token', response.token || 'dummy');
        localStorage.setItem('farmcity_userId', response.userId || response.user?.id || '1');
        localStorage.setItem('farmcity_email', response.user?.email || email);
        localStorage.setItem('farmcity_name', response.user?.name || response.user?.username || name || 'Farmcity Shopper');
        navigate('/products');
      } else {
        await authAPI.register({ name, email, password });
        alert('Registration successful! You can now log in.');
        setMode('login');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to login/register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '2rem auto', background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#4caf50' }}>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.65rem' }}>
        {mode === 'register' && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />
        )}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
          style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          required
          style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
        />
        {error && <div style={{ color: '#d32f2f', fontSize: '0.9rem' }}>{error}</div>}
        <button type="submit" style={{ padding: '0.7rem', borderRadius: '8px', border: 'none', background: '#4caf50', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }} disabled={loading}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '0.8rem', color: '#374151' }}>
        {mode === 'login' ? (
          <button onClick={() => setMode('register')} style={{ border: 'none', background: 'transparent', color: '#4caf50', cursor: 'pointer' }}>
            Don't have an account? Register
          </button>
        ) : (
          <button onClick={() => setMode('login')} style={{ border: 'none', background: 'transparent', color: '#4caf50', cursor: 'pointer' }}>
            Already have an account? Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Login;
