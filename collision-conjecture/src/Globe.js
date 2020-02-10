import React from 'react';
import { hot } from "react-hot-loader/root"
import { Viewer, Entity } from "resium"
import { Cartesian3 } from "cesium"




const Globe = ({positions, showSatellites}) => {

    const handleClick = (position) => {
        showSatellites(position)
    }

    const point = { pixelSize: 5, color: Cesium.Color.RED, outlineWidth: 2}
    const dotPosition = positions.map(position => {
        return  <Entity position={Cartesian3.fromDegrees(position.lon, position.lat)} point={point} longitude={position.lon} latitude={position.lat} key={position.id} onClick={() => handleClick(position)}/>
       
    })

    return (
  <Viewer className="globe" full>
    {dotPosition}
  </Viewer>

    )
}


export default hot(Globe) 