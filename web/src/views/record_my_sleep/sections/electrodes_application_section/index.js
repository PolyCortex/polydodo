import React from 'react';
import { Col, Container, Row } from 'reactstrap';

import HeaderSeparator from 'components/header_separator';

import './style.css';

const Step = ({ imgElement, titlePrefix, title, description }) => (
  <Col className="my-4" xl="4" md="12">
    <Row className="align-items-center justify-content-center">
      <h3 className="display-5 mb-4">
        <span className="text-orange mr-1">{titlePrefix}</span>
        <span className="text-white">{title}</span>
      </h3>
    </Row>
    <Row className="electrodes_application_section__step_image align-items-center justify-content-center mb-4">
      {imgElement}
    </Row>
    <Row className="align-items-center justify-content-center">
      <Col className="text-justify">
        <span className="text-white mr-1">{description}</span>
      </Col>
    </Row>
  </Col>
);

const ElectrodesApplicationSection = () => (
  <section className="section section-shaped section-lg">
    <div className="shape shape-style-1 shape-dark">
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
    &nbsp;
    <Container className="text-justify">
      <h3 className="display-3 mb-4 text-white">How to place the electrodes</h3>

      <div>
        <h4 className="display-4 mt-5 text-white">Apply skin preparation gel</h4>
        <p className="lead text-white">
          Pour a small amount of abrasive paste where your Fpz mark is and exfoliate the skin with a cotton swab until
          it begins to turn pink. Using rubbing alcohol and a cotton swab, wipe away the skin several times in order to
          remove dead skin. Repeat this for all marked locations.
        </p>
      </div>

      <div className="electrodes_application__section">
        <h4 className="display-4 mt-5 text-white">Place the scalp electrodes (Cz, Pz and Oz)</h4>
        <p className="lead text-white">
          First, make sure your electrodes are clean. For more info on how to wash them, see the Wake Up section below.
          Then, follow these three steps:
        </p>
        <Row className="text-center mt-5">
          <Step
            titlePrefix="01|"
            title="Fill the cup with Ten20"
            imgElement={
              <img src={`${process.env.PUBLIC_URL}/illustrations/electrodes_ten20.png`} alt="Electrodes in Ten20" />
            }
            description="Apply a good amount of Ten20 paste into the cup. This means filling the cup until it slightly overflows with paste."
          />
          <Step
            titlePrefix="02|"
            title="Pour some EC2"
            imgElement={<img src={`${process.env.PUBLIC_URL}/illustrations/gauze_ec2.png`} alt="EC2 on gauze" />}
            description="Squeeze some EC2 conductive paste on a gauze pad. Ensure there's enough so that it will surround the electrode."
          />
          <Step
            titlePrefix="03|"
            title="Fill the cup"
            imgElement={
              <img src={`${process.env.PUBLIC_URL}/illustrations/gauze_electrodes.png`} alt="Electrodes on gauze" />
            }
            description="Set the electrode down on the EC2. Place the concave side towards the outside of the fabric."
          />
        </Row>
        <p className="lead text-white">
          Finally, take the gauze pad with the electrode and the EC2 and place it on the marked area. Exert a small
          pressure on the gauze square with your palm. The electrode should stay in place. The EC2 conductive paste
          should take a couple minutes to dry (try to avoid sudden movements). Repeat these steps for the other two
          scalp electrodes.
        </p>
        <h4 className="mt-5 display-4 text-white">Place the skin electrodes (Fpz and A2)</h4>
        <p className="lead text-white">
          As with the scalp electrodes' first step, fill the electrode cup with a good amount of Ten20. Afterwards,
          cutoff a small piece of Hypafix. Place the electrode over the mark and apply the Hypafix medical tape tightly.
          The electrode should be secured under the tape.
        </p>
      </div>
    </Container>
    <HeaderSeparator />
  </section>
);
export default ElectrodesApplicationSection;
