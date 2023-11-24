import React from "react";

const Tooltip = ({ feature }) => {
  const { id } = feature.properties;

  return (
    <div id={`tooltip-${id}`}>
      <strong>name:</strong> {feature.properties["name"]}
      <br />
      <strong>density:</strong> {feature.properties.density}
    </div>
  );
};

export default Tooltip;
