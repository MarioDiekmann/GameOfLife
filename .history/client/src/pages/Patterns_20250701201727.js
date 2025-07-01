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
            The Glider is a small pattern that travels diagonally at a speed of 1 cell every 4 generations (c/4).
            It’s one of the simplest moving patterns and is often used in more complex structures to transmit information.
          </p>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Game_of_life_animated_glider.gif"
            alt="Glider animation"
          />
        </section>

        <section>
          <h2>Lightweight Spaceship (LWSS)</h2>
          <p>
            The LWSS moves horizontally and demonstrates how structures can travel across the grid.
            Spaceships like this are key in forming communication within the Game of Life.
          </p>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Game_of_life_-_Lightweight_spaceship.gif"
            alt="LWSS animation"
          />
        </section>

        <section>
          <h2>Gosper Glider Gun</h2>
          <p>
            The first discovered “gun”—a pattern that periodically produces gliders.
            It generates a new glider roughly every 30 generations, showcasing a self-sustaining dynamic.
          </p>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Gosper_glider_gun.gif"
            alt="Gosper Glider Gun animation"
          />
        </section>

        <section>
          <h2>Breeder</h2>
          <p>
            A breeder contains guns that emit gliders or other patterns.
            It creates exponential growth and demonstrates emergent complexity—like the famous “rake” breeder.
          </p>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/cf/Conway%27s_Game_of_Life_-_Breeder_animation.gif"
            alt="Breeder animation"
          />
        </section>

        <section>
          <h2>Still Life: Block</h2>
          <p>
            A “still life” is a stable pattern that doesn’t change over time.
            The Block is the simplest example, representing equilibrium states in the simulation.
          </p>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/0d/Conways_life_block.svg"
            alt="Block still life"
          />
        </section>
      </main>
    </div>
  </div>
);

export default Patterns;
