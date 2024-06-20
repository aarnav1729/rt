import React from 'react';

const EventSelector = ({ events, onSelect }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Select Event</h2>
      <select onChange={(e) => onSelect(e.target.value)} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">Select an event</option>
        {events.map(event => (
          <option key={event._id} value={event._id}>{event.name}</option>
        ))}
      </select>
    </div>
  );
};

export default EventSelector;
