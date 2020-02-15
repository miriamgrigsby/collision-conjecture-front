import React from 'react';
import { hot } from "react-hot-loader/root"
import { Viewer, Entity, CzmlDataSource, CameraFlyTo } from "resium"
import { Cartesian3, Color, SingleTileImageryProvider } from "cesium"


const Globe = ({ positions, renderSpecificDebris, allDebris, renderedDebris }) => {

    const point = { pixelSize: 5, color: Color.BROWN, outlineWidth: 1 }

    const dotPosition = positions.map(position => {
        return <Entity
            position={Cartesian3.fromDegrees(position.lon, position.lat, 1000000)}
            point={point}
            key={position.id}
        />
    })

    const dotPosition2 = positions.map(position => {
        return <Entity
            position={Cartesian3.fromDegrees(position.lat, position.lon, 1000000)}
            point={point}
            key={position.id}
        />
    })

    console.log(allDebris)

    // const showDebris = (debris, specificDebris) => {
    //     console.log(debris)
    //     console.log(specificDebris)
    //     {
    //         if (debris && specificDebris) {
    //             debris[specificDebris].map(position => {
    //                 return <Entity
    //                     position={Cartesian3.fromDegrees(position.latitude, position.longitude, position.altitude)}
    //                     point={point}
    //                     key={position.id}
    //                 />
    //             })
    //         }


    //     }
    // }

    const showDebris = () => {
        if (renderedDebris && allDebris ) {
            return allDebris[renderedDebris].map(position => {
                 return <Entity
                     position={Cartesian3.fromDegrees(position.latitude, position.longitude, position.altitude)}
                     point={point}
                     key={position.id}
                 />
             })
        }
    }

    //   const cosmoDebris = cosmos.map(position => {
    //     return <Entity
    //       position={Cartesian3.fromDegrees(position.latitude, position.longitude, position.altitude)}
    //       point={point}
    //       key={position.id}
    //     />
    // })

    // const iridiumDebris = iridium.map(position => {
    //     return <Entity
    //       position={Cartesian3.fromDegrees(position.latitude, position.longitude, position.altitude)}
    //       point={point}
    //       key={position.id}
    //     />
    // })

    // const fengyunDebris = fengyun.map(position => {
    //     return <Entity
    //       position={Cartesian3.fromDegrees(position.latitude, position.longitude, position.altitude)}
    //       point={point}
    //       key={position.id}
    //     />
    // })

    // const indianDebris = indian.map(position => {

    //     return <Entity
    //       position={Cartesian3.fromDegrees(position.latitude, position.longitude, position.altitude)}
    //       point={point}
    //       key={position.id}
    //     />
    // })

    const handleClick = (event) => {
        renderSpecificDebris(event.target.value)
        // showDebris(allDebris[event.target.value])
    }


    return (
        <>
            <Viewer id="cesium-container" className="globe" full timeline={false} baseLayerPicker={false}  >
                {dotPosition}
                {dotPosition2}
                {renderedDebris && allDebris  && showDebris()}
            </Viewer>
            <div className="debris-buttons-all">
                <button className="allDebris-button">Space Debris Impact</button>
                <button className="cosmo-button" onClick={handleClick} value="cosmos">Cosmos 2251</button>
                <button className="iridium-button" onClick={handleClick} value="iridium">Iridium 33</button>
                <button className="fengyun-button" onClick={handleClick} value="fengyun">Fengyun 1C</button>
                <button className="indian-button" onClick={handleClick} value="indian">Indian ASAT Test</button>
            </div>
        </>
    )
}

export default hot(Globe) 