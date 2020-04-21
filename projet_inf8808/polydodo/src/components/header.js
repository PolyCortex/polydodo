import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import { Col, Container } from "reactstrap";

const Header = ({ sizeClass, title, subtitle, description }) => {
  return (
    <section className={`section section-lg section-shaped ${sizeClass}`}>
      <div className="shape shape-style-1 shape-dark">
        {_.times(7, (i) => <span key={i} />)}
      </div>
      <Container>
        <div className="col px-0">
          <Col lg="6">
            <h1 className="display-3 text-white">
              {title}
              <span>{subtitle}</span>
            </h1>
            <p className="lead text-white">{description}</p>
          </Col>
        </div>
      </Container>

      <div className="separator separator-bottom separator-skew">
        <svg preserveAspectRatio="none" viewBox="0 0 2560 100" x="0" y="0" >
          <polygon className="fill-white" points="2560 0 2560 110 0 100" />
        </svg>
      </div>
    </section>
  );
}

Header.propTypes = {
  sizeClass: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
};

Header.defaultProps = {
  sizeClass: "pb-150",
  title: "",
  subtitle: "",
  description: "",
};

export default Header;