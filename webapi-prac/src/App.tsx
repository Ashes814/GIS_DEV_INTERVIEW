import MapContainer from "./openLayers/MapContainer";
import ThreeDemo from "./threejspra/ThreeDemo";
import "./App.css";

function App() {
  return (
    <>
      {/* <div className="ol-container">
        <h1>OpenLayers</h1>
        <MapContainer />
      </div> */}
      <div className="three-demo">
        <h1>ThreeJS Demo</h1>
        <ThreeDemo />
      </div>
    </>
  );
}

export default App;
