import React from 'react';
import PropTypes from 'prop-types';
import D3Component from './d3component';

const D3ComponentScrollyTelling = ({
  callback,
  data,
  isInitialized,
  setIsInitialized,
  useDiv = false,
}) => {
  const createCallback = (svg, data) => {
    if (!isInitialized) {
      setIsInitialized(true);
      callback(svg, data);
    }
  };

  return <D3Component callback={createCallback} data={data} useDiv={useDiv} />;
};

D3ComponentScrollyTelling.propTypes = {
  callback: PropTypes.func.isRequired,
  isInitialized: PropTypes.bool,
  setIsInitialized: PropTypes.func,
  data: PropTypes.any,
  // Using a div node instead of a svg node allows usage of child components of other types:
  // i.g., for performance issues, we used both canvas & svg child elements in a visualisation.
  useDiv: PropTypes.bool,
};

export default D3ComponentScrollyTelling;
