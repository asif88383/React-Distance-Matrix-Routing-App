import {useEffect, useState, useRef} from 'react';
import './App.css';
import * as tt from '@tomtom-international/web-sdk-maps';
import * as ttapi from '@tomtom-international/web-sdk-services';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

const App = () => {
  const mapElement = useRef();
  const [map, setMap] = useState({});
  const [longitude, setLongitude] = useState(-0.112869);
  const [latitude, setLatitude] = useState(51.504);

  const convertToCoordinates = (lngLat) => {
    return{
      point:{
        latitude: lngLat.lat,
        longitude: lngLat.lng
      }
    }
  }

  const drawRoute = (geoJson, map) => {
    if(map.getLayer('route')){
      map.removeLayer('route')
      map.removeSource('route')
    }
    map.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: geoJson,
      },
      paint: {
        'line-color': 'purple',
        'line-width': 6,
        'line-dasharray': [1, 1]
      }
    })
  }

  const addDeliveryPoint = (lngLat, map) => {
    const element = document.createElement('div');
    element.className = 'marker-delivery';
    new tt.Marker({
      element: element,
    }).setLngLat(lngLat).addTo(map);
  }

  useEffect(() => {
    const origin = {
      lat: latitude,
      lng: longitude,
    };

    
    const destinations =[]

    let map = tt.map({
      key: process.env.REACT_APP_MAP_KEY,
      container:mapElement.current,
      stylesVisibility: {
        trafficIncidents: true,
        trafficFlow: true,
      },
      center: [longitude, latitude],
      zoom: 14,
  })
  setMap(map);

  const addMarker = () => {
    const popupOffset = {
      bottom: [0, -25],
    }
    
    const popup = new tt.Popup({offset: popupOffset}).setHTML('<p>Hey! This is you.</p>');
    const element = document.createElement('div');
    element.className = 'marker';

    const marker = new tt.Marker({
      element: element,
      draggable: true,
    })
    .setLngLat([longitude, latitude]).addTo(map);

    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      setLongitude(lngLat.lng);
      setLatitude(lngLat.lat);
    });

    marker.setPopup(popup).togglePopup();
  }

  addMarker();

  const sortDestinations = (locations) => {
    const pointsForDestinations = locations.map((destination) => {
      return convertToCoordinates(destination)
      });
      const callParemeters = {
        origins: [convertToCoordinates(origin)],
        destinations: pointsForDestinations,
        key: process.env.REACT_APP_MAP_KEY,
      }
    return new Promise((resolve, reject) => {
      ttapi.services
        .matrixRouting(callParemeters)
        .then((matrixAPIResults) => {
          const results = matrixAPIResults.matrix[0]
          const resultsArray = results.map((result, index) => {
            return {
              location: locations[index],
              divingtime: result.response.routeSummary.travelTimeInSeconds,
            }
          })
          resultsArray.sort((a,b) => {
            return a.divingtime - b.divingtime;
          })
          const sortedLocations = resultsArray.map((result) => {
            return result.location;
            })
          resolve(sortedLocations);
        })
    });
  }


  const recalculateRoutes = () => {
    sortDestinations(destinations).then((sorted) => {
      sorted.unshift(origin);

      ttapi.services
        .calculateRoute({
          key: process.env.REACT_APP_MAP_KEY,
          locations: sorted,
        })
        .then((routeData) => {
          const geoJson = routeData.toGeoJson()
          console.log('geoJson', geoJson);
          drawRoute(geoJson, map);
        })
      })
    }

  

  map.on('click', (e) => {
    destinations.push(e.lngLat);
    addDeliveryPoint(e.lngLat, map);
    recalculateRoutes();
  });

  return () => map.remove();
}, [longitude, latitude])

  return (
    <>
      {map && (
        <div className="app">
          <div ref={mapElement} className="map" />

          <div className="search-bar">
            <h1>Where to?</h1>
            <input
              type="text"
              placeholder="Enter longitude"
              className="longitude"
              onchange={(e) => {
                setLongitude(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Enter latitude"
              className="latitude"
              onchange={(e) => {
                setLatitude(e.target.value);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
