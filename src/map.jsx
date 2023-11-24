import React from "react";
import ReactDOM from "react-dom";

import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import "./map.css";
import data from "./data.json";
import Tooltip from "./Tooltip";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2lrc2h5YWVxdWl0eSIsImEiOiJjbG92Ym1nOXIwcmp4MmtsZWZuZ3M5eWIzIn0.uye_-ROZEG8B2VXGBYKl8A";

const start = {
  pitch: 0,
  bearing: 0,
  center: [-100.486052, 37.830348],
  zoom: 3,
};

const Map = () => {
  const mapContainerRef = React.useRef(null);
  const tooltipRef = React.useRef(new mapboxgl.Popup({ offset: 15 }));

  const [lng, setLng] = React.useState(0);
  const [lat, setLat] = React.useState(0);
  const [zoom, setZoom] = React.useState(4);

  const options = [
    {
      name: "Population",
      description: "Estimated total population",
      property: "density",
      stops: [
        [0, "#ffeda0"],
        [50, "#feb24c"],
        [100, "#fd8d3c"],
        [200, "#fc4e2a"],
        [500, "#e31a1c"],
        [1000, "#bd0026"],
        [10065, "#000000"],
      ],
    },
    {
      name: "GDP",
      description: "Estimate total GDP in millions of dollars",
      property: "gdp_md_est",
      stops: [
        [0, "#f8d5cc"],
        [1000, "#f4bfb6"],
        [5000, "#f1a8a5"],
        [10000, "#ee8f9a"],
        [50000, "#ec739b"],
        [100000, "#dd5ca8"],
        [250000, "#c44cc0"],
        [5000000, "#9f43d7"],
        [10000000, "#6e40e6"],
      ],
    },
  ];

  const [active, setActive] = React.useState(options[0]);

  React.useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      // style: "mapbox://styles/examples/cjgioozof002u2sr5k7t14dim", // map style URL from Mapbox Studio
      // style: "mapbox://styles/sikshyaequity/clowekw2300w601pm21tth4u7",
      style: "mapbox://styles/mapbox/streets-v11",
      ...start,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      map.addSource("states", {
        type: "geojson",
        data,
      });

      map.addLayer({
        id: "state-fills",
        type: "fill",
        source: "states",
      });

      map.setPaintProperty("state-fills", "fill-color", {
        property: active.property,
        stops: active.stops,
      });

      map.addLayer({
        id: "state-borders",
        type: "line",
        source: "states",
        layout: {},
        paint: {
          "line-color": "#627BC1",
          "line-width": 2,
        },
      });

      map.addLayer({
        id: "state-fills-hover",
        type: "fill",
        source: "states",
        layout: {},
        paint: {
          "fill-color": "#000000",
          "fill-opacity": 0.3,
        },
        filter: ["==", "name", ""],
      });

      // make a pointer cursor
      //   map.getCanvas().style.cursor = "default";
      // set map bounds to the continental US
      map.fitBounds([
        [-133.2421875, 16.972741],
        [-47.63671875, 52.696361],
      ]);
    });

    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    // change cursor to pointer when user hovers over a clickable feature
    map.on("mouseenter", (e) => {
      if (e.features.length) {
        map.getCanvas().style.cursor = "pointer";
      }
    });

    // reset cursor to default when user is no longer hovering over a clickable feature
    map.on("mouseleave", () => {
      map.getCanvas().style.cursor = "";
    });

    // add tooltip when users mouse move over a point
    map.on("mousemove", (e) => {
      const features = map.queryRenderedFeatures(e.point);
      if (features.length) {
        const feature = features[0];

        // Create tooltip node
        const tooltipNode = document.createElement("div");
        ReactDOM.render(<Tooltip feature={feature} />, tooltipNode);

        // Set tooltip on map
        tooltipRef.current
          .setLngLat(e.lngLat)
          .setDOMContent(tooltipNode)
          .addTo(map);
      }
    });

    map.on("click", (e) => {
      console.log(e);
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["state-fills"],
      });
      if (!features.length) return;
      const { properties } = features[0];
      const { name, density } = properties;
      alert(`(${name}) ${density}`);
    });

    return () => map.remove();
  }, []);

  return (
    <div>
      <div className="sidebarStyle">
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
};

export default Map;
