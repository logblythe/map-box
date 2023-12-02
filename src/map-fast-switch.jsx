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

const zoomThreshold = 4;

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2lrc2h5YWVxdWl0eSIsImEiOiJjbG92Ym1nOXIwcmp4MmtsZWZuZ3M5eWIzIn0.uye_-ROZEG8B2VXGBYKl8A";

const MapFastSwitch = () => {
  const mapRef = React.useRef();

  const mapContainerRef = React.useRef(null);

  const [lng, setLng] = React.useState(0);
  const [lat, setLat] = React.useState(0);
  const [zoom, setZoom] = React.useState(3);

  const handleMapMove = () => {
    setLng(mapRef.current.getCenter().lng.toFixed(4));
    setLat(mapRef.current.getCenter().lat.toFixed(4));
    setZoom(mapRef.current.getZoom().toFixed(2));
  };

  React.useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      ...start,
    });

    mapRef.current.on("load", () => {
      mapRef.current.addSource("population", {
        type: "vector",
        url: "mapbox://mapbox.660ui7x6",
      });

      mapRef.current.addLayer(
        {
          id: "state-population",
          source: "population",
          "source-layer": "state_county_population_2014_cen",
          maxzoom: zoomThreshold,
          type: "fill",
          // only include features for which the "isState"
          // property is "true"
          filter: ["==", "isState", true],
          paint: {
            "fill-color": [
              "interpolate",
              ["linear"],
              ["get", "population"],
              0,
              "#F2F12D",
              500000,
              "#EED322",
              750000,
              "#E6B71E",
              1000000,
              "#DA9C20",
              2500000,
              "#CA8323",
              5000000,
              "#B86B25",
              7500000,
              "#A25626",
              10000000,
              "#8B4225",
              25000000,
              "#723122",
            ],
            "fill-opacity": 0.75,
          },
        },
        "road-label-simple" // Add layer below labels
      );

      mapRef.current.addLayer(
        {
          id: "county-population",
          source: "population",
          "source-layer": "state_county_population_2014_cen",
          minzoom: zoomThreshold,
          type: "fill",
          // only include features for which the "isCounty"
          // property is "true"
          filter: ["==", "isCounty", true],
          paint: {
            "fill-color": [
              "interpolate",
              ["linear"],
              ["get", "population"],
              0,
              "#F2F12D",
              100,
              "#EED322",
              1000,
              "#E6B71E",
              5000,
              "#DA9C20",
              10000,
              "#CA8323",
              50000,
              "#B86B25",
              100000,
              "#A25626",
              500000,
              "#8B4225",
              1000000,
              "#723122",
            ],
            "fill-opacity": 0.75,
          },
        },
        "road-label-simple" // Add layer below labels
      );
    });

    mapRef.current.on("move", handleMapMove);
  }, []);

  return (
    <div>
      <div className="sidebarStyle">
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
      <div className="map-info-fast-switch">
        The level of data changes when zoom level reaches the zoomThreshold of 4
        in the map below:
      </div>
      <div ref={mapContainerRef} className="map-container-fast-switch" />
    </div>
  );
};

export default MapFastSwitch;
