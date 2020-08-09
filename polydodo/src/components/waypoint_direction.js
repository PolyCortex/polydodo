import React from "react";
import { Waypoint } from "react-waypoint";

const WaypointDirection = ({ onUp, onDown }) => (
  <Waypoint
    onEnter={({ previousPosition }) =>
      previousPosition === Waypoint.below ? onDown() : onUp()
    }
  />
);

export default WaypointDirection;
