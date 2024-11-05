import React, { useState } from 'react';
import axios from 'axios';
import {jwt_decode} from 'jwt-decode';

const InputForm = ({ pattern, onSubmit }) => {  // Add onSubmit prop to close form
  const [formData, setFormData] = useState({
    Name: ''
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
    const token = localStorage.getItem('authToken'); 
    const decoded = jwt_decode(token);
    const finalFormData = {
      Name: formData.Name,
      Pattern: pattern,  // Pass the pattern from props
      CreatedAt: new Date().toISOString(),
      User_id: decoded.userId
    };

    try {
      const response = await axios.post('http://localhost:5000/api/savePattern', finalFormData);
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
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="Name"
            value={formData.Name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <button type="submit">Save Pattern</button>
          <button type="button" onClick={onSubmit}>Cancel</button> {/* Close form on cancel */}
        </div>
      </form>
    </div>
  );
};

export default InputForm;
