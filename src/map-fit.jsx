import React from "react";
import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import "./map.css";
import counties10mRaw from "./counties-10m.json";
import states10mRaw from "./states-10m.json";
import * as topojson from "topojson-client";
import { stateWithColor, countyWithColor } from "./equityIndexMapDisplaySet";
import Tooltip from "./Tooltip";
import ReactDOM from "react-dom/client";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2lrc2h5YWVxdWl0eSIsImEiOiJjbG92Ym1nOXIwcmp4MmtsZWZuZ3M5eWIzIn0.uye_-ROZEG8B2VXGBYKl8A";

const counties10m = counties10mRaw;
const states10m = states10mRaw;

const start = {
  pitch: 0,
  bearing: 0,
  center: [0, 0],
  minZoom: 2,
  zoom: 3,
};

const zoomThreshold = 4;

const getColorByStateId = (stateId) => {
  return (
    stateWithColor.find((state) => state.stateId === stateId)?.eqColorHex ??
    "#000000"
  );
};

const getColorByCountyId = (countyId) => {
  return (
    countyWithColor.find((county) => county.countyId === countyId)
      ?.eqColorHex ?? "#000000"
  );
};

const countyFeatures = topojson.feature(
  counties10m,
  counties10m.objects.counties
);

const stateFeatures = topojson.feature(states10m, states10m.objects.states);

console.log({ stateFeatures, countyFeatures });

const MapFit = () => {
  const mapRef = React.useRef();
  const tooltipRef = React.useRef(new mapboxgl.Popup({ offset: 15 }));

  const mapContainerRef = React.useRef(null);
  const [lng, setLng] = React.useState(0);
  const [lat, setLat] = React.useState(0);
  const [zoom, setZoom] = React.useState(3);
  const [selectedStateId, setSelectedStateId] = React.useState(null);

  const handleMouseClick = (e) => {
    console.log(e);
    const features = mapRef.current.queryRenderedFeatures(e.point, {
      source: ["states"],
    });
    console.log(features);
    if (!features.length) return;
    const { properties, id } = features[0];
    const { name } = properties;
    setSelectedStateId(id);
    // alert(`(${id})-${name}`);
  };

  const handleMapMove = () => {
    setLng(mapRef.current.getCenter().lng.toFixed(4));
    setLat(mapRef.current.getCenter().lat.toFixed(4));
    setZoom(mapRef.current.getZoom().toFixed(2));
  };

  const handleMouseMove = (e) => {
    const features = mapRef.current.queryRenderedFeatures(e.point);
    if (features.length) {
      const feature = features[0];

      // Create tooltip node
      const tooltipNode = document.createElement("div");
      ReactDOM.createRoot(tooltipNode).render(<Tooltip feature={feature} />);

      // Set tooltip on map
      tooltipRef.current
        .setLngLat(e.lngLat)
        .setDOMContent(tooltipNode)
        .addTo(mapRef.current);
    }
  };

  const getData = React.useCallback(() => {
    if (selectedStateId) {
      const counties = {
        ...countyFeatures,
        features: countyFeatures.features.filter((f) =>
          String(f.id || "").startsWith(selectedStateId)
        ),
      };
      counties.features.forEach((feature) => {
        feature.properties.fillColor = getColorByCountyId(feature.id);
        feature.properties.isCounty = true;
      });
      return counties;
    }
    // if (zoom > 4) {
    //   countyFeatures.features.forEach((feature) => {
    //     feature.properties.fillColor = getColorByCountyId(feature.id);
    //     feature.properties.isCounty = true;
    //   });
    //   return countyFeatures;
    // }
    stateFeatures.features.forEach((feature) => {
      feature.properties.fillColor = getColorByStateId(feature.id);
      feature.properties.isState = true;
    });
    return stateFeatures;
  }, [selectedStateId]);

  // const getData = () => {

  //   if (zoom > 4) {
  //   } else {
  //     stateFeatures.features.forEach((feature) => {
  //       feature.properties.fillColor = getColorByStateId(feature.id);
  //       feature.properties.isState = true;
  //     });
  //     return stateFeatures;
  //   }
  // };

  React.useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      // style: "mapbox://styles/mapbox/streets-v11",
      // style: "mapbox://styles/mapbox/light-v10", // Use a simplified map style
      // style: "mapbox://styles/sikshyaequity/clp5r1olc01o901o4ehil9qon",
      style: "mapbox://styles/sikshyaequity/clpmhykqr00uz01qthvp3c3xq",
      ...start,
      zoom,
    });

    // let hoveredPolygonId = null;

    mapRef.current.on("load", () => {});

    // change cursor to pointer when user hovers over a clickable feature
    mapRef.current.on("mouseenter", (e) => {
      if (e.features.length) {
        mapRef.current.getCanvas().style.cursor = "pointer";
      }
    });

    // reset cursor to default when user is no longer hovering over a clickable feature
    mapRef.current.on("mouseleave", () => {
      mapRef.current.getCanvas().style.cursor = "";
    });

    mapRef.current.on("move", handleMapMove);

    mapRef.current.on("mousemove", handleMouseMove);

    // Listen for the mousemove event on the state-fills layer
    mapRef.current.on("mousemove", "state-fills", function (e) {
      // Change the cursor style to pointer
      mapRef.current.getCanvas().style.cursor = "pointer";

      // Get the state name from the features under the mouse pointer
      var stateName = e.features[0].properties.name;

      mapRef.current.setPaintProperty("state-fills", "fill-color", [
        "match",
        ["get", "name"],
        stateName,
        "#FF0000",
        ["get", "fillColor"],
      ]);
    });

    // Reset the fill color on mouseout
    mapRef.current.on("mouseout", "state-fills", function () {
      // Change the cursor style back to default
      mapRef.current.getCanvas().style.cursor = "";

      // Reset the fill color
      mapRef.current.setPaintProperty("state-fills", "fill-color", [
        "get",
        "fillColor",
      ]);
    });

    mapRef.current.on("click", (e) => handleMouseClick(e));

    return () => mapRef.current.remove();
  }, [selectedStateId]);

  return (
    <div>
      <div ref={mapContainerRef} className="map-fit-container" />
    </div>
  );
};

export default MapFit;
