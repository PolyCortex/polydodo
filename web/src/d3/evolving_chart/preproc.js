import _ from 'lodash';

import { convertTimestampsToDates, convertEpochsToAnnotations } from '../utils';
import { STAGES_ORDERED } from '../constants';

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

const getStageTimeProportions = (data) => {
  const nbEpochPerSleepStage = _.countBy(data.map((x) => x.sleepStage));
  const proportionPerSleepStage = _.mapValues(nbEpochPerSleepStage, (countPerStage) => countPerStage / data.length);

  return proportionPerSleepStage;
};

//Finds the index of the first element of each sleep stage (for Viz 3)
const findFirstStageIndex = (annotations) =>
  STAGES_ORDERED.reduce(
    (firstStageIndexes, stage) =>
      Object({
        ...firstStageIndexes,
        [stage]: annotations.findIndex((element) => element.stage === stage),
      }),
    {},
  );
