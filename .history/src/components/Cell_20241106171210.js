import React from 'react';
import './Cell.css';

const Cell = ({ isAlive, onClick, numResizes, size }) => {
    const viewportSize = Math.min(window.innerWidth, window.innerHeight);
    const maxGridSize = Math.floor(viewportSize / size);

    const baseSize = maxGridSize / Math.pow(2, numResizes);
    const cellSize = Math.max(baseSize, 5);  // Prevent cells from shrinking too small

    return (
        <div
            className={`cell ${isAlive ? 'alive' : 'dead'}`}
            onClick={onClick}
            style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`
            }}
        ></div>
    );
};

export default Cell;
