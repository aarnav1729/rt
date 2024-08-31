import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { FaChevronDown } from 'react-icons/fa';
import Map, { Marker } from 'react-map-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'; // Import Mapbox Geocoder
import 'mapbox-gl/dist/mapbox-gl.css'; // Import Mapbox styles
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'; // Import Geocoder styles

const MAPBOX_API_KEY = 'pk.eyJ1IjoiYWFycmF0ZWQiLCJhIjoiY20waHh3dDZtMGdzaTJrcTVpYnk3ZndweSJ9.x4zDUvTtDYU_xXbyj5Wohg'; // Replace with your actual Mapbox API key

const AddEventForm = () => {
  const [newEvent, setNewEvent] = useState({ name: '', date: '', location: '' });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewport, setViewport] = useState({
    latitude: 17.385044, // Hyderabad latitude
    longitude: 78.486671, // Hyderabad longitude
    zoom: 12,
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mapRef = useRef();

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
          proximity: `${viewport.longitude},${viewport.latitude}`, // Bias results to Hyderabad
          bbox: '78.1300,17.2000,78.7100,17.5800', // Optional: Restrict results to Hyderabad area
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

  const handleGeocoderViewportChange = useCallback((newViewport) => {
    setViewport({
      ...newViewport,
      transitionDuration: 1000,
    });
  }, []);

  const onMapLoad = useCallback(() => {
    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_API_KEY,
      mapboxgl: mapRef.current.getMap(), // Pass the map instance
      marker: false,
      proximity: {
        longitude: 78.486671, // Hyderabad longitude
        latitude: 17.385044,  // Hyderabad latitude
      },
      bbox: [78.1300, 17.2000, 78.7100, 17.5800], // Optional: Restrict results to Hyderabad area
    });

    geocoder.on('result', (e) => {
      const { place_name, center } = e.result;
      setSelectedLocation(place_name);
      setNewEvent({ ...newEvent, location: place_name });
      setViewport({
        ...viewport,
        latitude: center[1],
        longitude: center[0],
        zoom: 14,
      });
    });

    mapRef.current.getMap().addControl(geocoder);
  }, [viewport, newEvent]);

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
          <div className="relative">
            <Map
              ref={mapRef}
              {...viewport}
              onMove={(evt) => setViewport(evt.viewState)}
              style={{ width: '100%', height: '300px' }}
              mapboxAccessToken={MAPBOX_API_KEY}
              onLoad={onMapLoad}
            >
              {selectedLocation && (
                <Marker
                  latitude={viewport.latitude}
                  longitude={viewport.longitude}
                >
                  <div className="marker"></div>
                </Marker>
              )}
            </Map>
          </div>
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