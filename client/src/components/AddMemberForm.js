// AddMemberForm.js
import React, { useState } from "react";
import axios from "axios";

const AddMemberForm = ({ onMemberAdded }) => {
  const [newMember, setNewMember] = useState({ name: "", email: "" });
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleAddMember = async () => {
    try {
      await axios.post("https://rt-1a2q.onrender.com/api/attendance/addMember", newMember);
      alert("Member added");
      setNewMember({ name: "", email: "" });
      onMemberAdded();
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Failed to add member");
    }
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <div className="mt-4">
      <h2 className="cursor-pointer text-blue-500" onClick={toggleFormVisibility}>
        Add New Member
      </h2>
      {isFormVisible && (
        <div className="flex flex-col space-y-2 mt-2">
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
      )}
    </div>
  );
};

export default AddMemberForm;