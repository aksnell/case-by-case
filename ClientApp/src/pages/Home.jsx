import React from 'react'
import ReactMapboxGl, { GeoJSONLayer } from 'react-mapbox-gl'


const json = require("./test.json")

const convert = (json) => {
  const shelters = {
    type: "FeatureCollection",
    features: []
  }
  for (let loc of json.filter(loc => loc["is_geocoded"])) {
    shelters["features"].push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [
          loc["longitude"],
          loc["latitude"]
        ]
      },
      properties: {
        "id": loc["id"],
        "phone": loc["phone"],
        "place": loc["name"]
      }
    })
  }
  return shelters
}

const shelterGeoJson = convert(json)

export function Home() {

  const Map = ReactMapboxGl({
    accessToken: 'pk.eyJ1IjoiYWtzbmVsbCIsImEiOiJja2QyNWIxaGwwMHF5MnNtb2hlM3kzODc5In0._iaqzpg_V-an3ngDTSWfmQ'
  })

  return (
    <Map
      style="mapbox://styles/aksnell/ckd27ujkt1un91iqouslqh4sk"
      center={[-82.460258, 27.963515]}
      zoom={[16]}
      bearing={[-20.00]}
      pitch={[52.50]}
      containerStyle={{
        height: '100vh',
        width: '100vh'
      }}
    >
    <GeoJSONLayer
      data={shelterGeoJson}
      circleLayout={{
        "visibility": "visible"
      }}
      symbolLayout={{
        "text-field": "{place}",
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-offset": [0, 0.6],
        "text-anchor": "top"
      }}
    />
    </Map>
  )
}
