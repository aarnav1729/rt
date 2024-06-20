import React from 'react';

const MemberList = ({ members, attendance, onAttendanceChange }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Members</h2>
      <div className="space-y-2">
        {members.map(member => (
          <div key={member._id} className="flex items-center justify-between bg-gray-100 p-2 rounded shadow-sm">
            <span className="text-gray-800">{member.name}</span>
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded ${attendance[member._id] ? 'bg-gray-500' : 'bg-green-500 text-white'}`}
                onClick={() => onAttendanceChange(member._id, true)}
              >
                Present
              </button>
              <button
                className={`px-4 py-2 rounded ${attendance[member._id] ? 'bg-red-500 text-white' : 'bg-gray-500'}`}
                onClick={() => onAttendanceChange(member._id, false)}
              >
                Undo
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberList;