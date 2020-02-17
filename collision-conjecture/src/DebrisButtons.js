import React from 'react'

const DebrisButtons = ({renderSpecificDebris, renderAllDebris}) => {

    const allDebrisPieces = ["cosmos", "iridium", "fengyun", "indian"]

    const handleClick = (event) => {
        renderSpecificDebris([event.target.value])
    }

    const handleAll = (event) => {
        renderAllDebris(allDebrisPieces)
    }

    return (
        <div className="debris-buttons-all">
            <button className="allDebris-button" onClick={handleAll}>Space Debris Impact</button>
            <button className="cosmo-button" onClick={handleClick} value="cosmos">Cosmos 2251</button>
            <button className="iridium-button" onClick={handleClick} value="iridium">Iridium 33</button>
            <button className="fengyun-button" onClick={handleClick} value="fengyun">Fengyun 1C</button>
            <button className="indian-button" onClick={handleClick} value="indian">Indian ASAT Test</button>
        </div>
    )
}

export default DebrisButtons