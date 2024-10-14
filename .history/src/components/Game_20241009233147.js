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

    const countNeighboursAlive = (row, col) => {
        let count = 0; 
      
        for (let i = row - 1; i <= row + 1; i++) {
          if (i >= 0 && i < size) {  // Check if row is within bounds
            for (let j = col - 1; j <= col + 1; j++) {
              if (j >= 0 && j < size) {  // Check if column is within bounds
                if (!(i === row && j === col)) {  // Skip the center cell
                  if (grid[i][j]) {  // If the neighboring cell is alive
                    count++;
                  }
                }
              }
            }
          }
        }
        
        return count;
      };
      
    
    const updateGrid = () =>{
        const indizesAlive = [];
        for(let i = -size/2; i<size/2; i++){
            for(let j = -size/2; j<size/2; j++){
                if(grid[i][j]){
                    const gridCount = countNeighboursAlive(i,j); 
                    
                    if(gridCount===2 || gridCount===3){
                        indizesAlive.push([i,j]);
                    }
                }
                else{
                    const gridCount = countNeighboursAlive; 
                    if(gridCount ===3){
                        indizesAlive.push(i,j);
                    }
                }
            }
        }
        
    }

    const checkEdges = ()=>{
        const indizesAlive = [];
        for(let i= -size/2; i<(size/2)-2; i++){                                //--> upper edge direction OFF BY ONE???
            if(grid[-size/2][i] && grid[-size/2][i+1] && grid[-size/2][i+2]){
                indizesAlive.push([(-size/2)-1][i+1]);
            }
        } 

        for(let i= -size/2; i<(size/2)-2; i++){                                // right edge down direction OFF BY ONE???
            if(grid[i][size/2] && grid[i+1][size/2] && grid[i+2][size/2]){
                indizesAlive.push([(-size/2)-1][i+1]);
            }
        }

        for(let i= (size/2) -1; i>(-size/2)-1; i--){                              // <-- lower edge direction
            if(grid[-size/2][i] && grid[-size/2][i-1] && grid[-size/2][i+-2]){
                indizesAlive.push([(-size/2)-1][i-1]);
            }
        }

        for(let i= (size/2)-1; i>-(size/2)-1; i--){                                 // left edge up direction 
            if(grid[i][-size/2] && grid[1-1][-size/2] && grid[i-2][-size/2]){
                indizesAlive.push([(-size/2)-1][i+1]);
            }
        }


    }

    return (
        <div>
            {renderGrid()}
        </div>
    )
}

export default Game;
