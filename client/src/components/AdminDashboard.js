import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventSelector from './eventSelector';
import MemberList from './memberList';
import AddMemberForm from './AddMemberForm';
import AddEventForm from './AddEventForm'; 
import SearchBar from './SearchBar';

const api = axios.create({
  baseURL: 'https://rt-1a2q.onrender.com', // Adjust base URL as necessary
});

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api.get('/api/attendance/events')
      .then(res => setEvents(res.data))
      .catch(err => console.error('Error fetching events:', err));
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      api.get('/api/attendance/members')
        .then(res => setMembers(res.data))
        .catch(err => console.error('Error fetching members:', err));
    }
  }, [selectedEvent]);

  const handleAttendanceChange = async (memberId, present) => {
    const newAttendance = {
      ...attendance,
      [memberId]: present,
    };

    try {
      const membersWithId = Object.keys(newAttendance).map((id) => {
        const member = members.find((m) => m._id === id);
        if (!member) {
          throw new Error(`Member with id ${id} not found`);
        }
        return {
          email: member.email,
          present: newAttendance[id],
        };
      });

      await api.post('/api/attendance/admin/mark', {
        eventId: selectedEvent,
        attendance: membersWithId,
      });

      alert('Attendance marked successfully by admin!');
      setAttendance(newAttendance);
      localStorage.setItem(
        `attendance_${selectedEvent}`,
        JSON.stringify(newAttendance)
      );
    } catch (err) {
      console.error('Error marking attendance:', err);
      alert('Failed to mark attendance');
    }
  };

  const handleMemberAdded = () => {
    if (selectedEvent) {
      api
        .get("/api/attendance/members")
        .then((res) => {
          setMembers(res.data);
        })
        .catch((err) => console.error("Error fetching members:", err));
    }
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">
          Admin Dashboard
        </h1>
        <EventSelector events={events} onSelect={setSelectedEvent} />
        <SearchBar onSearch={setSearchTerm} />
        {selectedEvent && (
          <div className="mt-4">
            <AddMemberForm onMemberAdded={handleMemberAdded} />
            <AddEventForm /> {/* AddEventForm component added here */}
            <MemberList
              members={filteredMembers}
              attendance={attendance}
              onAttendanceChange={handleAttendanceChange}
            />
            <button
              className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              onClick={() => alert("Attendance data saved successfully!")}
            >
              Save Attendance Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;