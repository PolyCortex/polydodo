import React from "react";
import Headroom from "headroom.js";
import { Link } from "react-router-dom";
import {
  Navbar as NavbarStrap,
  Container,
  NavbarBrand,
  NavItem,
  Nav,
  NavLink,
  UncontrolledTooltip,
} from "reactstrap";

import Logo from "assets/img/logo.png";
import text from "./text.json";

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.navbarstrapRef = React.createRef();
  }

  componentDidMount() {
    const headroom = new Headroom(this.navbarstrapRef);
    headroom.init();
  }

  render() {

    return (
      <div
        ref={ref => this.navbarstrapRef = ref}
        className="navbar-main navbar-transparent navbar-light headroom"
      >
        <NavbarStrap
          id="navbar-main"
          expand="lg"
        >
          <Container>
            <NavbarBrand className="mr-lg-5" to="/">
              <img alt="..." src={Logo} />
            </NavbarBrand>

            <Nav className="navbar-nav-hover align-items-lg-center" navbar>
              <NavItem>
                <NavLink to="/" tag={Link}> {text["navbar_home"]} </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/record-my-sleep" tag={Link}> {text["navbar_record"]} </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/analyze-my-sleep" tag={Link}> {text["navbar_analyze"]} </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/performance" tag={Link}> {text["navbar_performance"]} </NavLink>
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
                  {text["navbar_facebook_tooltip"]}
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
                  {text["navbar_instagram_tooltip"]}
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
                  {text["navbar_github_tooltip"]}
                </UncontrolledTooltip>
              </NavItem>
            </Nav>
          </Container>
        </NavbarStrap>
      </div>
    );
  }
}

export default Navbar;