import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import { AuthProvider, useAuth } from './context/AuthContext';
import BookingPage from './pages/BookingPage';
import HistoryPage from './pages/HistoryPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import './App.css';

const ProtectedRoute = ({ element, requiredRole }) => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return element;
};

const Home = () => (
  <div className="container" style={{ padding: '32px' }}>
    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Welcome to the Badminton Booking Platform</h1>
    <p style={{ marginTop: '16px' }}>Use the navigation to book a court.</p>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<LoginPage />} />

      {/* Booking now requires login */}
      <Route path="/booking" element={<ProtectedRoute element={<BookingPage />} />} />

      <Route path="/history" element={<ProtectedRoute element={<HistoryPage />} />} />
      <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />} />

      <Route
        path="*"
        element={<div className="container" style={{ color: 'red', padding: '32px' }}>404 - Page Not Found</div>}
      />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <main>
          <AppRoutes />
        </main>
      </AuthProvider>
    </Router>
  );
};

export default App;
