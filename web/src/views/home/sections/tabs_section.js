import React, { useState } from 'react';
import { Card, CardBody, NavItem, NavLink, Nav, TabContent, TabPane, Row, Col, Button, Container } from 'reactstrap';
import classnames from 'classnames';

import Emoji from 'components/emoji';

import Dodo from 'assets/img/dodo.png';
import './style.css';

const TABS = { FIRST: 0, SECOND: 1, THIRD: 2 };

const TabsSection = () => {
  const [activeTab, setActiveTab] = useState(TABS.FIRST);

  const onTabClickCallback = (tab) => (e) => {
    e.preventDefault();
    setActiveTab(tab);
  };

  return (
    <section className="section section-sm bg-secondary">
      <Container>
        <h3 className="h4 text-primary font-weight-bold mb-4">
          <Emoji symbol="💤" label="zzz" /> You can sleep soundly
        </h3>
        <Row className="justify-content-center">
          <Col lg="8">
            <div className="nav-wrapper">
              <Nav className="nav-fill flex-column flex-md-row" id="tabs-icons-text" pills role="tablist">
                <NavItem>
                  <NavLink
                    aria-selected={activeTab === TABS.FIRST}
                    className={classnames('mb-sm-3 mb-md-0', {
                      active: activeTab === TABS.FIRST,
                    })}
                    onClick={onTabClickCallback(TABS.FIRST)}
                    href="#pablo"
                    role="tab"
                  >
                    <i className="ni ni-atom mr-2" />
                    Open Source
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    aria-selected={activeTab === TABS.SECOND}
                    className={classnames('mb-sm-3 mb-md-0', {
                      active: activeTab === TABS.SECOND,
                    })}
                    onClick={onTabClickCallback(TABS.SECOND)}
                    href="#pablo"
                    role="tab"
                  >
                    <i className="ni ni-key-25 mr-2" />
                    Anonymous
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    aria-selected={activeTab === TABS.THIRD}
                    className={classnames('mb-sm-3 mb-md-0', {
                      active: activeTab === TABS.THIRD,
                    })}
                    onClick={onTabClickCallback(TABS.THIRD)}
                    href="#pablo"
                    role="tab"
                  >
                    <i className="ni ni-single-copy-04 mr-2" />
                    Disclaimer
                  </NavLink>
                </NavItem>
              </Nav>
            </div>
            <Card className="shadow mb-5">
              <CardBody>
                <TabContent className="tabs_section__body" activeTab={'activeTab' + activeTab}>
                  <TabPane tabId={`activeTab${TABS.FIRST}`}>
                    <p>This project is entirely free and open source. Feel free to help us by contributing!</p>
                    <Button
                      className="btn-icon mb-3 mb-sm-0"
                      color="github"
                      href="https://github.com/polycortex/polydodo"
                      size="md"
                      target="_blank"
                    >
                      <span className="btn-inner--icon mr-1">
                        <i className="fa fa-github" />
                      </span>
                      <span className="btn-inner--text">
                        <span className="text-warning mr-1">Star it</span>
                        on Github
                      </span>
                    </Button>
                  </TabPane>
                  <TabPane className="tabs_section__body" tabId={`activeTab${TABS.SECOND}`}>
                    <p>
                      Your data is in your hand. Nothing is sent over the internet. Everything is running locally on
                      your browser and local server.
                    </p>
                  </TabPane>
                  <TabPane className="tabs_section__body" tabId={`activeTab${TABS.THIRD}`}>
                    <p>
                      This application is not intended for medical purposes and the data it produces should not be used
                      in such context. Its only goal is to demonstrate what is possible and to help you study your own
                      sleep.
                    </p>
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>
          <Col size="4">
            <div className="position-relative pl-md-5">
              <img alt="..." className="img-center img-fluid" src={Dodo} />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default TabsSection;
