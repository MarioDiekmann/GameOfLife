import React, { useState, useEffect, useCallback, useRef } from "react";
import Cell from "./Cell";

const Game = () => {
    const startingsize = 25;
    const [size, setSize] = useState(startingsize); 
    const [epochs, setEpochs] = useState(0);
    const [isEvolving, setIsEvolving] = useState(false); 

    const initGrid = () => Array.from({ length: size }, () => Array(size).fill(false));
    const [grid, setGrid] = useState(initGrid()); 

    const previousGridRef = useRef(grid); // Reference to hold the previous grid

    const toggleCellState = (row, col) => {
        setGrid(prevGrid => {
            const newGrid = prevGrid.map((r, i) =>
                r.map((cell, j) => (i === row && j === col ? !cell : cell))
            );
            return newGrid;
        });
    };

    const resetGrid = () => {
        setIsEvolving(false); 
        setEpochs(0); 
        setSize(startingsize);
        setGrid(initGrid());
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
    };

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
        let newGrid = grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
                const gridCount = countNeighboursAlive(rowIndex, colIndex);
                return cell ? gridCount === 2 || gridCount === 3 : gridCount === 3;
            })
        );
        setGrid(newGrid);
        return newGrid; // Return the new grid for comparison
    }, [countNeighboursAlive, grid]);

    const checkEdges = useCallback(() => {
        const indicesAlive = [];
        // Check upper, right, lower, and left edges
        for (let col = 0; col < size - 2; col++) {  
            if (grid[0][col] && grid[0][col + 1] && grid[0][col + 2]) {  
                indicesAlive.push([0, col + 1]);  
                indicesAlive.push([-1, col + 1]); 
            }
        }
        for (let row = 0; row < size - 2; row++) {  
            if (grid[row][size - 1] && grid[row + 1][size - 1] && grid[row + 2][size - 1]) {  
                indicesAlive.push([row + 1, size - 1]); 
                indicesAlive.push([row + 1, size]);    
            }
        }
        for (let col = size - 1; col > 1; col--) {  
            if (grid[size - 1][col] && grid[size - 1][col - 1] && grid[size - 1][col - 2]) {  
                indicesAlive.push([size - 1, col - 1]);  
                indicesAlive.push([size, col - 1]);      
            }
        }
        for (let row = size - 1; row > 1; row--) {  
            if (grid[row][0] && grid[row - 1][0] && grid[row - 2][0]) {  
                indicesAlive.push([row - 1, 0]);  
                indicesAlive.push([row - 1, -1]); 
            }
        }
        return indicesAlive;
    }, [grid, size]);

    const expandGrid = useCallback((indicesAlive) => {
        const newSize = 2 * size; 
        const newGrid = Array.from({ length: newSize }, () => Array(newSize).fill(false)); 
        const rowOffset = Math.floor((newSize - size) / 2);
        const colOffset = Math.floor((newSize - size) / 2);
    
        for (let row = 0; row < size; row++) {  
            for (let col = 0; col < size; col++) {  
                if (grid[row][col]) {
                    newGrid[row + rowOffset][col + colOffset] = true;
                }
            }
        }
    
        for (const [row, col] of indicesAlive) {
            const newRow = row === -1 ? rowOffset - 1 : row + rowOffset;
            const newCol = col === -1 ? colOffset - 1 : col + colOffset;
            if (newRow < newSize && newCol < newSize && newRow >= 0 && newCol >= 0) {
                newGrid[newRow][newCol] = true;
            }
        }
    
        setSize(newSize); 
        setGrid(newGrid);
    }, [size, grid]);

    const runEpoch = useCallback(() => {
        const prevGrid = previousGridRef.current;
        const newGrid = updateGrid(); // Get updated grid after epoch

        const gridsAreEqual = prevGrid.every((row, i) =>
            row.every((cell, j) => cell === newGrid[i][j])
        );

        if (gridsAreEqual) {
            setIsEvolving(false);
            alert("You reached a stillstand");
            return true;
        }

        const indicesAlive = checkEdges();
        if (indicesAlive.length !== 0) {
            expandGrid(indicesAlive);
        }

        setEpochs(prevEpochs => prevEpochs + 1);
        previousGridRef.current = newGrid; // Update the reference to the latest grid state
        return false;
    }, [checkEdges, expandGrid, updateGrid]);

    useEffect(() => {
        if (!isEvolving) return;

        const maxEpochs = 1000;
        let updatedEpochs = 0;

        const interval = setInterval(() => {
            if (updatedEpochs < maxEpochs) {
                const stillstand = runEpoch();
                if (stillstand) {
                    clearInterval(interval);
                }
                updatedEpochs++;
            } else {
                setIsEvolving(false);
                clearInterval(interval);
            }
        }, 2000); 

        return () => clearInterval(interval); 
    }, [isEvolving, runEpoch]);

    const startEvolution = () => {
        previousGridRef.current = grid; // Set initial grid before evolution
        setIsEvolving(!isEvolving);
    };

    return (
        <div>
            {renderGrid()}
            <button onClick={startEvolution}>{isEvolving ? "Stop Evolution" : "Start Evolution"}</button>
            <button className="reset-btn" onClick={resetGrid}>Reset Grid</button>
            <div>EPOCHS: {epochs}</div>
        </div>
    );
};

export default Game;
