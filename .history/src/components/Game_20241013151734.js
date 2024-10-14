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
                indicesAlive.push([0, col + 1]); 
            }
        }

        // Check right edge
        for (let row = 0; row < size - 2; row++) {  
            if (grid[row][size - 1] && grid[row + 1][size - 1] && grid[row + 2][size - 1]) {  
                indicesAlive.push([row + 1, size - 1]); 
            }
        }

        // Check lower edge
        for (let col = size - 1; col > 1; col--) {  
            if (grid[size - 1][col] && grid[size - 1][col - 1] && grid[size - 1][col - 2]) {  
                indicesAlive.push([size - 1, col - 1]); 
            }
        }

        // Check left edge
        for (let row = size - 1; row > 1; row--) {  
            if (grid[row][0] && grid[row - 1][0] && grid[row - 2][0]) {  
                indicesAlive.push([row - 1, 0]); 
            }
        }

        return indicesAlive;
    }, [grid, size]);

    const expandGrid = useCallback((indicesAlive) => {
        setGrid(prevGrid => {
            const newSize = 2 * size;
            const newGrid = Array.from({ length: newSize }, () => Array(newSize).fill(false)); 

            for (let row = 0; row < size; row++) {  
                for (let col = 0; col < size; col++) {  
                    if (prevGrid[row][col]) {
                        newGrid[row ][col ] = true;  
                    } 
                }
            }

            for (const cell of indicesAlive) {
                const row = cell[0] ;  
                const col = cell[1] ;  
                newGrid[row][col] = true;
            }
            
            setsize(newSize);  
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
        }, 5000); // Adjust interval time if necessary

        return () => clearInterval(interval); // Cleanup on unmount
    }, [isEvolving, runEpoch]);

    const startEvolution = () => {
        setIsEvolving(true); // Start evolution
    };

    return (
        <div>
            {renderGrid()}
            <button onClick={startEvolution}>Start Evolution</button>
        </div>
    );
}

export default Game;
