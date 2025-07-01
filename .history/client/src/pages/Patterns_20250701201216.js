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
            The Glider is a small pattern that travels diagonally across the grid at a speed of 1 cell every 4 generations (c/4). It’s one of the simplest moving patterns and is often used in more complex structures to transmit information or signals.
          </p>
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Game_of_life_animated_glider.gif" alt="Glider animation" />
        </section>

        <section>
          <h2>Lightweight Spaceship (LWSS)</h2>
          <p>
            The LWSS is a small spaceship that moves horizontally. It demonstrates how structures can travel across the grid. Spaceships like this are key components in creating communication systems within the Game of Life.
          </p>
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Game_of_life_animated_LWSS.gif" alt="LWSS animation" />
          {/* PNG from Wikipedia as static fallback */}
        </section>

        <section>
          <h2>Gosper Glider Gun</h2>
          <p>
            This was the first discovered "gun" – a pattern that periodically produces gliders. The Gosper Glider Gun creates a new glider every 30 generations and is a classic example of a self‑sustaining and dynamic structure.
          </p>
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Gospers_glider_gun.gif" alt="Gosper Glider Gun animation" />
        </section>

        <section>
          <h2>Breeder</h2>
          <p>
            A breeder is a larger structure that contains guns which emit gliders or other components, resulting in quadratic growth. It demonstrates how complexity can emerge from simple rules. Here’s an animation of one such pattern.
          </p>
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Conways_game_of_life_breeder_animation.gif" alt="Breeder animation" />
        </section>

        <section>
          <h2>Still Life: Block</h2>
          <p>
            A "still life" is a stable pattern that does not change over time. The Block is the simplest example. Still lifes represent equilibrium states that emerge naturally in the simulation.
          </p>
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/0d/Conways_life_block.svg" alt="Block still life" />
        </section>
      </main>
    </div>
  </div>
);

export default Patterns;
