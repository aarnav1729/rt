import React from 'react';

const EventSelector = ({ events, onSelect }) => {
  return (
    <div>
      <h2>Select Event</h2>
      <select onChange={(e) => onSelect(e.target.value)} className="mt-2 mb-4 p-2 border rounded">
        <option value="">Select an event</option>
        {events.map(event => (
          <option key={event._id} value={event._id}>{event.name}</option>
        ))}
      </select>
    </div>
  );
};

export default EventSelector;