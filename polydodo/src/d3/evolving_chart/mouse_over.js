import tip from "d3-tip";
import moment from "moment";

import { EPOCH_DURATION_MS } from "../constants";

export const initializeTooltips = (svg, data) => {
  const barToolTip = initializeTooltip(svg, getBarToolTipText);
  const stackedToolTip = initializeTooltip(svg, (d) =>
    getStackedToolTipText(d, data.stageTimeProportions, data.epochs.length)
  );

  return { barToolTip, stackedToolTip };
};

const initializeTooltip = (svg, getToolTipText) => {
  const tooltip = tip().attr("class", "d3-tip").offset([-10, 0]);
  svg.call(tooltip);
  tooltip.html(getToolTipText);

  return tooltip;
};

const getBarToolTipText = (d) => {
  return `Stage : <strong> ${d.stage} </strong> <br>
            Range  :  <strong> ${moment(d.start).format("HH:mm:ss")} </strong>
              - <strong> ${moment(d.end).format("HH:mm:ss")} </strong> <br>
            Duration: <strong> ${moment
              .utc(moment(d.end).diff(d.start))
              .format("HH:mm:ss")} </strong>`;
};

const getStackedToolTipText = (d, stageTimeProportions, nbEpochs) =>
  `Stage : <strong> ${d.stage} </strong><br>  Duration : <strong> ${moment
    .utc(stageTimeProportions[d.stage] * nbEpochs * EPOCH_DURATION_MS)
    .format("HH:mm:ss")} </strong><br>`;
