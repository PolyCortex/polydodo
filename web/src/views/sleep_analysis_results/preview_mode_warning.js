import React from 'react';
import { Alert } from 'reactstrap';

import Emoji from 'components/emoji';

const BEDTIME_PREVIEW_MODE_TIMESTAMP = 1582423980 * 1000;

const PreviewModeWarning = () => {
  return (
    <Alert color="warning">
      <span>
        <Emoji symbol="⚠️" />
        <strong> You are in preview mode. </strong>
        The data that is shown here comes from a recording we took on{' '}
        {new Date(BEDTIME_PREVIEW_MODE_TIMESTAMP).toDateString()} <Emoji symbol="⚠️" />
      </span>
    </Alert>
  );
};

export default PreviewModeWarning;
