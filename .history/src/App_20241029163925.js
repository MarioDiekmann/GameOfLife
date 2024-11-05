import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Game from './components/Game';
import './App.css';
import AuthProvider from './AuthContext';

function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Game/>} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
