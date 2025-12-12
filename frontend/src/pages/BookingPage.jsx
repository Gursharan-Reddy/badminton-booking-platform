import React, { useState, useEffect } from 'react';
import { createBooking, checkLivePrice, getCourts, getCoaches } from '../services/api';
import Calendar from '../components/Calendar';
import SlotGrid from '../components/SlotGrid';
import LivePriceDisplay from '../components/LivePriceDisplay';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const BookingPage = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [courts, setCourts] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedCoachId, setSelectedCoachId] = useState(null);
  const [rackets, setRackets] = useState(0);
  const [shoes, setShoes] = useState(0);
  const [livePrice, setLivePrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courtsRes, coachesRes] = await Promise.all([getCourts(), getCoaches()]);
        setCourts(courtsRes.data);
        setCoaches(coachesRes.data);
        if (courtsRes.data.length > 0 && !selectedCourt) {
          setSelectedCourt(courtsRes.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch court/coach data:", error);
        setMessage('Failed to load courts or coaches. Check if the backend API is running.');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const updatePrice = async () => {
      if (!selectedCourt || !selectedSlot) {
        setLivePrice(null);
        return;
      }
      setLoading(true);
      setMessage('');
      
      try {
        const slotStart = new Date(selectedDate);
        slotStart.setHours(selectedSlot.startTime, 0, 0, 0);
        
        const slotEnd = new Date(selectedDate);
        slotEnd.setHours(selectedSlot.endTime, 0, 0, 0);

        const response = await checkLivePrice({
          courtId: selectedCourt.id,
          coachId: selectedCoachId,
          rackets,
          shoes, 
          startTime: slotStart.toISOString(),
          endTime: slotEnd.toISOString(),
        });
        setLivePrice(response.data);
      } catch (error) {
        setMessage(`Error calculating price: ${error.response?.data?.message || 'Server error.'}`);
        setLivePrice(null);
      } finally {
        setLoading(false);
      }
    };
    updatePrice();
  }, [selectedCourt, selectedSlot, selectedCoachId, rackets, shoes, selectedDate]);

  const handleBookingSubmit = async () => {
    if (!user) {
        setMessage('Please log in to make a booking.');
        return;
    }
    if (!selectedCourt || !selectedSlot || !livePrice) {
      setMessage('Please select court, slot, and wait for price calculation.');
      return;
    }
    setLoading(true);
    setMessage('');
    
    try {
      const startTime = new Date(selectedDate);
      startTime.setHours(selectedSlot.startTime, 0, 0, 0);
      const endTime = new Date(selectedDate);
      endTime.setHours(selectedSlot.endTime, 0, 0, 0);
      
      const bookingData = {
        courtId: selectedCourt.id,
        coachId: selectedCoachId,
        rackets,
        shoes, 
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        userId: user.id,
      };

      await createBooking(bookingData);
      setMessage(`Booking successful! Total: $${livePrice.total.toFixed(2)}`);
      setSelectedSlot(null);
      setLivePrice(null);
    } catch (error) {
      setMessage(`Booking failed: ${error.response?.data?.message || 'Server error or resource conflict.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#1f2937', marginBottom: '32px' }}>Badminton Court Booking</h1>
      
      {message && (
        <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '8px', backgroundColor: message.includes('successful') ? '#dcfce7' : '#fee2e2', color: message.includes('successful') ? '#166534' : '#991b1b' }}>
          {message}
        </div>
      )}

      <div className="grid-container-3"> 
        
        <div className="vertical-spacing"> 
          
          <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />

          <div className="card-padding card-shadow" style={{ backgroundColor: 'white', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px' }}>Select Court</h2>
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
              {courts.map((court) => (
                <div
                  key={court.id}
                  onClick={() => setSelectedCourt(court)}
                  style={{ 
                      padding: '12px', 
                      border: `2px solid ${selectedCourt?.id === court.id ? '#1e40ff' : '#ccc'}`,
                      backgroundColor: selectedCourt?.id === court.id ? '#eff6ff' : 'white',
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      minWidth: '150px'
                  }}
                >
                  <div style={{ fontWeight: '600' }}>{court.name}</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', textTransform: 'capitalize' }}>{court.type} - ${court.basePrice}/hr</div>
                </div>
              ))}
            </div>
          </div>
          
          {selectedCourt && (
            <div className="card-padding card-shadow" style={{ backgroundColor: 'white', borderRadius: '8px' }}>
              <SlotGrid 
                court={selectedCourt}
                selectedSlot={selectedSlot}
                onSelectSlot={setSelectedSlot}
              />
            </div>
          )}
        </div>

        <div className="vertical-spacing"> 
          <div className="card-padding card-shadow" style={{ backgroundColor: 'white', borderRadius: '8px', width: '100%' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>Finalize Booking</h2>
            
            <div className="form-section">
              <label>Coach (Optional)</label>
              <select
                className="input-field"
                value={selectedCoachId || ''}
                onChange={(e) => setSelectedCoachId(e.target.value ? parseInt(e.target.value) : null)}
              >
                <option value="">No Coach</option>
                {coaches.map((coach) => (
                  <option key={coach.id} value={coach.id}>
                    {coach.name} (${coach.hourlyRate}/hr)
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-section">
              <label>Rackets to Rent</label>
              <input
                type="number"
                value={rackets}
                onChange={(e) => setRackets(Math.max(0, parseInt(e.target.value) || 0))}
                min="0"
                className="input-field"
              />
            </div>
            
            <div className="form-section" style={{ marginBottom: '24px' }}>
              <label>Shoes to Rent</label>
              <input
                type="number"
                value={shoes}
                onChange={(e) => setShoes(Math.max(0, parseInt(e.target.value) || 0))}
                min="0"
                className="input-field"
              />
            </div>

            {selectedCourt && selectedSlot ? (
              <div style={{ marginBottom: '24px' }}>
                <LivePriceDisplay priceData={livePrice} />
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9fafb', color: '#6b7280', marginBottom: '24px' }}>
                Select a Court and Time Slot to proceed.
              </div>
            )}

            <Button
              onClick={handleBookingSubmit}
              disabled={loading || !selectedCourt || !selectedSlot || !livePrice}
              variant="primary"
            >
              {loading ? 'Processing...' : `Confirm Booking ($${livePrice?.total.toFixed(2) || '0.00'})`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;