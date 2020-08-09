import * as d3 from "d3";
import _ from "lodash";
import moment from "moment";

import { preprocessData } from "./preproc";
import { barLegend } from "./legend";
import { createTimelineChart } from "./stages_charts";
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
import { initializeTooltips } from "./mouse_over";

const initializeScales = () => {
  const xTime = d3.scaleTime([0, WIDTH]);
  const xLinear = d3.scaleLinear([0, WIDTH]);
  const y = d3.scaleOrdinal(_.range(0, HEIGHT + 1, BAR_HEIGHT));
  const colors = d3.scaleOrdinal(STAGES_ORDERED.map((x) => STAGE_TO_COLOR[x]));

  return { xTime, xLinear, y, colors };
};

export const setDomainOnScales = (xTime, xLinear, y, colors, epochs) => {
  const start = _.first(epochs).timestamp;
  const end = _.last(epochs).timestamp;
  const nightDuration = moment.duration(moment(end).diff(start));

  xTime.domain([start, end]);
  xLinear.domain([0, nightDuration.asHours()]);
  y.domain(STAGES_ORDERED);
  colors.domain(STAGES_ORDERED);
};

const initializeAxes = (xTime, xLinear, y) => {
  const xTimeAxis = d3.axisBottom(xTime).tickFormat((d) => `${d.getHours()}h`);
  const xLinearAxis = d3.axisBottom(xLinear).tickFormat((d) => `${d}h`);
  const yAxis = d3.axisLeft(y).tickSize(-WIDTH); //will create the lines in second visualisation

  return { xTimeAxis, xLinearAxis, yAxis };
};

const createDrawingGroup = (svg) => {
  return svg
    .append("g")
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);
};

const createEvolvingChart = (containerNode, data) => {
  const svg = d3
    .select(containerNode)
    .attr("width", CANVAS_WIDTH)
    .attr("height", CANVAS_HEIGHT);
  const { xTime, xLinear, y, colors } = initializeScales();
  const { xTimeAxis, xLinearAxis, yAxis } = initializeAxes(xTime, xLinear, y);
  const gBarChart = createDrawingGroup(svg);

  data = preprocessData(data);

  setDomainOnScales(xTime, xLinear, y, colors, data.epochs);
  const { barToolTip, stackedToolTip } = initializeTooltips(svg, data);
  createTimelineChart(gBarChart, data.annotations, xTime, colors, barToolTip);

  addTransitions(
    gBarChart,
    data.annotations,
    colors,
    stackedToolTip,
    xTime,
    xTimeAxis,
    xLinearAxis,
    yAxis,
    data.firstStageIndexes,
    data.stageTimeProportions,
    data.epochs.length,
    barToolTip
  );
  // Axes
  gBarChart
    .append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${BAR_HEIGHT})`)
    .call(xTimeAxis);

  //get tick
  d3.selectAll(".tick").select("text").style("font-weight", 540);

  barLegend(svg, colors);
};

export default createEvolvingChart;
