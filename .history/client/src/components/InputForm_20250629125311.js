import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

/**
 * InputForm Component
 * 
 * Allows the user to save a pattern by providing a name. On submission, 
 * the form data is sent to the server along with the current pattern 
 * and user ID (extracted from a JWT token). Also supports cancellation via `onSubmit` prop.
 * 
 * Props:
 * - pattern: Array or object representing the pattern to be saved.
 * - onSubmit: Function to be called when the form is submitted or canceled.
 */
const InputForm = ({ pattern, onSubmit }) => {
  // Local state for form input (pattern name)
  const [formData, setFormData] = useState({
    Name: ''
  });

  /**
   * Updates form data state when the user types into the input field.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /**
   * Handles form submission.
   * - Extracts the JWT token from local storage and decodes it.
   * - Constructs the final data object including the name, pattern, timestamp, and user ID.
   * - Sends a POST request to save the pattern.
   * - Calls `onSubmit` to close the form on success.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    const decoded = jwtDecode(token);

    const finalFormData = {
      Name: formData.Name,
      Pattern: pattern,
      CreatedAt: new Date().toISOString(),
      User: decoded.userId
    };

    try {
      console.log('Submitting:', finalFormData);

      const response = await axios.post('https://gameoflife-okf7.onrender.com/api/savePattern', finalFormData);

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
