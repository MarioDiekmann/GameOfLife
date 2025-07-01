import React from 'react';
import NavBar from '../components/NavBar';
import './Overview.css';

const Patterns = () => (
  <div className="overview-container">
    <NavBar />
    <div className="content">
      <header className="banner">
        <h1>Interesting Patterns</h1>
      </header>
      <main className="text-content">
        <section>
          <h2>Glider</h2>
          <p>
            The Glider is a small pattern that travels diagonally across the grid at about 1 cell every 4 generations (c/4). One of the simplest moving patterns, often used to transmit information through more complex structures.
          </p>
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Game_of_life_animated_glider.gif" alt="Glider animation" />
        </section>

        <section>
          <h2>Lightweight Spaceship (LWSS)</h2>
          <p>
            The LWSS is a basic spaceship that moves horizontally across the grid. It's a classic example of movement and communication patterns in Conway’s Game of Life.
          </p>
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Game_of_life_animated_LWSS.gif" alt="LWSS animation" />
        </section>

        <section>
          <h2>Gosper Glider Gun</h2>
          <p>
            The first known glider “gun” — it periodically emits gliders approximately every 30 generations. A vivid example of a self-sustaining pattern.
          </p>
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Gospers_glider_gun.gif" alt="Gosper Glider Gun animation" />
        </section>

        <section>
          <h2>Breeder</h2>
          <p>
            A breeder is a large, complex structure that contains glider guns, emitting streams of gliders. Its growth is exponential and shows how complexity can emerge from simple rules.
          </p>
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Conways_game_of_life_breeder_animation.gif" alt="Breeder animation" />
        </section>

        <section>
          <h2>Still Life: Block</h2>
          <p>
            A "still life" is a stable pattern that doesn't evolve further. The Block is the simplest example—representing equilibrium in the simulation.
          </p>
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/0d/Conways_life_block.svg" alt="Block still life" />
        </section>
      </main>
    </div>
  </div>
);

export default Patterns;
