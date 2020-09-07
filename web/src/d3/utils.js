import { EPOCH_DURATION_SEC } from './constants';

export const convertTimestampsToDates = (data) =>
  data.map((row) =>
    Object({
      ...row,
      timestamp: parseTimestampToDate(row.timestamp),
    }),
  );

export const convertEpochsToAnnotations = (data) => {
  const annotations = [];
  const nbEpochs = data.length;
  let currentAnnotationStart = data[0].timestamp;
  let currentSleepStage = data[0].sleepStage;
  let currentAnnotationEpochCount = 0;

  const isNextAnnotation = (sleepStage, index) =>
    sleepStage !== currentSleepStage || index === data.length - 1;

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

    if (isNextAnnotation(sleepStage, index)) {
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
