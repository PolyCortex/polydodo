import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const D3Component = React.memo(({ callback, data }) => {
  const ref = useRef();
  useEffect(() => {
    callback(ref.current, data);
  });
  return <svg ref={ref} />;
});

D3Component.propTypes = {
  callback: PropTypes.func.isRequired,
  data: PropTypes.any.isRequired,
};

export default D3Component;
