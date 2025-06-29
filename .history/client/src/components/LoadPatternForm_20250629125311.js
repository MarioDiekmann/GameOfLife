import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import './LoadPatternForm.css';

/**
 * LoadPatternForm Component
 * 
 * Allows a user to load previously saved patterns. Fetches the user's patterns on mount,
 * provides a list of saved pattern names in a popup, and allows loading a selected pattern.
 * 
 * Props:
 * - dataHandling: Function to process the loaded pattern data (e.g., inject into the grid).
 * - onSubmit: Function to close or reset the form after loading or canceling.
 */
const LoadPatternForm = ({ dataHandling, onSubmit }) => {
  // Form input state (pattern name)
  const [formData, setFormData] = useState({ Name: '' });

  // All saved patterns for the current user
  const [patterns, setPatterns] = useState([]);

  // Controls whether the popup displaying all patterns is visible
  const [showPopup, setShowPopup] = useState(false);

  /**
   * Fetch user's saved patterns from the backend when component mounts.
   */
  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userId = jwtDecode(token).userId;

        const response = await axios.get(`https://gameoflife-okf7.onrender.com/api/displayPatterns/${userId}`);
        if (response.status === 200) {
          setPatterns(response.data); // Expected to be an array of pattern objects
        }
      } catch (error) {
        console.error('Error fetching patterns:', error);
      }
    };

    fetchPatterns();
  }, []);

  /**
   * Handles changes to the input field.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /**
   * Updates the input field when a pattern is selected from the popup.
   * Also closes the popup.
   */
  const handlePatternSelect = (patternName) => {
    setFormData({ Name: patternName });
    setShowPopup(false);
  };

  /**
   * Submits the form to load the selected pattern from the backend.
   * Calls `dataHandling` to pass the pattern data back to the parent.
   * Also calls `onSubmit` to close the form.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('authToken'); 
      const user = jwtDecode(token).userId;

      const response = await axios.get(`https://gameoflife-okf7.onrender.com/api/displayPattern/${formData.Name}/${user}`);
      if (response.status === 200) {
        dataHandling(response.data.Pattern); // Send pattern data to parent
        onSubmit(); // Close form
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

      {/* Button to show all saved patterns in a popup */}
      <button onClick={() => setShowPopup(true)}>Show All Patterns</button>

      {/* Pattern selection popup */}
      {showPopup && (
        <div className="popup">
          <h3>Select a Pattern</h3>
          <ul className="pattern-list">
            {patterns.map((pattern) => (
              <li
                key={pattern._id}
                className="pattern-box"
                onClick={() => handlePatternSelect(pattern.Name)}
              >
                {pattern.Name}
              </li>
            ))}
          </ul>
          <button onClick={() => setShowPopup(false)}>Close</button>
        </div>
      )}

      {/* Manual input and load form */}
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
          <button type="button" onClick={onSubmit}>Cancel</button> {/* Close form */}
        </div>
      </form>
    </div>
  );
};

export default LoadPatternForm;
