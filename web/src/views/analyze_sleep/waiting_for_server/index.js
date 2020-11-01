import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner } from 'reactstrap';
import { getLatestServerReleaseAssets } from 'requests/latest_release';
import { ListGroup, ListGroupItem } from 'reactstrap';

const WaitingForServer = () => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    getLatestServerReleaseAssets().then((assets) => setAssets(assets));
  }, [setAssets]);

  return (
    <Container>
      <h3 className="mb-4">Waiting for local server to be running...</h3>

      <h3>Download latest server release</h3>
      <Row>
        <Col className="text-center mb-4">
          <ListGroup>
            {assets.map((asset) => (
              <ListGroupItem key={asset.name} active={asset.currentOs} tag="a" href={asset.url}>
                {asset.name}
              </ListGroupItem>
            ))}
          </ListGroup>
        </Col>
      </Row>

      <Row>
        <Col className="text-center mb-4">
          <Spinner style={{ width: '3rem', height: '3rem' }} />
        </Col>
      </Row>
    </Container>
  );
};

export default WaitingForServer;
