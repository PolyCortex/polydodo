import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Spinner, Row, Col } from "reactstrap";

const D3Component = React.memo(({ callback, data, useDiv = false }) => {
  if (data === null)
    return (
      <Row>
        <Col className="text-center">
          <Spinner style={{ width: "3rem", height: "3rem" }} />
        </Col>
      </Row>
    );
  const ref = useRef();
  useEffect(() => {
    callback(ref.current, data);
  });
  return useDiv ? <div ref={ref} /> : <svg ref={ref} />;
});

D3Component.propTypes = {
  callback: PropTypes.func.isRequired,
  data: PropTypes.any,
};

export default D3Component;
