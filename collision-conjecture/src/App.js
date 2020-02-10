import React, { Component } from 'react';
import './App.css';
import Globe from "./Globe.js"
import {FilterSatellites}  from './FilterSatellites'
import Cesium from "cesium";

var unique = require('uniq')

class App extends Component {

  state = {
    positions: [],
    latitude: 0.0,
    longitude: 0.0,
    searchTerm: "",
  }

  componentDidMount() {
    fetch("http://localhost:3000/positions")
      .then(response => response.json())
      .then(positions => this.setState({ positions }))
  }


  showSatellites = (position) => {
    console.log(position)
    this.setState({
      latitude: position.lat,
      longitude: position.lon,
    })
  }

  updateSearchTerm = (term) => {
    this.setState({
      searchTerm: term
    })
  }

  filterLocations = () => this.state.positions
    .filter(position => {
      return position.name.toUpperCase().includes(this.state.searchTerm.toUpperCase()) || position.country.toUpperCase().includes(this.state.searchTerm.toUpperCase())
    })
   
  filterSubmit = (position) => {
    this.setState({
      latitude: position.lat,
      longitude: position.lon,
    })
  }

  // viewer = new Cesium.Viewer('root')
  // console.log(viewer)

//   viewer.camera.flyTo({
//   destination : Cesium.Cartesian3.fromDegrees(-122.22, 46.12, 5000.0),
//   orientation : {
//       heading : Cesium.Math.toRadians(20.0),
//       pitch : Cesium.Math.toRadians(-35.0),
//       roll : 0.0
//   }
// })


  render() {
    return (
      <div id="body">
        <h1 className="h1">Collision Conjecture</h1>
        <Globe positions={this.filterLocations()} showSatellites={this.showSatellites} />
        <FilterSatellites updateSearchTerm={this.updateSearchTerm} searchTerm={this.state.searchTerm} filterSubmit={this.filterSubmit} positions={this.state.positions}/>
        <div className="satellite-buttons">
          <button id="map-satellites-button">Map Satellites</button>
          <button id="reset-satellites-button">Reset</button>
        </div>
        
      </div>
    )
  }
}

export default App


