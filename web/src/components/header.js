import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Col, Container } from 'reactstrap';
import HeaderSeparator from './header_separator';

const Header = ({ sizeClass, shapeQty, title, subtitle, description }) => {
  return (
    <section className={`section section-lg section-shaped ${sizeClass}`}>
      <div className="shape shape-style-1 shape-dark ">
        {_.times(shapeQty, (i) => (
          <span key={i} />
        ))}
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
      <HeaderSeparator />
    </section>
  );
};

Header.propTypes = {
  sizeClass: PropTypes.string,
  shapeQty: PropTypes.number,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
};

Header.defaultProps = {
  sizeClass: 'pb-150',
  shapeQty: 5,
  title: '',
  subtitle: '',
  description: '',
};

export default Header;
