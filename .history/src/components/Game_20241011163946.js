import React, { useState, useEffect, useCallback } from "react"; 
import Cell from "./Cell";

const Game = () => {
    const [size, setsize] = useState(50); 
    const [Epochs, setEpochs] = useState(0);
    const [isEvolving, setIsEvolving] = useState(false); 

    const initGrid = () => {
        const grid = [];
        for (let i = 0; i < size; i++) {  
            grid[i] = [];
            for (let j = 0; j < size; j++) {  
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

    const countNeighboursAlive = useCallback((row, col) => {
        let count = 0; 
      
        for (let i = row - 1; i <= row + 1; i++) {
          if (i >= 0 && i < size) {  
            for (let j = col - 1; j <= col + 1; j++) {
              if (j >= 0 && j < size) {  
                if (!(i === row && j === col)) {  
                  if (grid[i][j]) {  
                    count++;
                  }
                }
              }
            }
          }
        }
        
        return count;
    }, [grid, size]); // Include grid and size as dependencies

    const updateGrid = useCallback(() => {
        const newGrid = grid.map(row => row.slice()); 
    
        for (let row = 0; row < size; row++) {  
            for (let col = 0; col < size; col++) {  
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
    
        setGrid(newGrid); 
    }, [grid, size, countNeighboursAlive]); // Include grid, size, and countNeighboursAlive

    const checkEdges = useCallback(() => {
        const indizesAlive = [];
        
        for (let col = 0; col < size - 2; col++) {  
            if (grid[0][col] && grid[0][col + 1] && grid[0][col + 2]) {  
                indizesAlive.push([0, col + 1]); 
            }
        }
    
        for (let row = 0; row < size - 2; row++) {  
            if (grid[row][size - 1] && grid[row + 1][size - 1] && grid[row + 2][size - 1]) {  
                indizesAlive.push([row + 1, size - 1]); 
            }
        }
    
        for (let col = size - 1; col > 1; col--) {  
            if (grid[size - 1][col] && grid[size - 1][col - 1] && grid[size - 1][col - 2]) {  
                indizesAlive.push([size - 1, col - 1]); 
            }
        }
    
        for (let row = size - 1; row > 1; row--) {  
            if (grid[row][0] && grid[row - 1][0] && grid[row - 2][0]) {  
                indizesAlive.push([row - 1, 0]); 
            }
        }
    
        return indizesAlive;
    }, [grid, size]); // Include grid and size as dependencies

    const expandGrid = useCallback((indizesAlive) => {
        const newGrid = [];
        for (let row = 0; row < 2 * size; row++) {  
            newGrid[row] = [];
            for (let col = 0; col < 2 * size; col++) {  
                newGrid[row][col] = false; 
            }
        } 

        for (let row = 0; row < size; row++) {  
            for (let col = 0; col < size; col++) {  
                if (grid[row][col]) {
                    newGrid[row + size][col + size] = true;  
                } 
            }
        }

        for (const cell of indizesAlive) {
            const row = cell[0] + size;  
            const col = cell[1] + size;  
            newGrid[row][col] = true;
        }
        
        setGrid(newGrid);  
        setsize(2 * size);  
    }, [grid, size]); // Include grid and size as dependencies

    useEffect(() => {
        if (!isEvolving) return;

        let updatedEpochs = 0;
        const maxEpochs = 10;

        const runEpoch = () => {
            if (updatedEpochs < maxEpochs) {
                updateGrid();
                const indizesAlive = checkEdges(); 
                if (indizesAlive.length !== 0) {
                    expandGrid(indizesAlive);
                }
                setEpochs((prevEpochs) => prevEpochs + 1); 
                updatedEpochs++;

                setTimeout(runEpoch, 100); 
            } else {
                setIsEvolving(false); 
            }
        };

        runEpoch(); 

        return () => {
            setIsEvolving(false); 
        };
    }, [isEvolving, checkEdges, expandGrid, updateGrid]); // Added functions to dependencies

    const startEvolution = () => {
        setIsEvolving(true); // Start evolution
    };

    return (
        <div>
            {renderGrid()}
            <button onClick={startEvolution}>Start Evolution</button>
        </div>
    )
}

export default Game;
