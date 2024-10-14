import React from 'react';

const Cell = ({ isAlive, onClick }) => {
  return (
    <div
      className={`cell ${isAlive ? 'alive' : 'dead'}`}
      onClick={onClick}
    ></div>
  );
};

export default Cell;
