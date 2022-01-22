import BadgeBulletPoint from 'components/badge_bullet_point';
import React from 'react';
import { Alert, Container } from 'reactstrap';

import ElectrodesDisplay from './electrodes_display';

const ElectrodesPlacementSection = () => (
  <section className="section section-lg">
    <Container className="text-justify pt-md">
      <Alert color="primary">
        <span className="text-white alert-inner--text">
          <i className="text-white fas fa-hands-helping fa-lg mr-2" />
          <strong>For the two next parts, you may want to ask someone for some help.</strong> It will be far easier in
          order to locate and fix each electrode.
        </span>
      </Alert>
      <h3 className="display-3 mt-7">Where to place the electrodes</h3>
      <p className="lead">
        First, you need to know where to place the electrodes. You will need the soft tape measure to measure the head
        according to the 10-20 placement system and then you will mark as precisely as possible each electrode's
        location using a marker. The montage is composed of the Fpz-Cz and Pz-Oz channels to which we add a driven
        ground electrode placed at A2. This montage is based on an alternative electrode placement for sleep analysis
        [Sweden, Kemp, Kamphuisen and Velde, 1990].
      </p>
      <div className="ml-3 mr-md-9">
        <ul className="list-unstyled mt-4">
          <li className="py-2">
            <BadgeBulletPoint badgeColor="primary" iconClass="fas fa-ruler">
              <h6 className="mb-0">
                First, you will need to measure the distance starting from your&nbsp;
                <a href="https://en.wikipedia.org/wiki/Nasion" target="_blank" rel="noreferrer">
                  nasion
                </a>
                &nbsp;to your&nbsp;
                <a
                  href="https://en.wikipedia.org/wiki/External_occipital_protuberance"
                  target="_blank"
                  rel="noreferrer"
                >
                  inion.
                </a>
              </h6>
            </BadgeBulletPoint>
          </li>
          <li className="py-2">
            <BadgeBulletPoint badgeColor="primary" iconClass="fas fa-marker">
              <h6 className="mb-0">
                Then, using this measure, follow the table below to get some detailed explanations on where to draw
                marks for each location.
              </h6>
            </BadgeBulletPoint>
          </li>
        </ul>
      </div>

      <ElectrodesDisplay className="my-5" />
      <small className="text-muted text-justify">
        <div className="mt-2">
          [Sweden, Kemp, Kamphuisen and Velde, 1990] B. V. Sweden, B. Kemp, H. A. C. Kamphuisen, and E.A.V.D. Velde.
          Alternative Electrode Placement in (Automatic) Sleep Scoring (Fpz-Cz/Pz-Oz versus C4-At). Sleep,
          13(3):279–283, 1990.
        </div>
      </small>
    </Container>
  </section>
);

export default ElectrodesPlacementSection;
