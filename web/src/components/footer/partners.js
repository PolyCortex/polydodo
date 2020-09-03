import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row } from 'reactstrap';

import text from './text.json';

import Polymtl from '../../assets/img/partners/polymtl.png';
import AEP from '../../assets/img/partners/aep.png';
import Protocase from '../../assets/img/partners/protocase.png';
import NTX from '../../assets/img/partners/ntx.png';
import Diptrace from '../../assets/img/partners/diptrace.png';

const Partner = ({ img, alt, width }) => {
  return <img alt={alt} className="img-center img-fluid" src={img} style={{ width: `${width}px` }} />;
};

Partner.propTypes = {
  img: PropTypes.string.isRequired,
  alt: PropTypes.string,
  width: PropTypes.number,
};

Partner.defaultProps = {
  alt: '...',
  width: 100,
};

const Partners = () => {
  return (
    <Container>
      <h3 className="mt-md mb-5">{text['sponsor_thank-you']}</h3>
      <Row className="align-items-center mb-5">
        <Partner alt="Polytechnique Montréal" img={Polymtl} width={125} />
        <Partner alt="Association Étudiante de Polytechnique" img={AEP} width={125} />
        <Partner alt="NeurotechX" img={NTX} width={125} />
        <Partner alt="Protocase" img={Protocase} width={125} />
        <Partner alt="Diptrace" img={Diptrace} width={125} />
      </Row>
    </Container>
  );
};

export default Partners;
