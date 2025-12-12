import React, { useState, useEffect } from 'react';
import { getEquipment, adminUpdateEquipment } from '../services/api';
import Button from '../components/Button';

const AdminEquipment = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await getEquipment();
      setEquipmentList(response.data);
    } catch (error) {
      setMessage('Failed to fetch equipment inventory.');
    }
  };

  const handleStockChange = (name, newStock) => {
    const updatedList = equipmentList.map(item =>
      item.name === name ? { ...item, stock: parseInt(newStock) } : item
    );
    setEquipmentList(updatedList);
  };

  const handleUpdate = async (item) => {
    try {
      await adminUpdateEquipment(item.name, { stock: item.stock, pricePerUnit: item.pricePerUnit });
      setMessage(`${item.name} stock updated to ${item.stock}.`);
    } catch (error) {
      setMessage(`Update failed for ${item.name}.`);
      fetchEquipment();
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>Equipment Inventory Management</h2>
      {message && <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '8px', backgroundColor: message.includes('failed') ? '#fee2e2' : '#dcfce7', color: message.includes('failed') ? '#991b1b' : '#166534' }}>{message}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {equipmentList.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
            <div style={{ flexGrow: 1 }}>
              <p style={{ fontWeight: '600' }}>{item.name}</p>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Price: ${item.pricePerUnit.toFixed(2)} per unit</p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <label style={{ color: '#374151', fontWeight: '500' }}>Stock:</label>
              <input
                type="number"
                value={item.stock}
                onChange={(e) => handleStockChange(item.name, e.target.value)}
                min="0"
                style={{ width: '80px', border: '1px solid #ccc', padding: '8px', borderRadius: '4px', textAlign: 'center' }}
              />
              <Button onClick={() => handleUpdate(item)} variant="primary">
                Update
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEquipment;