import tip from "d3-tip";

import {
  addZero,
  getDurationString,
  getDurationSecondString,
} from "../duration";
import { STAGES_ORDERED, EPOCH_DURATION_SEC } from "../constants";

export const initializeTooltip = (svg, data) => {
  const tooltip = tip().attr("class", "d3-tip").offset([-10, 0]);
  const tipStacked = tip().attr("class", "d3-tip").offset([-10, 0]);

  tooltip.html((d) => getToolTipText.call(this, d));
  svg.call(tooltip);
  svg.call(tipStacked);

  tipStacked.html((d) =>
    getStackedToolTipText.call(
      this,
      d,
      data.stageTimeProportions,
      data.epochs.length
    )
  );

  return { tooltip, tipStacked };
};

const getToolTipText = (d) => {
  const h = addZero(d.start.getHours());
  const m = addZero(d.start.getMinutes());
  const s = addZero(d.start.getSeconds());
  const hf = addZero(d.end.getHours());
  const mf = addZero(d.end.getMinutes());
  const sf = addZero(d.end.getSeconds());
  const hourDiff = (d.end - d.start) / 3.6e6; //in ms

  return `Stage : <strong> ${STAGES_ORDERED[d.stage]} </strong> <br>
            Range  :  <strong> ${h}:${m}:${s} </strong>
              - <strong> ${hf}:${mf}:${sf} </strong> <br>
            Duration: <strong> ${getDurationString(hourDiff)} </strong>`; //TO DO ADD HOURS
};

const getStackedToolTipText = (d, stageTimeProportions, nbEpochs) =>
  `Stage : <strong> ${
    STAGES_ORDERED[d.stage]
  } </strong><br>  Duration : <strong> ${getDurationSecondString(
    stageTimeProportions[d.stage] * nbEpochs * EPOCH_DURATION_SEC
  )} </strong><br>`;
