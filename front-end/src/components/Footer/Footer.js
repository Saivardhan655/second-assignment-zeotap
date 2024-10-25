import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Weather Dashboard. All rights reserved.</p>
        <p>Developed by Sai Vardhan</p>
      </div>
    </footer>
  );
};

export default Footer;

