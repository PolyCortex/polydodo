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

D3Component.propTypes = {
  callback: PropTypes.func.isRequired,
  isInitialized: PropTypes.bool,
  setIsInitialized: PropTypes.func,
  data: PropTypes.any,
  useDiv: PropTypes.bool,
};

export default D3ComponentScrollyTelling;
