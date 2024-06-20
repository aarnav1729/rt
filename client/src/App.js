import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventSelector from './components/eventSelector';
import MemberList from './components/memberList';

const App = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/api/attendance/events')
      .then(res => {
        console.log('Events fetched:', res.data);
        setEvents(res.data);
      })
      .catch(err => console.error('Error fetching events:', err));
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      axios.get('http://localhost:5000/api/attendance/members')
        .then(res => {
          console.log('Members fetched:', res.data);
          setMembers(res.data);
          loadAttendanceState(selectedEvent);
        })
        .catch(err => console.error('Error fetching members:', err));
    }
  }, [selectedEvent]);

  const loadAttendanceState = (eventId) => {
    const savedState = localStorage.getItem(`attendance_${eventId}`);
    if (savedState) {
      setAttendance(JSON.parse(savedState));
    } else {
      setAttendance({});
    }
  };

  const handleAttendanceChange = (memberId) => {
    const newAttendance = {
      ...attendance,
      [memberId]: !attendance[memberId],
    };
    setAttendance(newAttendance);
    localStorage.setItem(`attendance_${selectedEvent}`, JSON.stringify(newAttendance));
  };

  const handleSubmit = () => {
    const attendanceList = members.map(member => ({
      email: member.email,
      present: attendance[member._id] || false,
    }));

    axios.post('http://localhost:5000/api/attendance/mark', {
      eventId: selectedEvent,
      attendance: attendanceList,
    })
    .then(() => alert('Attendance submitted successfully!'))
    .catch(err => console.error('Error submitting attendance:', err));
  };

  return (
    <div className="container mx-auto p-4">
      <EventSelector events={events} onSelect={setSelectedEvent} />
      {selectedEvent && (
        <MemberList 
          members={members} 
          attendance={attendance} 
          onAttendanceChange={handleAttendanceChange} 
        />
      )}
      {selectedEvent && (
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" 
          onClick={handleSubmit}
        >
          Submit Attendance
        </button>
      )}
    </div>
  );
};

export default App;