import React from 'react';
import PropTypes from 'prop-types';

const Emoji = ({ symbol, label, className }) => (
  <span className={className} role="img" aria-label={label} aria-hidden={label ? 'false' : 'true'}>
    {symbol}
  </span>
);

Emoji.propTypes = {
  symbol: PropTypes.string.isRequired,
  className: PropTypes.string,
  label: PropTypes.string,
};

Emoji.defaultProps = {
  className: '',
  label: '',
};

export default Emoji;
