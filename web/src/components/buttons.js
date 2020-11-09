import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

export const RecordMyOwnSleepButton = ({ block, className, color }) => (
  <Button block={block} className={`btn-icon ${className}`} color={color} to="/record-my-sleep" tag={Link} size="lg">
    <span className="btn-inner--icon mr-1">
      <i className="fas fa-procedures fa-lg" />
    </span>
    <span className="btn-inner--text">Record My Own Sleep</span>
  </Button>
);

export const PreviewButton = ({ block, className, color }) => (
  <Button
    block={block}
    className={`btn-icon ${className}`}
    color={color}
    to={{ pathname: '/sleep-analysis-results', state: { isPreviewMode: true } }}
    tag={Link}
    size="lg"
  >
    <span className="btn-inner--icon mr-1">
      <i className="fas fa-play" />
    </span>
    <span className="btn-inner--text">Preview</span>
  </Button>
);
