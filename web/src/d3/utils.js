import _ from 'lodash';

import { EPOCH_DURATION_SEC } from './constants';

export const convertAPIFormatToCSVFormat = (epochs) =>
  _.zip(epochs.timestamps, epochs.stages).map((el) => Object({ timestamp: el[0], sleepStage: el[1] }));

export const convertTimestampsToDates = (data) =>
  data.map((row) =>
    Object({
      ...row,
      timestamp: parseTimestampToDate(row.timestamp),
    }),
  );

export const convertEpochsToAnnotations = (data) => {
  // Epochs (original data format):
  //    Epochs are equal-length spans of data extracted from raw continuous data [from MNE library glossary].
  //    In our case, each epoch corresponds to a 30s portion of the night with its corresponding sleep stage label.
  // Annotations (destination data format):
  //    An annotation is defined by an onset, a duration, and a string description [from MNE library glossary].
  //    In our case, an annotation is a contiguous period of the night where a subject stayed in the same sleep stage.

  const annotations = [];
  const nbEpochs = data.length;
  let currentAnnotationStart = data[0].timestamp;
  let currentSleepStage = data[0].sleepStage;
  let currentAnnotationEpochCount = 0;

  const isSleepStageTransition = (sleepStage, index) => sleepStage !== currentSleepStage || index === data.length - 1;

  const saveCurrentAnnotation = (timestamp) => {
    annotations.push({
      stage: currentSleepStage,
      proportion: currentAnnotationEpochCount / nbEpochs,
      start: currentAnnotationStart,
      end: timestamp,
      duration: currentAnnotationEpochCount * EPOCH_DURATION_SEC,
    });
  };

  data.forEach(({ timestamp, sleepStage }, index) => {
    currentAnnotationEpochCount++;

    if (isSleepStageTransition(sleepStage, index)) {
      saveCurrentAnnotation(timestamp);
      currentAnnotationStart = timestamp;
      currentSleepStage = sleepStage;
      currentAnnotationEpochCount = 0;
    }
  });

  return annotations;
};

const parseTimestampToDate = (timestamp) => {
  // To convert UNIX timestamp to JS Date, we have to convert number of seconds to milliseconds.
  const date = new Date(timestamp * 1000);
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDay(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
};
