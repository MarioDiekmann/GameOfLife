const Cell = ({ isAlive, onClick, cellSize }) => {
  return (
      <div
          className={`cell ${isAlive ? 'alive' : 'dead'}`}
          onClick={onClick}
          style={{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              margin: '1px',
          }}
      ></div>
  );
};

export default Cell;
