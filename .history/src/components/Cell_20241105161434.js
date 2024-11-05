import React from 'react';
import './Cell.css';

const Cell = ({ isAlive, onClick, numResizes }) => {
  // Base sizes for cell dimensions and margin
  const baseSize = 30; // Base cell size when numResizes = 1
  const baseMargin = 1; // Base margin when numResizes = 1

  // Calculate cell size and margin based on numResizes
  const cellSize = baseSize / Math.pow(2, numResizes );
  const marginSize = baseMargin / Math.pow(2, numResizes );

  return (
    <div
      className={`cell ${isAlive ? 'alive' : 'dead'}`}
      onClick={onClick}
      style={{
        width: `${cellSize}px`,
        height: `${cellSize}px`,
        margin: `${marginSize}px`, // Uniform margin applied
      }}
    ></div>
  );
};

export default Cell;
