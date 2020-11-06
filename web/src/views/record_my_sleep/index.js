import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Alarm, Hotel, Timeline } from '@material-ui/icons';

import Header from 'components/header';
import Table from 'components/table';

import text from './text.json';
import material_needed from './material_needed.json';

import WIPWarning from 'components/wip_warning';
import CardGroups from 'components/card_groups';

const RecordMySleep = () => {
  return (
    <>
      <Header
        sizeClass={'pb-150'}
        shapeQty={7}
        title={text['header_title']}
        subtitle={text['header_subtitle']}
        description={text['header_description']}
      />
      <section className="section">
        <Container className="text-justify pt-lg">
          <h3 className="display-3">Create your own sleep lab</h3>
          <p>
            Here are some explanations about how to get your own EEG data in order to score your sleep using this
            website. If you already own an OpenBCI board, you could have very little (see nothing) to buy.
          </p>
          <p>
            If you don’t have the time or the resources to create your own sleep lab, we have pre-recorded one of our
            members' night's sleep. You can take a look at the end result right here:
          </p>
        </Container>
      </section>

      <section className="section bg-secondary">
        <Container className="text-justify pt-lg">
          <h3 className="display-3">What you need</h3>
          <CardGroups groupSize={4} elements={material_needed.elements} />
        </Container>
      </section>

      <section className="section section-lg">
        <Container className="text-justify pt-lg">
          <h3 className="display-3">Where to place the electrodes</h3>
          <p>
            You may want to ask a friend for some help. It will be easier to locate the site where to place your
            electrodes and to place them with the help of someone else.
          </p>
          <p>
            First, you need to know where to place the electrodes. Our channels are Fpz-Cz and Pz-Oz to which we add a
            driven ground electrode placed at A2 (on your right ear lobe).
          </p>

          <div>
            <Row className="row-grid mt-5">
              <Col lg="4">
                <div className="icon icon-lg icon-shape bg-gradient-white shadow rounded-circle text-primary">
                  <i className="ni ni-settings text-primary" />
                </div>
                <h5 className="mt-3">Fpz</h5>
                <p className="mt-3">
                  Fpz is located at 10 % of the distance along the midline between your nasion and your inion.
                </p>
              </Col>
              <Col lg="4">
                <div className="icon icon-lg icon-shape bg-gradient-white shadow rounded-circle text-primary">
                  <i className="ni ni-ruler-pencil text-primary" />
                </div>
                <h5 className="mt-3">Cz</h5>
                <p className="mt-3">
                  We’re measuring a potential difference between Fpz and that point. Cz is located at 50% of the
                  distance along the midline starting from your nasion to your inion.
                </p>
              </Col>
              <Col lg="4">
                <div className="icon icon-lg icon-shape bg-gradient-white shadow rounded-circle text-primary">
                  <i className="ni ni-ruler-pencil text-primary" />
                </div>
                <h5 className="mt-3">A2</h5>
                <p className="mt-3">
                  This is the electrode that serves as driven ground between your and your OpenBCI board. Simply place
                  it on your right earlobe.
                </p>
              </Col>
            </Row>
            <Row className="row-grid mt-5">
              <Col lg={{ size: 4, offset: 2 }}>
                <div className="icon icon-lg icon-shape bg-gradient-white shadow rounded-circle text-primary">
                  <i className="ni ni-atom text-primary" />
                </div>
                <h5 className="mt-3">Pz</h5>
                <p className="mt-3">
                  This is our other active electrode. It is located at 70% of the distance between your nasion and your
                  inion.
                </p>
              </Col>
              <Col lg="4">
                <div className="icon icon-lg icon-shape bg-gradient-white shadow rounded-circle text-primary">
                  <i className="ni ni-settings text-primary" />
                </div>
                <h5 className="mt-3">Oz</h5>
                <p className="mt-3">
                  This is the point at which Pz is referenced. It is located at 90% of the distance between your nasion
                  and your inion.
                </p>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      <section className="section bg-secondary">
        <Container className="text-justify pt-lg">
          <h3 className="display-3">How to place the electrodes</h3>

          <div>
            <h4 className="display-4">Apply Abrasive paste</h4>
            <p>
              Now that you marked all these locations, you can clean the areas with abrasive paste. Exfoliate the skin
              with a cotton swab until it begins to turn pink, and then wash the skin using some rubbing alcohol and a
              cotton pad.
            </p>
          </div>

          <div>
            <h4 className="display-4">Place your electrodes</h4>
            <p>Make sure your electrodes are clean.</p>
            <p>
              <b>For Cz, Pz and Oz</b> (electrodes placed over your scalp): Squeeze some EC2 over a gauze pad, take an
              electrode and apply a good amount of Ten20 paste into the cup, and then set the electrode down on the EC2.
              Finally, take the gauze pad with the electrode and place it on the marked area.
            </p>
            <p>
              <b>For Fpz and A2</b> (electrodes directly placed over skin): Apply a good amount of Ten20 paste into the
              cup, place it on the marked area and fix it with a small cutoff of Hypafix. If you do not have Ten20
              paste, just use EC2 paste as above.
            </p>
            <p>
              Please note: A good amount of Ten20 paste means filling the cup until it slightly overflows with paste.
            </p>
            <WIPWarning />
          </div>

          <div>
            <h4 className="display-4">Ensure good skin contact</h4>
            <p>
              To ensure that skin contact is good, it is important to measure the impedance between the electrodes.
              Start by measuring the impedance between your active electrode and its reference (e.g.: Fpz and Cz). Also,
              check the impedance between the reference electrodes of each channel (Cz and Oz) and the ground electrode
              (A2). As a rule of thumb, low impedance (10 KOhms) is good and high ones are bad (let’s say 150 KOhms).
            </p>
          </div>

          <div>
            <h4 className="display-4">Wire the electrodes to the OpenBCI device</h4>
            <p>Here’s is how you need to wire your electrodes to the OpenBCI board you are using:</p>
            <Table
              headers={['Location', 'Pin on Cyton', 'Pin on Ganglion']}
              elementsRows={[
                ['Fpz', 'P1', '+1'],
                ['Cz', 'N1', '-1'],
                ['Pz', 'P2', '+2'],
                ['Oz', 'N2', '-2'],
                ['A2', 'BIAS (Any pin)', 'D_G (Any pin)'],
              ]}
            />
          </div>
        </Container>
      </section>

      <section className="section section-lg">
        <Container className="text-justify pt-lg">
          <h3 className="display-3">How to use OpenBCI GUI</h3>
          <p>
            First thing you need is the OpenBCI GUI in order to use the hardware. Therefrom, select{' '}
            <b>Live (from &lt;boardname&gt;)</b> as your source. If you’re using a Cyton board we suggest you use a
            microSD card using FAT32 format. If you do so, do not forget to select at least <b>12 hour maximum</b> for
            the write to SD card parameter. Otherwise, you must keep your computer near and open for the whole night and
            log the data to a session file. If you do it this way, do not forget to select the OpenBCI file output and
            to select <b>No Limit</b> as your max file duration. When everything is configured properly, you can press{' '}
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

          <p>
            Do not forget to deactivate all unused channels by greying out the numbered colored pill on the left of the
            signal in the GUI. You can now press <b>Start data stream</b>. If you are using a microSD card and a Cyton
            board, you may want to pull off the dongle from its usb port. Data will be written to the SD card for the
            configured amount of time.
          </p>
        </Container>
      </section>

      <section className="section bg-secondary">
        <Container className="text-justify pt-lg">
          <h3 className="display-3">Limit noise</h3>
          <p>
            Tie the electrodes together with a hair tie, and if you have long hair, tie them all together in order to
            avoid static during the night. To limit electromagnetic interferences you may want to place your board in
            some sort of Faraday cage, for example, a plastic container wrapped up in aluminium foil.
          </p>
        </Container>
      </section>

      <section className="section section-lg">
        <Container className="text-justify pt-lg">
          <h3 className="display-3">Write a journal</h3>
          <p>
            You must keep a journal (accurate to the minute) and write down a few information to help us track and
            analyze your sleep:
          </p>
          <p>
            <Timeline />
            When you start the stream
          </p>
          <p>
            <Hotel />
            When you go to bed
          </p>
          <p>
            <Alarm />
            When you wake up
          </p>
          <p>You will need to provide this information in order to score your EEG recording.</p>
        </Container>
      </section>

      <section className="section bg-gradient-warning">
        <Container className="mt-5 mb-5 text-justify  text-white">
          <h3 className="display-3 text-white">Wake up!</h3>
          <div>
            <h4 className="display-4 text-white">Remove your electrodes</h4>
            <p>
              In order to take the electrodes off your scalp, you can use warm water for the EC2 to come off easily. The
              Hypafix, used for electrodes over the skin, should be taken off with warm water and/or rubbing alcohol.
              Prefer taking them off slowly, since they can hurt sensible skin if removed too quickly. Don’t forget to
              clean your electrodes using warm water and soap.
            </p>
          </div>
          <div>
            <h4 className="display-4 text-white">If you used an microSD card:</h4>
            <p>
              Remove the microSD card from the board and insert it in your computer. Then, open OpenBCI GUI and select
              <b>PLAYBACK (from file)</b> as your data source. Use the <b>Convert SD for playback option</b> and select
              your sd file. Wait a little bit and you will get the converted csv file. Upload this one to this website
              in order to score your sleep
            </p>
          </div>
          <div>
            <h4 className="display-4 text-white">If you used session file:</h4>
            <p>
              After stopping the stream, go to the Recordings directory where your session file. Just upload this file
              in order to score your sleep and analyze your data.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
};
export default RecordMySleep;
