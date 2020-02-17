import React from 'react'

const PlanetButtons = ({ changePlanet }) => {

    const handleClick = (event) => {
        changePlanet(event)
    }

    return (
        <div className="planet-buttons">
            <div id="sun-gif" onClick={handleClick}>sun</div>
            <div id="mercury-gif" onClick={handleClick}>mercury</div>
            <div id="venus-gif" onClick={handleClick}>venus</div>
            <div id="earth-gif" onClick={handleClick}>earth</div>
            <div id="moon-gif" onClick={handleClick}>moon</div>
            <div id="mars-gif" onClick={handleClick}>mars</div>
            <div id="jupiter-gif" onClick={handleClick}>jupiter</div>
            <div id="saturn-gif" onClick={handleClick}>saturn</div>
            <div id="uranus-gif" onClick={handleClick}>uranus</div>
            <div id="neptune-gif" onClick={handleClick}>neptune</div>
            <div id="pluto-gif" onClick={handleClick}>pluto</div>
        </div>
    )
}

export default PlanetButtons