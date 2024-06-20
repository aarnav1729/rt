import React from 'react';

const MemberList = ({ members, attendance, onAttendanceChange }) => {
  return (
    <div>
      <h2>Members</h2>
      <div>
        {members.map(member => (
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
    </div>
  );
};

export default MemberList;