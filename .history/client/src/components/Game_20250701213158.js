import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import Cell from "./Cell";
import axios from "axios";
import InputForm from "./InputForm";
import './Game.css';
import NavBar from "./NavBar";
import LoadPatternForm from "./LoadPatternForm";
import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";
import { AuthContext } from '../AuthContext';

const Game = () => {
    const startingsize = 25;

    const [size, setSize] = useState(startingsize);
    const [epochs, setEpochs] = useState(0);
    const [isEvolving, setIsEvolving] = useState(false);
    const [initialPattern, setInitialPattern] = useState([]);
    const [numResizes, setNumResizes] = useState(0);

    const [isFormVisible, setIsFormVisible] = useState(false); // Controls the visibility of forms
    const [patternRequested, setPatternRequested] = useState(false); // Indicates if pattern loading is requested
    const [registrationRequested, setRegistrationRequested] = useState(false); // Registration form visibility
    const [loginRequested, setLoginRequested] = useState(false); // Login form visibility

    const initGrid = () => Array.from({ length: size }, () => Array(size).fill(false));
    const [grid, setGrid] = useState(initGrid());
    const [tokenPresent, setTokenPresent] = useState(false); // Tracks if auth token is valid and present

    const previousGridRef = useRef(grid); // Stores the previous grid for comparison in evolution

    const { isTokenExpired, handleLogout, token } = useContext(AuthContext); // Auth context values

    // Watch for token changes and expiry, and update token presence accordingly
    useEffect(() => {
        if (isTokenExpired || !token) {
            setTokenPresent(false);
            if (isTokenExpired) {
                alert("Your session has expired. Please log in again.");
                handleLogout();
            }
        } else {
            setTokenPresent(true);
        }
    }, [isTokenExpired, token, handleLogout]);

    // Toggles the alive/dead state of a cell
    const toggleCellState = (row, col) => {
        setGrid(prevGrid => {
            const newGrid = prevGrid.map((r, i) =>
                r.map((cell, j) => (i === row && j === col ? !cell : cell))
            );
            return newGrid;
        });
    };

    // Resets the grid to the initial state and size
    const resetGrid = () => {
        setIsEvolving(false);
        setEpochs(0);
        setSize(prevSize => {
            const newGrid = Array.from({ length: startingsize }, () => Array(startingsize).fill(false));
            setGrid(newGrid);
            setInitialPattern(newGrid);
            setNumResizes(0);
            return startingsize;
        });
    };

    // Renders the grid of cells
    const renderGrid = () => {
        return grid.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
                {row.map((cell, colIndex) => (
                    <Cell
                        key={`${rowIndex}-${colIndex}`}
                        isAlive={cell}
                        onClick={() => toggleCellState(rowIndex, colIndex)}
                        numResizes={numResizes}
                    />
                ))}
            </div>
        ));
    };
// Count the number of alive neighbors for the cell at (row, col)
const countNeighboursAlive = useCallback((row, col) => {
    let count = 0;
    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            // Check boundaries and exclude the cell itself
            if ((i >= 0 && i < size) && (j >= 0 && j < size) && !(i === row && j === col)) {
                count += grid[i][j] ? 1 : 0;
            }
        }
    }
    return count;
}, [grid, size]);

// Update the grid state according to the Game of Life rules
const updateGrid = useCallback(() => {
    const newGrid = grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
            const neighborsAlive = countNeighboursAlive(rowIndex, colIndex);
            // Apply the rules: alive cell stays alive if 2 or 3 neighbors, dead cell becomes alive if exactly 3 neighbors
            return cell ? neighborsAlive === 2 || neighborsAlive === 3 : neighborsAlive === 3;
        })
    );
    setGrid(newGrid);
    return newGrid;
}, [countNeighboursAlive, grid]);

// Save a deep copy of the current grid as the initial pattern
const saveInitialPattern = () => {
    const deepCopy = grid.map(row => row.slice());
    setInitialPattern(deepCopy);
};

// Check if there are alive cells along the edges that require grid expansion
const checkEdges = useCallback(() => {
    const indicesAlive = [];

    // Check top edge for any three consecutive alive cells
    for (let col = 0; col < size - 2; col++) {
        if (grid[0][col] && grid[0][col + 1] && grid[0][col + 2]) {
            indicesAlive.push([0, col + 1]);
            indicesAlive.push([-1, col + 1]); // Indicate need to expand upwards
        }
    }

    // Check right edge for any three consecutive alive cells
    for (let row = 0; row < size - 2; row++) {
        if (grid[row][size - 1] && grid[row + 1][size - 1] && grid[row + 2][size - 1]) {
            indicesAlive.push([row + 1, size - 1]);
            indicesAlive.push([row + 1, size]); // Indicate need to expand rightwards
        }
    }

    // Check bottom edge for any three consecutive alive cells
    for (let col = size - 1; col > 1; col--) {
        if (grid[size - 1][col] && grid[size - 1][col - 1] && grid[size - 1][col - 2]) {
            indicesAlive.push([size - 1, col - 1]);
            indicesAlive.push([size, col - 1]); // Indicate need to expand downwards
        }
    }

    // Check left edge for any three consecutive alive cells
    for (let row = size - 1; row > 1; row--) {
        if (grid[row][0] && grid[row - 1][0] && grid[row - 2][0]) {
            indicesAlive.push([row - 1, 0]);
            indicesAlive.push([row - 1, -1]); // Indicate need to expand leftwards
        }
    }

    return indicesAlive;
}, [grid, size]);

// Expand the grid size and reposition alive cells accordingly
const expandGrid = useCallback((indicesAlive) => {
    setGrid(prevGrid => {
        const newSize = 2 * size; // Double the current size
        setNumResizes(prev => prev + 1);

        // Initialize new grid with all cells dead
        const newGrid = Array.from({ length: newSize }, () => Array(newSize).fill(false));

        // Calculate offset to center the previous grid inside the new larger grid
        const rowOffset = Math.floor((newSize - size) / 2);
        const colOffset = Math.floor((newSize - size) / 2);

        // Copy previous grid cells into the centered position of the new grid
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (prevGrid[row][col]) {
                    newGrid[row + rowOffset][col + colOffset] = true;
                }
            }
        }

        // Adjust and set alive cells indicated for expansion near edges
        for (const [row, col] of indicesAlive) {
            let newRow = row;
            let newCol = col;

            // Adjust indices that indicate out-of-bounds to their new positions
            if (row === -1) newRow = rowOffset - 1;
            if (col === -1) newCol = colOffset - 1;

            newRow += rowOffset;
            newCol += colOffset;

            // Ensure the new position is within grid bounds before marking alive
            if (newRow >= 0 && newRow < newSize && newCol >= 0 && newCol < newSize) {
                newGrid[newRow][newCol] = true;
            }
        }

        setSize(newSize); // Update the grid size state
        return newGrid;
    });
}, [size]);

// Run one epoch (generation) of the simulation
const runEpoch = useCallback(() => {
		const prevGrid = previousGridRef.current;
		const newGrid = updateGrid();

    // Check if the new grid is identical to the previous to detect stillness
    const gridsAreEqual = prevGrid.every((row, i) =>
        row.every((cell, j) => cell === newGrid[i][j])
    );

    if (gridsAreEqual) {
        setIsEvolving(false);
        alert("You reached a stillstand");
        return true; // Indicate simulation stopped due to no changes
    }

    // Check edges for alive cells that require grid expansion
    const indicesAlive = checkEdges();
    if (indicesAlive.length !== 0) {
        expandGrid(indicesAlive);
    }

    setEpochs(prevEpochs => prevEpochs + 1);
    previousGridRef.current = newGrid;
    return false; // Indicate simulation should continue
}, [checkEdges, expandGrid, updateGrid]);

// useEffect to run the simulation while evolving is true
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
    }, 200);

    return () => clearInterval(interval);
}, [isEvolving, runEpoch]);

// Start or resume the evolution process
const startEvolution = () => {
    previousGridRef.current = grid;
    saveInitialPattern();
    setIsEvolving(!isEvolving);
};

// Pause or stop the evolution process
const stopEvolution = () => {
    previousGridRef.current = grid;
    setIsEvolving(!isEvolving);
};

// Retrieve and load a saved pattern into the grid
const retrievePattern = (pattern) => {
    initGrid(); // Initialize the grid (clears or resets)
    setGrid(pattern); // Load the requested pattern
    setInitialPattern(pattern); // Save as initial pattern
    setEpochs(0); // Reset epoch count
    setIsEvolving(false); // Stop evolution
    setPatternRequested(false); // Reset pattern request state
};


// Close all active forms/popups
const closeForm = () => {
    setIsFormVisible(false);         // Close Save Pattern form
    setPatternRequested(false);      // Close Retrieve Pattern form
    setRegistrationRequested(false); // Close Registration form
    setLoginRequested(false);        // Close Login form
};

// Close login form and reload the page to reflect login state changes
const closeLogin = () => {
    setLoginRequested(false);
    window.location.reload();
};

// Prepare to save the pattern and show the Save Pattern form
const makeFormVisible = () => {
    saveInitialPattern();    // Save the current state before opening the form
    setIsFormVisible(true);  // Show Save Pattern form
};

// Show Retrieve Pattern form
const makeRequestVisible = () => {
    setPatternRequested(true);
};

// Show Registration form
const makeRegistrationVisible = () => {
    setRegistrationRequested(true);
};

// Show Login form or logout the user if already logged in
const makeLoginVisible = () => {
    if (token) {
        handleLogout(); // Log out if user is already logged in
    } else {
        setLoginRequested(true); // Show Login form
    }
};

return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {/* Left navigation bar */}
        <NavBar />

        {/* Main content area */}
        <div
            style={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                overflowY: 'auto'
            }}
        >
            {/* App banner */}
            <div className="banner">
                <h1>Game of Life</h1>
            </div>

            <br />

            {/* Grid and control buttons */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flexGrow: 1
                }}
            >
                {/* Grid rendering */}
                {renderGrid()}

                {/* Action buttons */}
                <div className="button-container">
                    <button className="button" onClick={isEvolving ? stopEvolution : startEvolution}>
                        {isEvolving ? "Stop Evolution" : "Start Evolution"}
                    </button>

                    <button className="button reset-btn" onClick={resetGrid}>
                        Reset Grid
                    </button>

                    <button
                        className="button"
                        onClick={makeFormVisible}
                        disabled={!tokenPresent}
                        title={!tokenPresent ? "Login required to save patterns" : ""}
                    >
                        Save Pattern
                    </button>

                    <button
                        className="button"
                        onClick={makeRequestVisible}
                        disabled={!tokenPresent}
                        title={!tokenPresent ? "Login required to retrieve patterns" : ""}
                    >
                        Retrieve Pattern
                    </button>

                    <button className="button" onClick={makeRegistrationVisible}>
                        Register
                    </button>

                    <button className="button" onClick={makeLoginVisible}>
                        {token ? "Logout" : "Login"}
                    </button>
                </div>
            </div>

            {/* -------------------- Popup Forms -------------------- */}

            {/* Save Pattern Form */}
            {isFormVisible && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <InputForm pattern={initialPattern} onSubmit={closeForm} />
                    </div>
                </div>
            )}

            {/* Retrieve Pattern Form */}
            {patternRequested && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <LoadPatternForm onSubmit={closeForm} dataHandling={retrievePattern} />
                    </div>
                </div>
            )}

            {/* Registration Form */}
            {registrationRequested && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <RegistrationForm onSubmit={closeForm} />
                    </div>
                </div>
            )}

            {/* Login Form */}
            {loginRequested && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <LoginForm onSubmit={closeLogin} />
                    </div>
                </div>
            )}
        </div>
    </div>
);}

export default Game;

