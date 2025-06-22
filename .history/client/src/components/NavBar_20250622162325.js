import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

/**
 * NavBar Component
 * 
 * Displays a vertical navigation menu using React Router links.
 * Menu items are defined in a reusable array and rendered dynamically.
 */
const NavBar = () => {
  // Array of navigation items with display names and route paths
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Overview", path: "/Overview" },
    { name: "About", path: "/about" },
    { name: "Settings", path: "/settings" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <div className="navbar">
      <h2>Navigation</h2>
      <ul>
        {/* Render each navigation item as a list element */}
        {navItems.map((item, index) => (
          <li key={index}>
            {/* Use Link component to enable client-side navigation */}
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavBar;
