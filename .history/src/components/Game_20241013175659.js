import React, { useState, useEffect, useCallback } from "react"; 
import Cell from "./Cell";

const Game = () => {
    const [size, setsize] = useState(25); 
    const [epochs, setEpochs] = useState(0);
    const [isEvolving, setIsEvolving] = useState(false); 

    const initGrid = () => Array.from({ length: size }, () => Array(size).fill(false));
    const [grid, setGrid] = useState(initGrid()); 

    const toggleCellState = (row, col) => {
        setGrid(prevGrid => {
            const newGrid = prevGrid.map((r, i) =>
                r.map((cell, j) => (i === row && j === col ? !cell : cell))
            );
            return newGrid;
        });
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
            for (let j = col - 1; j <= col + 1; j++) {
                if ((i >= 0 && i < size) && (j >= 0 && j < size) && !(i === row && j === col)) {
                    count += grid[i][j] ? 1 : 0; // Increment if alive
                }
            }
        }
        return count;
    }, [grid, size]);

    const updateGrid = useCallback(() => {
        setGrid(prevGrid => {
            const newGrid = prevGrid.map(row => row.slice()); 
            for (let row = 0; row < size; row++) {  
                for (let col = 0; col < size; col++) {  
                    const gridCount = countNeighboursAlive(row, col); 
                    if (prevGrid[row][col]) {
                        newGrid[row][col] = gridCount === 2 || gridCount === 3; // Survives
                    } else {
                        newGrid[row][col] = gridCount === 3; // Becomes alive
                    }
                }
            }
            return newGrid;
        });
    }, [countNeighboursAlive, size]);

    const checkEdges = useCallback(() => {
        const indicesAlive = [];
    
        // Check upper edge
        for (let col = 0; col < size - 2; col++) {  
            if (grid[0][col] && grid[0][col + 1] && grid[0][col + 2]) {  
                indicesAlive.push([0, col + 1]);  // Mark middle cell on the edge
                indicesAlive.push([-1, col + 1]); // The cell above the current grid
            }
        }
    
        // Check right edge
        for (let row = 0; row < size - 2; row++) {  
            if (grid[row][size - 1] && grid[row + 1][size - 1] && grid[row + 2][size - 1]) {  
                indicesAlive.push([row + 1, size - 1]); // Mark middle cell on the edge
                indicesAlive.push([row + 1, size]);    // The cell that would be on the right in the expanded grid
            }
        }
    
        // Check lower edge
        for (let col = size - 1; col > 1; col--) {  
            if (grid[size - 1][col] && grid[size - 1][col - 1] && grid[size - 1][col - 2]) {  
                indicesAlive.push([size - 1, col - 1]);  // Mark middle cell on the edge
                indicesAlive.push([size, col - 1]);      // The cell below the current grid
            }
        }
    
        // Check left edge
        for (let row = size - 1; row > 1; row--) {  
            if (grid[row][0] && grid[row - 1][0] && grid[row - 2][0]) {  
                indicesAlive.push([row - 1, 0]);  // Mark middle cell on the edge
                indicesAlive.push([row - 1, -1]); // The cell to the left of the current grid
            }
        }
    
        return indicesAlive;
    }, [grid, size]);
    

    const expandGrid = useCallback((indicesAlive) => {
        setGrid(prevGrid => {
            const newSize = 2 * size; // Double the size
            const newGrid = Array.from({ length: newSize }, () => Array(newSize).fill(false)); 
    
            // Calculate the offset to center the old grid in the new one
            const rowOffset = Math.floor((newSize - size) / 2);
            const colOffset = Math.floor((newSize - size) / 2);
    
            // Copy the existing grid to the center of the new grid
            for (let row = 0; row < size; row++) {  
                for (let col = 0; col < size; col++) {  
                    if (prevGrid[row][col]) {
                        newGrid[row + rowOffset][col + colOffset] = true; // Copy with offsets
                    }
                }
            }
    
            // Handle indicesAlive and place the alive cells correctly
            for (const [row, col] of indicesAlive) {
                const newRow = row === -1 ? rowOffset - 1 : row + rowOffset;
                const newCol = col === -1 ? colOffset - 1 : col + colOffset;
    
                if (newRow < newSize && newCol < newSize && newRow >= 0 && newCol >= 0) {
                    newGrid[newRow][newCol] = true;  // Mark the cell as alive in the new grid
                }
            }
    
            setsize(newSize);  // Update size to the new expanded size
            return newGrid;
        });
    }, [size]);
    

    const runEpoch = useCallback(() => {
        updateGrid();
        const indicesAlive = checkEdges(); 
        if (indicesAlive.length !== 0) {
            expandGrid(indicesAlive);
        }
        setEpochs(prevEpochs => prevEpochs + 1);
    }, [checkEdges, expandGrid, updateGrid]);

    useEffect(() => {
        if (!isEvolving) return;

        const maxEpochs = 100;
        let updatedEpochs = 0;

        const interval = setInterval(() => {
            if (updatedEpochs < maxEpochs) {
                runEpoch();
                updatedEpochs++;
            } else {
                setIsEvolving(false); 
                clearInterval(interval);
            }
        }, 2000); // Adjust interval time if necessary

        return () => clearInterval(interval); // Cleanup on unmount
    }, [isEvolving, runEpoch]);

    const startEvolution = () => {
        setIsEvolving(true); // Start evolution
    };

    return (
        <div>
            {renderGrid()}
            <button onClick={startEvolution}>{isEvolving ? "Stop Evolution" : "Start Evolution"}</button> 
            <div>EPOCHS:{epochs}</div>
        </div>
    );
}

export default Game;
