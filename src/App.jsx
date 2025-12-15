import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Map3D from './components/Map3d';
import CesiumMap from './components/CesiumBox' ; 
const App = () => {

  return (
    <div className="App">
      {/* <Map3D /> */}
      <CesiumMap />
    </div>
  );
};

export default App;
