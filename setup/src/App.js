import {useEffect, useState, useRef} from 'react';
import './App.css';
import * as tt from '@tomtom-international/web-sdk-maps';

const App = () => {
  const mapElement = useRef();
  const [map, setMap] = useState({});
  const [marker, setMarker] = useState({});
  const [longitude, setLongitude] = useState(-0.112869);
  const [latitude, setLatitude] = useState(51.504);

  useEffect(() => {
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
    const element = document.createElement('div');
    element.className = 'marker';

    const marker = new tt.Marker({
      element: element,
      draggable: true,
    })
  }
  return () => map.remove();
}, [longitude, latitude])

  return (
    <div className='app'>
      <div ref={mapElement} className="map" />

      <div className="search-bar">
        <h1>Where to?</h1>
        <input
          type="text"
          placeholder="Enter longitude"
          className='longitude'
          onchange={(e) => {setLongitude(e.target.value)}}
        />
        <input
          type="text"
          placeholder="Enter latitude"
          className='latitude'
          onchange={(e) => {setLatitude(e.target.value)}}
        />
      </div>
    </div>
  );
}

export default App;
