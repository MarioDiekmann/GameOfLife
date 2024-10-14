import React, { useState } from "react"; 
import Cell from "./Cell";

const Game = () => {
    const [size, setsize] = useState(50);

    const initGrid = () => {
        const grid = [];
        for (let i = 0; i < size; i++) {  // Changed to 0-based indexing
            grid[i] = [];
            for (let j = 0; j < size; j++) {  // Changed to 0-based indexing
                grid[i][j] = false; 
            }
        }
        return grid;
    }

    const [grid, setGrid] = useState(initGrid()); 

    const toggleCellState = (row, col) => {
        const newGrid = grid.map((r, i) =>
            r.map((cell, j) => (i === row && j === col ? !cell : cell))
        );
        setGrid(newGrid);
    };

    const renderGrid = () => {
        return grid.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
                {row.map((cell, colIndex) => (
                    <Cell 
                        key={`${rowIndex}-${colIndex}`} 
                        isAlive={cell} 
                        onClick={() => toggleCellState(rowIndex, colIndex)} 
                    />
                ))}
            </div>
        ));
    }

    const countNeighboursAlive = (row, col) => {
        let count = 0; 
      
        for (let i = row - 1; i <= row + 1; i++) {
          if (i >= 0 && i < size) {  // Check if row is within bounds
            for (let j = col - 1; j <= col + 1; j++) {
              if (j >= 0 && j < size) {  // Check if column is within bounds
                if (!(i === row && j === col)) {  // Skip the center cell
                  if (grid[i][j]) {  // If the neighboring cell is alive
                    count++;
                  }
                }
              }
            }
          }
        }
        
        return count;
      };
      
    
      const updateGrid = () => {
        const newGrid = grid.map(row => row.slice()); // Create a copy of the grid
    
        for (let row = 0; row < size; row++) {  // Changed to 0-based indexing
            for (let col = 0; col < size; col++) {  // Changed to 0-based indexing
                const gridCount = countNeighboursAlive(row, col); 
    
                if (grid[row][col]) {
                    if (gridCount < 2 || gridCount > 3) {
                        newGrid[row][col] = false; // Cell dies
                    } else if (gridCount === 2 || gridCount === 3) {
                        newGrid[row][col] = true; // Cell survives
                    }
                } else {
                    if (gridCount === 3) {
                        newGrid[row][col] = true; // Dead cell becomes alive
                    }
                }
            }
        }
    
        setGrid(newGrid); // Update the grid state
    };
    
    
    const checkEdges = () => {
        const indizesAlive = [];
        
        // Check upper edge, move from left to right
        for (let col = 0; col < size - 2; col++) {  // Changed to 0-based indexing
            if (grid[0][col] && grid[0][col + 1] && grid[0][col + 2]) {  // Changed to 0-based indexing
                indizesAlive.push([0, col + 1]); // Push the cell just above the middle
            }
        }
    
        // Check right edge, move from top to bottom
        for (let row = 0; row < size - 2; row++) {  // Changed to 0-based indexing
            if (grid[row][size - 1] && grid[row + 1][size - 1] && grid[row + 2][size - 1]) {  // Changed to 0-based indexing
                indizesAlive.push([row + 1, size - 1]); // Push the cell to the right of the middle
            }
        }
    
        // Check lower edge, move from right to left
        for (let col = size - 1; col > 1; col--) {  // Changed to 0-based indexing
            if (grid[size - 1][col] && grid[size - 1][col - 1] && grid[size - 1][col - 2]) {  // Changed to 0-based indexing
                indizesAlive.push([size - 1, col - 1]); // Push the cell below the middle
            }
        }
    
        // Check left edge, move from bottom to top
        for (let row = size - 1; row > 1; row--) {  // Changed to 0-based indexing
            if (grid[row][0] && grid[row - 1][0] && grid[row - 2][0]) {  // Changed to 0-based indexing
                indizesAlive.push([row - 1, 0]); // Push the cell to the left of the middle
            }
        }
    
        return indizesAlive;
    };

    const expandGrid = (indizesAlive)=> {
        const newGrid = [];
        for (let row = 0; row < 2 * size; row++) {  // Changed to 0-based indexing
            newGrid[row] = [];
            for (let col = 0; col < 2 * size; col++) {  // Changed to 0-based indexing
                newGrid[row][col] = false; 
            }
        } 

        for (let row = 0; row < size; row++) {  // Changed to 0-based indexing
            for (let col = 0; col < size; col++) {  // Changed to 0-based indexing
                if (grid[row][col]) {
                    newGrid[row + size][col + size] = true;  // Adjust for the new larger grid size
                } 
            }
        }

        for (const cell of indizesAlive) {
            const row = cell[0] + size;  // Adjust for the new larger grid size
            const col = cell[1] + size;  // Adjust for the new larger grid size
            newGrid[row][col] = true;
        }
        
        setGrid(newGrid);  
        setsize(2 * size);  // Double the size
    }
    

    return (
        <div>
            {renderGrid()}
        </div>
    )
}

export default Game;
