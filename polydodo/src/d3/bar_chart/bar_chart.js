import * as d3 from "d3";
import tip from "d3-tip";
import _ from "lodash";

import {
  setDomainOnScales,
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
} from "./stages_charts";
import { addTransitions } from "./transition";
import {
  STATES_ORDERED,
  WIDTH,
  HEIGHT,
  MARGIN,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  BAR_HEIGHT,
} from "./constants";
import { STATES, STATE_TO_COLOR } from "../constants";

const initializeScales = () => {
  const x = d3.scaleTime().range([0, WIDTH]);
  const y = d3.scaleOrdinal().range(_.range(0, HEIGHT + 1, BAR_HEIGHT));
  const colors = d3.scaleOrdinal().range(STATES.map((x) => STATE_TO_COLOR[x]));

  return { x, y, colors };
};

const initializeAxes = (x, y) => {
  const xAxis = d3.axisBottom(x).tickFormat((d) => `${d.getHours()}h`);
  const yAxis = d3.axisLeft(y).tickSize(-WIDTH); //will create the lines in second visualisation

  return { xAxis, yAxis };
};

const createDrawingGroup = (svg, { LEFT, TOP }) => {
  return svg.append('g').attr('transform', `translate(${LEFT}, ${TOP})`);
};

const createBarChart = (containerNode, data) => {
  const svg = d3
    .select(containerNode)
    .attr("width", CANVAS_WIDTH)
    .attr("height", CANVAS_HEIGHT);

  const { x, y, colors } = initializeScales();
  const { xAxis, yAxis } = initializeAxes(x, y);
  const gBarChart = createDrawingGroup(svg, MARGIN);

  const tooltip = tip().attr("class", "d3-tip").offset([-10, 0]);
  const tipStacked = tip().attr("class", "d3-tip").offset([-10, 0]);

  tooltip.html((d) => getToolTipText.call(this, d));
  svg.call(tooltip);
  svg.call(tipStacked);

  tipStacked.html((d) =>
    getStackedToolTipText.call(this, d, totalStagesPortion, data.length)
  );

  convertSource(data);

  const sources = createSources(data, STATES, STATES_ORDERED);

  //For visualisation 3
  const totalStagesPortion = calculateStagesPortion(
    data,
    STATES,
    STATES_ORDERED
  );
  const firstStagesIndex = findFirstStageIndex(sources);

  setDomainOnScales(x, y, colors, data);
  createStackedBarChart(gBarChart, sources, x, colors, tooltip, BAR_HEIGHT);

  const gSecondBarChart = svg
    .append("g")
    .attr(
      "transform",
      `translate(${MARGIN.LEFT}, ${2 * MARGIN.TOP + BAR_HEIGHT})`
    );

  const gThirdBarChart = svg
    .append("g")
    .attr(
      "transform",
      `translate(${MARGIN.LEFT}, ${3 * MARGIN.TOP + 2 * BAR_HEIGHT})`
    );

  addTransitions(
    gBarChart,
    gSecondBarChart,
    gThirdBarChart,
    sources,
    colors,
    BAR_HEIGHT,
    WIDTH,
    tipStacked,
    xAxis,
    yAxis,
    firstStagesIndex,
    totalStagesPortion,
    data.length
  );
  // Axes
  gBarChart
    .append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${BAR_HEIGHT})`)
    .call(xAxis);

  //get tick
  d3.selectAll('.tick').select('text').style('font-weight', 540);

  barLegend(svg, STATES, colors);
};

export default createBarChart;
