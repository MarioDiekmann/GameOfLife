import React, { useEffect, useState } from 'react';
import './Cell.css';

const Cell = ({ isAlive, onClick, numResizes }) => {
  const [cellSize, setCellSize] = useState(0);

  useEffect(() => {
    // Update cell size based on screen width and height
    const updateCellSize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // Calculate the number of cells that can fit horizontally and vertically
      const cellsPerRow = Math.floor(screenWidth / 25); 
      const cellsPerColumn = Math.floor(screenHeight / 25); 

      // Choose the smaller of the two values to ensure the grid fits within the screen
      const screenCellSize = Math.min(screenWidth / cellsPerRow, screenHeight / cellsPerColumn);

      // Apply resizing logic with numResizes
      const finalCellSize = screenCellSize / Math.pow(2, numResizes);

      setCellSize(finalCellSize);
    };

    // Call once on mount and whenever the window is resized
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
