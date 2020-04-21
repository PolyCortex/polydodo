import React from "react";
import Headroom from "headroom.js";
import { Link } from "react-router-dom";

import Logo from "assets/img/logo.png";
import {
  Navbar as NavbarStrap,
  Container,
  NavbarBrand,
  NavItem,
  Nav,
  NavLink,
  UncontrolledTooltip,
} from "reactstrap";

class Navbar extends React.Component {
  componentDidMount() {
    const headroom = new Headroom(document.getElementById("navbar-main"));
    headroom.init();
  }

  render() {
    return (
      <NavbarStrap
        className="navbar-main navbar-transparent navbar-light headroom"
        expand="lg"
        id="navbar-main"
      >
        <Container>
          <NavbarBrand className="mr-lg-5" to="/">
            <img
              alt="..."
              src={Logo}
            />
          </NavbarBrand>

          <Nav className="navbar-nav-hover align-items-lg-center" navbar>
            <NavItem>
              <NavLink to="/" tag={Link}>
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/record-my-sleep" tag={Link}>
                Record my sleep
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/analyze-my-sleep" tag={Link}>
                Analyze my sleep
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/performance" tag={Link}>
                Performance
              </NavLink>
            </NavItem>
          </Nav>

          <Nav className="align-items-lg-center ml-lg-auto" navbar>
            <NavItem>
              <NavLink
                className="nav-link-icon"
                href="https://www.facebook.com/PolyCortex/"
                id="tooltip333589074"
                target="_blank"
              >
                <i className="fa fa-facebook-square" />
                <span className="nav-link-inner--text d-lg-none ml-2"> Facebook </span>
              </NavLink>
              <UncontrolledTooltip delay={0} target="tooltip333589074">
                Learn more about us on our Facebook page
              </UncontrolledTooltip>
            </NavItem>
            <NavItem>
              <NavLink
                className="nav-link-icon"
                href="https://www.instagram.com/polycortex/"
                id="tooltip356693867"
                target="_blank"
              >
                <i className="fa fa-instagram" />
                <span className="nav-link-inner--text d-lg-none ml-2">
                  Instagram
              </span>
              </NavLink>
              <UncontrolledTooltip delay={0} target="tooltip356693867">
                Follow us on Instagram
            </UncontrolledTooltip>
            </NavItem>

            <NavItem>
              <NavLink
                className="nav-link-icon"
                href="https://github.com/PolyCortex"
                id="tooltip112445449"
                target="_blank"
              >
                <i className="fa fa-github" />
                <span className="nav-link-inner--text d-lg-none ml-2">Github</span>
              </NavLink>
              <UncontrolledTooltip delay={0} target="tooltip112445449">
                For more informations about this project, check our github!
              </UncontrolledTooltip>
            </NavItem>
          </Nav>
        </Container>
      </NavbarStrap>
    );
  }
}

export default Navbar;