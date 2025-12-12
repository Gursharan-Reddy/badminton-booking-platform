import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const loadUser = async (userToken) => {
    try {
      if (userToken) {
        // Token format: header.payload.signature
        const [header, payload, signature] = userToken.split('.');

        const decodedPayload = JSON.parse(atob(payload));
        setUser(decodedPayload.user);
      }
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser(token);
  }, [token]);

  const login = (userData, userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
