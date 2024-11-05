import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const LoadPatternForm = ({ dataHandling, onSubmit }) => {
  const [formData, setFormData] = useState({ Name: '' });
  const [patterns, setPatterns] = useState([]); // To store all patterns for the user
  const [showPopup, setShowPopup] = useState(false); // To control popup visibility

  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userId = jwtDecode(token).userId;
        
        const response = await axios.get(`http://localhost:5000/api/patterns/${userId}`);
        if (response.status === 200) {
          setPatterns(response.data); // Assuming response.data is an array of patterns
        }
      } catch (error) {
        console.error('Error fetching patterns:', error);
      }
    };

    fetchPatterns();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePatternSelect = (patternName) => {
    setFormData({ Name: patternName });
    setShowPopup(false); // Close the popup after selecting
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken'); 
      const user = jwtDecode(token).userId; 

      const response = await axios.get(`http://localhost:5000/api/displayPattern/${formData.Name}/${user}`);
      if (response.status === 200) {
        dataHandling(response.data.Pattern);
        onSubmit();
      } else {
        console.error('Error loading pattern');
      }
    } catch (error) {
      console.error('Error loading pattern:', error);
    }
  };

  return (
    <div>
      <h2>Load Your Patterns</h2>
      <button onClick={() => setShowPopup(true)}>Show All Patterns</button>

      {showPopup && (
        <div className="popup">
          <h3>Select a Pattern</h3>
          <ul>
            {patterns.map((pattern) => (
              <li key={pattern._id} onClick={() => handlePatternSelect(pattern.Name)}>
                {pattern.Name}
              </li>
            ))}
          </ul>
          <button onClick={() => setShowPopup(false)}>Close</button>
        </div>
      )}

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
          <button type="submit">Load Pattern</button>
          <button type="button" onClick={onSubmit}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default LoadPatternForm;
