import React, { Component } from 'react';
import './App.css';
import Globe from "./Globe.js"
import Debris from "./Debris.js"
import Planets from "./Planets.js"
import { FilterSatellites } from './FilterSatellites'
import { throttleRequestByServer } from 'cesium';


let currentdate = new Date();
let datetime = currentdate.getFullYear() + "-" + "0" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + "_" + currentdate.getHours() + ":" + currentdate.getMinutes()

let finaldate = currentdate.getFullYear() + "-" + "0" + (currentdate.getMonth() + 1) + "-" + (currentdate.getDate() + 1) + "_" + currentdate.getHours() + ":" + currentdate.getMinutes()


const ids = [44369, 43600, 10936, 44368, 44372, 44367, 2371, 43728, 44365, 44374, 44366, 44370, 2741, 70027, 43763, 43834, 44371, 44419, 43768, 27424, 44083, 37256, 40549, 40938, 36828, 37384, 37763, 37948, 41434, 43539, 70069, 44105, 900, 43671, 16719, 29670, 32393, 42798, 43508, 44299, 70120, 44900, 28895, 27848, 39271, 27844, 43474, 24753, 41459, 43792, 43807, 70063, 70064, 99999, 32958, 37214, 39260, 43010, 42920, 43137, 70062, 43730, 43812, 44622, 43585, 40118, 41727, 43461, 43484, 40701, 36585, 40730, 41019, 41328, 37753, 38833, 39166, 39533, 39741, 40105, 40534, 28129, 28190, 28361, 28474, 24876, 26360, 26407, 26605, 27663, 27704, 28874, 29486, 29601, 32260, 32384, 32711, 35752, 43476, 70065, 70066, 5, 40015, 43655, 44385, 42957, 24793, 25544, 70003, 40961, 0, 6126, 39084, 1361, 43184, 43113, 7276, 40069, 35865, 44387, 25338, 28654, 33591, 43013, 39188, 44235, 44298, 43836, 43837, 41186, 44058, 1, 19822, 70130, 70131, 32382, 44322, 70081, 43477, 43618, 27607, 43831, 40697, 43437, 43238, 38011, 7646, 44713, 41907, 41908, 25260, 70116, 70067, 42829, 25994, 70070, 99991, 41765, 43216, 43217, 70068, 44315, 35946, 41848, 41857, 43442, 70002, 2364, 70097, 41770, 29671, 32276, 32275, 32395, 36111, 36112, 36113, 36400, 36402, 36401, 37139, 37372, 37829, 37869, 37867, 37868, 39155, 39620, 40001, 40315, 41330, 41554, 42939, 70048, 26548]



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
    splicedSpots: []
  }

  componentDidMount() {
    fetch("http://localhost:3000/positions")
      .then(response => response.json())
      .then(positions => this.setState({ positions: positions }))

    fetch("http://localhost:3000/spots")
      .then(response => response.json())
      .then(spots => this.setState({ spots: spots }))
      .then(this.spliceSpots)

    document.querySelector(".cesium-viewer-bottom").remove()
    document.querySelector(".cesium-viewer-toolbar").style.visibility = "hidden"
    this.hideCesiumTimeMapper()
  }
  

  spliceSpots = () => {
    const splicedSpot = {
      cosmos: this.state.spots.splice(0, 1000),
      iridium: this.state.spots.splice(0, 500),
      fengyun: this.state.spots.splice(0, 1000),
      indian: this.state.spots.splice(0,15)
    }
    this.setState({
      splicedSpots: splicedSpot
    })
  }


  hideCesiumTimeMapper = () => {
    document.querySelector(".cesium-viewer-animationContainer").style.visibility = "hidden"
  }

 

  showToolBar = (event) => {
    this.hideCesiumTimeMapper()
    document.querySelector(".cesium-viewer-toolbar").style.visibility = "visible"
    {!this.state.debrisChosen ?   document.querySelector(".planet-buttons").style.display = "none" : null}
    {!this.state.debrisChosen ?   document.querySelector("#toggle-planets").style.display = "none" : null}
    document.querySelector(".debris-button").style.display = "none"
    this.setState({
      viewerToolBar: true
    })
    event.target.innerText = "-"
  }


  hideToolBar = (event) => {
    this.hideCesiumTimeMapper()
    document.querySelector(".cesium-viewer-toolbar").style.visibility = "hidden"
    document.querySelector(".debris-button").style.display = "block"
    {!this.state.debrisChosen ?   document.querySelector(".planet-buttons").style.display = "block" : null}
    {!this.state.debrisChosen ?   document.querySelector("#toggle-planets").style.display = "block" : null}
    this.setState({
      viewerToolBar: false
    })
    event.target.innerText = "+"
  }

  showSatellites = (position) => {
    document.querySelector(".cesium-viewer-animationContainer").style.visibility = "visible"
    document.querySelector(".cesium-viewer-animationContainer").style.zIndex = "2"
    document.querySelector(".cesium-viewer-toolbar").style.visibility = "visible"
    document.querySelector(".planet-buttons").style.display = "none"
    document.querySelector("#toggle-planets").style.display = "none"


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
    this.hideCesiumTimeMapper()
  }

  hidePlanetButtons = () => {
    {
      document.querySelector(".planet-buttons").style.display == "none"
        ? document.querySelector(".planet-buttons").style.display = "block"
        : document.querySelector(".planet-buttons").style.display = "none"
    }
    this.togglePlanetButtonToggler()

  }

  togglePlanetButtonToggler = () => {
    {
      document.querySelector(".planet-buttons").style.display == "none"
        ? document.querySelector("#toggle-planets").innerText = "+"
        : document.querySelector("#toggle-planets").innerText = "x"
    }
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
    document.querySelector(`#${event.target.innerText}`).style.visibility = "hidden"
    this.setState({
      enlargePlanet: false,
      planetName: ""
    })
    document.querySelector(".iframe").style.display = "none"
  }

  expandNasa = (event) => {
    event.target.style.zIndex = "5"
    event.target.style.marginLeft = "30%"
    event.target.style.marginTop = "1%"
    event.target.style.width = "60%"
    event.target.style.height = "80%"
    console.log(this.state.planetName)
  }

  closeNasa = (event) => {
    event.target.style.zIndex = "1"
    event.target.style.marginLeft = "68%"
    event.target.style.width = "30%"
    event.target.style.height = "11%"
    event.target.style.position = "absolute"
    event.target.style.marginTop = "10%"
  }

  toggleDebris = () => {
    document.querySelector(".cesium-viewer-toolbar").style.visibility = "hidden"
    document.querySelector(".cesium-viewer-animationContainer").style.visibility = "hidden"
    fetch("http://localhost:3000/spots")
      .then(response => response.json())
      .then(spots => this.setState({ spots: spots }))
    {this.state.debrisChosen 
    
      ? this.setState({
          debrisChosen: false
      })
      : this.setState({
        debrisChosen: true
      })
    }
    
  }

  renderSpecificDebris = (debris) => {
    this.setState({
      renderedDebris: debris
    })
  }

  render() {
    return (
      <div id="body">
        <button className="debris-button" onClick={this.toggleDebris}>Debris</button>
        <button id="show-toolbar" onClick={!this.state.viewerToolBar ? this.showToolBar : this.hideToolBar}>+</button>
        <h1 className="h1">Collision Conjecture</h1>
        {
          !this.state.debrisChosen 
       ?
        <>
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
       <div id="moon" ></div>
       <div id="sun" ></div>
       <div id="mercury"></div>
       <div id="venus"></div>
       <div id="earth"></div>
       <div id="mars"></div>
       <div id="jupiter"></div>
       <div id="saturn"></div>
       <div id="uranus"></div>
       <div id="neptune"></div>
       <div id="pluto"></div>
       <Planets enlargePlanet={this.state.enlargePlanet}
         changePlanet=
         {this.state.enlargePlanet
           ? this.shrinkPlanets
           : this.enlargePlanets
         }/>
          <button id="toggle-planets" onClick={this.hidePlanetButtons}>x</button>
        
    </>
    :
    <>
        
       <Debris 
       positions={this.filterLocations()} 
       hideCesiumTimeMapper={this.hideCesiumTimeMapper()}
       renderSpecificDebris={this.renderSpecificDebris}
       allDebris={this.state.splicedSpots}
       renderedDebris={this.state.renderedDebris}
       />
       </>
        }
  
      </div>
    )
  }
}

export default App


