// src/components/Navbar/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
  return (
    <header className="navbar">
      <Link to="/dashboard" className='nav-title'><h1>My Weather Dashboard</h1></Link>

      <nav className="nav-links">
        <Link to="/dashboard">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
};

export default Navbar;
