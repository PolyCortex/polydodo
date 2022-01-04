import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const ScrollToTop = ({ children }) => {
  const location = useLocation();
  useEffect(() => window.scrollTo(0, 0), [location.pathname]);

  return children;
};

ScrollToTop.propTypes = {
  children: PropTypes.array.isRequired,
};

export default ScrollToTop;
