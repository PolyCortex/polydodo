import React from 'react';
import { Row, Col } from 'reactstrap';

const AlternatingTextImage = ({ elements }) =>
  elements.map(({ title, text, image }, i) => {
    const textElement = (
      <>
        <h4 className="display-4">{title}</h4>
        <p className="lead">{text}</p>
      </>
    );

    const imageElement = <img src={`${process.env.PUBLIC_URL}/${image}`} alt={title} />;

    return i % 2 === 0 ? (
      <Row key={i}>
        <Col xs="8">{textElement}</Col>
        <Col xs="4">{imageElement}</Col>
      </Row>
    ) : (
      <Row key={i}>
        <Col xs="4">{imageElement}</Col>
        <Col xs="8">{textElement}</Col>
      </Row>
    );
  });
export default AlternatingTextImage;
