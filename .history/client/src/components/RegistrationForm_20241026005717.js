import React, { useState } from 'react';
import axios from 'axios';

const RegistrationForm = ({ onSubmit }) => {  
  const [formData, setFormData] = useState({
    username: '', password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/register', formData);
      if (response.status === 201) {
        console.log('Form submitted successfully');
        onSubmit(); // Close the form after successful submission
      } else {
        console.error('Error submitting form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
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
            name="username"  // Corrected name attribute to match state key
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
            name="password"  // Corrected name attribute to match state key
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <button type="submit">Register</button>
          <button type="button" onClick={onSubmit}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
