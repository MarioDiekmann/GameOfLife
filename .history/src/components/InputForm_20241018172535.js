import React, { useState } from 'react';
import axios from 'axios';

const InputForm = ({ pattern }) => {  // pattern should be passed in as a prop
  // State to handle input values
  const [formData, setFormData] = useState({
    Name: ''
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add pattern and createdAt to the final form data
    const finalFormData = {
      Name: formData.Name,
      Pattern: pattern,  // Assuming the pattern comes from props
      CreatedAt: new Date().toISOString(),  // Auto-generate the timestamp
    };

    try {
      const response = await axios.post('http://localhost:5000/api/savePattern', finalFormData);
      if (response.status === 201) {
        console.log('Form submitted successfully');
      } else {
        console.error('Error submitting form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <h2>Input Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Name input field */}
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="Name"  // Use "Name" to match your backend's field
            value={formData.Name}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Submit button */}
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
