import * as d3 from 'd3';

import { EPOCH_DURATION_MS, STAGES_LABELS_TO_DISPLAY } from '../constants';
import { DateTime, Duration } from 'luxon';

export const initializeTooltips = (containerNode, data) => {
  const stackedToolTip = initializeTooltip(containerNode, (d) =>
    getStackedToolTipText(d, data.stageTimeProportions, data.epochs.length),
  );
  const barToolTip = initializeTooltip(containerNode, getBarToolTipText);

  return { barToolTip, stackedToolTip };
};

const initializeTooltip = (containerNode, getToolTipText) => {
  var tooltip = d3
    .select(containerNode)
    .append('div')
    .attr('class', 'tooltip')
    .attr('border-radius', '2px')
    .style('background-color', 'rgba(235, 235, 235, 0.9)')
    .style('opacity', 0)
    .style('position', 'absolute');
  var tooltipText = tooltip.append('div').style('padding', '1em').style('font-size', '1em');

  var mouseover = (d) => {
    tooltip.style('opacity', 1);
  };
  var mousemove = function (d, mouse, yPosition) {
    // localize d3.mouse into viewbox: https://stackoverflow.com/a/11936865
    tooltip.style('opacity', 1).style('left', `${mouse[0]}px`).style('top', yPosition);
    tooltipText.html(() => getToolTipText(d));
  };
  var mouseleave = function () {
    tooltip.style('opacity', 0).style('left', `0px`).style('top', '0px');
  };

  return { mouseover, mousemove, mouseleave };
};

const getBarToolTipText = (d) => `Stage : <strong> ${STAGES_LABELS_TO_DISPLAY[d.stage]} </strong> <br>
            Range  :  <strong> ${DateTime.fromJSDate(d.start).toFormat('hh:mm:ss')} </strong>
              - <strong> ${DateTime.fromJSDate(d.end).toFormat('hh:mm:ss')} </strong> <br>
            Duration: <strong> ${DateTime.fromJSDate(d.end)
              .diff(DateTime.fromJSDate(d.start))
              .toFormat('hh:mm:ss')} </strong>`;

const getStackedToolTipText = (d, stageTimeProportions, nbEpochs) =>
  `Stage : <strong> ${STAGES_LABELS_TO_DISPLAY[d.stage]} </strong><br>  Duration : <strong> ${Duration.fromMillis(
    stageTimeProportions[d.stage] * nbEpochs * EPOCH_DURATION_MS,
  ).toFormat('hh:mm:ss')} </strong><br>`;
