import tip from 'd3-tip';
import './style.css';

import { EPOCH_DURATION_MS } from '../constants';
import { DateTime, Duration } from 'luxon';

export const initializeTooltips = (svg, data) => {
  const barToolTip = initializeTooltip(svg, getBarToolTipText);
  const stackedToolTip = initializeTooltip(svg, (d) =>
    getStackedToolTipText(d, data.stageTimeProportions, data.epochs.length),
  );

  return { barToolTip, stackedToolTip };
};

const initializeTooltip = (svg, getToolTipText) => {
  const tooltip = tip().attr('class', 'evolving_chart__tooltip').offset([-10, 0]);
  svg.call(tooltip);
  tooltip.html(getToolTipText);

  return tooltip;
};

const getBarToolTipText = (d) => `Stage : <strong> ${d.stage} </strong> <br>
            Range  :  <strong> ${DateTime.fromJSDate(d.start).toFormat('hh:mm:ss')} </strong>
              - <strong> ${DateTime.fromJSDate(d.end).toFormat('hh:mm:ss')} </strong> <br>
            Duration: <strong> ${DateTime.fromJSDate(d.end)
              .diff(DateTime.fromJSDate(d.start))
              .toFormat('hh:mm:ss')} </strong>`;

const getStackedToolTipText = (d, stageTimeProportions, nbEpochs) =>
  `Stage : <strong> ${d.stage} </strong><br>  Duration : <strong> ${Duration.fromMillis(
    stageTimeProportions[d.stage] * nbEpochs * EPOCH_DURATION_MS,
  ).toFormat('hh:mm:ss')} </strong><br>`;
