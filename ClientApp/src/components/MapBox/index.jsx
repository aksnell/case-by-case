import React, { useEffect, useState, useRef } from 'react'
import mapboxgl, { PositionOptions } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const API_KEY = process.env.REACT_APP_MAPBOX_KEY

// Convert THI/Unity JSON format to GeoJSON specification.
const convertGeoJson = () => {

  const rawJson = require('./test.json')
  const mapboxClient = require('@mapbox/mapbox-sdk/services/geocoding')
  const geocodeClient = mapboxClient({ accessToken: API_KEY })

  const result = {
    features: Array(rawJson.length)
  }

  for (let shelter of rawJson) {
    geocodeClient.forwardGeocode({
      query: `${shelter['address1']}, ${shelter['city']}`,
      limit: 1
    })
    .send()
    .then(response => {
      const match = response.body
      result.features.push({
        type: "Feature",
        geometry: {
          coordinates: match.features[0].center,
          type: 'Point'
        },
        properties: {
          title: shelter['name'].match('[A-z -]+')[0].replaceAll('-', '\n'),
          description: shelter['description'],
          address: `${shelter['address1']}${(shelter['address2'] != '') ? ' ' + shelter['address2'] : ''}, ${shelter['city']}, FL ${shelter['zipcode']}`,
          city: shelter['city'],
          zipcode: shelter['zipcode'],
          url: shelter['url'],
          phone: shelter['phone'],
          date_modified: shelter['date_modified'],
          populations: {
            handicap: shelter['handicap_access'],
            men: shelter['tsv_default'].search(`'male|\'men`) != -1,
            women: shelter['tsv_default'].search(`'women|'fem`) != -1,
            children: shelter['tsv_default'].search(`'child`) != -1,
            family: shelter['tsv_default'].search(`'famili`) != -1,
            veteran: shelter['tsv_default'].search(`'vet`) != -1,
            pregnant: shelter['tsv_default'].search(`'preg|'matern`) != -1
          },
          services: {
            job: shelter['tsv_default'].search(`'job`) != -1,
            domestic: shelter['tsv_default'].search(`domest`) != -1,
            substance: shelter['tsv_default'].search(`substa`) != -1,
            transportation: shelter['tsv_default'].search(`transp`) != -1,
            emergency: shelter['service_string'].search(`Emerge`) != -1,
            transitional: shelter['service_string'].search(`Transit`) != -1
          },
          availability: {
            total: shelter['unitListInfo'][0]['total'],
            available: shelter['unitListInfo'][0]['available'],
          }
        }
      })
    })
  }
  console.log(result)
}

const mapStyle = {
  width: "100vw",
  height: "100vh",
  position:" absolute"
}


convertGeoJson()

export function Map() {
  const [ map, setMap ] = useState(null)
  const mapContainer = useRef(null)

  // Map initialization
  useEffect(() => {
    mapboxgl.accessToken = API_KEY

    const initializeMap = ({ setMap, mapContainer}) => {
      // Create map with custom styling, centered on Metropolitan Ministries.
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/aksnell/ckd27ujkt1un91iqouslqh4sk',
        center: [-82.460258, 27.963515],
        zoom: 18,
        bearing: -20.00,
        pitch: 52.50
      })

      // Find user location
      map.addControl(
        new mapboxgl.GeolocateControl({
          PositionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        })
      )

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

