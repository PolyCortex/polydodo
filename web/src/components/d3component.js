import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Spinner, Row, Col } from 'reactstrap';

const D3Component = React.memo(({ callback, data, useDiv = false }) => {
  const ref = useRef();
  useEffect(() => {
    data && callback(ref.current, data);
  });

  return data === null ? (
    <Row>
      <Col className="text-center">
        <Spinner style={{ width: '3rem', height: '3rem' }} />
      </Col>
    </Row>
  ) : useDiv ? (
    <div ref={ref} />
  ) : (
    <svg ref={ref} />
  );
});

D3Component.propTypes = {
  callback: PropTypes.func.isRequired,
  data: PropTypes.any,
  // Using a div node instead of a svg node allows usage of child components of other types:
  // i.g., for performance issues, we used both canvas & svg child elements in a visualisation.
  useDiv: PropTypes.bool,
};

export default D3Component;
