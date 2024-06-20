import React from 'react';

const MemberList = ({ members, attendance, onAttendanceChange }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Members</h2>
      <div className="space-y-2">
        {members.map(member => (
          <div key={member._id} className="flex items-center bg-gray-100 p-2 rounded shadow-sm">
            <input 
              type="checkbox" 
              checked={attendance[member._id] || false}
              onChange={() => onAttendanceChange(member._id)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="text-gray-800">{member.name}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberList;