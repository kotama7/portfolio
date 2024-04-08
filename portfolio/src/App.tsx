import React from 'react';
import logo from './logo.svg';
import './App.css';

import Home from './components/home/home';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <body>
        <Home />
      </body>
    </div>
  );
}

export default App;
