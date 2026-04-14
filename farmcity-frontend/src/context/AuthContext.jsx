import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const setAuthToken = useCallback((newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      setToken(newToken);
    } else {
      localStorage.removeItem('token');
      setToken(null);
    }
  }, []);

  const fetchCurrentUser = useCallback(async (authToken) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          return data.user;
        }
      }
      // If token is invalid, clear it
      setAuthToken(null);
      setUser(null);
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }, [setAuthToken]);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        await fetchCurrentUser(storedToken);
      }
      setLoading(false);
    };

    initAuth();
  }, [fetchCurrentUser]);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setAuthToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        setAuthToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (data.success) {
        setUser({ ...user, ...data.user });
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const isAdmin = () => user?.role === 'ADMIN';

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAdmin,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
