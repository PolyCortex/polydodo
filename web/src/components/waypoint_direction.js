import React from 'react';
import PropTypes from 'prop-types';
import { Waypoint } from 'react-waypoint';

const WaypointDirection = ({ onUp = () => {}, onDown = () => {} }) => (
  <Waypoint
    onEnter={({ previousPosition }) => (previousPosition === Waypoint.below ? onDown() : onUp())}
    bottomOffset="99%"
    fireOnRapidScroll
  />
);

WaypointDirection.propTypes = {
  onUp: PropTypes.func.isRequired,
  onDown: PropTypes.func.isRequired,
};

export default WaypointDirection;
