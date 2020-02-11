// // var Cesium = require("cesium/Cesium")

// import React from 'react'
// import { Viewer, CzmlDataSource } from "cesium"




// export default function SatelliteMapper() {

    

//     const proxyurl = "https://cors-anywhere.herokuapp.com/"
//     const url = 'http://www.orbitalpredictor.com/api/predict_orbit/?sats=41888,40938,40549&start=2020-02-26_15:00:00&end=2020-02-27_15:00:00&format=czml&type=orbit'
//     fetch(proxyurl + url)
//         .then(function (resource) {
//             return CzmlDataSource.load(proxyurl + url);
//         })
//         .then(function (dataSource) {
//             return viewer.dataSources.add(dataSource);
//         })
//         .then(function (dataSource) {
//             return viewer.zoomTo(dataSource);
//         });
//     return (
//         <div>

//         </div>
//     )
// }
