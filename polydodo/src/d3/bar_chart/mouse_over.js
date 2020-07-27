import tip from "d3-tip";

import {
  addZero,
  getDurationString,
  getDurationSecondString,
} from "../duration";
import { STAGES_ORDERED } from "../constants";

export const initializeTooltip = (svg, totalStagesPortion, data) => {
  const tooltip = tip().attr("class", "d3-tip").offset([-10, 0]);
  const tipStacked = tip().attr("class", "d3-tip").offset([-10, 0]);

  tooltip.html((d) => getToolTipText.call(this, d));
  svg.call(tooltip);
  svg.call(tipStacked);

  tipStacked.html((d) =>
    getStackedToolTipText.call(this, d, totalStagesPortion, data.length)
  );

  return { tooltip, tipStacked };
};

const getToolTipText = (d) => {
  const h = addZero(d.start.getHours());
  const m = addZero(d.start.getMinutes());
  const hf = addZero(d.end.getHours());
  const mf = addZero(d.end.getMinutes());
  let hourDiff = d.end - d.start; //in ms

  hourDiff /= 3.6e6; //in h

  return `Stage : <strong> ${STAGES_ORDERED[d.stage]} </strong> <br>
            Début  :  <strong> ${h} h ${m}  </strong>
              -  Fin : <strong> ${hf} h ${mf} </strong> <br>
            Durée: <strong> ${getDurationString(hourDiff)} </strong>`; //TO DO ADD HOURS
};

const getStackedToolTipText = (d, totalStagesPortion, totalTimeStamp) => {
  return `Stage : <strong> ${STAGES_ORDERED[d.stage]} </strong><br> 
            Durée : <strong> ${getDurationSecondString(
              totalStagesPortion[d.stage] * totalTimeStamp * 30
            )} </strong><br>`;
};
