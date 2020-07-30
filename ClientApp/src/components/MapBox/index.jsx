import React, { useEffect, useState, useRef } from 'react'
import mapboxgl, { PositionOptions } from 'mapbox-gl'
import './style.scss'
import 'mapbox-gl/dist/mapbox-gl.css'

const API_KEY = process.env.REACT_APP_MAPBOX_KEY

// Convert THI/Unity JSON format to GeoJSON specification.
const convertGeoJson = () => {
  const rawJson = require('./test.json')
  const mapboxClient = require('@mapbox/mapbox-sdk/services/geocoding')
  const geocodeClient = mapboxClient({ accessToken: API_KEY })

  const result = {
    features: Array(rawJson.length),
  }

  const acceptsMen = /\'male|\'men/g
  const acceptsWomen = /\'wome|\'fem/g
  const acceptsChildren = /\'child/g
  const acceptsPregnant = /\'mater|\'preg/g
  const acceptsFamilies = /\'famili/g
  const acceptsVeterans = /\'vet/g

  // TODO: Refactor to produce entire population string at once.
  const verifyPopulation = (popRegex, tsv_string) => {
    return tsv_string.search(popRegex) != -1
  }

  for (let shelter of rawJson) {
    const populations = shelter['tsv_default']

    geocodeClient
      .forwardGeocode({
        query: `${shelter['address1']}, ${shelter['city']}`,
        limit: 1,
      })
      .send()
      .then(response => {
        const match = response.body
        result.features.push({
          type: 'Feature',
          geometry: {
            coordinates: match.features[0].center,
            type: 'Point',
          },
          properties: {
            title: shelter['name'].match('[A-z -]+')[0].replaceAll('-', '\n'),
            description: shelter['description'],
            address: `${shelter['address1']}${
              shelter['address2'] != '' ? ' ' + shelter['address2'] : ''
            }, ${shelter['city']}, FL ${shelter['zipcode']}`,
            city: shelter['city'],
            zipcode: shelter['zipcode'],
            url: shelter['url'],
            phone: shelter['phone'],
            date_modified: shelter['date_modified'],
            populations: `${shelter['handicap_access'] ? 'handicap,' : ''}${
              verifyPopulation(acceptsMen, populations) ? 'men,' : ''
            }${verifyPopulation(acceptsWomen, populations) ? 'women,' : ''}${
              verifyPopulation(acceptsChildren, populations) ? 'youth,' : ''
            }${
              verifyPopulation(acceptsFamilies, populations) ? 'family,' : ''
            }${
              verifyPopulation(acceptsVeterans, populations) ? 'veterans,' : ''
            }${
              verifyPopulation(acceptsPregnant, populations) ? 'pregnant' : ''
            }`,
            emergency: shelter['service_string'].search(/Emerg/g) != -1,
            transitional: shelter['service_string'].search(/Trans/g) != -1,
            substance: shelter['tsv_default'].search(/substa/g) != -1,
            total_beds: shelter['unitListInfo'][0]['total'],
            available_beds: shelter['unitListInfo'][0]['available'],
          },
        })
      })
  }
  console.log(result)
}

//convertGeoJson()

const mapStyle = {
  width: '100vw',
  height: '100vh',
  position: 'absolute',
}

export function Map() {
  const [map, setMap] = useState(null)
  const [shelters, setShelters] = useState(require('./geotest.json'))
  const mapContainer = useRef(null)

  // Map initialization
  useEffect(() => {
    mapboxgl.accessToken = API_KEY

    const initializeMap = ({ setMap, mapContainer }) => {
      // Create map with custom styling, centered on Metropolitan Ministries.
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/aksnell/ckd27ujkt1un91iqouslqh4sk',
        center: [-82.460258, 27.963515],
        zoom: 18,
        bearing: -20.0,
        pitch: 52.5,
      })

      // Find user location
      map.addControl(
        new mapboxgl.GeolocateControl({
          PositionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        })
      )

      map.on('load', () => {
        // Add transformed shelter geojson data
        map.addSource('geojson-shelters', {
          type: 'geojson',
          data: shelters,
        })

        // Draw geojson data

        const filterGroup = document.getElementById('filter-group')

        const filters = [
          'men',
          'women',
          'family',
          'veterans',
          'handicap accessible',
          'youth',
        ]

        const services = [
          'emergency',
          'transitional'
        ]

        for (let service of services) {
            if (!map.getLayer(service)) {
              map.addLayer({
                id: service,
                type: 'symbol',
                source: 'geojson-shelters',
                layout: {
                  'icon-image': ['image', 'lodging-15'],
                  'text-field': ['get', 'title'],
                  'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                  'text-size': 10,
                  'text-offset': [0, 1.25],
                  'text-anchor': 'top',
                },
                filter: ['==', service, true],
              })

              const input = document.createElement('input')
              input.type = 'checkbox'
              input.id = service
              input.checked = true
              filterGroup.appendChild(input)

              const label = document.createElement('label')
              label.setAttribute('for', service)
              label.textContent = service
              filterGroup.appendChild(label)

              input.addEventListener('change', e => {
                map.setLayoutProperty(
                  service,
                  'visibility',
                  e.target.checked ? 'visible' : 'none'
                )
              })
            }
          }

        setMap(map)
        map.resize()
      })

      map.on('click', 'shelters', shelter => {
        const props = shelter.features[0].properties
        const coords = shelter.features[0].geometry.coordinates.slice()

        while (Math.abs(shelter.lngLat.lng - coords[0]) > 180) {
          coords[0] += shelter.lngLat.lng > coords[0] ? 360 : -360
        }

        new mapboxgl.Popup()
          .setLngLat(coords)
          .setHTML(
            `
            <article class="shelter-popup">
            <strong>${props.title.split('\n')[1]}</strong>
            <p>${props.description}</p>
            <strong>Populations</strong>
            <ul>
            ${props.populations
              .split(',')
              .map(pop => (pop !== '' ? '<li>' + pop + '</li>' : ''))
              .join('')}
            </ul>
            </article>
          `
          )
          .addTo(map)
      })

      map.on('mouseenter', 'shelters', () => {
        map.getCanvas().style.cursor = 'pointer'
      })

      map.on('mouseleave', 'shelters', () => {
        map.getCanvas().style.cursor = ''
      })
    }

    if (!map) initializeMap({ setMap, mapContainer })
  }, [map])

  return (
    <>
      <div ref={el => (mapContainer.current = el)} id="map" />
      <nav id="filter-group" className="filter-group"></nav>
    </>
  )
}
