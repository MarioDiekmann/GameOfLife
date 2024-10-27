import React, { useState } from 'react';
import axios from 'axios';

const LoadPatternForm = ({onSubmit }) => {
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
    try {
      // Using GET request to match the backend
      const response = await axios.get(`http://localhost:5000/api/displayPattern/${formData.Name}`);
      if (response.status === 200) { // Checking for status 200 for success
        console.log('Pattern loaded successfully', response.data);
        onSubmit(); // Close the form after successful submission
      } else {
        console.error('Error loading pattern');
      }
    } catch (error) {
      console.error('Error loading pattern:', error);
    }
  };

  return (
    <div>
      <h2>Load Your Pattern</h2> {/* Changed the title to "Load" */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name of the pattern you want to retrieve:</label>
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
          <button type="submit">Load Pattern</button> {/* Changed the button text */}
          <button type="button" onClick={onSubmit}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default LoadPatternForm;
