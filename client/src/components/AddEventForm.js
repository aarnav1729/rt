// src/components/AddEventForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { FaChevronDown } from 'react-icons/fa';
import { Map, Geocoder } from 'react-map-gl'; // Import Mapbox components

const MAPBOX_API_KEY = 'pk.eyJ1IjoiYWFycmF0ZWQiLCJhIjoiY20waHh3dDZtMGdzaTJrcTVpYnk3ZndweSJ9.x4zDUvTtDYU_xXbyj5Wohg'; 

const AddEventForm = () => {
  const [newEvent, setNewEvent] = useState({ name: '', date: '', location: '' });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewport, setViewport] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 10,
  });
  const [selectedLocation, setSelectedLocation] = useState(null);

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleAddEvent = async () => {
    try {
      setLoading(true);

      // Use Mapbox Geocoding API to convert location to latitude and longitude
      const geoResponse = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(newEvent.location)}.json`, {
        params: {
          access_token: MAPBOX_API_KEY,
          limit: 1,
        },
      });

      if (geoResponse.data.features.length === 0) {
        alert("Unable to find location. Please enter a valid location.");
        setLoading(false);
        return;
      }

      const { center } = geoResponse.data.features[0]; // Extract latitude and longitude

      // Send event data to backend
      await axios.post('https://rt-1a2q.onrender.com/api/attendance/addEvent', {
        name: newEvent.name,
        date: new Date(newEvent.date),
        latitude: center[1], // Latitude
        longitude: center[0], // Longitude
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

  const handleLocationChange = (event) => {
    setNewEvent({ ...newEvent, location: event.target.value });
  };

  const handleGeocoderViewportChange = (viewport) => {
    setViewport(viewport);
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
          <Geocoder
            mapboxApiAccessToken={MAPBOX_API_KEY}
            onViewportChange={handleGeocoderViewportChange}
            onResult={(result) => setSelectedLocation(result.result.place_name)}
            placeholder="Enter Event Location"
            inputValue={newEvent.location}
            onChange={handleLocationChange}
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