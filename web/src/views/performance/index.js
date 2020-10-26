import React from 'react';
import { Container, Table } from 'reactstrap';
import PropTypes from 'prop-types';

import Header from 'components/header';
import D3Component from 'components/d3component';

import { createComparativeHypnogram } from 'd3/hypnogram/hypnogram';

import physionetWoman78yoSleepEDF from 'assets/data/physionet_woman78yo_sleepedf';
import predictedWoman78yoSleepEDF from 'assets/data/predicted_woman78yo_sleepedf';
import electrophysiologistWoman78yoSleepEDF from 'assets/data/electrophysiologist_woman78yo_sleepedf';
import electrophysiologistWilliamCyton from 'assets/data/electrophysiologist_william_cyton';
import predictedWilliamCyton from 'assets/data/predicted_william_cyton';

import text from './text.json';

const ClassificationReport = ({ rows }) => (
  <Table size="sm" responsive>
    <thead>
      <tr>
        <th></th>
        <th>Precision (%)</th>
        <th>Recall (%)</th>
        <th>F1-Score (%)</th>
        <th>Support</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((row, i) => {
        return (
          <tr key={i}>
            <th>{row[0]}</th>
            {row.slice(1).map((el, j) => (
              <td key={j}>{el}</td>
            ))}
          </tr>
        );
      })}
    </tbody>
  </Table>
);

ClassificationReport.propTypes = {
  rows: PropTypes.array.isRequired,
};

const Performance = () => {
  return (
    <div>
      <Header
        sizeClass={'pb-100'}
        shapeQty={7}
        title={text['header_title']}
        subtitle={text['header_subtitle']}
        description={text['header_description']}
      />
      <Container className="mt-5 text-justify">
        <p>
          Ever wonder what is the value of this application? This page aims to illustrate the relative performance of
          our sleep scoring compared to clinical hypnogram scoring (which is usually considered the state-of-the-art
          technique).
        </p>
        <p>
          <strong>Here is the plan:</strong>
        </p>
        <ul>
          <li>
            First, we will check how our classifier’s scoring agrees with the scoring within the Physionet's Sleep-EDF
            dataset. Of course, we will perform this agreement test on a subset of EEG data that was never trained on.
            This subset is composed of full nights of sleep coming from five subject of a different age group.{' '}
          </li>
          <li>
            Then, we will check how this classifier performs on a full night recorded on one of our members. In order to
            be able to make comparisons, we ask for the help of a medical electrophysiologist to score our data. This
            manual scoring will serve as reference to get an idea of the accuracy of our model on data acquired using an
            OpenBCI under non-clinical conditions. The AASM manual was used for scoring.
          </li>
          <li>
            Finally, we will present the scoring differences between the medical electrophysiologist and Sleep-EDF. To
            do this, we will take a random night in our dataset. This will allow us to qualify somewhat the previous
            results and maybe get an idea of the usual disagreement level between professional scorers.
          </li>
        </ul>
        <h3 className="mt-5">Classifier's accuracy according to Sleep-EDF</h3>
        <D3Component
          callback={(svg, data) => createComparativeHypnogram(svg, data, ['Classifier', 'Sleep-EDF'])}
          data={[predictedWoman78yoSleepEDF.epochs, physionetWoman78yoSleepEDF.epochs]}
        />
        <ClassificationReport
          rows={[
            ['W', 92, 93, 92, 242],
            ['REM', 56, 50, 52, 86],
            ['N1', 80, 82, 70, 32],
            ['N2', 75, 72, 23, 368],
            ['N3', 96, 97, 96, 68],
            ['Accuracy', '', '', 82, 796],
          ]}
        />
        <h3 className="mt-5">Classifier's accuracy according to the electrophysiologist</h3>
        <D3Component
          callback={(svg, data) => createComparativeHypnogram(svg, data, ['Classifier', 'Electrophysiologist'])}
          data={[predictedWilliamCyton.epochs, electrophysiologistWilliamCyton.epochs]}
        />
        <ClassificationReport
          rows={[
            ['W', 85, 93, 92, 304],
            ['REM', 52, 50, 52, 83],
            ['N1', 76, 80, 78, 37],
            ['N2', 75, 60, 68, 366],
            ['N3', 92, 93, 92, 65],
            ['Accuracy', '', '', 74, 842],
          ]}
        />
        <h3 className="mt-5">Electrophysiologist and Sleep-EDF's agreement</h3>
        <D3Component
          callback={(svg, data) => createComparativeHypnogram(svg, data, ['Electrophysiologist', 'Sleep-EDF'])}
          data={[electrophysiologistWoman78yoSleepEDF.epochs, physionetWoman78yoSleepEDF.epochs]}
        />
        <ClassificationReport
          rows={[
            ['W', 92, 93, 92, 304],
            ['REM', 56, 50, 52, 83],
            ['N1', 74, 72, 73, 37],
            ['N2', 70, 64, 67, 366],
            ['N3', 89, 87, 87, 65],
            ['Accuracy', '', '', 73, 842],
          ]}
        />
      </Container>
    </div>
  );
};

export default Performance;
