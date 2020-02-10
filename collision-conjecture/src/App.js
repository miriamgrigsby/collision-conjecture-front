import React, { Component } from 'react';
import './App.css';
import Globe from "./Globe.js"

class App extends Component {

  state = {
    positions: [],
    latitude: 0.0,
    longitude: 0.0,

  }

  componentDidMount() {
    fetch("http://localhost:3000/positions")
      .then(response => response.json())
      .then(positions => this.setState({ positions }))
  }


  showSatellites = (position) => {
    this.setState({
      latitude: position.lat,
      longitude: position.lon
    })
  }

  render() {
    return (
      <div id="body">
        <h1 className="h1">Collision Conjecture</h1>
        <Globe positions={this.state.positions} showSatellites={this.showSatellites}/>
        <div className="satellite-buttons">
          <button id="map-satellites-button">Map Satellites</button>
          <button id="reset-satellites-button">Reset</button>
          
        </div>
      </div>
    )
  }
}




 export default App

