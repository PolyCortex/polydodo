import React from 'react';
import _ from 'lodash';

import { Button, Container, Row, Col } from 'reactstrap';
import HeaderSeparator from 'components/header_separator';

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
                    <img
                      alt="..."
                      className="img-fluid"
                      src={require('assets/img/logo.png')}
                      style={{ width: '350px' }}
                    />
                    <p className="lead text-white mb-5">Record, upload and visualize your sleep.</p>
                    <iframe
                      title="Open Challenge 2020"
                      width="560"
                      height="315"
                      src="https://www.youtube.com/embed/YJV732hR0gU"
                      frameborder="0"
                      allow="autoplay; clipboard-write; encrypted-media;"
                      allowfullscreen
                    />
                    <div className="btn-wrapper mt-6">
                      <Button
                        className="btn-icon mb-3 mb-sm-0"
                        color="warning"
                        href="https://www.creative-tim.com/product/argon-design-system-react?ref=adsr-landing-page"
                        size="lg"
                      >
                        <span className="btn-inner--icon mr-1">
                          <i className="ni ni-sound-wave" />
                        </span>
                        <span className="btn-inner--text">Record My Own Sleep</span>
                      </Button>{' '}
                      <Button
                        className="btn-icon mb-3 mb-sm-0"
                        color="github"
                        href="https://github.com/PolyCortex/polydodo"
                        size="lg"
                        target="_blank"
                      >
                        <span className="btn-inner--icon mr-1">
                          <i className="fa fa-github" />
                        </span>
                        <span className="btn-inner--text">
                          <span className="text-warning mr-1">Star us</span>
                          on Github
                        </span>
                      </Button>
                    </div>
                    <div className="mt-5">
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
