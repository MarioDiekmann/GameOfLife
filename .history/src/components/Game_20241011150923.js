import React, { useState } from "react"; 
import Cell from "./Cell";

const Game = () => {
    const [size, setsize] = useState(50);

    const initGrid = () => {
        const grid = [];
        for (let i = -size / 2; i < size / 2; i++) {
            grid[i] = [];
            for (let j = -size / 2; j < size / 2; j++) {
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
    
        for (let row = -size / 2; row < size / 2; row++) {
            for (let col = -size / 2; col < size / 2; col++) {
                const gridCount = countNeighboursAlive(row, col); 
    
                if (grid[row][col]) {
                    // Live cell logic: Underpopulation, Overpopulation, or Lives on
                    if (gridCount < 2 || gridCount > 3) {
                        newGrid[row][col] = false; // Cell dies
                    } else if (gridCount === 2 || gridCount === 3) {
                        newGrid[row][col] = true; // Cell survives
                    }
                } else {
                    // Dead cell logic: Reproduction
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
        for (let col = -size / 2; col < size / 2 - 2; col++) {
            if (grid[-size / 2][col] && grid[-size / 2][col + 1] && grid[-size / 2][col + 2]) {
                indizesAlive.push([(-size / 2) - 1, col + 1]); // Push the cell just above the middle
            }
        }
    
        // Check right edge, move from top to bottom
        for (let row = -size / 2; row < size / 2 - 2; row++) {
            if (grid[row][size / 2] && grid[row + 1][size / 2] && grid[row + 2][size / 2]) {
                indizesAlive.push([row + 1, (size / 2) + 1]); // Push the cell to the right of the middle
            }
        }
    
        // Check lower edge, move from right to left
        for (let col = size / 2 - 1; col > -size / 2 + 1; col--) {
            if (grid[size / 2][col] && grid[size / 2][col - 1] && grid[size / 2][col - 2]) {
                indizesAlive.push([(size / 2) + 1, col - 1]); // Push the cell below the middle
            }
        }
    
        // Check left edge, move from bottom to top
        for (let row = size / 2 - 1; row > -size / 2 + 1; row--) {
            if (grid[row][-size / 2] && grid[row - 1][-size / 2] && grid[row - 2][-size / 2]) {
                indizesAlive.push([row - 1, (-size / 2) - 1]); // Push the cell to the left of the middle
            }
        }
    
        return indizesAlive;
    };

    const expandGrid = (indizesAlive)=>{
        const newGrid = [];
        for (let row = -size ; row < size ; row++) {
            newGrid[row] = [];
            for (let col = -size ; col < size; col++) {
                newGrid[row][col] = false; 
            }
        } 

        for (let row = -size/2 ; row < size/2 ; row++) {
            for (let col = -size/2 ; col < size/2; col++) {
                if(grid[row][col]){
                    newGrid[row +(size/2)][col +(size/2)] = true;
                } 
            }
        }

        for (const cell of indizesAlive) {
            const row = cell[0]+(size/2); 
            const col = cell[1]+(size/2); 
            newGrid[row][col] = true;
          }
        
        setGrid(newGrid);  
        setsize(2*size);
        


    }
    

    return (
        <div>
            {renderGrid()}
        </div>
    )
}

export default Game;
