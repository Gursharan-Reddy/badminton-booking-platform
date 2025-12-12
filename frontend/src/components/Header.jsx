import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const Header = () => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="header">
      <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e40ff', textDecoration: 'none' }}>
        Acorn Sports
      </Link>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Link to="/booking" className="header-link">
          Book Court
        </Link>
        {user && (
          <Link to="/history" className="header-link">
            My Bookings
          </Link>
        )}
        {isAdmin && (
          <Link to="/admin" className="header-link">
            Admin
          </Link>
        )}
        {user ? (
          <Button onClick={logout} variant="secondary">
            Logout ({user.name})
          </Button>
        ) : (
          <Link to="/login">
            <Button variant="primary">Login</Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;