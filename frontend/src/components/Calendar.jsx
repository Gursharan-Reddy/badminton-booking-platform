import React from 'react';

const Calendar = ({ selectedDate, onSelectDate }) => {
  const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const handleDateChange = (event) => {
    const selected = new Date(event.target.value);
    selected.setHours(0, 0, 0, 0); 
    onSelectDate(selected);
  };

  return (
    <div className="card-padding card-shadow" style={{ backgroundColor: 'white', borderRadius: '8px' }}>
      <label style={{ display: 'block', fontSize: '1.125rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
        Select Date:
      </label>
      <input
        type="date" 
        value={formatDate(selectedDate)}
        onChange={handleDateChange}
        min={formatDate(new Date())}
        className="input-field"
        style={{ 
          width: '100%', 
          borderRadius: '8px', 
          padding: '8px',
          boxSizing: 'border-box',
          // Remove custom appearance settings here as well, if they were present
          appearance: 'auto', 
          WebkitAppearance: 'auto',
        }}
      />
    </div>
  );
};

export default Calendar;