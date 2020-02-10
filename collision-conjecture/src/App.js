import React, { Component } from 'react';
import './App.css';
import Globe from "./Globe.js"
import { FilterSatellites } from './FilterSatellites'
import Modal from './Modal.js'


class App extends Component {

  state = {
    positions: [],
    latitude: 0.0,
    longitude: 0.0,
    searchTerm: "",
    show: false,
    showButton: false
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
      showButton: true
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


  showModal = () => {
    this.setState({
      show: true,
      showButton: false
    });

  };

  hideModal = () => {
    this.setState({
      show: false
    });
  };


  render() {
    const { showButton } = this.state
    return (
      <div id="body">
        <h1 className="h1">Collision Conjecture</h1>
        <Globe positions={this.filterLocations()} showSatellites={this.showSatellites} />
        <FilterSatellites updateSearchTerm={this.updateSearchTerm} searchTerm={this.state.searchTerm} />
        <div className="satellite-buttons">
          <button id="map-satellites-button">Map Satellites</button>
          <button id="reset-satellites-button">Reset</button>

        </div>
        {showButton
          ? <button onClick={this.showModal}
            className="showModal">More Info</button>
          : null
        }
        <Modal show={this.state.show} hideModal={this.hideModal} />
      </div>
    )
  }
}




export default App



