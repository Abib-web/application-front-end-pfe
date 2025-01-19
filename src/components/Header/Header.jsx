// Header.js
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext'; // Importez le hook useTheme
import './Header.css';

const Header = () => {
  const { toggleTheme } = useTheme(); // Utilisez le hook pour obtenir toggleTheme directement

  return (
    <header>
      <a href="/" className="logo">PFE AirQuality</a>
      <div className="hello-user">Salut, Adam 👋</div>
      <label className="switch">
        <input type="checkbox" onChange={toggleTheme} />
        <span className="slider"></span>
      </label>
    </header>
  );
};

export default Header;
