import React from 'react';
import { hot } from "react-hot-loader/root"
import { Viewer, Entity, CzmlDataSource, CameraFlyTo } from "resium"
import { Cartesian3, Color } from "cesium"
import SatelliteIDs from './SatelliteIDs.js'

const Globe = ({ positions, showSatellites, ENVISAT, displaySats, randomSats, showFullStats, ENVISAT2, latitude, longitude, zoomOut }) => {

  const ids = SatelliteIDs

  const handleClick = (position) => {
    randomSats(ids)
    showSatellites(position)
  }

  const mapSatResponse = ENVISAT.map(data => {
    return data.czml_data
  })

  const point = { pixelSize: 5, color: Color.BROWN, outlineWidth: 1 }

  const dotPosition = positions.map(position => {
    return <Entity
      position={Cartesian3.fromDegrees(position.lon, position.lat)}
      point={point}
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

    <Viewer id="cesium-container" className="globe" full timeline={false}>
      {dotPosition}
      {displaySats
        ? <CzmlDataSource data={!showFullStats ? mapSatResponse[0] : ENVISAT2} />
        : null
      }
      {zoomOut === true
        ? <CameraFlyTo destination={Cartesian3.fromDegrees(longitude, latitude, 50000000)} />
        : <CameraFlyTo destination={
          latitude > 0.0
            ? Cartesian3.fromDegrees(longitude, latitude, 10000000)
            : Cartesian3.fromDegrees(-105, 40, 23000000)
        } />
      }
    </Viewer>
  )
}

export default hot(Globe) 