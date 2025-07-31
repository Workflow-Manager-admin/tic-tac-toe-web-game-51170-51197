import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * Main App component for the 2-player Tic Tac Toe game.
 * - Provides the full game UI, move history, win/draw logic, and restart controls.
 * - Uses modern, light-themed design with accent (yellow #FFC107), primary (green #4CAF50), and secondary (blue #2196F3) colors.
 */
function App() {
  // Game state (history: array of {squares: Array(9), isXNext: bool})
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), isXNext: true }
  ]);
  const [stepNumber, setStepNumber] = useState(0); // Current step in history
  const [status, setStatus] = useState('Next player: X');
  const [winner, setWinner] = useState(null);

  const current = history[stepNumber];

  // Compute winner and set status
  useEffect(() => {
    const winResult = calculateWinner(current.squares);
    if (winResult) {
      setStatus(`Winner: ${winResult.winner}`);
      setWinner(winResult.winner);
    } else if (!current.squares.includes(null)) {
      setStatus('Draw!');
      setWinner('draw');
    } else {
      setStatus(`Next player: ${current.isXNext ? 'X' : 'O'}`);
      setWinner(null);
    }
  }, [current]);

  // PUBLIC_INTERFACE
  function handleClick(i) {
    const slicedHistory = history.slice(0, stepNumber + 1);
    const currentSnapshot = slicedHistory[slicedHistory.length - 1];
    const squares = currentSnapshot.squares.slice();

    if (winner || squares[i]) {
      // Ignore clicks if game over or square occupied
      return;
    }
    squares[i] = current.isXNext ? 'X' : 'O';
    setHistory(slicedHistory.concat([
      { squares, isXNext: !current.isXNext }
    ]));
    setStepNumber(slicedHistory.length);
  }

  // PUBLIC_INTERFACE
  function jumpTo(step) {
    setStepNumber(step);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setHistory([
      { squares: Array(9).fill(null), isXNext: true }
    ]);
    setStepNumber(0);
  }

  // Render move history list
  const moves = history.map((step, move) => {
    const desc = move ?
      `Go to move #${move}` :
      'Go to game start';
    return (
      <li key={move}>
        <button
          className={`history-btn${move === stepNumber ? ' active' : ''}`}
          style={{color: move === stepNumber ? 'var(--color-primary)' : ''}}
          onClick={() => jumpTo(move)}
          aria-label={desc}
        >
          {desc}
        </button>
      </li>
    );
  });

  return (
    <div className="ttt-root">
      <h1 className="game-title">
        Tic Tac Toe
      </h1>
      <div className="game-container">
        <div className="board-and-status">
          <Board
            squares={current.squares}
            onClick={handleClick}
            winningLine={calculateWinner(current.squares)?.line ?? []}
            disabled={winner !== null}
          />
          <div
            className={`game-status${winner === 'draw' ? ' draw' : winner ? ' won' : ''}`}
            style={
              winner === 'draw'
                ? { color: 'var(--color-secondary)' }
                : winner === 'X'
                ? { color: 'var(--color-primary)' }
                : winner === 'O'
                ? { color: 'var(--color-accent)' }
                : {}
            }
            aria-live="polite"
          >
            {status}
          </div>
        </div>
        <div className="controls">
          <button className="restart-btn" onClick={handleRestart}>
            Restart Game
          </button>
          <details className="move-history" open>
            <summary>Move History</summary>
            <ol>{moves}</ol>
          </details>
        </div>
      </div>
      <footer className="ttt-footer">
        <span>
          Two-player • <b>Modern React</b> • Responsive UI
        </span>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onClick, winningLine, disabled }) {
  // Renders all board squares
  function renderSquare(i) {
    const isWinning = winningLine?.includes(i);
    return (
      <button
        className={`square${isWinning ? ' win-square' : ''}`}
        style={
          isWinning ? { backgroundColor: 'var(--color-accent)', color: '#fff' } : {}
        }
        key={i}
        onClick={() => onClick(i)}
        disabled={!!squares[i] || disabled}
        aria-label={`Cell ${i}: ${squares[i] ? squares[i] : 'empty'}`}
      >
        {squares[i]}
      </button>
    );
  }
  return (
    <div className="board-grid">
      {[0, 1, 2].map(row =>
        <div className="board-row" key={row}>
          {[0, 1, 2].map(col =>
            renderSquare(3 * row + col)
          )}
        </div>
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Returns {winner, line} if there's a winner, otherwise null.
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
    [0, 4, 8], [2, 4, 6] // diagonal
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

export default App;
