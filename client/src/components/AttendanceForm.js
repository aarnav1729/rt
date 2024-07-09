import React, { useState } from "react";
import axios from "axios";

const AttendanceForm = ({
  members,
  attendance,
  onAttendanceChange,
  selectedEvent,
}) => {
  const [newMember, setNewMember] = useState({ name: "", email: "" });

  const handleAddMember = async () => {
    if (!selectedEvent) {
      alert("Please select an event first");
      return;
    }

    try {
      await axios.post("/api/attendance/addMember", {
        ...newMember,
        eventId: selectedEvent,
      });
      alert("Member added and marked as present");
      setNewMember({ name: "", email: "" });
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Failed to add member");
    }
  };

  const handleAttendanceChange = (memberId) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const newAttendance = {
          ...attendance,
          [memberId]: !attendance[memberId],
        };

        try {
          await axios.post("/api/attendance/mark", {
            eventId: selectedEvent,
            attendance: Object.keys(newAttendance).map(id => ({
              email: members.find(member => member._id === id).email,
              present: newAttendance[id]
            })),
            latitude,
            longitude,
          });
          alert("Attendance marked successfully!");
          onAttendanceChange(memberId, newAttendance[memberId]);
        } catch (err) {
          console.error("Error marking attendance:", err);
          alert("Failed to mark attendance");
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Failed to get your location");
      }
    );
  };

  return (
    <div>
      <h2>Attendance Form</h2>
      <div>
        {members.map((member) => (
          <div key={member._id} className="flex items-center mb-2">
            <button
              className={`px-4 py-2 rounded ${attendance[member._id] ? 'bg-gray-500' : 'bg-green-500 text-white'}`}
              onClick={() => handleAttendanceChange(member._id)}
            >
              {attendance[member._id] ? 'Undo' : 'Present'}
            </button>
            <span className="ml-4">{member.name}</span>
          </div>
        ))}
      </div>
      <h2 className="mt-4">Add New Member</h2>
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          placeholder="Name"
          value={newMember.name}
          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={newMember.email}
          onChange={(e) =>
            setNewMember({ ...newMember, email: e.target.value })
          }
          className="p-2 border rounded"
        />
        <button
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          onClick={handleAddMember}
        >
          Add Member
        </button>
      </div>
    </div>
  );
};

export default AttendanceForm;