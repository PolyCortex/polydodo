import * as d3 from "d3";
import tip from "d3-tip";
import _ from "lodash";

import {
  createColorScale,
  domainX,
  domainY,
  convertSource,
  createSources,
  calculateStagesPortion,
  findFirstStageIndex,
} from "./preproc";
import { barLegend } from "./legend";
import {
  createStackedBarChart,
  getToolTipText,
  getStackedToolTipText,
} from "./stages-charts";
import { addTransitions } from "./transition";
import { STATES_ORDERED, WIDTH, HEIGHT, MARGIN } from "./constants";
import { STATES } from "../constants";

const initializeScales = () => {
  const x = d3.scaleTime().range([0, WIDTH]);
  const y = d3
    .scaleOrdinal()
    .range(_.range(0, HEIGHT + 1, HEIGHT / STATES.length));

  return { x, y };
};

const initializeAxes = (x, y) => {
  const xAxis = d3.axisBottom(x).tickFormat((d) => `${d.getHours()}h`);
  const yAxis = d3.axisLeft().scale(y).tickSize(-WIDTH); //will create the lines in second visualisation

  return { xAxis, yAxis };
};

const createDrawingGroup = (svg, { LEFT, TOP }) => {
  return svg.append("g").attr("transform", `translate(${LEFT}, ${TOP})`);
};

const initializeBarChart = async (svg, data) => {
  const barHeight = Math.round(HEIGHT / STATES.length);

  const { x, y } = initializeScales();
  const { xAxis, yAxis } = initializeAxes(x, y);
  const gBarChart = createDrawingGroup(svg, MARGIN);

  var totalTimeStamp = data.length;
  var tooltip = tip().attr("class", "d3-tip").offset([-10, 0]);

  var tipStacked = tip().attr("class", "d3-tip").offset([-10, 0]);

  const color = createColorScale();
  convertSource(data);

  var sources = createSources(data, STATES, STATES_ORDERED);

  //For visualisation 3
  var totalStagesPortion = calculateStagesPortion(data, STATES, STATES_ORDERED);
  var firstStagesIndex = findFirstStageIndex(sources);

  domainX(x, data);
  domainY(y, STATES_ORDERED);

  createStackedBarChart(gBarChart, sources, x, color, tooltip, barHeight);

  var gSecondBarChart = svg
    .append("g")
    .attr(
      "transform",
      "translate(" + MARGIN.LEFT + "," + (2 * MARGIN.TOP + barHeight) + ")"
    );

  var gThirdBarChart = svg
    .append("g")
    .attr(
      "transform",
      "translate(" + MARGIN.LEFT + "," + (3 * MARGIN.TOP + 2 * barHeight) + ")"
    );

  addTransitions(
    gBarChart,
    gSecondBarChart,
    gThirdBarChart,
    sources,
    color,
    barHeight,
    barHeight,
    WIDTH,
    tipStacked,
    xAxis,
    yAxis,
    firstStagesIndex,
    totalStagesPortion,
    totalTimeStamp
  );
  // Axes
  gBarChart
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + barHeight + ")")
    .call(xAxis);

  //get tick
  d3.selectAll(".tick").select("text").style("font-weight", 540);

  tooltip.html(function (d) {
    return getToolTipText.call(this, d);
  });
  svg.call(tooltip);

  tipStacked.html(function (d) {
    return getStackedToolTipText.call(
      this,
      d,
      totalStagesPortion,
      totalTimeStamp
    );
  });
  svg.call(tipStacked);

  barLegend(svg, STATES, color);
};

export default initializeBarChart;
