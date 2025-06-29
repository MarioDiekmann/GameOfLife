import React, { useState } from 'react';
import axios from 'axios';

/**
 * RegistrationForm Component
 * 
 * Allows users to register by providing a username and password.
 * Submits data to the backend and optionally closes the form on success.
 * 
 * Props:
 * - onSubmit: Function to call after successful registration or cancel.
 */
const RegistrationForm = ({ onSubmit }) => {
  // State to store form input values
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  /**
   * Updates form state as the user types into input fields.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Update the corresponding field (username/password)
    });
  };

  /**
   * Submits the registration data to the backend.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form reload

    try {
      const response = await axios.post('https://gameoflife-okf7.onrender.com/api/register', formData);

      if (response.status === 201) {
        console.log('Form submitted successfully');

        onSubmit(); // Notify parent to close form or update UI
      } else {
        console.error('Error submitting form');
      }
    } catch (error) {
      console.error('Error submitting form:', error); // Handle network/server errors
    }
  };

  return (
    <div>
      <h2>Save Your Pattern</h2>

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
          <button type="submit">Register</button>
          <button type="button" onClick={onSubmit}>Cancel</button> {/* Cancel registration */}
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
