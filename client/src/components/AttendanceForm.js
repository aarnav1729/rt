import React, { useState } from "react";
import axios from "axios";

const AttendanceForm = ({
  members,
  attendance,
  onAttendanceChange,
  onSubmit,
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

  return (
    <div>
      <h2>Attendance Form</h2>
      <div>
        {members.map((member) => (
          <div key={member._id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={attendance[member._id] || false}
              onChange={() => onAttendanceChange(member._id)}
              className="mr-2"
            />
            <label>{member.name}</label>
          </div>
        ))}
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={onSubmit}
      >
        Submit Attendance
      </button>
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