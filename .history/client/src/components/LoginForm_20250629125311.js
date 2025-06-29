import React, { useState } from 'react';
import axios from 'axios';

/**
 * LoginForm Component
 * 
 * Handles user login by capturing username and password,
 * sending a login request to the backend, and storing the
 * returned JWT token in local storage upon success.
 * 
 * Props:
 * - onSubmit: Callback function to close the form or proceed after login.
 */
const LoginForm = ({ onSubmit }) => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  /**
   * Updates form input state as the user types.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Dynamically update either 'username' or 'password'
    });
  };

  /**
   * Handles login form submission.
   * Sends credentials to backend and stores JWT token if successful.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page reload

    try {
      const response = await axios.post('https://gameoflife-okf7.onrender.com/api/login', formData);

      if (response.status === 200) {
        console.log('Login successful');

        const token = response.data.token;
        localStorage.setItem('authToken', token); // Store JWT in localStorage

        onSubmit(); // Notify parent component (e.g., to close form or re-render)
      } else {
        console.error('Error logging in');
      }
    } catch (error) {
      console.error('Error logging in:', error); // Could be due to network issues or invalid credentials
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username" // Must match key in formData state
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password" // Must match key in formData state
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <button type="submit">Login</button>
          <button type="button" onClick={onSubmit}>Cancel</button> {/* Cancel/close the login form */}
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
