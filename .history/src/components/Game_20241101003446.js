// Game.js
import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import Cell from "./Cell";
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
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [patternRequested, setPatternRequested] = useState(false);
    const [registrationRequested, setRegistrationRequested] = useState(false);
    const [loginRequested, setLoginRequested] = useState(false);
    const initGrid = () => Array.from({ length: size }, () => Array(size).fill(false));
    const [grid, setGrid] = useState(initGrid());
    const previousGridRef = useRef(grid);

    const { isTokenExpired, handleLogout } = useContext(AuthContext);

    useEffect(() => {
      console.log("Checking isTokenExpired in Game.js:", isTokenExpired);
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
      setSize(startingsize);
      const newGrid = initGrid();
      setGrid(newGrid);
      setInitialPattern(newGrid);
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

    const startEvolution = () => {
      previousGridRef.current = grid;
      setIsEvolving(!isEvolving);
      setInitialPattern(grid.map(row => row.slice())); 
    };

    const stopEvolution = () => {
      setIsEvolving(!isEvolving);
    };

    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <NavBar />
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
          <button onClick={() => setIsFormVisible(true)}>Save Pattern</button>
          <button onClick={() => setPatternRequested(true)}>Retrieve Pattern</button>
          <button onClick={() => setRegistrationRequested(true)}>Register</button>
          <button onClick={() => setLoginRequested(true)}>Login</button>

          {isFormVisible && (
            <div className="popup-overlay">
              <div className="popup-content">
                <InputForm pattern={initialPattern} onSubmit={() => setIsFormVisible(false)} />
              </div>
            </div>
          )}

          {patternRequested && (
            <div className="popup-overlay">
              <div className="popup-content">
                <LoadPatternForm dataHandling={(pattern) => {
                  setGrid(pattern);
                  setInitialPattern(pattern);
                  setEpochs(0);
                  setIsEvolving(false);
                  setPatternRequested(false);
                }} onSubmit={() => setPatternRequested(false)} />
              </div>
            </div>
          )}

          {registrationRequested && (
            <div className="popup-overlay">
              <div className="popup-content">
                <RegistrationForm onSubmit={() => setRegistrationRequested(false)} />
              </div>
            </div>
          )}

          {loginRequested && (
            <div className="popup-overlay">
              <div className="popup-content">
                <LoginForm onSubmit={() => setLoginRequested(false)} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
};

export default Game;
