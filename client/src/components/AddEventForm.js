import React, { useState } from 'react';
import axios from 'axios';
import { FaChevronDown } from 'react-icons/fa'; 
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ["places"]; // Load the 'places' library for autocomplete

const AddEventForm = () => {
  const [newEvent, setNewEvent] = useState({ name: '', date: '', location: '' });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);

  // Load Google Maps API script
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with your actual Google Maps API key
    libraries,
  });

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleAddEvent = async () => {
    try {
      setLoading(true);

      // Use Google Maps Geocoding API to convert location to latitude and longitude
      const geoResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          address: newEvent.location,
          key: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with your actual Google Maps API key
        },
      });

      if (geoResponse.data.results.length === 0) {
        alert("Unable to find location. Please enter a valid location.");
        setLoading(false);
        return;
      }

      const { lat, lng } = geoResponse.data.results[0].geometry.location; // Extract latitude and longitude

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

  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      setNewEvent({ ...newEvent, location: place.formatted_address });
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  if (!isLoaded) return <div>Loading...</div>; // Wait for Google Maps API to load

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
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input
              type="text"
              placeholder="Event Location"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              className="p-2 border rounded"
            />
          </Autocomplete>
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