import React, { useState, useEffect, useCallback } from "react"; 
import Cell from "./Cell";

const Game = () => {
    const [size, setsize] = useState(50); 
    const [epochs, setEpochs] = useState(0);
    const [isEvolving, setIsEvolving] = useState(false); 

    // Initialize a grid with all cells dead
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
                    // Game of Life rules
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

    const runEpoch = useCallback(() => {
        updateGrid();
        setEpochs(prevEpochs => prevEpochs + 1);
    }, [updateGrid]);

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
        }, 1000); // Adjust interval time if necessary

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
