import React, { useState, useEffect } from 'react';
import { adminAddRule, adminUpdateRule } from '../services/api';
import Button from '../components/Button';

// Mock function to fetch rules, as API endpoint wasn't fully coded
const mockFetchRules = () => [
    { id: 1, name: 'Weekend Multiplier', type: 'multiplier', value: 1.2, appliesToType: 'time', targetValue: 'weekend', isActive: true, startTime: null, endTime: null },
    { id: 2, name: 'Peak Hour Surcharge', type: 'surcharge', value: 5.00, appliesToType: 'time', targetValue: 'peak_hour', isActive: true, startTime: '18:00', endTime: '21:00' },
    { id: 3, name: 'Indoor Premium', type: 'surcharge', value: 5.00, appliesToType: 'court', targetValue: 'indoor', isActive: true, startTime: null, endTime: null },
];

const AdminPricing = () => {
  const [rules, setRules] = useState([]);
  const [formData, setFormData] = useState({ 
    name: '', type: 'multiplier', value: 1.0, appliesToType: 'time', isActive: true, targetValue: '', startTime: '', endTime: ''
  });
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // In a real app, replace this with an API call: getPricingRules().
    setRules(mockFetchRules()); 
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleEdit = (rule) => {
    setFormData(rule);
    setIsEditing(true);
  };

  const resetForm = () => {
      setFormData({ name: '', type: 'multiplier', value: 1.0, appliesToType: 'time', isActive: true, targetValue: '', startTime: '', endTime: '' });
      setIsEditing(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (isEditing) {
            await adminUpdateRule(formData.id, formData);
            setMessage(`Rule "${formData.name}" updated successfully.`);
        } else {
            await adminAddRule(formData);
            setMessage(`Rule "${formData.name}" added successfully.`);
        }
      setRules(mockFetchRules()); 
      resetForm();
    } catch (error) {
      setMessage(`Operation failed: ${error.response?.data?.message || 'Server error'}`);
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>Pricing Engine Configuration</h2>
      {message && <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '8px', backgroundColor: message.includes('failed') ? '#fee2e2' : '#dcfce7', color: message.includes('failed') ? '#991b1b' : '#166534' }}>{message}</div>}

      <form onSubmit={handleSubmit} style={{ marginBottom: '32px', padding: '16px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px' }}>{isEditing ? 'Edit Rule' : 'Create New Rule'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Rule Name" required style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }} />
          <select name="type" value={formData.type} onChange={handleChange} style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}>
            <option value="multiplier">Multiplier (e.g., 1.5)</option>
            <option value="surcharge">Surcharge (e.g., 5.00)</option>
          </select>
          <input type="number" name="value" value={formData.value} onChange={handleChange} placeholder="Value (1.5 or 5.00)" required style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }} />
          <select name="appliesToType" value={formData.appliesToType} onChange={handleChange} style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}>
            <option value="time">Time</option>
            <option value="court">Court Type</option>
          </select>
          <input type="text" name="targetValue" value={formData.targetValue} onChange={handleChange} placeholder="Target (e.g., weekend or peak_hour)" style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }} />
          <input type="text" name="startTime" value={formData.startTime || ''} onChange={handleChange} placeholder="Start Time (e.g., 18:00)" style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }} />
          <input type="text" name="endTime" value={formData.endTime || ''} onChange={handleChange} placeholder="End Time (e.g., 21:00)" style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }} />
        </div>
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
            <Button type="submit" variant="primary">
                {isEditing ? 'Update Rule' : 'Add Rule'}
            </Button>
            {isEditing && <Button type="button" variant="secondary" onClick={resetForm}>Cancel Edit</Button>}
        </div>
      </form>

      <div style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px' }}>Active Rules</h3>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {rules.map((rule) => (
            <li key={rule.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f9fafb', border: '1px solid #eee', borderRadius: '4px' }}>
              <span style={{ fontWeight: '500' }}>{rule.name} ({rule.appliesToType})</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span>{rule.type === 'multiplier' ? `${rule.value}x` : `+$${rule.value.toFixed(2)}`}</span>
                  <Button onClick={() => handleEdit(rule)} variant="secondary" style={{ padding: '6px 10px' }}>Edit</Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPricing;