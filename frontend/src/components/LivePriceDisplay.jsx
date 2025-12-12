import React from 'react';

const LivePriceDisplay = ({ priceData }) => {
  if (!priceData || priceData.total === undefined) {
    return <div style={{ color: '#6b7280', fontStyle: 'italic' }}>Select options to see live price.</div>;
  }

  const { total, breakdown } = priceData;
  const { resourceFees, ruleAdjustments } = breakdown;

  const totalRulesAdjustment = ruleAdjustments.reduce((sum, rule) => sum + rule.adjustment, 0);
  const totalResourceFees = resourceFees.rackets + resourceFees.shoes + resourceFees.coach;

  return (
    <div style={{ padding: '16px', border: '2px solid #bfdbfe', borderRadius: '8px', backgroundColor: '#eff6ff' }}>
      <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1d4ed8', marginBottom: '12px' }}>Live Price Breakdown</h4>
      <div style={{ fontSize: '0.875rem', marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>Base Court Price:</span>
          <span style={{ fontWeight: '500' }}>${breakdown.baseCourtPrice.toFixed(2)}</span>
        </div>

        {ruleAdjustments.map((rule, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563', paddingLeft: '8px' }}>
            <span style={{ fontStyle: 'italic' }}>{rule.name}:</span>
            <span style={{ fontWeight: '500' }}>
              {rule.adjustment >= 0 ? '+' : ''}${rule.adjustment.toFixed(2)}
            </span>
          </div>
        ))}
        
        {totalRulesAdjustment > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px', borderTop: '1px solid #dbeafe', color: '#2563eb' }}>
            <span>Total Adjustments:</span>
            <span style={{ fontWeight: '500' }}>+${totalRulesAdjustment.toFixed(2)}</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #ccc', fontWeight: '600' }}>
          <span>Total Resource Fees:</span>
          <span>+${totalResourceFees.toFixed(2)}</span>
        </div>
      </div>
      
      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '2px solid #60a5fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e40ff' }}>TOTAL:</span>
        <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e40ff' }}>${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default LivePriceDisplay;