import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './App.css'
import CardGenerator from './CardGenerator'



  function App() {
    return (
      <div className="App">
        <h1 className="text-center mt-1">Random Card Generator</h1>
        <CardGenerator />
        
      </div>
    );
  }

  
  export default App;
