import "./App.css";
import MapAlbers from "./map-albers";
import MapAlternate from "./map-alternate";
import MapFastSwitch from "./map-fast-switch";
import MapFit from "./map-fit";
import MapOutdoor from "./map-outdoor";

function App() {
  return (
    <div>
      <MapAlternate />
      <MapFastSwitch />
      <MapOutdoor />
      <MapAlbers />
    </div>
  );
}

export default App;
