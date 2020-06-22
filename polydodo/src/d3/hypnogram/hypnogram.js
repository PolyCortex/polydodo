import * as d3 from "d3";
import _ from "lodash";

import {
  parseTimestampToDate,
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

const initializeScales = ({ width, height }) => {
  const x = d3.scaleTime().range([0, width]);
  const y = d3
    .scaleOrdinal()
    .range(_.range(0, height + 1, height / STATES.length));

  return { x, y };
};

const initializeAxes = (x, y) => {
  const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%H:%M"));
  const yAxis = d3.axisLeft().scale(y);

  return { xAxis, yAxis };
};

const createDrawingGroup = (svg, dimensions, margin) => {
  const { width, height } = dimensions;
  const { left, top, right, bottom } = margin;
  svg.attr("width", width + left + right).attr("height", height + top + bottom);

  const g = svg.append("g").attr("transform", `translate(${left}, ${top})`);

  return g;
};

const createHypnogram = (
  containerNode,
  data,
  chartTitle,
  hypnogramNames,
  comparativeColors
) => {
  const svg = d3.select(containerNode);
  const sleepLabels = ["W", "REM", "N1", "N2", "N3"];

  const margin = {
    top: 100,
    right: 10,
    bottom: 70,
    left: 70,
  };
  const dimensions = {
    width: 1000 - margin.left - margin.right,
    height: 400 - margin.top - margin.bottom,
  };

  const { x, y } = initializeScales(dimensions);
  const { xAxis, yAxis } = initializeAxes(x, y);
  const g = createDrawingGroup(svg, dimensions, margin);
  const line = createLine(x, y);

  parseTimestampToDate(data);
  convertValuesToLabels(data);
  data = convertSources(data, hypnogramNames);

  domainX(x, data);
  domainY(y, sleepLabels);
  const colorDomain = domainColor(data, comparativeColors);

  const g_chart = createHypnogramChart(g, data, line, colorDomain);
  createMouseOver(g_chart, x, y, data, margin, dimensions, colorDomain);
  createAxes(g, xAxis, yAxis, dimensions, margin);
  createTitle(g, chartTitle, dimensions, margin);
  createLegend(g, hypnogramNames, comparativeColors, dimensions, margin);
};

export const createSingleHypnogram = (containerNode, data) => {
  const chartTitle = "Hypnogram";
  const hypnogramNames = ["Classifier"];
  const comparativeColors = ["#006aff"];

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
  const colors = {
    Classifier: "#efce31",
    "Sleep-EDF": "#006aff",
    Electrophysiologist: "#ff7575",
  };
  const comparativeColors = hypnogramNames.map((x) => colors[x]);

  createHypnogram(
    containerNode,
    data,
    chartTitle,
    hypnogramNames,
    comparativeColors
  );
};
