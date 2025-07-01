import React from 'react';
import NavBar from '../components/NavBar';
import './Overview.css';

// Hilfsfunktion: rendert ein Pattern als kleines Raster
const renderPatternGrid = (pattern) => {
  return (
    <table className="pattern-grid" style={{ borderCollapse: 'collapse', marginBottom: 10 }}>
      <tbody>
        {pattern.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td
                key={j}
                style={{
                  width: 15,
                  height: 15,
                  backgroundColor: cell ? 'black' : 'white',
                  border: '1px solid #ccc',
                }}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Startkonfigurationen (gleiche Patterns wie im GIF-Skript, nur als 2D-Array mit 0/1)
const patterns = {
  Glider: [
    [0,1,0],
    [0,0,1],
    [1,1,1]
  ],
  LWSS: [
    [0,1,1,1,1],
    [1,0,0,0,1],
    [0,0,0,0,1],
    [1,0,0,1,0]
  ],
  'Gosper Glider Gun': [
    // Ausschnitt der Gun (komplett ist groß, hier kleiner Ausschnitt)
    // Für bessere Übersicht z.B. 11x38 aus Skript, hier nur z.B. 11x15
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0,0,0,0,0,0],
    [0,0,1,0,0,0,1,0,0,0,0,0,0,0,0],
    [0,0,1,0,0,0,1,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,1,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ],
  Breeder: [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  ],
};

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
          {renderPatternGrid(patterns.Glider)}
          <img src="/gifs/Glider.gif" alt="Glider animation" />
        </section>

        <section>
          <h2>Lightweight Spaceship (LWSS)</h2>
          <p>
            The LWSS moves horizontally and demonstrates how structures can travel across the grid.
            Spaceships like this are key in forming communication within the Game of Life.
          </p>
          {renderPatternGrid(patterns.LWSS)}
          <img src="/gifs/Lightweight Spaceship.gif" alt="LWSS animation" />
        </section>

        <section>
          <h2>Gosper Glider Gun</h2>
          <p>
            The first discovered “gun”—a pattern that periodically produces gliders.
            It generates a new glider roughly every 30 generations, showcasing a self-sustaining dynamic.
          </p>
          {renderPatternGrid(patterns['Gosper Glider Gun'])}
          <img src="/gifs/Gosper Glider Gun.gif" alt="Gosper Glider Gun animation" />
        </section>

        <section>
          <h2>Breeder</h2>
          <p>
            A breeder contains guns that emit gliders or other patterns.
            It creates exponential growth and demonstrates emergent complexity—like the famous “rake” breeder.
          </p>
          {renderPatternGrid(patterns.Breeder)}
          <img src="/gifs/Breeder.gif" alt="Breeder animation" />
        </section>

        {/* Still Life we lassen weg */}
      </main>
    </div>
  </div>
);

export default Patterns;
