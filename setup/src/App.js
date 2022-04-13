import {useEffect} from 'react';
import './App.css';

const App = () => {

  useEffect(() => {
    let map = new tt.map({
      key: process.env.REACT_APP_MAP_KEY,
      container:"mapElement",
  })

}, [])

  return (
    <div className="App">
      
    </div>
  );
}

export default App;
