import React, { useState } from 'react';
import AdminCourts from './AdminCourts';
import AdminPricing from './AdminPricing';
import AdminEquipment from './AdminEquipment';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('courts');

  const renderContent = () => {
    switch (activeTab) {
      case 'courts':
        return <AdminCourts />;
      case 'pricing':
        return <AdminPricing />;
      case 'equipment':
        return <AdminEquipment />;
      default:
        return <AdminCourts />;
    }
  };

  const tabs = [
    { id: 'courts', name: 'Courts' },
    { id: 'pricing', name: 'Pricing Rules' },
    { id: 'equipment', name: 'Inventory' },
  ];

  return (
    <div className="container">
      <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '32px' }}>Admin Dashboard</h1>

      <div style={{ marginBottom: '24px', borderBottom: '1px solid #e5e7eb' }}>
        <nav style={{ display: 'flex', gap: '32px' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ 
                padding: '12px 4px', 
                fontWeight: '500', 
                fontSize: '0.875rem', 
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderBottom: `2px solid ${activeTab === tab.id ? '#1e40ff' : 'transparent'}`,
                color: activeTab === tab.id ? '#1e40ff' : '#6b7280',
                transition: 'color 0.2s, border-bottom 0.2s'
              }}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div style={{ marginTop: '24px' }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;