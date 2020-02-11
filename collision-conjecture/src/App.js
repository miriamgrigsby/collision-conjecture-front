import React, { Component } from 'react';
import './App.css';
import Globe from "./Globe.js"
import { FilterSatellites } from './FilterSatellites'


class App extends Component {

  state = {
    positions: [],
    latitude: 0.0,
    longitude: 0.0,
    searchTerm: "",
    displaySats: false,
    ENVISAT: []
  }

  componentDidMount() {
    fetch("http://localhost:3000/positions")
      .then(response => response.json())
      .then(positions => this.setState({ positions }))
    this.fetchSatellites()
    // fetch("https://cors-anywhere.herokuapp.com/http://www.orbitalpredictor.com/api/predict_orbit/?sats=41888&start=2020-02-26_15:00:00&end=2020-02-27_15:00:00&format=czml&type=orbit")
    //   .then(response => response.json())
    //   .then(satResponse => this.setState({satResponse}))
  }


  showSatellites = (position) => {
    this.setState({
      latitude: position.lat,
      longitude: position.lon,
    })
    this.fetchSatellites(this.state.latitude, this.state.longitude)
  }

  updateSearchTerm = (term) => {
    this.setState({
      searchTerm: term,
    })
  }

  filterLocations = () => 
    this.state.positions
    .filter(position => {
      return position.name.toUpperCase().includes(this.state.searchTerm.toUpperCase()) || position.country.toUpperCase().includes(this.state.searchTerm.toUpperCase()) 
    })
  
  

  filterSubmit = (position) => {
      this.setState({
        latitude: position.lat,
        longitude: position.lon,
      })
    this.fetchSatellites(this.state.latitude, this.state.longitude)
  }


// fetchSatellites = (latitude, longitude) => {
//   fetch(`https://cors-anywhere.herokuapp.com/http://www.orbitalpredictor.com/api/predict_overpass/?sats=27386&start=2018-02-22_22:35:00&end=2018-02-23_22:35:00&latitude=${latitude}&longitude=${longitude}&visible=false&type=overpass`)
//   .then(response => console.log(response.json()))
//   // .then(ENVISAT => this.setState({ENVISAT: ENVISAT.over_passes.ENVISAT}))
// }


fetchSatellites = () => {
  fetch(`https://cors-anywhere.herokuapp.com/http://www.orbitalpredictor.com/api/predict_orbit/?sats=41888,40938,40549,28393,40013&start=2020-02-26_15:00:00&end=2020-02-27_15:00:00&format=czml&type=orbit`)
  .then(response => response.json())
  .then(ENVISAT => this.setState({ENVISAT}))
}



  // on either the filtersubmit or the showsatellites ()s we need to do a fetch that fills in the newly set lat and long from state and returns that response to then be displayed 
 

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


  showSats = () => {
    this.setState({
      displaySats: true
    })
  }


hideSats = () => {
    this.setState({
      displaySats: false
    })
  }

  render() {
    return (
      <div id="body">
        <h1 className="h1">Collision Conjecture</h1>
        <Globe positions=
        {this.filterLocations()} 
        showSatellites={this.showSatellites} 
        ENVISAT={this.state.ENVISAT}
        displaySats={this.state.displaySats}
      />

        <FilterSatellites 
        updateSearchTerm={this.updateSearchTerm} 
        searchTerm={this.state.searchTerm} 
        filterSubmit={this.filterSubmit} 
        positions={this.state.positions} 
      />
        
        <div className="satellite-buttons">
          <button id="map-satellites-button" onClick={this.showSats}>Map Satellites</button>
          <button id="reset-satellites-button" onClick={this.hideSats}>Reset</button>
        </div>
      </div>
    )
  }
}

export default App


