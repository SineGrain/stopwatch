import React from 'react';
import logo from './logo.svg';
import './App.scss';
import { Stopwatch } from './views/Stopwatch';
import { Control } from './views/Control';

function App() {
  const path = window.location.pathname

  let CurrentView: React.FC  = Stopwatch

  switch(path){
    case '/': {
      CurrentView = Stopwatch
      break;
    }
    case '/control': {
      CurrentView = Control
      break;
    }
  }


  return (
    <div className="App">
      <CurrentView />
    </div>
  );
}

export default App;
