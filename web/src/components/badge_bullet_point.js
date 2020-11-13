import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'reactstrap';

const BadgeBulletPoint = ({ className, badgeColor, iconClass, children }) => (
  <div className={`d-flex ${className}`}>
    <Badge className="badge-circle flex-shrink-0 mr-3" color={badgeColor}>
      <i className={`${iconClass}`} />
    </Badge>
    <div>{children}</div>
  </div>
);

BadgeBulletPoint.propTypes = {
  className: PropTypes.string,
  badgeColor: PropTypes.string,
  iconClass: PropTypes.string,
  children: PropTypes.any.isRequired,
};

export default BadgeBulletPoint;
