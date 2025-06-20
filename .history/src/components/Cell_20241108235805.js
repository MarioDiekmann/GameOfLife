import React, { useEffect, useState } from 'react';
import './Cell.css';

const Cell = ({ isAlive, onClick, numResizes }) => {
  const [cellSize, setCellSize] = useState(0);

  useEffect(() => {
    const updateCellSize = () => {
      const gridWidth = window.innerWidth * 0.8;  // Use 80% of screen width
      const gridHeight = window.innerHeight * 0.8; // Use 80% of screen height

      const cellsPerRow = Math.floor(gridWidth / 30);
      const cellsPerColumn = Math.floor(gridHeight / 30);

      const screenCellSize = Math.min(gridWidth / cellsPerRow, gridHeight / cellsPerColumn);

      const finalCellSize = screenCellSize / Math.pow(2, numResizes);

      setCellSize(finalCellSize);
    };

    updateCellSize();
    window.addEventListener('resize', updateCellSize);

    return () => {
      window.removeEventListener('resize', updateCellSize);
    };
  }, [numResizes]);

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
