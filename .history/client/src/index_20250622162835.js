import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';       // Global styles
import App from './App';     // Root component of the app
import reportWebVitals from './reportWebVitals'; // Optional: performance monitoring

// Create root and render App component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);

// Optional: measuring app performance
// You can pass a function like reportWebVitals(console.log)
// or connect it to an analytics service
reportWebVitals();
