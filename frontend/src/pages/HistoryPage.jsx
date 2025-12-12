import React, { useState, useEffect } from 'react';
import { getBookings } from '../services/api';
import { useAuth } from '../context/AuthContext';

const HistoryPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading || !user) return;
    
    const fetchHistory = async () => {
      try {
        const response = await getBookings();
        setBookings(response.data);
      } catch (err) {
        setError('Failed to fetch booking history. Please check your token/login.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '32px' }}>Loading...</div>;
  }

  if (!user) {
    return <div className="container" style={{ textAlign: 'center', padding: '32px', color: 'red' }}>Please log in to view your booking history.</div>;
  }

  if (error) {
    return <div className="container" style={{ textAlign: 'center', padding: '32px', color: 'red' }}>{error}</div>;
  }

  return (
    <div className="container">
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '24px' }}>My Booking History</h1>
      
      {bookings.length === 0 ? (
        <div style={{ padding: '16px', backgroundColor: '#fef3c7', color: '#b45309', borderRadius: '8px' }}>You have no confirmed bookings yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {bookings.map((booking) => (
            <div key={booking.id} style={{ padding: '16px', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                  {new Date(booking.startTime).toLocaleDateString()}
                </span>
                <span style={{ padding: '4px 12px', fontSize: '0.875rem', fontWeight: '600', borderRadius: '9999px', backgroundColor: booking.status === 'confirmed' ? '#dcfce7' : '#e5e7eb', color: booking.status === 'confirmed' ? '#166534' : '#374151' }}>
                  {booking.status}
                </span>
              </div>
              <p style={{ color: '#4b5563', marginTop: '4px' }}>
                Court ID: {booking.courtId} | Time: {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p style={{ fontWeight: 'bold', fontSize: '1.25rem', marginTop: '8px' }}>Total: ${booking.totalPrice.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;