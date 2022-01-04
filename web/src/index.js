import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Routes, Navigate, HashRouter } from 'react-router-dom';

import '@fortawesome/fontawesome-free/css/all.css';
import 'assets/css/argon-design-system-react.min.css';

import Footer from 'components/footer';
import Navbar from 'components/navbar';
import SleepAnalysisResults from 'views/sleep_analysis_results';
import Performance from 'views/performance';
import AnalyzeSleep from 'views/analyze_sleep';
import RecordMySleep from 'views/record_my_sleep';
import ScrollToTop from 'components/scroll_to_top';
import Home from 'views/home';

ReactDOM.render(
  <HashRouter>
    <ScrollToTop>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/record-my-sleep" element={<RecordMySleep />} />
        <Route exact path="/analyze-my-sleep" element={<AnalyzeSleep />} />
        <Route exact path="/sleep-analysis-results" element={<SleepAnalysisResults />} />
        <Route exact path="/performance" element={<Performance />} />
        <Route element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </ScrollToTop>
  </HashRouter>,
  document.getElementById('root'),
);
