import React from 'react';
import './SearchBar.css';

const SearchBar = ({ setSearchTerm }) => {
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="search-bar">
      <input 
        type="text" 
        placeholder="Search in menu" 
        className="search-bar-input"
        onChange={handleInputChange} 
      />
    </div>
  );
};

export default SearchBar;