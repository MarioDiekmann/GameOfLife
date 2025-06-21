import React, { useEffect, useState } from 'react';
import './Cell.css';

const Cell = ({ isAlive, onClick, numResizes }) => {
  const [cellSize, setCellSize] = useState(0);

  useEffect(() => {
    const updateCellSize = () => {
      // Dynamically calculate the grid size, but limit cell size for smaller screens
      const gridWidth = Math.min(window.innerWidth * 0.8, 600); // Cap width to 600px on larger screens
      const gridHeight = Math.min(window.innerHeight * 0.8, 600); // Cap height to 600px on larger screens

      const cellsPerRow = Math.floor(gridWidth / 30);
      const cellsPerColumn = Math.floor(gridHeight / 30);

      let screenCellSize = Math.min(gridWidth / cellsPerRow, gridHeight / cellsPerColumn);
      screenCellSize = Math.max(screenCellSize, 10); // Ensure cells don’t get smaller than 10px

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
