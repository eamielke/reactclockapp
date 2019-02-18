import React, { Component } from 'react';
import './App.css';
import ClockFace from "./ClockFace";

class App extends Component {
  render() {
    return (
      <div className="App">
      <ClockFace faceDiameter="200"/>
      </div>
    );
  }
}

export default App;
