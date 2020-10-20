import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

const ScrollToTop = ({ location, children }) => {
  useEffect(() => window.scrollTo(0, 0), [location.pathname]);

  return children;
};

ScrollToTop.propTypes = {
  location: PropTypes.object.isRequired,
  children: PropTypes.array.isRequired,
};

export default withRouter(ScrollToTop);
