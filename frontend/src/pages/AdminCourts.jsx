import React, { useState, useEffect } from 'react';
import { getCourts, adminAddCourt, adminUpdateCourt } from '../services/api';
import Button from '../components/Button';

const AdminCourts = () => {
  const [courts, setCourts] = useState([]);
  const [formData, setFormData] = useState({ name: '', type: 'indoor', basePrice: 10.00, isActive: true });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const response = await getCourts();
      // Need to fetch all courts, including inactive ones for admin view
      setCourts(response.data); 
    } catch (error) {
      setMessage('Failed to fetch courts.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value),
    });
  };

  const handleEdit = (court) => {
    setFormData(court);
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await adminUpdateCourt(formData.id, formData);
        setMessage(`Court ${formData.name} updated successfully.`);
      } else {
        await adminAddCourt(formData);
        setMessage(`Court ${formData.name} added successfully.`);
      }
      fetchCourts();
      setFormData({ name: '', type: 'indoor', basePrice: 10.00, isActive: true });
      setIsEditing(false);
    } catch (error) {
      setMessage(`Operation failed: ${error.response?.data?.message || 'Server error'}`);
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>Court Management</h2>
      {message && <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '8px', backgroundColor: message.includes('failed') ? '#fee2e2' : '#dcfce7', color: message.includes('failed') ? '#991b1b' : '#166534' }}>{message}</div>}

      <form onSubmit={handleSubmit} style={{ marginBottom: '32px', padding: '16px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px' }}>{isEditing ? 'Edit Court' : 'Add New Court'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Court Name" required style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }} />
          <select name="type" value={formData.type} onChange={handleChange} style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}>
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
          </select>
          <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} placeholder="Base Price" required style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
            <span>Active</span>
          </label>
        </div>
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          <Button type="submit" variant="primary">
            {isEditing ? 'Update Court' : 'Add Court'}
          </Button>
          {isEditing && (
            <Button type="button" variant="secondary" onClick={() => { setIsEditing(false); setFormData({ name: '', type: 'indoor', basePrice: 10.00, isActive: true }); }}>
              Cancel Edit
            </Button>
          )}
        </div>
      </form>

      <div style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px' }}>Existing Courts</h3>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {courts.map((court) => (
            <li key={court.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f9fafb', border: '1px solid #eee', borderRadius: '4px' }}>
              <span style={{ fontWeight: '500' }}>{court.name} - ${court.basePrice}/hr ({court.type})</span>
              <Button onClick={() => handleEdit(court)} variant="secondary">Edit</Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminCourts;