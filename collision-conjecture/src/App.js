import React, { Component } from 'react';
import './App.css';
import Globe from "./Globe.js"
import Debris from "./Debris.js"
import PlanetButtons from "./PlanetButtons.js"
import { FilterSatellites } from './FilterSatellites.js'
import Planets from './Planets.js'
import SatelliteIDs from './SatelliteIDs.js'
import { datetime, finaldate } from './Date.js'

const ids = SatelliteIDs

class App extends Component {

  state = {
    positions: [],
    latitude: 0.0,
    longitude: 0.0,
    searchTerm: "",
    displaySats: false,
    ENVISAT: [],
    ENVISAT2: [],
    randomSatsId: ids.sort(() => Math.random() - Math.random()).slice(0, 8),
    showFullStats: false,
    viewerToolBar: false,
    enlargePlanet: false,
    planetName: "",
    zoomOut: false,
    spots: [],
    debrisChosen: false,
    renderedDebris: null,
    splicedSpots: [],
    allDebris: false
  }

  fetchSpots = () => {
    fetch("http://localhost:3000/spots")
      .then(response => response.json())
      .then(spots => this.setState({ spots: spots }))
      .then(this.spliceSpots)
  }

  componentDidMount() {
    fetch("http://localhost:3000/positions")
      .then(response => response.json())
      .then(positions => this.setState({ positions: positions }))

    this.fetchSpots()

    document.querySelector(".cesium-viewer-bottom").remove()
    this.hideCesiumToolBar()
    this.hideCesiumTimeMapper()
  }

  hideCesiumToolBar = () => {
    let cesiumViwerToolbar = document.querySelector(".cesium-viewer-toolbar")
    cesiumViwerToolbar.style.visibility == "hidden" ? cesiumViwerToolbar.style.visibility = "visible" : cesiumViwerToolbar.style.visibility = "hidden"
  }

  hideCesiumTimeMapper = () => {
    document.querySelector(".cesium-viewer-animationContainer").style.visibility = "hidden"
  }

  spliceSpots = () => {
    const splicedSpot = {
      cosmos: this.state.spots.splice(0, 1000),
      iridium: this.state.spots.splice(0, 500),
      fengyun: this.state.spots.splice(0, 1000),
      indian: this.state.spots.splice(0, 15)
    }

    this.setState({
      splicedSpots: splicedSpot
    })
  }

  showToolBar = (event) => {
    this.hideCesiumTimeMapper()
    this.hideCesiumToolBar()
    document.querySelector(".debris-button").style.display = "none"
    event.target.innerText = "-"

    { !this.state.debrisChosen ? document.querySelector(".planet-buttons").style.display = "none" : null }
    { !this.state.debrisChosen ? document.querySelector("#toggle-planets").style.display = "none" : null }

    this.setState({
      viewerToolBar: true
    })
  }

  hideToolBar = (event) => {
    this.hideCesiumTimeMapper()
    this.hideCesiumToolBar()
    document.querySelector(".debris-button").style.display = "block"
    event.target.innerText = "+"

    { !this.state.debrisChosen ? document.querySelector(".planet-buttons").style.display = "block" : null }
    { !this.state.debrisChosen ? document.querySelector("#toggle-planets").style.display = "block" : null }

    this.setState({
      viewerToolBar: false
    })
  }

  showSatellites = (position) => {
    this.fetchSatellites(this.state.latitude, this.state.longitude)

    document.querySelector(".cesium-viewer-animationContainer").style.visibility = "visible"
    document.querySelector(".cesium-viewer-animationContainer").style.zIndex = "2"
    document.querySelector(".planet-buttons").style.display = "none"
    document.querySelector("#toggle-planets").style.display = "none"
    document.querySelector(".debris-button").style.display = "none"
    this.hideCesiumToolBar()
    
    this.setState({
      latitude: position.lat,
      longitude: position.lon,
    })

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
    this.fetchSatellites(this.state.latitude, this.state.longitude)

    this.setState({
      latitude: position.lat,
      longitude: position.lon,
    })
  }

  filterSubmit2 = (position) => {
    this.setState({
      latitude: position.lat,
      longitude: position.lon,
    })

    document.querySelector(".debris-button").style.display = "none"
    this.fetchSatellites2(this.state.latitude, this.state.longitude)
  }

  fetchSatellites = (latitude, longitude) => {
    fetch(`https://cors-anywhere.herokuapp.com/http://www.orbitalpredictor.com/api/predict_overpass/?sats=${this.state.randomSatsId}&start=2019-02-01_22:35:00&end=2019-02-02_22:35:00&latitude=${latitude}&longitude=${longitude}&visible=false&type=overpass`)
      .then(response => response.json())
      .then(ENVISAT => this.setState({ ENVISAT: ENVISAT.over_passes[Object.keys(ENVISAT.over_passes)[0]] }))
  }

  randomSats = (ids) => {
    this.setState({
      randomSatsId: ids.sort(() => Math.random() - Math.random()).slice(0, 1)
    })
  }

  fetchSatellites2 = () => {
    fetch(`https://cors-anywhere.herokuapp.com/http://www.orbitalpredictor.com/api/predict_orbit/?sats=${this.state.randomSatsId}&start=${datetime}&end=${finaldate}:00&format=czml&type=orbit`)
      .then(response => response.json())
      .then(ENVISAT2 => this.setState({ ENVISAT2 }))
  }

  showSats = () => {
    this.setState({
      displaySats: true,
      showFullStats: false
    })

    document.querySelector(".planet-buttons").style.display = "none"
    document.querySelector("#toggle-planets").style.display = "none"
  }

  showSats2 = () => {
    this.setState({
      displaySats: true,
      showFullStats: true,
      zoomOut: true
    })

    document.querySelector(".planet-buttons").style.display = "none"
    document.querySelector("#toggle-planets").style.display = "none"
    document.querySelector(".cesium-infoBox").classList.add("cesium-infoBox-bodyless")
    document.querySelector(".cesium-infoBox").classList.remove("cesium-infoBox-visible")
    document.querySelector(".cesium-viewer-animationContainer").style.visibility = "visible"
    document.querySelector(".cesium-viewer-animationContainer").style.zIndex = "2"
    this.fetchSatellites2(this.state.latitude, this.state.longitude)
  }

  hideSats = () => {
    this.setState({
      displaySats: false,
      latitude: 0.0,
      longitude: 0.0,
      ENVISAT: [],
      ENVISAT2: [],
      showFullStats: false,
      searchTerm: "",
      zoomOut: false,
      randomSatsId: ids.sort(() => Math.random() - Math.random()).slice(0, 8)
    })
    
    document.querySelector(".cesium-infoBox").classList.add("cesium-infoBox-bodyless")
    document.querySelector(".cesium-infoBox").classList.remove("cesium-infoBox-visible")
    document.querySelector(".planet-buttons").style.display = "block"
    document.querySelector("#toggle-planets").style.display = "block"
    document.querySelector(".debris-button").style.display = "block"
    this.hideCesiumTimeMapper()
  }

  hidePlanetButtons = () => {
    let styleDisplay = document.querySelector(".planet-buttons")
    {
      styleDisplay.style.display == "none"
        ? styleDisplay.style.display = "block"
        : styleDisplay.style.display = "none"
    }

    this.togglePlanetButtonToggler()
  }

  togglePlanetButtonToggler = () => {
    let styleDisplay = document.querySelector(".planet-buttons")
    let innertext = document.querySelector("#toggle-planets")
    { styleDisplay.style.display == "none" ? innertext.innerText = "+" : innertext.innerText = "x" }
  }

  enlargePlanets = (event) => {
    this.setState({
      enlargePlanet: true,
      planetName: event.target.innerText
    })

    document.querySelector(`#${event.target.innerText}`).style.visibility = "visible"
    document.querySelector(".iframe").style.display = "block"
  }

  shrinkPlanets = (event) => {
    this.setState({
      enlargePlanet: false,
      planetName: ""
    })

    document.querySelector(`#${event.target.innerText}`).style.visibility = "hidden"
    document.querySelector(".iframe").style.display = "none"
  }

  expandNasa = (event) => {
    const eventStyle = event.target.style
    eventStyle.zIndex = "5"
    eventStyle.marginLeft = "30%"
    eventStyle.marginTop = "1%"
    eventStyle.width = "60%"
    eventStyle.height = "80%"
  }

  closeNasa = (event) => {
    const eventStyle = event.target.style
    eventStyle.zIndex = "1"
    eventStyle.marginLeft = "68%"
    eventStyle.marginTop = "10%"
    eventStyle.width = "30%"
    eventStyle.height = "11%"
    eventStyle.position = "absolute"
  }

  toggleDebris = () => {
    this.hideCesiumToolBar()
    this.hideCesiumTimeMapper()
    this.fetchSpots()
    { this.state.debrisChosen ? this.setState({ debrisChosen: false }) : this.setState({ debrisChosen: true }) }
  }

  renderSpecificDebris = (debris) => {
    {
      this.state.renderedDebris == null
        ? this.setState({
          renderedDebris: debris
        })
        : this.setState({
          renderedDebris: null
        })
    }
  }

  renderAllDebris = (debris) => {
    {
      this.state.allDebris == false
        ?
        this.setState({ renderedDebris: debris, allDebris: true })
        : this.setState({
          allDebris: false, renderedDebris: null
        })
    }
  }

  render() {
    return (
      <div id="body">

        <button className="debris-button" onClick={this.toggleDebris}>Debris</button>
        <button id="show-toolbar" onClick={!this.state.viewerToolBar ? this.showToolBar : this.hideToolBar}>+</button>
        <h1 className="h1">Collision Conjecture</h1>

        {!this.state.debrisChosen
          ? <>
            <iframe onMouseOver={this.expandNasa} onMouseLeave={this.closeNasa}
              class="iframe"
              zIndex="2"
              style={{
                position: "absolute",
                width: "30%",
                height: "11%",
              }
              }
              src={`https://www.nasa.gov/${this.state.planetName}`}
              zIndex="3"
              frameBorder='0'
              allow='autoplay; encrypted-media'
              allowFullScreen
              title='video'
            />

            <Globe positions=
              {this.filterLocations()}
              showSatellites={this.showSatellites}
              ENVISAT={this.state.ENVISAT}
              ENVISAT2={this.state.ENVISAT2}
              displaySats={this.state.displaySats}
              randomSats={this.randomSats}
              showFullStats={this.state.showFullStats}
              latitude={this.state.latitude}
              longitude={this.state.longitude}
              zoomOut={this.state.zoomOut}
            />

            <FilterSatellites
              updateSearchTerm={this.updateSearchTerm}
              searchTerm={this.state.searchTerm}
              filterSubmit={this.filterSubmit}
              positions={this.state.positions}
              randomSats={this.randomSats}
              showFullStats={this.state.showFullStats}
              filterSubmit2={this.filterSubmit2}
            />

            <div className="satellite-buttons">
              <button id="map-random-satellites" onClick={this.showSats2}>Random</button>
              <button id="map-satellites-button" onClick={this.showSats}>Map Satellites</button>
            </div>

            <button id="reset-satellites-button" onClick={this.hideSats}>Reset</button>

            <Planets />

            <PlanetButtons
              enlargePlanet={this.state.enlargePlanet}
              changePlanet=
              {this.state.enlargePlanet
                ? this.shrinkPlanets
                : this.enlargePlanets
              }
            />

            <button id="toggle-planets" onClick={this.hidePlanetButtons}>x</button>
          </>

          : <>
            <Debris
              positions={this.filterLocations()}
              hideCesiumTimeMapper={this.hideCesiumTimeMapper()}
              renderSpecificDebris={this.renderSpecificDebris}
              allDebris={this.state.splicedSpots}
              renderedDebris={this.state.renderedDebris}
              renderAllDebris={this.renderAllDebris}
              showAllDebris={this.state.allDebris}
            />
          </>
        }

      </div>
    )
  }
}

export default App


