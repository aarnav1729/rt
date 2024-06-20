import React from 'react';

const SearchBar = ({ onSearch }) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">Search Members</h2>
      <input 
        type="text" 
        placeholder="Search by name..." 
        onChange={(e) => onSearch(e.target.value)}
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default SearchBar;