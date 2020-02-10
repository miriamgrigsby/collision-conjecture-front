import React from 'react'

export const FilterSatellites = ({searchTerm, updateSearchTerm}) => {

   const handleChange = (event) =>{
        updateSearchTerm(event.target.value)
    }


        return (
            <div className="filter-satellites">
                <form on>
                    <input className="filter-form" onChange={handleChange} value={searchTerm} placeholder="City/Country/U.S. State"></input>
                </form>
            </div>
        )
    
}
