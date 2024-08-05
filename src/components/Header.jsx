import React from 'react';
import './Header.css';

const Header = ({ restaurantName }) => {
  return (
    <header className="header">
      <h1 className="header-title">{restaurantName || "Kitchen Stories"}</h1>
      <p className="header-subtitle"> Kharghar, Navi Mumbai</p>
      <p className="header-status">11:30 AM - 3:30 PM / 7:30 PM - 11:30 PM</p>
    </header>
  );
};

export default Header;
