import React from 'react';
import PropTypes from 'prop-types';
import { Button, NavItem, NavLink, Nav, Container, Row, Col, UncontrolledTooltip } from 'reactstrap';

import Partners from './partners';
import text from './text.json';

const PlatformButton = ({ href, color, iconClass, tooltipText, tooltipID }) => {
  return (
    <>
      <Button className="btn-icon-only rounded-circle ml-1" color={color} href={href} id={tooltipID} target="_blank">
        <span className="btn-inner--icon">
          <i className={`fab ${iconClass}`} />
        </span>
      </Button>
      <UncontrolledTooltip delay={0} target={tooltipID}>
        {tooltipText}
      </UncontrolledTooltip>
    </>
  );
};

PlatformButton.propTypes = {
  href: PropTypes.string.isRequired,
  color: PropTypes.string,
  iconClass: PropTypes.string,
  tooltipText: PropTypes.string,
  tooltipID: PropTypes.string.isRequired,
};

PlatformButton.defaultProps = {
  color: 'secondary',
  iconClass: '',
  tooltipText: '',
};

const Copyright = () => {
  return (
    <div className="copyright">
      © {new Date().getFullYear()}{' '}
      <a href="http://polycortex.polymtl.ca/" target="_blank" rel="noopener noreferrer">
        {text['footer_copyright_polycortex']}
      </a>
    </div>
  );
};

const Navfooter = () => {
  return (
    <Nav className=" nav-footer justify-content-end">
      <NavItem>
        <NavLink href="http://polycortex.polymtl.ca/" target="_blank">
          {text['footer_about-us']}
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="https://github.com/PolyCortex" target="_blank">
          {text['footer_license']}
        </NavLink>
      </NavItem>
    </Nav>
  );
};

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <Partners />
        <Container>
          <hr />
          <h3 className="text-primary font-weight-light mb-2">{text['support_title']}</h3>
          <Row className="row-grid align-items-center mb-5">
            <Col className="mt-sm" lg="8">
              <h4 className=" mb-3 font-weight-light">{text['support_platforms']}</h4>
              <PlatformButton
                href="https://www.facebook.com/polycortex"
                color="facebook"
                iconClass="fa-facebook"
                tooltipText={text['support_facebook_tooltip']}
                tooltipID="tooltip_facebook"
              />
              <PlatformButton
                href="https://www.instagram.com/polycortex/"
                color="instagram"
                iconClass="fa-instagram"
                tooltipText={text['support_instagram_tooltip']}
                tooltipID="tooltip_instagram"
              />
              <PlatformButton
                href="https://github.com/PolyCortex"
                color="github"
                iconClass="fa-github"
                tooltipText={text['support_github_tooltip']}
                tooltipID="tooltip_github"
              />
            </Col>

            <Col className="text-lg-right" lg="4">
              <h4 className="mb-3 font-weight-light">{text['support_donate_text']}</h4>
              <Button
                className="btn-icon"
                color="success"
                href="https://soutien.polymtl.ca/vie-etudiante"
                target="_blank"
              >
                <span className="btn-inner--icon">
                  <i className="fas fa-hand-holding-usd fa-lg" />
                </span>

                <span className="btn-inner--text">{text['support_donate_button']}</span>
              </Button>
            </Col>
          </Row>
          <hr />
          <Row className=" align-items-center justify-content-md-between">
            <Col md="6">
              <Copyright />
            </Col>
            <Col md="6">
              <Navfooter />
            </Col>
          </Row>
        </Container>
      </footer>
    );
  }
}

export default Footer;
