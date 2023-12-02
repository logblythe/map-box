import React from "react";
import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import "./map.css";

const start = {
  pitch: 0,
  bearing: 0,
  center: [-100.486052, 37.830348],
  minZoom: 2,
  zoom: 3,
};

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2lrc2h5YWVxdWl0eSIsImEiOiJjbG92Ym1nOXIwcmp4MmtsZWZuZ3M5eWIzIn0.uye_-ROZEG8B2VXGBYKl8A";

const MapOutdoor = () => {
  const mapRef = React.useRef();

  const mapContainerRef = React.useRef(null);

  React.useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      ...start,
    });
  }, []);

  return (
    <div>
      <div className="map-info-outdoor">
        Default outdoor map provided by mapbox
      </div>
      <div ref={mapContainerRef} className="map-container-outdoor" />
    </div>
  );
};

export default MapOutdoor;
