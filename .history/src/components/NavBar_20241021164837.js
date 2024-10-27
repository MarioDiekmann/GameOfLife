import React from 'react';
import './NavBar.css'; // Create this CSS file for styling

const NavBar = () => {
    const navItems = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]; // Replace with your desired items

    return (
        <div className="navbar">
            <h2>Navigation</h2>
            <ul>
                {navItems.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default NavBar;
