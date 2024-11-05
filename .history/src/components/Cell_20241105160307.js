import React from 'react';
import './Cell.css'

const Cell = ({ isAlive, onClick, numResizes }) => {
  const baseSize = 30; // Base size when numResizes = 1
  const cellSize = baseSize / Math.pow(2, numResizes);
  return (
    <div
      className={`cell ${isAlive ? 'alive' : 'dead'}`}
      onClick={onClick}
      style={{
        width: `${cellSize}px`,
        height: `${cellSize}px`,
      }}
    ></div>
  );
};

export default Cell;
