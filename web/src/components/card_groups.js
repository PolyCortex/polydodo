import React from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, CardGroup } from 'reactstrap';
import _ from 'lodash';

const CardGroups = ({ elements, groupSize }) => {
  const chunks = _.chunk(elements, groupSize);
  return chunks.map((chunk, i) => (
    <CardGroup key={i}>
      {chunk.map(({ title, text, image }, j) => (
        <Card key={j}>
          <CardImg top src={`${process.env.PUBLIC_URL}/${image}`} alt={title} />
          <CardBody>
            <CardTitle tag="h5">{title}</CardTitle>
            <CardText>{text}</CardText>
          </CardBody>
        </Card>
      ))}
    </CardGroup>
  ));
};
export default CardGroups;
