import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Row } from 'reactstrap';

const FloatingCard = ({ cardClassName, headerText, bodyText, button }) => (
  <Card className={`${cardClassName} p-5 h-100 shadow-lg border-0 h-100 card-lift--hover`}>
    <Row className="align-items-center h-100">
      <Col className="h-100 d-flex flex-column">
        {headerText !== null && <h3 className="text-white">{headerText}</h3>}
        <p className="lead text-white text-justify mt-3">{bodyText}</p>
        <Row className="justify-content-center mt-auto">{button}</Row>
      </Col>
    </Row>
  </Card>
);

FloatingCard.propTypes = {
  cardClassName: PropTypes.string,
  headerText: PropTypes.string,
  bodyText: PropTypes.any.isRequired,
  button: PropTypes.object,
};

export default FloatingCard;
