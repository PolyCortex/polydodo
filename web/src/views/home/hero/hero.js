import React from 'react';
import _ from 'lodash';

import { Container, Row, Col } from 'reactstrap';
import HeaderSeparator from 'components/header_separator';
import { RecordMyOwnSleepButton, PreviewButton } from 'components/buttons';

import Logo from 'assets/img/logo.png';
import PolyCortexFull from 'assets/img/polycortex_full.png';

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
                    <img alt="Polydodo" className="img-fluid hero__logo" src={Logo} />
                    <p className="lead text-white mb-5">Record, upload and visualize your sleep.</p>
                    <div className="hero__video-container center">
                      <iframe
                        title="Open Challenge 2020"
                        className="hero__video-iframe"
                        src="https://www.youtube.com/embed/322JvyDQYeQ"
                        allowFullScreen
                      />
                    </div>
                    <Row className="align-items-center justify-content-center mt-5 mb-4">
                      <RecordMyOwnSleepButton className="ml-3 mb-3 mb-md-0 hero__action_button" color="warning" />
                      <span className="mr-4" />
                      <PreviewButton className="btn-white btn-lg hero__action_button mr-3 mb-3 mb-sm-0" />
                    </Row>
                    <div className="mt-4">
                      <small className="text-muted font-weight-bold mb-0 mr-2">* a project made by</small>
                      <a href="http://polycortex.polymtl.ca/" target="_blank" rel="noopener noreferrer">
                        <img alt="..." className="ml-1" style={{ height: '100px' }} src={PolyCortexFull} />
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
