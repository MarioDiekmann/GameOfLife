import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ onSubmit }) => {  
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
      const response = await axios.post('http://localhost:5000/api/login', formData);
      if (response.status === 200) {
        console.log('Login successful');
        const token = response.data.token; 
        localStorage.setItem('authToken', token);
        onSubmit();
      } else {
        console.error('Error logging in');
      }
    } catch (error) {
      console.error('Error logging in:', error);
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
          <button type="submit">Login</button>
          <button type="button" onClick={onSubmit}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
