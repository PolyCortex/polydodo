import React from 'react';
import { Container } from 'reactstrap';

import Table from 'components/table';

const WiringSection = () => (
  <section className="section">
    <Container className="text-justify">
      <div className="mt-5">
        <h3 className="display-3">Wire the electrodes to the OpenBCI device</h3>
        <p className="lead">Here’s is how you need to wire your electrodes to the OpenBCI board you are using:</p>
        <Table
          headers={['Location', 'Pin on Cyton', 'Pin on Ganglion']}
          elementsrows={[
            ['Fpz', 'P1', '+1'],
            ['Cz', 'N1', '-1'],
            ['Pz', 'P2', '+2'],
            ['Oz', 'N2', '-2'],
            ['A2', 'BIAS (Any pin)', 'D_G (Any pin)'],
          ]}
        />
        <p className="lead mt-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </p>
      </div>
    </Container>
  </section>
);

export default WiringSection;
