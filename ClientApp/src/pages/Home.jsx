import React, { useRef, useState, useEffect } from 'react'
import ReactMapboxGl, { Marker } from 'react-mapbox-gl'


export function Home() {

  const mapContainer = useRef(null);
  const json = require("./test.json")

  const [ lng, setLng ] = useState(5)
  const [ lat, setLat ] = useState(34)
  const [ zoom, setZoom ] = useState(1.5)

  console.log(json)

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
    </Map>
  )
}
