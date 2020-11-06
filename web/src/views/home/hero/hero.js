import React from 'react';
import _ from 'lodash';

import { Button, Container, Row, Col } from 'reactstrap';
import HeaderSeparator from 'components/header_separator';
import { Link } from 'react-router-dom';

import Logo from 'assets/img/dodo.png';

import './style.css';

class Hero extends React.Component {
  render() {
    return (
      <>
        <div className="position-relative">
          <section className="section section-hero section-shaped pb-150">
            <div className="shape shape-style-1 shape-dark">
              {_.times(10, (i) => (
                <span key={i} />
              ))}
            </div>
            <Container className="shape-container d-flex align-items-center pt-6">
              <div className="col px-0">
                <Row className="align-items-center justify-content-center">
                  <Col className="text-center" lg="12">
                    <img alt="..." className="img-fluid" src={Logo} style={{ width: '125px' }} />
                    <p className="lead text-white mb-5">Record, upload and visualize your sleep.</p>
                    <div className="hero__video-container center">
                      <iframe
                        title="Open Challenge 2020"
                        className="hero__video-iframe"
                        src="https://www.youtube.com/embed/YJV732hR0gU"
                        allowFullScreen
                      />
                    </div>
                    <Row className="align-items-center justify-content-center mt-5 mb-4">
                      <Button
                        className="ml-3 btn-icon mb-3 mb-sm-0 hero__action_button"
                        color="warning"
                        to="/record-my-sleep"
                        tag={Link}
                        size="lg"
                      >
                        <span className="btn-inner--icon mr-1">
                          <i className="ni ni-sound-wave" />
                        </span>
                        <span className="btn-inner--text">Record My Own Sleep</span>
                      </Button>
                      <span className="mr-4" />
                      <Button
                        className="mr-3 btn-icon mb-3 mb-sm-0 hero__action_button"
                        color="secondary"
                        to={{ pathname: '/sleep-analysis-results', state: { isPreviewMode: true } }}
                        tag={Link}
                        size="lg"
                      >
                        <span className="btn-inner--icon mr-1">
                          <i className="ni ni-button-play" />
                        </span>
                        <span className="btn-inner--text">Preview</span>
                      </Button>
                    </Row>
                    <div className="mt-4">
                      <small className="text-muted font-weight-bold mb-0 mr-2">* a project made by</small>
                      <a href="http://polycortex.polymtl.ca/" target="_blank" rel="noopener noreferrer">
                        <img
                          alt="..."
                          className="ml-1"
                          style={{ height: '100px' }}
                          src={require('assets/img/polycortex_full.png')}
                        />
                      </a>
                    </div>
                  </Col>
                </Row>
              </div>
            </Container>
            <HeaderSeparator />
          </section>
        </div>
      </>
    );
  }
}

export default Hero;
