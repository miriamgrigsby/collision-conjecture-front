import React from 'react';
import { hot } from "react-hot-loader/root"
import { Viewer, Entity } from "resium"
import { Cartesian3, Color } from "cesium"
import DebrisButtons from './DebrisButtons.js'

const Globe = ({ positions, renderSpecificDebris, allDebris, renderedDebris, renderAllDebris, showAllDebris }) => {

    let point = { pixelSize: 4, color: Color.WHITE }

    const dotPosition = positions.map(position => {
        return <Entity
            position={Cartesian3.fromDegrees(position.lon, position.lat, 3500000)}
            point={point}
            key={position.id}
        />
    })

    const dotPosition2 = positions.map(position => {
        return <Entity
            position={Cartesian3.fromDegrees(position.lat, position.lon, 2500000)}
            point={point}
            key={position.id}
        />
    })

    const showDebris = () => {
        if (renderedDebris && allDebris) {
            return renderedDebris.map(debrisPiece => {
                console.log(debrisPiece)
                if (debrisPiece === "cosmos") {
                    point = { pixelSize: 4, color: Color.BROWN }
                } else if (debrisPiece === "iridium") {
                    point = { pixelSize: 5, color: Color.BLUE }
                } else if (debrisPiece === "indian") {
                    point = { pixelSize: 8, color: Color.GREEN }
                } else {
                    point = { pixelSize: 6, color: Color.YELLOW }
                }
                return allDebris[debrisPiece].map(position => {
                    return <Entity
                        position={Cartesian3.fromDegrees(position.latitude, position.longitude, position.altitude)}
                        point={point}
                        key={position.id}
                    />
                })
            })

        }
    }

    return (
        <>
            <Viewer id="cesium-container" className="globe" full timeline={false} baseLayerPicker={false}  >

                {
                    showAllDebris === true
                        ? <> {dotPosition} {dotPosition2} {showDebris()} </>
                        : <> {
                            renderedDebris == null
                                ? <> {dotPosition} {dotPosition2} </>
                                : <> renderedDebris && allDebris && {showDebris()} </>
                        } </>
                }

            </Viewer>
            <DebrisButtons renderSpecificDebris={renderSpecificDebris} renderAllDebris={renderAllDebris} />
        </>
    )
}

export default hot(Globe) 