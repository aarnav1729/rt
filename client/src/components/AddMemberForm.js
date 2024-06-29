// AddMemberForm.js
import React, { useState } from "react";
import axios from "axios";

const AddMemberForm = ({ selectedEvent, onMemberAdded }) => {
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
      onMemberAdded();
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Failed to add member");
    }
  };

  return (
    <div className="mt-4">
      <h2>Add New Member</h2>
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

export default AddMemberForm;