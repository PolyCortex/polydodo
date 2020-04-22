import React from "react";
import PropTypes from "prop-types";

const Emoji = ({symbol, label}) => (
  <span
    role="img"
    aria-label={label}
    aria-hidden={label ? "false" : "true"}
  >
    {symbol}
  </span>
);

Emoji.propTypes = {
  symbol: PropTypes.string.isRequired,
  label: PropTypes.string,
};

Emoji.defaultProps = {
  label: "",
};

export default Emoji;