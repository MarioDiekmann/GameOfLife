import React from 'react';
import NavBar from '../components/NavBar';
import './Overview.css';

const renderPatternGrid = (pattern) => (
  <table className="pattern-grid" style={{ borderCollapse: 'collapse' }}>
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
  'pulsar': [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0],
  [0,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0],
  [0,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0],
  [0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0],
  [0,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0],
  [0,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0],
  [0,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
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
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
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
        {Object.entries(patterns).map(([name, pattern]) => (
          <section key={name}>
            <h2>{name}</h2>
            <p>
              {name === 'Glider' && `The Glider is a small pattern that travels diagonally at a speed of 1 cell every 4 generations (c/4). It’s one of the simplest moving patterns and is often used in more complex structures to transmit information.`}
              {name === 'LWSS' && `The LWSS moves horizontally and demonstrates how structures can travel across the grid. Spaceships like this are key in forming communication within the Game of Life.`}
              {name === 'pulsar' && `description will follow.`}
              {name === 'Breeder' && `A breeder contains guns that emit gliders or other patterns. It creates exponential growth and demonstrates emergent complexity—like the famous “rake” breeder.`}
            </p>
            {renderPatternGrid(pattern)}
            <img src={`/gifs/${name}.gif`} alt={`${name} animation`} />
          </section>
        ))}
      </main>
    </div>
  </div>
);

export default Patterns;
