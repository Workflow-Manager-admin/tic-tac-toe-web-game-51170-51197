import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Standard React app entrypoint, renders the Tic Tac Toe App component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
