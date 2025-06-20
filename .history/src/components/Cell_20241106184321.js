import React, { useEffect, useState } from 'react';
import './Cell.css';

const Cell = ({ isAlive, onClick, numResizes }) => {
  // Calculate the size of the cell relative to the screen size
  const [cellSize, setCellSize] = useState(0);

  useEffect(() => {
    // Update cell size based on screen width and height
    const updateCellSize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // Calculate the number of cells that can fit horizontally and vertically
      const cellsPerRow = Math.floor(screenWidth / 20); // 20px is the minimum width for a cell
      const cellsPerColumn = Math.floor(screenHeight / 20); // 20px is the minimum height for a cell

      // Choose the smaller of the two values to ensure the grid fits within the screen
      const cellSize = Math.min(screenWidth / cellsPerRow, screenHeight / cellsPerColumn);

      setCellSize(cellSize);
    };

    // Call once on mount and whenever the window is resized
    updateCellSize();
    window.addEventListener('resize', updateCellSize);

    return () => {
      window.removeEventListener('resize', updateCellSize);
    };
  }, []);

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
