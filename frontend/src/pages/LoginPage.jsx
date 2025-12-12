import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let userData = { name: 'User', email: email, role: 'user', id: 1 };

      // Base64 payload encoding
      const mockPayload = (role) => {
        const user = {
          name: role === 'admin' ? 'Admin' : 'User',
          email,
          role,
          id: role === 'admin' ? 2 : 1
        };
        return btoa(JSON.stringify({ user }));
      };

      let token;

      // Admin login
      if (email === 'admin@example.com' && password === 'admin123') {
        userData.role = 'admin';
        token = `mock.${mockPayload('admin')}.signature`; // FIXED (only 3 parts)
      }
      // User login
      else if (email === 'user@example.com' && password === 'password123') {
        token = `mock.${mockPayload('user')}.signature`; // FIXED
      }
      else {
        throw new Error('Invalid credentials');
      }

      // Save state
      login(userData, token);

      // Redirect to booking page
      navigate('/booking');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f4f7fa' }}>
      <div style={{ width: '100%', maxWidth: '448px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', textAlign: 'center', color: '#1f2937' }}>Sign in to Account</h2>
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
          Use 'admin@example.com'/'admin123' or 'user@example.com'/'password123'
        </p>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handleLogin}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', marginTop: '4px', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', marginTop: '4px', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }}
            />
          </div>

          {error && (
            <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} style={{ width: '100%' }} variant="primary">
            {loading ? 'Logging in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
