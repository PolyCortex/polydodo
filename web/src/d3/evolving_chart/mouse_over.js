import * as d3 from 'd3';
import './style.css';

import { EPOCH_DURATION_MS } from '../constants';
import { DateTime, Duration } from 'luxon';

export const initializeTooltips = (containerNode, data) => {
  // const barToolTip = initializeTooltip(svg, getBarToolTipText);
  // const stackedToolTip = initializeTooltip(svg, (d) =>
  //   getStackedToolTipText(d, data.stageTimeProportions, data.epochs.length),
  // );
  const barToolTip = initializeTooltip(containerNode, getBarToolTipText);

  return { barToolTip, stackedToolTip: barToolTip };
};

// const initializeTooltip = (svg, getToolTipText) => {
//   const tooltip = tip().attr('class', 'evolving_chart__tooltip').offset([-10, 0]);
//   svg.call(tooltip);
//   tooltip.html(getToolTipText);

//   return tooltip;
// };

const initializeTooltip = (containerNode, getToolTipText) => {
  // const tooltip = tip().attr('class', 'evolving_chart__tooltip').offset([-10, 0]);
  // svg.call(tooltip);
  // tooltip.html(getToolTipText);
  var tooltip = d3.select(containerNode).append('div').style('opacity', 1).style('position', 'absolute').html('fsfse');

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function (d) {
    tooltip.html('fsdisdfjisjie').style('opacity', 1).attr('class', 'tooltip');
  };
  var mousemove = function (d, mouse) {
    tooltip
      .html('fsdisdfjisjifjejiw deewf wedwejie')
      // .html(getToolTipText(d))
      .style('left', mouse[0] + 70 + 'px')
      .style('top', mouse[1] + 'px');
  };
  var mouseleave = function () {
    tooltip.style('opacity', 0);
  };

  return { mouseover, mousemove, mouseleave };
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
