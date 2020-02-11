import React from 'react'

export const FilterSatellites = ({searchTerm, updateSearchTerm, filterSubmit, positions}) => {

   const handleChange = (event) =>{
        updateSearchTerm(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const matchPositions = positions.find(position => {
            return event.target.elements[0].value.toUpperCase() === position.name.toUpperCase() ||  event.target.elements[0].value.toUpperCase() === position.country.toUpperCase()
        })
        filterSubmit(matchPositions)
      }

      

        return (
            <div className="filter-satellites">
                <form onSubmit={handleSubmit} className="filter-first-form">
                    <input className="filter-form" onChange={handleChange} value={searchTerm} placeholder="City/Country/U.S. State" ></input>
                    <button onSubmit={handleSubmit} className="filter-submit">Filter</button>
                </form>
            </div>
        )
    
}


    

   

