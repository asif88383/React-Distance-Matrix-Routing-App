import {useEffect, useState, useRef} from 'react';
import './App.css';
import * as tt from '@tomtom-international/web-sdk-maps';

const App = () => {
  const [map, setMap] = useState({});
  const mapElement = useRef();
  const [marker, setMarker] = useState({});
  const [longitude, setLongitude] = useState(-0.112869);
  const [latitude, setLatitude] = useState(51.504);

  useEffect(() => {
    let map = tt.map({
      key: process.env.REACT_APP_MAP_KEY,
      container:mapElement.current,
      center: [longitude, latitude],
      zoom: 13,
  })
  setMap(map);
}, [])

  return (
    <div className="App">
      <div ref={mapElement} className="map" ></div>
    </div>
  );
}

export default App;
