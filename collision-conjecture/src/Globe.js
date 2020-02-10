import React from 'react';
import { hot } from "react-hot-loader/root"
import { Viewer, Entity } from "resium"
import { Cartesian3 } from "cesium"




const Globe = ({ positions, showSatellites }) => {

  const handleClick = (position) => {
    showSatellites(position)
  }

  const point = { pixelSize: 5, color: Cesium.Color.BROWN, outlineWidth: 1 }

  const dotPosition = positions.map(position => {
    return <Entity
      position={Cartesian3.fromDegrees(position.lon, position.lat)} point={point}
      longitude={position.lon}
      latitude={position.lat}
      key={position.id}
      name={position.name}
      country={position.country}
      onClick={() => handleClick(position)}
      description={`${position.country} <br></br>
        Capital:  ${position.name} <br></br>
        Latitude: ${position.lat} <br></br>
        Longitude: ${position.lon} <br></br>
        <a href="https://www.google.com/search?q=${position.name},${position.country}" target="_blank">Learn More</a>
        <br></br>`
      }
    />

  })

  return (
    <Viewer className="globe" full>
      {dotPosition}
    </Viewer>

  )
}


export default hot(Globe) 