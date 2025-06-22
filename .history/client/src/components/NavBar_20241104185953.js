import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
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
                {navItems.map((item, index) => (
                    <li key={index}>
                        <Link to={item.path}>{item.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NavBar;
