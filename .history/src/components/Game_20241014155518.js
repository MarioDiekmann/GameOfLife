import React, { useState, useEffect, useCallback } from "react"; 
import Cell from "./Cell";

const Game = () => {
    const startingsize = 25;
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

    const resetGrid = () => {
        setIsEvolving(false); 
        setEpochs(0); 
        const tempGrid = () => Array.from({ length: startingsize }, () => Array(size).fill(false));
        setGrid(tempGrid);
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
                    count += grid[i][j] ? 1 : 0;
                }
            }
        }
        return count;
    }, [grid, size]);

    const updateGrid = useCallback((stillstandDetected) => {
        setGrid(prevGrid => {
            let stillstand = true; 
            const newGrid = prevGrid.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    const gridCount = countNeighboursAlive(rowIndex, colIndex);
                    if (cell) {
                        if (gridCount !== 2 && gridCount !== 3) stillstand = false;
                        return gridCount === 2 || gridCount === 3;
                    } else {
                        if (gridCount === 3) stillstand = false;
                        return gridCount === 3;
                    }
                })
            );

            if (stillstand) {
                stillstandDetected(); 
            }

            return newGrid;
        });
    }, [countNeighboursAlive]);

    const checkEdges = useCallback(() => {
        const indicesAlive = [];
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
        setGrid(prevGrid => {
            const newSize = 2 * size; 
            const newGrid = Array.from({ length: newSize }, () => Array(newSize).fill(false)); 
    
            const rowOffset = Math.floor((newSize - size) / 2);
            const colOffset = Math.floor((newSize - size) / 2);
    
            for (let row = 0; row < size; row++) {  
                for (let col = 0; col < size; col++) {  
                    if (prevGrid[row][col]) {
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
    
            setsize(newSize);
            return newGrid;
        });
    }, [size]);

    const runEpoch = useCallback(() => {
        let stopEvolution = false; 

        updateGrid(() => {
            stopEvolution = true;
        });

        const indicesAlive = checkEdges(); 
        if (indicesAlive.length !== 0) {
            expandGrid(indicesAlive);
        }

        setEpochs(prevEpochs => prevEpochs + 1);
        
        return stopEvolution;
    }, [checkEdges, expandGrid, updateGrid]);

    useEffect(() => {
        if (!isEvolving) return;

        const maxEpochs = 1000;
        let updatedEpochs = 0;

        const interval = setInterval(() => {
            if (updatedEpochs < maxEpochs) {
                const stopEvolution = runEpoch(); 

                if (stopEvolution) {
                    setIsEvolving(false);
                    clearInterval(interval);
                    alert('You reached a stillstand');
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
        setIsEvolving(!isEvolving);
    };

    return (
        <div>
            {renderGrid()}
            <button onClick={startEvolution}>{isEvolving ? "Stop Evolution" : "Start Evolution"}</button> 
            <button className="reset-btn" onClick={resetGrid}>Reset the Grid</button>
            <div>EPOCHS: {epochs}</div>
        </div>
    );
}

export default Game;
