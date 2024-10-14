import React, { useState } from "react"; 
import Cell from "./Cell";

const Game = () => {
    const size = 50;

    const initGrid = () => {
        const grid = [];
        for (let i = -size / 2; i < size / 2; i++) {
            grid[i] = [];
            for (let j = -size / 2; j < size / 2; j++) {
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

    return (
        <div>
            {renderGrid()}
        </div>
    )
}

export default Game;
