// src/components/AddEventForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { FaChevronDown } from 'react-icons/fa'; 

const AddEventForm = () => {
  const [newEvent, setNewEvent] = useState({ name: '', date: '', location: '' });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleAddEvent = async () => {
    try {
      setLoading(true);

      // Use OpenCage Data Geocoding API to convert location to latitude and longitude
      const geoResponse = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
        params: {
          key: 'YOUR_OPENCAGE_API_KEY', // Replace with your actual OpenCage API key
          q: newEvent.location,
          limit: 1,
        },
      });

      if (geoResponse.data.results.length === 0) {
        alert("Unable to find location. Please enter a valid location.");
        setLoading(false);
        return;
      }

      const { lat, lng } = geoResponse.data.results[0].geometry; // Extract latitude and longitude

      // Send event data to backend
      await axios.post('https://rt-1a2q.onrender.com/api/attendance/addEvent', {
        name: newEvent.name,
        date: new Date(newEvent.date),
        latitude: lat,
        longitude: lng,
      });

      alert('Event added successfully');
      setNewEvent({ name: '', date: '', location: '' });
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        className="w-full flex items-center justify-between px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none"
        onClick={toggleFormVisibility}
      >
        <span>Add New Event</span>
        <FaChevronDown className={`transform transition-transform duration-200 ${isFormVisible ? 'rotate-180' : ''}`} />
      </button>
      {isFormVisible && (
        <div className="flex flex-col space-y-2 mt-2 pb-4"> 
          <input
            type="text"
            placeholder="Event Name"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            placeholder="Event Date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Event Location"
            value={newEvent.location}
            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            className="p-2 border rounded"
          />
          <button
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
            onClick={handleAddEvent}
            disabled={loading}
          >
            {loading ? 'Adding Event...' : 'Add Event'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddEventForm;