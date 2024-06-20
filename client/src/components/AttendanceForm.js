import React from 'react';

const AttendanceForm = ({ members, attendance, onAttendanceChange, onSubmit }) => {
  return (
    <div>
      <h2>Attendance Form</h2>
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
      <button 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" 
        onClick={onSubmit}
      >
        Submit Attendance
      </button>
    </div>
  );
};

export default AttendanceForm;