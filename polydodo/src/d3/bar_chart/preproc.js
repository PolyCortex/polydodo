import { STAGES, STAGES_ORDERED } from "../constants";

export const setDomainOnScales = (x, y, colors, data) => {
  x.domain([data[0].timestamp, data[data.length - 1].timestamp]);
  y.domain(STAGES_ORDERED);
  colors.domain(STAGES_ORDERED);
};

export const convertEpochsToAnnotations = (data) => {
  const annotations = [];
  const nbEpochs = data.length;
  let currentAnnotationStart = data[0].timestamp;
  let currentSleepStage = data[0].sleepStage;
  let currentProportion = 0;

  const isNextAnnotation = (sleepStage, index) =>
    sleepStage !== currentSleepStage || index === data.length - 1;

  const saveCurrentAnnotation = (timestamp) => {
    annotations.push({
      stage: STAGES_ORDERED.indexOf(currentSleepStage),
      proportion: (currentProportion / nbEpochs) * 100,
      start: currentAnnotationStart,
      end: timestamp,
    });
  };

  data.forEach(({ timestamp, sleepStage }, index) => {
    currentProportion++;

    if (isNextAnnotation(sleepStage, index)) {
      saveCurrentAnnotation(timestamp);
      currentAnnotationStart = timestamp;
      currentSleepStage = sleepStage;
      currentProportion = 0;
    }
  });

  return annotations;
};

export const calculateStagesProportion = (data) => {
  const stageProportionCounts = [0, 0, 0, 0, 0];

  data.forEach(({ sleepStage }) => {
    ++stageProportionCounts[STAGES_ORDERED.indexOf(sleepStage)];
  });

  stageProportionCounts.forEach((proportion, i) => {
    stageProportionCounts[i] = proportion / data.length;
  });

  return stageProportionCounts;
};

//Finds the index of the first element of each sleep stage (for Viz 3)
export const findFirstStageIndex = (states) => {
  var firstIndexes = [];

  for (let stage = 0; stage < 5; stage++) {
    firstIndexes.push(states.findIndex((element) => element.stage === stage));
  }

  return firstIndexes;
};
