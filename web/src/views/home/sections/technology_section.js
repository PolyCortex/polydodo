import React from 'react';
import { Link } from 'react-router-dom';

const TechnologySection = () => (
  <div className="mt-4">
    <h2 className="mt-6">The technology</h2>
    <p>
      Our sleep stage classification algorithm is trained on the Physionet Sleep-EDF Extended dataset which provides 153
      nights of polysomnographic recordings. The used machine learning approach achieves a X.XX Cohen-Kappa score which
      is close to state of the art techniques. Of course, this does not reach the accuracy of a true clinical
      polysomnography, but we do get better results than non-using eeg apps...
    </p>
    <Link to="/performance">Learn more about the performances</Link>
  </div>
);

export default TechnologySection;
