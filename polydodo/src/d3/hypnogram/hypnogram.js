import * as d3 from "d3";
import _ from "lodash";

import {
  convertTimestampsToDates,
  convertValuesToLabels,
  convertSources,
  domainX,
  domainY,
  domainColor,
} from "./preproc";
import {
  createLine,
  createHypnogramChart,
  createAxes,
  createTitle,
  createLegend,
} from "./line-charts";
import { createMouseOver } from "./mouse-over";
import { STATES } from "../constants";

const MARGINS = {
  top: 100,
  right: 10,
  bottom: 70,
  left: 70,
};

const DIMENSIONS = {
  width: 1000 - MARGINS.left - MARGINS.right,
  height: 400 - MARGINS.top - MARGINS.bottom,
};

const COLORS = {
  Classifier: "#efce31",
  "Sleep-EDF": "#006aff",
  Electrophysiologist: "#ff7575",
};

const preprocessData = (data, hypnogramNames) => {
  data = convertTimestampsToDates(data);
  data = convertValuesToLabels(data);
  return convertSources(data, hypnogramNames);
};

const initializeScales = () => {
  const x = d3.scaleTime().range([0, DIMENSIONS.width]);
  const y = d3
    .scaleOrdinal()
    .range(
      _.range(0, DIMENSIONS.height + 1, DIMENSIONS.height / STATES.length)
    );

  return { x, y };
};

const initializeAxes = (x, y) => {
  const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat('%H:%M'));
  const yAxis = d3.axisLeft().scale(y);

  return { xAxis, yAxis };
};

const createDrawingGroup = (svg) =>
  svg
    .append("g")
    .attr("transform", `translate(${MARGINS.left}, ${MARGINS.top})`);

const createHypnogram = (
  containerNode,
  data,
  chartTitle,
  hypnogramNames,
  comparativeColors
) => {
  const svg = d3
    .select(containerNode)
    .attr("width", DIMENSIONS.width + MARGINS.left + MARGINS.right)
    .attr("height", DIMENSIONS.height + MARGINS.top + MARGINS.bottom);
  const { x, y } = initializeScales();
  const { xAxis, yAxis } = initializeAxes(x, y);
  const g = createDrawingGroup(svg);
  const line = createLine(x, y);

  data = preprocessData(data, hypnogramNames);

  domainX(x, data);
  domainY(y);
  const colorDomain = domainColor(data, comparativeColors);

  const g_chart = createHypnogramChart(g, data, line, colorDomain);
  createMouseOver(g_chart, x, y, data, MARGINS, DIMENSIONS, colorDomain);
  createAxes(g, xAxis, yAxis, DIMENSIONS, MARGINS);
  createTitle(g, chartTitle, DIMENSIONS, MARGINS);
  createLegend(g, hypnogramNames, comparativeColors, DIMENSIONS, MARGINS);
};

export const createSingleHypnogram = (containerNode, data) => {
  const chartTitle = "Hypnogram";
  const hypnogramNames = ["Classifier"];
  const comparativeColors = [COLORS.Classifier];

  createHypnogram(
    containerNode,
    data,
    chartTitle,
    hypnogramNames,
    comparativeColors
  );
};

export const createComparativeHypnogram = (
  containerNode,
  data,
  hypnogramNames
) => {
  const chartTitle = `Agreement between ${hypnogramNames[0]} and ${hypnogramNames[1]}`;
  const comparativeColors = hypnogramNames.map((x) => COLORS[x]);

  createHypnogram(containerNode, data, chartTitle, hypnogramNames, comparativeColors);
};
