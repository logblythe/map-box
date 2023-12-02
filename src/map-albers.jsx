import React from "react";
import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import "./map.css";

const start = {
  pitch: 0,
  bearing: 0,
  center: [0, 0],
  minZoom: 2,
  zoom: 3.5,
};

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2lrc2h5YWVxdWl0eSIsImEiOiJjbG92Ym1nOXIwcmp4MmtsZWZuZ3M5eWIzIn0.uye_-ROZEG8B2VXGBYKl8A";

const MapAlbers = () => {
  const mapRef = React.useRef();

  const mapContainerRef = React.useRef(null);

  React.useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      // style: "mapbox://styles/mapbox/outdoors-v12",
      // style: "mapbox://styles/sikshyaequity/clpjxz56e00rn01r57ah6eqi4",
      // style: "mapbox://styles/sikshyaequity/clpmohsfa00yp01r5a7rg5r4e",
      style: "mapbox://styles/sikshyaequity/clpmhykqr00uz01qthvp3c3xq",

      ...start,
    });
  }, []);

  return (
    <div>
      <div ref={mapContainerRef} className="map-container-albers" />
      <div className="map-info-albers">Albers Projection</div>
    </div>
  );
};

export default MapAlbers;
