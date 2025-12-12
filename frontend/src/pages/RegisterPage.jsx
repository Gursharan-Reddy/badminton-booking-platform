import React, { useState } from 'react';
import { registerUser } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await registerUser({ name, email, password });
      setMessage('Registration successful! Please log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f4f7fa' }}>
      <div style={{ width: '100%', maxWidth: '448px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', textAlign: 'center', color: '#1f2937' }}>Create New Account</h2>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handleRegister}>
          
          <div className="form-section">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div className="form-section">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>
          
          <div className="form-section">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>
          
          {error && <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', textAlign: 'center' }}>{error}</div>}
          {message && <div style={{ padding: '12px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '8px', textAlign: 'center' }}>{message}</div>}

          <Button type="submit" disabled={loading} variant="primary">
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#4b5563' }}>
          Already have an account? <Link to="/login" style={{ color: '#1e40ff', fontWeight: '600' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;