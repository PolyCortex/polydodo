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
          This page aims to illustrate the performance of our sleep scoring algorithm compared to professional manual
          scoring, which is considered the gold standard in sleep stage scoring. If you want to learn more about how
          we've defined our sleep scoring algorithm, please either refer to our presentation video in our home page, or
          to our{' '}
          <a href="https://github.com/PolyCortex/polydodo/wiki/Model" target="_blank" rel="noreferrer">
            wiki
          </a>
          .
        </p>
        <p className="lead">
          In summary, we will look at our classifier's performance against three different point of view, as described
          here;
        </p>
        <ul>
          <li>First, we will check how our classifier’s labels agree with the labels scored within our dataset.</li>
          <li>
            Then, we will check how this classifier performs on a full night recorded on one of our members. It is the
            night displayed in preview mode. In order to be able to make comparisons, we asked for the help of a medical
            electrophysiologist to score our data. This manual scoring will serve as reference to get an idea of the
            accuracy of our model on data acquired using an OpenBCI under non-clinical conditions.
          </li>
          <li>
            Finally, we will present the scoring differences between the medical electrophysiologist and our dataset. To
            do this, we will take a random night in our dataset. This will allow us to qualify somewhat the previous
            results and maybe get an idea of the usual agreement level between professional scorers.
          </li>
        </ul>
        <p className="lead">
          We will finally cover the limitations of our current sleep staging model and further work to be done in order
          to improve our results.
        </p>
        <h3 className="my-5">Model training and selection</h3>
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
          The test set, on which these metrics were calculated, is composed of randomly chosen subjects from different
          ages groups (a 33 year old female, a 54 year old female, a 67 year old female and a 88 year old male), so that
          the obtained score is the most representative of our ability to classify sleep, no matter the age.
          {/* On another side, we could compare the results obtained to the ones found in the litterature. To do so, we had to find a
          paper that uses the same dataset, the same metric and that splits their dataset in a similar fashion as
          ours.TODO. */}
        </p>
        <p>
          Although we obtain good results, it didn't quite validate that our classifier could accurately score OpenBCI
          data into sleep stages. After all, we only validated on data coming from the same acquisition hardware than
          the data we've trained on, which is not the case when we analyze data submitted in the application. We then
          had to make our own polysomnographic dataset based on the hardware we use, namely an OpenBCI board.
        </p>
        <h3 className="my-5">Manual scoring of OpenBCI data and comparison to our classifier</h3>
        <p>
          As we had limited resources, we had in mind to create a small dataset of two manually scored night's of sleep,
          based on biosginals acquired with OpenBCI Cyton boards. Due to a technical problem that occured while
          recording one of them, we only had one night of sleep scored. The subject is one of our team member, William,
          who turned exactly 23 years old on the night of the recording 🥳. Afterwards, Alexandra, the
          electrophysiologist with who this part of the project was realized, manually scored the night of sleep based
          on the signals from the EEG channels, namely Fpz-Cz and Pz-Oz, the EOG channel and the EMG channel. We finally
          compared the scoring made by our classifier, which we recall has been trained on the SleepEDF dataset, and the
          scoring made by Alexandra.&nbsp;
          <strong>
            We obtained a Cohen's Kappa agreement score of <span className="text-primary">0.8310</span>!
          </strong>{' '}
          Let's see below how the scorings compare in a hypnogram.
        </p>
        <h3 className="mt-5">Classifier's accuracy according to the electrophysiologist</h3>
        <D3Component
          callback={(svg, data) => createComparativeHypnogram(svg, data, ['Classifier', 'Electrophysiologist'])}
          data={[predictedWilliamCyton.epochs, electrophysiologistWilliamCyton.epochs]}
        />
        <p className="my-5">
          The results are quite similar! Below are the other metrics describing the differences in the classification of
          William's night.
        </p>
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
        <p className="mt-5">
          So, we have been able to verify that, indeed, our automatic sleep stage classifier could accurately score EEG
          data acquired from an OpenBCI Cyton. Of course, we only verified on one night of sleep, and on a single
          subject. In the future, it would be interesting to test our classifier on subjects of different age and sex.
          Also, <strong>we did not tested on OpenBCI Ganglion boards</strong>, and it would be really helpful to be able
          to certify, in the same maner as we did for the Cyton, that the classification works also accurately on this
          board.
        </p>
        <h3 className="mt-5">Inter-scorer agreement based on a night from our dataset</h3>
        <p className="mt-5">
          As it is stated in{' '}
          <q>The American Academy of Sleep Medicine Inter-scorer Reliability Program: Sleep Stage Scoring</q>, written
          by R. Rosenberg, manual sleep stage agreement averaged 82.6% when scorers based their analysis on the AASM's
          scoring manual [R. Rosenberg, 2013]. Based on that statistic, we were curious to see how the classification
          made by Alexandra compares to the classification found in our dataset. As we've already mentionned, we were
          expecting some differences, as the scoring is based on two different manuals (see our further developmnent
          section below).
        </p>
        <p className="mt-5">
          We then randomly selected a night of sleep within our dataset and asked Alexandra to score it. The selected
          subject is a 74 year old woman. You can see below the differences between both classification. The Cohen's
          Kappa agreement score is of{' '}
          <strong>
            <span className="text-primary">0.6315</span>
          </strong>
          .
        </p>
        <h3 className="mt-5">Electrophysiologist and Sleep-EDF's agreement (kappa:0.6315)</h3>
        <D3Component
          callback={(svg, data) => createComparativeHypnogram(svg, data, ['Electrophysiologist', 'Sleep-EDF'])}
          data={[electrophysiologistWoman78yoSleepEDF.epochs, physionetWoman78yoSleepEDF.epochs]}
        />
        <p className="my-5">
          The main differences can be seen at the N3 sleep stage level, as no epochs were tagged as N3 by our
          electrophysiologist. She'd explain to us, in an{' '}
          <a
            href="https://drive.google.com/file/d/11RgOksnavKMp8yMRKy4wE2_9ebyXXhmw/view?usp=sharing"
            target="_blank"
            rel="noreferrer"
          >
            interview you can view here
          </a>{' '}
          (in french only), that no epochs filled the N3 sleep stage conditions. It may be explained by the fact that
          the scoring manual used is different.
        </p>
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
        <p className="my-5">
          And what if we looked at the automatic sleep classification of the same subject? We then reused the same model
          description, trained on all the dataset's recording except for the randomly selected recording, and looked at
          the results. The Cohen's Kappa agreement score is of{' '}
          <strong>
            <span className="text-primary">0.6709</span>
          </strong>
          .
        </p>
        <h3 className="mt-5">Classifier's accuracy according to Sleep-EDF</h3>
        <D3Component
          callback={(svg, data) => createComparativeHypnogram(svg, data, ['Classifier', 'Sleep-EDF'])}
          data={[predictedWoman78yoSleepEDF.epochs, physionetWoman78yoSleepEDF.epochs]}
        />
        <p className="my-5">
          We can see that some differences between the automatic classification and SleepEDF's are the same as
          Alexandra's. Per example, near the end of the night, both Alexandra and the automatic scoring model classified
          N2 instead of N1. On another note, we can see that the obtained Cohen's Kappa agreement score is less than the
          one obtained for our test set above, which was 0.741. We can then reasonably assume that this night of sleep
          may be hard to conclude on.
        </p>
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
        <h3 className="my-5">Limitations and further development</h3>
        <p>
          If we take a step back and look at the main differences between the automatic and manual scoring that
          Alexandra did, there's notably the manual used for the classification. Indeed, the dataset we've used to train
          our model contains sleep stages classification based on the 1968 Rechtschaffen and Kales manual, whereas
          Alexandra, of course, used the most recent manual scoring guide, whereas the American Academy of Sleep
          Medicine Manual for the Scoring of Sleep and Assoicated Events. In order to output AASM's sleep stages instead
          of R&K's sleep stages, we've merged both Sleep Stage 3 and 4 together. Further work could be done to either
          look at the litterature to see if there's a better way to translate R&K's sleep stages into AASM's sleep
          stages. Even better, it would be to train on labels scored based on the latest AASM's sleep stages. We have
          considered more recent datasets, such as{' '}
          <a href="http://www.ceams-carsm.ca/mass" target="_blank" rel="noreferrer">
            the Montreal Archive of Sleep Studies (MASS)
          </a>
          , but it involved having a complete accreditation coming from an ethic board.
        </p>
        <p>
          Furthermore, as we've already mentionned, we would also like to test our automatic sleep stage scoring based
          on OpenBCI Ganglion board's data, by comparing it to manual scoring. It could also be interesting to test on
          subjects of different age groups and sex.
        </p>
        <p className="mb-5">
          Finally, in terms of the explored machine learning models, we've mostly looked at classic statistical models,
          and have not exhaustively looked at deep learning algorithms. We did look at the differences between manual
          feature extraction and representation learning, through a CNN (we've written{' '}
          <a
            href="https://drive.google.com/file/d/1Td3NE207KiSkJ6xJxsKN1TkvLNXsNXrl/view?usp=sharing"
            target="_blank"
            rel="noreferrer"
          >
            an article
          </a>{' '}
          about the results we've obtained, which currently is in french only). Since we were limited in both time and
          in hardware, we only trained on a few subjects. Also, considering that the dependancy of sleep stages over
          time is quite important, we could greatly improve our model by exploring recurrent neural networks (RNN) or
          long short term memory (LSTM) networks.
        </p>
      </Container>
    </div>
  );
};

export default Performance;
