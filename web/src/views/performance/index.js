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
        <p className="lead">
          This page aims to illustrate the performance of our sleep scoring compared to clinical hypnogram scoring,
          which is usually considered the gold standard in sleep stage scoring. If you want to learn more about how
          we've defined our sleep scoring algorithm, please either refer to our presentation video in our home page, or
          to our{' '}
          <a href="https://github.com/PolyCortex/polydodo/wiki/Model" target="_blank" rel="noreferrer">
            wiki page
          </a>
          .
        </p>
        <h3>Model training and selection</h3>
        <p>
          In order to train our model to predict sleep stages based on EEG data, we used an open source dataset,
          <a href="https://physionet.org/content/sleep-edfx/1.0.0/" target="_blank" rel="noreferrer">
            &nbsp;Physionet SleepEDF expanded
          </a>
          , which is composed of 153 nights of sleep coming from 82 subjects, of different ages and sex. The labelled
          data has been produced by well-trained technicians according to the 1968 Rechtschaffen and Kales manual,
          adapted to the used EEG montage. In order to compare and validate the prototyped models, we divided the data
          into a training and testing set, and we made sure that both sets had different subjects. Indeed, we didn't
          want our test metrics to be biaised, as we'd have already trained on data coming from a same subject.
        </p>

        <p>
          In order to select the most accurate model, we looked at the{' '}
          <a href="https://en.wikipedia.org/wiki/Cohen%27s_kappa" target="_blank" rel="noreferrer">
            Cohen's Kappa agreement score
          </a>
          , as it is often used in the automatic sleep scoring litterature. We then chose the model with the highest
          agreement score, which is a voting classifier, composed of a K Nearest Neighbour and a Random Forest
          classifiers. Unfortunatly, the model couldn't be exported to be used in the server, as we included, inside the
          voting classifier, a pipeline to reduce the dimension of the inputed features. We then decided to use our
          second best model, which is a Random Forest. It is the one we will evaluate the performances, as it is the one
          currently used to classify sleep stages in our server.
        </p>
        <p>
          Let's first look at the performances of the classifier over the selected test set composed of subjects from
          the SleepEDF dataset. The resulted Cohen's Kappa agreement score is{' '}
          <strong>
            <span className="text-primary">0.741</span>
          </strong>
          . Please note that the classes are imbalanced, and thus impacting the metrics displayed.
        </p>
        <h3 className="my-5">Classifier's accuracy according to Sleep-EDF testing set</h3>
        <div className="my-5">
          <ClassificationReport
            rows={[
              ['W', 88, 90, 89, 1624],
              ['REM', 75, 87, 81, 1302],
              ['N1', 69, 26, 38, 983],
              ['N2', 86, 89, 87, 3603],
              ['N3', 70, 94, 80, 611],
              ['Accuracy', '', '', 82, 8123],
            ]}
          />
        </div>
        <p>
          The test set, on which these metrics were calculated, is composed of subjects from different ages groups (33
          year old female, 54 year old female, 67 year old female, 88 year old male), so that the obtained score is the
          most representative of our ability to classify sleep, no matter the age. In another side, we could compare the
          results obtained to the ones found in the litterature. To do so, we had to find a paper that uses the same
          dataset, the same metric and that splits their dataset in a similar fashion as ours.TODO.
        </p>
        <p className="lead">
          Although we obtain good results, it didn't quite validate that our classifier could accurately score OpenBCI
          data into sleep stages. After all, we only validated on data coming from the same acquisition hardware than
          the data we trained on, which is not the case when we analyze data submitted in the application. We then had
          to make our own polysomnographic dataset based on the hardware we use, so using an OpenBCI board.
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
        <h3 className="mt-5">Classifier's accuracy according to Sleep-EDF (kappa:0.6709)</h3>
        <D3Component
          callback={(svg, data) => createComparativeHypnogram(svg, data, ['Classifier', 'Sleep-EDF'])}
          data={[predictedWoman78yoSleepEDF.epochs, physionetWoman78yoSleepEDF.epochs]}
        />
        <ClassificationReport
          rows={[
            ['W', 88, 97, 93, 409],
            ['REM', 53, 100, 69, 100],
            ['N1', 65, 35, 45, 183],
            ['N2', 75, 77, 76, 405],
            ['N3', 100, 34, 51, 91],
            ['Accuracy', '', '', 76, 1188],
          ]}
        />
        <h3 className="mt-5">Classifier's accuracy according to the electrophysiologist (kappa;0.8310)</h3>
        <D3Component
          callback={(svg, data) => createComparativeHypnogram(svg, data, ['Classifier', 'Electrophysiologist'])}
          data={[predictedWilliamCyton.epochs, electrophysiologistWilliamCyton.epochs]}
        />
        <ClassificationReport
          rows={[
            ['W', 100, 97, 98, 379],
            ['REM', 84, 82, 83, 200],
            ['N1', 30, 12, 17, 58],
            ['N2', 79, 90, 84, 353],
            ['N3', 89, 91, 90, 242],
            ['Accuracy', '', '', 87, 1232],
          ]}
        />
        <h3 className="mt-5">Electrophysiologist and Sleep-EDF's agreement (kappa:0.6315)</h3>
        <D3Component
          callback={(svg, data) => createComparativeHypnogram(svg, data, ['Electrophysiologist', 'Sleep-EDF'])}
          data={[electrophysiologistWoman78yoSleepEDF.epochs, physionetWoman78yoSleepEDF.epochs]}
        />
        <ClassificationReport
          rows={[
            ['W', 87, 100, 93, 409],
            ['REM', 73, 100, 84, 100],
            ['N1', 52, 46, 49, 183],
            ['N2', 67, 70, 69, 405],
            ['N3', 0, 0, 0, 91],
            ['Accuracy', '', '', 74, 1188],
          ]}
        />
      </Container>
    </div>
  );
};

export default Performance;
