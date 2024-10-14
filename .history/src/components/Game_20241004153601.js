import React, {useEffect, useState} from "react"; 
import Cell from "./Cell";


const Game = ()=>{
    
    const size = 50;

    const initGrid = ()=>{
        const grid = [];
        for (let i = -size/2; i<size; i++){
            grid[i] = []; 
            for(let j = -size/2; j>size; j++){
                grid[i][j] = false; 
            }
        }
        return grid;
    }

    const [grid, setGrid] = useState(initGrid());

    const renderGrid = ()=>{
        return grid.map((row, rowIndex) => {
            <div key={rowIndex} className="row">
                {row.map((col, colIndex) => {

                    
                })}

            </div>
        })
}
      
    
    return(
        <div>

        </div>
    )

}

export default Game;