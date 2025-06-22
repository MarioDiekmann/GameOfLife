import React, { useEffect, useState } from 'react';
import './Cell.css';

/**
 * Cell Component
 * 
 * Represents a single cell in the Game of Life grid.
 * Adjusts its size dynamically based on screen dimensions and zoom level.
 * 
 * Props:
 * - isAlive (boolean): Whether the cell is currently alive
 * - onClick (function): Handler to toggle cell state
 * - numResizes (number): Tracks zoom level to scale cell size
 */
const Cell = ({ isAlive, onClick, numResizes }) => {
  const [cellSize, setCellSize] = useState(0); // Dynamic size of cell in pixels

  useEffect(() => {
    /**
     * Calculates and sets the appropriate cell size based on window size
     * and zoom level. Ensures responsiveness and readability on various screens.
     */
    const updateCellSize = () => {
      // Limit grid rendering area to a max of 600px or 80% of the window
      const gridWidth = Math.min(window.innerWidth * 0.8, 600);
      const gridHeight = Math.min(window.innerHeight * 0.8, 600);

      // Estimate number of cells per row and column assuming a base size of ~30px
      const cellsPerRow = Math.floor(gridWidth / 30);
      const cellsPerColumn = Math.floor(gridHeight / 30);

      // Get the initial cell size that fits this grid
      let screenCellSize = Math.min(gridWidth / cellsPerRow, gridHeight / cellsPerColumn);

      // Prevent cells from becoming smaller than 10px
      screenCellSize = Math.max(screenCellSize, 10);

      // Apply zoom scaling using numResizes (each resize halves the size)
      const finalCellSize = screenCellSize / Math.pow(2, numResizes);

      setCellSize(finalCellSize);
    };

    // Initial size calculation
    updateCellSize();

    // Recalculate on window resize
    window.addEventListener('resize', updateCellSize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('resize', updateCellSize);
    };
  }, [numResizes]);

  return (
    <div
      className={`cell ${isAlive ? 'alive' : 'dead'}`} // Apply CSS class based on alive state
      onClick={onClick} // Toggle alive/dead on click
      style={{
        width: `${cellSize}px`,
        height: `${cellSize}px`,
      }}
    ></div>
  );
};

export default Cell;
