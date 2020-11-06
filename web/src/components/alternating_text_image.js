import React from 'react';
import { Row, Col } from 'reactstrap';

const AlternatingTextImage = ({ elements }) =>
  elements.map(({ title, text, image }, i) => {
    const textElement = (
      <>
        <h4>{title}</h4>
        <p>{text}</p>
      </>
    );

    const imageElement = <img src={`${process.env.PUBLIC_URL}/${image}`} alt={title} />;

    return i % 2 === 0 ? (
        <Row>
          <Col lg="8">{textElement}</Col>
          <Col lg="4">{imageElement}</Col>
        </Row>
    ) : (
        <Row>
          <Col lg="4">{imageElement}</Col>
          <Col lg="8">{textElement}</Col>
        </Row>
    );
  });
export default AlternatingTextImage;
