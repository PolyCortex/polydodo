import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Alert } from 'reactstrap';
import { getLatestServerReleaseAssets } from 'requests/latest_release';
import { ListGroup, ListGroupItem } from 'reactstrap';

const WaitingForServer = () => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    getLatestServerReleaseAssets().then((assets) => setAssets(assets));
  }, [setAssets]);

  return (
    <Container className="my-6">
      <Alert color="warning" className="lead mb-5 mr-3">
        <i class="fas fa-server fa-lg mr-3" />
        <strong>Waiting for local server to be running...</strong>
      </Alert>

      <h3 className="mb-4">Download latest server release</h3>
      <Row>
        <Col md="6">
          <p>
            In order to upload your sleep file, we ask you to install our local server. This server will proceed to the
            preprocessing, feature extraction and classification of your sleep EEG. Your data is processed locally since
            we, at PolyCortex, believe that you should have full control over your data and its privacy.
          </p>
        </Col>
        <Col md="6" className="text-center mb-4">
          <ListGroup>
            {assets.map((asset) => (
              <ListGroupItem color="default" key={asset.name} active={asset.currentOs} tag="a" href={asset.url}>
                {asset.name}
              </ListGroupItem>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default WaitingForServer;
