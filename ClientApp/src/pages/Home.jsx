import React from 'react'
import { Map } from '../components/MapBox'


// const json = require("./test.json")

// const convert = (json) => {
//   const shelters = {
//     type: "FeatureCollection",
//     features: []
//   }
//   for (let loc of json.filter(loc => loc["is_geocoded"])) {
//     console.log(loc["name"])
//     shelters["features"].push({
//       type: "Feature",
//       geometry: {
//         type: "Point",
//         coordinates: [
//           loc["longitude"],
//           loc["latitude"]
//         ]
//       },
//       properties: {
//         "id": loc["id"],
//         "phone": loc["phone"],
//         "place": loc["name"]
//       }
//     })
//   }
//   return shelters
// }

// const shelterGeoJson = convert(json)

export function Home() {
  return (
    <Map/>
  )
}
