import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

const PreviewButton = ({ block, className }) => (
  <Button
    block={block}
    className={`btn-icon btn-white ${className}`}
    color="default"
    to={{ pathname: '/sleep-analysis-results', state: { isPreviewMode: true } }}
    tag={Link}
    size="lg"
  >
    <span className="btn-inner--icon mr-1">
      <i className="ni ni-button-play" />
    </span>
    <span className="btn-inner--text">Preview</span>
  </Button>
);

export default PreviewButton;
