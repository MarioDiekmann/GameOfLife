import React from 'react';
import NavBar from './NavBar';
import './Overview.css';

const Overview = () => {
    return (
        <div className="overview-container">
            <NavBar />
            <div className="content">
                <header className="banner">
                    <h1>Overview</h1>
                </header>
                <main className="text-content">
                    <p>
                    The Game of Life is a cellular automaton invented in 1970 by the British mathematician John Conway. It's a zero-player game where the evolution of patterns occurs based on a few simple rules, with each "generation" revealing how groups of cells transform based on their current state and their neighbors.

Overview and How It Works
The Game of Life takes place on a grid, where each cell has two possible states: alive or dead. The game proceeds in "generations," with each new generation calculated based on the current state of each cell and a set of simple rules that determine its fate based on its neighbors. The rules are:

Survival: A live cell with 2 or 3 live neighbors remains alive.
Death by Underpopulation: A live cell with fewer than 2 live neighbors dies.
Death by Overpopulation: A live cell with more than 3 live neighbors dies.
Reproduction: A dead cell with exactly 3 live neighbors becomes alive.
These rules allow for diverse and often surprising behaviors, where patterns appear to grow, shrink, or remain stable over generations. Some patterns will stabilize, while others might oscillate, move across the grid, or even lead to endless cycles.

History and Significance
Conway invented the Game of Life as an exploration of how complex patterns can emerge from simple rules, reflecting broader themes in computational theory and emergent systems. It quickly captivated mathematicians, computer scientists, and hobbyists, as it could generate an extraordinary variety of patterns, from static structures to oscillating and even "traveling" forms, like gliders. The Game of Life is notable for being Turing complete, meaning it can simulate any computational process, given enough space and time.

Impact and Cultural Meaning
The Game of Life is not just a mathematical curiosity but has influenced areas ranging from artificial life studies to philosophy. It has prompted discussions about how complex structures might arise from simple origins, echoing ideas in biology, cosmology, and computer science. Over time, Life has inspired many other similar simulations and remains a popular choice for beginners in programming to explore graphics and algorithms, as well as for enthusiasts who use it to model complex, lifelike systems.

With its simplicity and endless potential, the Game of Life offers both a window into the nature of computation and a fun challenge in visualizing ever-evolving patterns. Many people still experiment with it, creating new patterns and sharing discoveries within a dedicated community.
                    </p>
                </main>
            </div>
        </div>
    );
};

export default Overview;
