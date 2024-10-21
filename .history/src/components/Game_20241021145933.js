import React, { useState, useEffect, useCallback, useRef } from "react";
import Cell from "./Cell";
import axios from "axios";
import InputForm from "./InputForm";  
import './Game.css';

const Game = () => {
    const startingsize = 25;
    const [size, setSize] = useState(startingsize);
    const [epochs, setEpochs] = useState(0);
    const [isEvolving, setIsEvolving] = useState(false);
    const [initialPattern, setInitialPattern] = useState([]);

    const [isFormVisible, setIsFormVisible] = useState(false); // State to control form visibility

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
        setSize(prevSize => {
            const newGrid = Array.from({ length: startingsize }, () => Array(startingsize).fill(false));
            setGrid(newGrid);
            return startingsize;
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

    const updateGrid = useCallback(() => {
        let newGrid = grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
                const gridCount = countNeighboursAlive(rowIndex, colIndex);
                return cell ? gridCount === 2 || gridCount === 3 : gridCount === 3;
            })
        );
        setGrid(newGrid);
        return newGrid;
    }, [countNeighboursAlive, grid]);

    const saveInitialPattern = () => {
        const deepCopy = grid.map(row => row.slice());
        setInitialPattern(deepCopy); // Save current grid as the initial pattern
        setIsFormVisible(true);
    };

    const runEpoch = useCallback(() => {
        const prevGrid = previousGridRef.current;
        const newGrid = updateGrid();

        const gridsAreEqual = prevGrid.every((row, i) =>
            row.every((cell, j) => cell === newGrid[i][j])
        );

        if (gridsAreEqual) {
            setIsEvolving(false);
            alert("You reached a stillstand");
            return true;
        }

        setEpochs(prevEpochs => prevEpochs + 1);
        previousGridRef.current = newGrid;
        return false;
    }, [updateGrid]);

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
        previousGridRef.current = grid;
        setIsEvolving(!isEvolving);
        saveInitialPattern(); // Save the pattern before starting evolution
    };

    const closeForm = () => {
        setIsFormVisible(false); // Hide the form when pattern is saved
    };

    return (
        <div>
            {renderGrid()}
            <button onClick={startEvolution}>
                {isEvolving ? "Stop Evolution" : "Start Evolution"}
            </button>
            <button className="reset-btn" onClick={resetGrid}>Reset Grid</button>
            <div>EPOCHS: {epochs}</div>

            <button onClick={saveInitialPattern}>Save Pattern</button>

            {/* Show the form conditionally */}
            {isFormVisible && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <InputForm pattern={initialPattern} onSubmit={closeForm} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Game;
