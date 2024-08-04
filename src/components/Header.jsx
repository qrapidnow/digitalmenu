import React from 'react';
import './Header.css';

const Header = ({ restaurantName }) => {
  return (
    <header className="header">
      <h1 className="header-title">{restaurantName || "Kitchen Stories"}</h1>
      <p className="header-subtitle"> Kharghar, Navi Mumbai</p>
      <p className="header-status">12:00 PM - 4:00 PM / 7:00 PM - 12:00 AM</p>
    </header>
  );
};

export default Header;
