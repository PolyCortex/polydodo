import React from 'react';
import { Row, Col } from 'reactstrap';

import './style.css';

const AlternatingTextImage = ({ elements }) =>
  elements.map(({ title, text, image }, i) => {
    const textElement = (
      <>
        <h4 className="display-4">{title}</h4>
        <p className="lead">{text}</p>
      </>
    );

    const imageElement = (
      <img className="alternating_text_image__img" src={`${process.env.PUBLIC_URL}/${image}`} alt={title} />
    );

    return (
      <div className="pt-lg-5" key={i}>
        {i % 2 === 0 ? (
          <Row>
            <Col md="8">{textElement}</Col>
            <Col md="4">
              <span className="alternating_text_image__img_right">{imageElement}</span>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col md="4">
              <span className="alternating_text_image__img_left">{imageElement}</span>
            </Col>
            <Col md="8">{textElement}</Col>
          </Row>
        )}
      </div>
    );
  });
export default AlternatingTextImage;
