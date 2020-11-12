import React from 'react';
import { Row, Col } from 'reactstrap';
import { useMediaQuery } from 'react-responsive';

import './style.css';

const AlternatingTextImage = ({ elements }) => {
  const isTabletOrMobile = useMediaQuery({
    query: '(max-width: 1140px)',
  });

  return elements.map(({ title, text, image }, i) => {
    const titleElement = <h4 className="display-4">{title}</h4>;
    const imageElement = image && (
      <img className="alternating_text_image__img" src={`${process.env.PUBLIC_URL}/${image}`} alt={title} />
    );
    const textElement = <p className="lead">{text}</p>;

    if (isTabletOrMobile || !image) {
      return (
        <div className="pt-lg-5" key={i}>
          <Col>
            <div>{titleElement}</div>
            <Row>{imageElement}</Row>
            <div className="mb-5">{textElement}</div>
          </Col>
        </div>
      );
    }

    return (
      <div className="pt-lg-5" key={i}>
        {i % 2 === 0 ? (
          <Row>
            <Col lg="9">
              {titleElement}
              {textElement}
            </Col>
            <Col lg="3">
              <span className="alternating_text_image__right_img_container">{imageElement}</span>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col lg="3">
              <span className="alternating_text_image__left_img_container">{imageElement}</span>
            </Col>
            <Col lg="9">
              {titleElement}
              {textElement}
            </Col>
          </Row>
        )}
      </div>
    );
  });
};

export default AlternatingTextImage;
