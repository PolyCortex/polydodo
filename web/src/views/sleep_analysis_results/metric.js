import React from 'react';
import PropTypes from 'prop-types';

const Metric = ({ isTime, isDuration, children }) => {
  const getTimeString = (numberSecondsUTC) => new Date(numberSecondsUTC * 1000).toLocaleTimeString();
  const getDurationString = (numberSeconds) => {
    const nbHours = Math.floor(numberSeconds / 3600);
    const nbMinutes = Math.floor((numberSeconds % 3600) / 60);

    return nbHours > 0 ? `${nbHours} hours and ${nbMinutes} minutes` : `${nbMinutes} minutes`;
  };

  let content = children;

  if (isTime) {
    content = content !== null ? getTimeString(children) : 'never';
  } else if (isDuration) {
    content = content !== null ? getDurationString(children) : '0 minutes';
  }

  return (
    <span className="text-primary">
      <strong>{content}</strong>
    </span>
  );
};

Metric.propTypes = {
  isTime: PropTypes.bool,
  isDuration: PropTypes.bool,
};

Metric.defaultProps = {
  isTime: false,
  isDuration: false,
};

export default Metric;
