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

    const [isFormVisible, setIsFormVisible] = useState(false); // State to control form visibility 
    const [patternRequested, setPatternRequested] = useState(false);
    const [registrationRequested, setRegistrationRequested] = useState(false);
    const [loginRequested, setLoginRequested] = useState(false);
    const initGrid = () => Array.from({ length: size }, () => Array(size).fill(false));
    const [grid, setGrid] = useState(initGrid());

    const previousGridRef = useRef(grid); // Reference to hold the previous grid 

    const { isTokenExpired, handleLogout } = useContext(AuthContext);

    useEffect(() => {
        if (isTokenExpired) {
            alert("Your session has expired. Please log in again.");
            handleLogout();
        }
    }, [isTokenExpired, handleLogout]);
    
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
            setInitialPattern(newGrid);
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
    };

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
                let newRow = row;
                let newCol = col;

                // Adjust row and col if they are outside the original grid
                if (row === -1) newRow = rowOffset - 1;
                if (col === -1) newCol = colOffset - 1;

                newRow += rowOffset;
                newCol += colOffset;

                // Make sure the calculated newRow and newCol are within bounds
                if (newRow >= 0 && newRow < newSize && newCol >= 0 && newCol < newSize) {
                    newGrid[newRow][newCol] = true;  // Mark the cell as alive in the new grid
                }
            }

            setSize(newSize);  // Update size to the new expanded size
            return newGrid;
        });
    }, [size]);

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

        const indicesAlive = checkEdges(); // Check if we need to expand the grid
        if (indicesAlive.length !== 0) {
            expandGrid(indicesAlive);
        }

        setEpochs(prevEpochs => prevEpochs + 1);
        previousGridRef.current = newGrid;
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
        previousGridRef.current = grid;
        setIsEvolving(!isEvolving);
        saveInitialPattern(); // Save the pattern before starting evolution
    };

    const stopEvolution = () => {
        previousGridRef.current = grid;
        setIsEvolving(!isEvolving);
    };

    const closeForm = () => {
        setIsFormVisible(false); // Hide the form when pattern is saved
    };

    const closeRequest = ()=>{
        setPatternRequested(false);
    }

    const closeRegistration = ()=>{
        setRegistrationRequested(false);
    }

    const closeLogin = ()=>{
        setLoginRequested(false)
    }

    const makeFormVisible = () => {
        setIsFormVisible(true);
    };

    const makeRequestVisible = ()=>{
        setPatternRequested(true);
    }

    const makeRegistrationVisible = ()=>{
        setRegistrationRequested(true);
    } 

    const makeLoginVisible = ()=>{
        setLoginRequested(true);
    }

    const retrievePattern = (pattern)=>{
        initGrid();
        setGrid(pattern); 
        setInitialPattern(pattern);
        setEpochs(0); 
        setIsEvolving(false); 
        setPatternRequested(false); 
    }

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <NavBar /> {/* Keep the NavBar on the left */}
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="banner">
                    <h1>Game of Life</h1>
                </div>
                <br />
                {renderGrid()}
                <button onClick={isEvolving ? stopEvolution : startEvolution}>
                    {isEvolving ? "Stop Evolution" : "Start Evolution"}
                </button>
                <button className="reset-btn" onClick={resetGrid}>Reset Grid</button>
                <div>EPOCHS: {epochs}</div>
                <button onClick={makeFormVisible}>Save Pattern</button> 
                <button onClick={makeRequestVisible}>Retrieve Pattern</button> 
                <button onClick={makeRegistrationVisible}>Register</button> 
                <button onClick={makeLoginVisible}>Login</button>
                {/* Show the form conditionally */}
                {isFormVisible && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <InputForm pattern={initialPattern} onSubmit={closeForm} />
                        </div>
                    </div>
                )}

                {/* Show the form conditionally */}
                {patternRequested && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <LoadPatternForm dataHandling={retrievePattern}  onSubmit={closeRequest} />
                        </div>
                    </div>
                )}

                {registrationRequested && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <RegistrationForm onSubmit={closeRegistration} />
                        </div>
                    </div>
                )}  

                {loginRequested && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <LoginForm onSubmit={closeLogin} />
                        </div>
                    </div>
                )} 
            </div>
        </div>
    );
};

export default Game;
