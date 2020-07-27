import * as d3 from "d3";
import _ from "lodash";

import {
  setDomainOnScales,
  convertEpochsToAnnotations,
  calculateStagesProportion,
  findFirstStageIndex,
} from "./preproc";
import { barLegend } from "./legend";
import { createStackedBarChart } from "./stages_charts";
import { addTransitions } from "./transition";
import {
  WIDTH,
  HEIGHT,
  MARGIN,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  BAR_HEIGHT,
} from "./constants";
import { STAGES_ORDERED, STAGE_TO_COLOR } from "../constants";
import { initializeTooltip } from "./mouse_over";
import { convertTimestampsToDates } from "../utils";

const initializeScales = () => {
  const x = d3.scaleTime([0, WIDTH]);
  const y = d3.scaleOrdinal(_.range(0, HEIGHT + 1, BAR_HEIGHT));
  const colors = d3.scaleOrdinal(STAGES_ORDERED.map((x) => STAGE_TO_COLOR[x]));

  return { x, y, colors };
};

const initializeAxes = (x, y) => {
  const xAxis = d3.axisBottom(x).tickFormat((d) => `${d.getHours()}h`);
  const yAxis = d3.axisLeft(y).tickSize(-WIDTH); //will create the lines in second visualisation

  return { xAxis, yAxis };
};

const createDrawingGroup = (svg) => {
  return svg
    .append("g")
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);
};

const createBarChart = (containerNode, data) => {
  const svg = d3
    .select(containerNode)
    .attr("width", CANVAS_WIDTH)
    .attr("height", CANVAS_HEIGHT);
  const { x, y, colors } = initializeScales();
  const { xAxis, yAxis } = initializeAxes(x, y);
  const gBarChart = createDrawingGroup(svg);

  data = convertTimestampsToDates(data);
  const annotations = convertEpochsToAnnotations(data);
  const totalStagesPortion = calculateStagesProportion(data);
  const firstStagesIndex = findFirstStageIndex(annotations);

  setDomainOnScales(x, y, colors, data);
  const { tooltip, tipStacked } = initializeTooltip(
    svg,
    totalStagesPortion,
    data
  );
  createStackedBarChart(gBarChart, annotations, x, colors, tooltip);

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
    annotations,
    colors,
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

  barLegend(svg, colors);
};

export default createBarChart;
