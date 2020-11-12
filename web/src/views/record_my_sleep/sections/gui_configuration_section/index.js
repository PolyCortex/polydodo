import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import Table from 'components/table';

const GUIConfigurationSection = () => (
  <section className="section section-lg">
    <Container className="text-justify">
      <h3 className="display-3">How to use OpenBCI GUI</h3>
      <p className="lead">
        First thing you need is the OpenBCI GUI in order to use the hardware. Therefrom, select{' '}
        <b>Live (from &lt;boardname&gt;)</b> as your source. If you’re using a Cyton board we suggest you use a microSD
        card using FAT32 format. If you do so, do not forget to select at least <b>12 hour maximum</b> for the write to
        SD card parameter. Otherwise, you must keep your computer near and open for the whole night and log the data to
        a session file. If you do it this way, do not forget to select the OpenBCI file output and to select{' '}
        <b>No Limit</b> as your max file duration. When everything is configured properly, you can press{' '}
        <b>Start Session</b>. Before pressing <b>Start Stream</b>, press <b>Hardware Settings</b> and configure
        everything as follow:
      </p>

      <Row>
        <Col>
          <h4 className="display-4">Cyton</h4>
          <Table
            headers={['Channel', 'PGA Gain', 'Input Type', 'Bias', 'SRB2', 'SRB1']}
            elementsRows={[
              ['1', 'x24', 'Normal', 'Include', 'Off', 'No'],
              ['2', 'x24', 'Normal', 'Include', 'Off', 'No'],
            ]}
          />
        </Col>
        <Col>
          <h4 className="display-4">Ganglion</h4>
          <Table
            headers={['Channel', 'PGA Gain', 'Input Type', 'Driven Ground', 'Common Ref']}
            elementsRows={[
              ['1', 'x24', 'Normal', 'Include', 'Off'],
              ['2', 'x24', 'Normal', 'Include', 'Off'],
            ]}
          />
        </Col>
      </Row>

      <p className="lead">
        Do not forget to deactivate all unused channels by greying out the numbered colored pill on the left of the
        signal in the GUI. You can now press <b>Start data stream</b>. If you are using a microSD card and a Cyton
        board, you may want to pull off the dongle from its usb port. Data will be written to the SD card for the
        configured amount of time.
      </p>
    </Container>
  </section>
);

export default GUIConfigurationSection;
