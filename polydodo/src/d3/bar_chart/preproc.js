import { STAGES, STAGES_ORDERED } from "../constants";

export const setDomainOnScales = (x, y, colors, data) => {
  x.domain([data[0].timestamp, data[data.length - 1].timestamp]);
  y.domain(STAGES);
  colors.domain(STAGES);
};

export const convertEpochsToAnnotations = (data) => {
  const annotations = [];
  const nbEpochs = data.length - 1;
  let currentAnnotationStart = data[0].timestamp;
  let currentSleepStage = data[0].sleepStage;
  let currentProportion = 0;

  const isNextAnnotation = (sleepStage, index) =>
    sleepStage !== currentSleepStage || index === data.length - 1;

  const saveCurrentAnnotation = (timestamp) => {
    annotations.push({
      stage: STAGES_ORDERED.indexOf(STAGES[currentSleepStage]),
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

//Calculate the total portion of each sleep stage (for Viz 3)
export const calculateStagesPortion = (data) => {
  var stageProportionCounts = [0, 0, 0, 0, 0];
  var totalTimestamp = data.length;
  //lets find how much % of the night does all stages have
  data.forEach((row) => {
    ++stageProportionCounts[STAGES_ORDERED.indexOf(STAGES[row.sleepStage])];
  });

  stageProportionCounts.forEach((proportion, i) => {
    stageProportionCounts[i] = proportion / totalTimestamp;
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
