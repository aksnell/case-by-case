import React, { useEffect, useState, useRef } from 'react'
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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

const mapStyle = {
  width: "100vw",
  height: "100vh",
  position:" absolute"
}


export function Home() {
  const [ map, setMap ] = useState(null)
  const mapContainer = useRef(null)


  // Map initialiization
  useEffect(() => {
    mapboxgl.accessToken =  'pk.eyJ1IjoiYWtzbmVsbCIsImEiOiJja2Q2MzcxYmgwdjNkMzFvZGhqdmxrYmpvIn0.-c3cS4I9ZS4TVtCltd5Q8Q'
    const initializeMap = ({ setMap, mapContainer}) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-82.460258, 27.963515],
        zoom: 16,
        bearing: -20.00,
        pitch: 52.50
      })

      map.on("load", () => {
        setMap(map)
        map.resize()
      })
    }

    if (!map) initializeMap({ setMap, mapContainer })

  }, [map])

  return (
    <div ref={el => (mapContainer.current = el)} style={mapStyle}/>
  )
}
