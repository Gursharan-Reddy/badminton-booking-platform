import React from 'react';

const generateTimeSlots = () => {
  const slots = [];
  for (let i = 8; i < 22; i++) {
    const start = `${i.toString().padStart(2, '0')}:00`;
    const end = `${(i + 1).toString().padStart(2, '0')}:00`;
    slots.push({ id: `${i}`, time: `${start} - ${end}`, startTime: i, endTime: i + 1 });
  }
  return slots;
};

const SlotGrid = ({ court, selectedSlot, onSelectSlot, bookedSlots = [] }) => {
  const timeSlots = generateTimeSlots();

  const isBooked = (slot) => {
    return bookedSlots.some(
      (booked) => booked.courtId === court.id && booked.timeSlot === slot.id
    );
  };

  const handleSlotClick = (slot) => {
    if (!isBooked(slot)) {
      onSelectSlot(selectedSlot && selectedSlot.id === slot.id ? null : slot);
    }
  };

  return (
    <div style={{ marginTop: '24px' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px' }}>Available Slots for {court.name}</h3>
      <div className="slot-grid-container">
        {timeSlots.map((slot) => {
          const booked = isBooked(slot);
          const selected = selectedSlot && selectedSlot.id === slot.id;
          
          let styleClass = 'slot-available';
          if (booked) styleClass = 'slot-unavailable';
          if (selected) styleClass = 'slot-selected';

          return (
            <div
              key={slot.id}
              className={`slot-item ${styleClass}`}
              onClick={() => handleSlotClick(slot)}
            >
              {slot.time}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SlotGrid;