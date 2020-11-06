import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Headroom from 'headroom.js';
import {
  Navbar as NavbarStrap,
  Container,
  NavbarBrand,
  NavItem,
  Nav,
  NavLink,
  UncontrolledTooltip,
  Row,
  Col,
  Button,
  Collapse,
} from 'reactstrap';

import Logo from 'assets/img/dodo.png';
import PaleBackgroundLogo from 'assets/img/dodo.png';
import text from './text.json';

const OutsideLink = ({ href, iconClass, linkName, tooltipText, tooltipID }) => {
  return (
    <NavItem>
      <NavLink className="nav-link-icon" href={href} id={tooltipID} target="_blank">
        <i className={`fa ${iconClass}`} />
        <span className="nav-link-inner--text d-lg-none ml-2">{linkName}</span>
      </NavLink>
      <UncontrolledTooltip delay={0} target={tooltipID}>
        {tooltipText}
      </UncontrolledTooltip>
    </NavItem>
  );
};

OutsideLink.propTypes = {
  href: PropTypes.string.isRequired,
  iconClass: PropTypes.string,
  linkName: PropTypes.string,
  tooltipText: PropTypes.string,
  tooltipID: PropTypes.string.isRequired,
};

OutsideLink.defaultProps = {
  iconClass: '',
  linkName: '',
  tooltipText: '',
};

const ResponsiveCollapse = ({ children, isCollapseOpen, setIsCollapseOpen }) => {
  const [collapseClass, setCollapseClass] = useState('');

  return (
    <React.Fragment>
      <button className="navbar-toggler" onClick={() => setIsCollapseOpen(!isCollapseOpen)}>
        <span className="navbar-toggler-icon" />
      </button>
      <Collapse
        navbar
        isOpen={isCollapseOpen}
        className={collapseClass}
        onExiting={() => {
          setCollapseClass('collapsing-out');
        }}
        onExited={() => {
          setCollapseClass('');
        }}
      >
        <div className="navbar-collapse-header">
          <Row>
            <Col className="collapse-brand" xs="6">
              <Link to="/">
                <img alt="Polydodo" src={PaleBackgroundLogo} />
              </Link>
            </Col>
            <Col className="collapse-close" xs="6">
              <Button color="link" className="navbar-toggler" onClick={() => setIsCollapseOpen(false)}>
                <span />
                <span />
              </Button>
            </Col>
          </Row>
        </div>
        {children}
      </Collapse>
    </React.Fragment>
  );
};

ResponsiveCollapse.propTypes = {
  children: PropTypes.array.isRequired,
};

const Navbar = () => {
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);
  const navbarstrapRef = useRef();
  useEffect(() => {
    const headroom = new Headroom(navbarstrapRef.current);
    headroom.init();
    return () => headroom.destroy();
  });

  return (
    <div ref={(ref) => (navbarstrapRef.current = ref)} className="navbar-main navbar-transparent navbar-light headroom">
      <NavbarStrap id="navbar-main" expand="lg">
        <Container>
          <NavbarBrand className="mr-lg-5" to="/" tag={Link}>
            <img alt="Polydodo" src={Logo} />
          </NavbarBrand>

          <ResponsiveCollapse isCollapseOpen={isCollapseOpen} setIsCollapseOpen={setIsCollapseOpen}>
            <Nav className="navbar-nav-hover align-items-lg-center" navbar>
              <NavItem onClick={() => setIsCollapseOpen(false)}>
                <NavLink to="/" tag={Link}>
                  {text['navbar_home']}
                </NavLink>
              </NavItem>
              <NavItem onClick={() => setIsCollapseOpen(false)}>
                <NavLink to="/record-my-sleep" tag={Link}>
                  {text['navbar_record']}
                </NavLink>
              </NavItem>
              <NavItem onClick={() => setIsCollapseOpen(false)}>
                <NavLink to="/analyze-my-sleep" tag={Link}>
                  {text['navbar_analyze']}
                </NavLink>
              </NavItem>
              <NavItem onClick={() => setIsCollapseOpen(false)}>
                <NavLink to="/performance" tag={Link}>
                  {text['navbar_performance']}
                </NavLink>
              </NavItem>
            </Nav>

            <Nav className="align-items-lg-center ml-lg-auto" navbar>
              <OutsideLink
                href="https://www.facebook.com/PolyCortex/"
                iconClass="fa-facebook-square"
                linkName="Facebook"
                tooltipText={text['navbar_facebook_tooltip']}
                tooltipID="tooltip333589074"
              />
              <OutsideLink
                href="https://www.instagram.com/polycortex/"
                iconClass="fa-instagram"
                linkName="Instagram"
                tooltipText={text['navbar_instagram_tooltip']}
                tooltipID="tooltip356693867"
              />
              <OutsideLink
                href="https://github.com/PolyCortex"
                iconClass="fa-github"
                linkName="Github"
                tooltipText={text['navbar_github_tooltip']}
                tooltipID="tooltip112445449"
              />
            </Nav>
          </ResponsiveCollapse>
        </Container>
      </NavbarStrap>
    </div>
  );
};

export default Navbar;
