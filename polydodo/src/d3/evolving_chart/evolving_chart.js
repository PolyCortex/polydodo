import * as d3 from "d3";
import _ from "lodash";

import { setDomainOnScales, preprocessData } from "./preproc";
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

const createEvolvingChart = (containerNode, data) => {
  const svg = d3
    .select(containerNode)
    .attr("width", CANVAS_WIDTH)
    .attr("height", CANVAS_HEIGHT);
  const { x, y, colors } = initializeScales();
  const { xAxis, yAxis } = initializeAxes(x, y);
  const gBarChart = createDrawingGroup(svg);

  data = preprocessData(data);

  setDomainOnScales(x, y, colors, data.epochs);
  const { barToolTip, stackedToolTip } = initializeTooltips(svg, data);
  createTimelineChart(gBarChart, data.annotations, x, colors, barToolTip);

  addTransitions(
    gBarChart,
    data.annotations,
    colors,
    stackedToolTip,
    x,
    xAxis,
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
    .call(xAxis);

  //get tick
  d3.selectAll(".tick").select("text").style("font-weight", 540);

  barLegend(svg, colors);
};

export default createEvolvingChart;
