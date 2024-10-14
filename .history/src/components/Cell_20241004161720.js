import React from 'react';
import './Cell.css'

const Cell = ({ isAlive, onClick }) => {
  return (
    <div
      className={`cell ${isAlive ? 'alive' : 'dead'}`}
      onClick={onClick}
    ></div>
  );
};

export default Cell;
