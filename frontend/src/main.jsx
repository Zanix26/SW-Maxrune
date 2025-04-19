import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('main.jsx: Starting React app');
const root = ReactDOM.createRoot(document.getElementById('root'));
console.log('main.jsx: Root element:', document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);