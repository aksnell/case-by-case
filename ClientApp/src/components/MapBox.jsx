import React, { useEffect, useState, useRef } from 'react'
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapboxTraffic = require('@mapbox/mapbox-gl-traffic');

const mapStyle = {
  width: "100vw",
  height: "100vh",
  position:" absolute"
}

const API_KEY = process.env.REACT_APP_MAPBOX_KEY

export function Map() {
  const [ map, setMap ] = useState(null)
  const mapContainer = useRef(null)


  // Map initialiization
  useEffect(() => {
    mapboxgl.accessToken = API_KEY
    const initializeMap = ({ setMap, mapContainer}) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/aksnell/ckd27ujkt1un91iqouslqh4sk',
        center: [-82.460258, 27.963515],
        zoom: 18,
        bearing: -20.00,
        pitch: 52.50
      })

      map.on("load", () => {
	map.addControl(new MapboxTraffic());
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

