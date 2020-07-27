import _ from "lodash";

import { convertTimestampsToDates } from "../utils";
import { STAGES_ORDERED, EPOCH_DURATION_SEC } from "../constants";

export const setDomainOnScales = (x, y, colors, data) => {
  x.domain([data[0].timestamp, data[data.length - 1].timestamp]);
  y.domain(STAGES_ORDERED);
  colors.domain(STAGES_ORDERED);
};

export const preprocessData = (data) => {
  data = convertTimestampsToDates(data);
  const annotations = convertEpochsToAnnotations(data);
  const stageTimeProportions = getStageTimeProportions(data);
  const firstStageIndexes = findFirstStageIndex(annotations);

  return {
    epochs: data,
    annotations,
    stageTimeProportions,
    firstStageIndexes,
  };
};

const convertEpochsToAnnotations = (data) => {
  const annotations = [];
  const nbEpochs = data.length;
  let currentAnnotationStart = data[0].timestamp;
  let currentSleepStage = data[0].sleepStage;
  let currentAnnotationEpochCount = 0;

  const isNextAnnotation = (sleepStage, index) =>
    sleepStage !== currentSleepStage || index === data.length - 1;

  const saveCurrentAnnotation = (timestamp) => {
    annotations.push({
      stage: STAGES_ORDERED.indexOf(currentSleepStage),
      proportion: (currentAnnotationEpochCount / nbEpochs) * 100,
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

const getStageTimeProportions = (data) => {
  const nbEpochPerSleepStage = _.countBy(data.map((x) => x.sleepStage));
  const proportionPerSleepStage = _.mapValues(
    nbEpochPerSleepStage,
    (countPerStage) => countPerStage / data.length
  );

  return STAGES_ORDERED.map((stage) => proportionPerSleepStage[stage]);
};

//Finds the index of the first element of each sleep stage (for Viz 3)
const findFirstStageIndex = (annotations) =>
  STAGES_ORDERED.map((_, i) =>
    annotations.findIndex((element) => element.stage === i)
  );
