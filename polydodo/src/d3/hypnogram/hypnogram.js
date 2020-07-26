import * as d3 from "d3";
import _ from "lodash";

import { preprocessData } from "./preproc";
import createHypnogramChart from "./line_charts";
import {
  DIMENSIONS,
  MARGINS,
  COMPARATIVE_COLORS,
  SLEEP_STAGES_ORDERED_FOR_HYPNOGRAM,
} from "./constants";
import { STATES } from "../constants";

const initializeScales = (comparativeColors) => {
  const x = d3.scaleTime().range([0, DIMENSIONS.width]);
  const y = d3
    .scaleOrdinal()
    .range(
      _.range(0, DIMENSIONS.height + 1, DIMENSIONS.height / STATES.length)
    );
  const colors = d3.scaleOrdinal(comparativeColors);

  return { x, y, colors };
};

const initializeAxes = (x, y) => {
  const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%H:%M"));
  const yAxis = d3.axisLeft(y);

  return { xAxis, yAxis };
};

const createDrawingGroup = (svg) =>
  svg
    .append("g")
    .attr("transform", `translate(${MARGINS.left}, ${MARGINS.top})`);

const setDomainOnScales = (x, y, colors, data) => {
  const dates = data[0].values.map((datum) => datum.timestamp);
  x.domain([d3.min(dates), d3.max(dates)]);
  y.domain(SLEEP_STAGES_ORDERED_FOR_HYPNOGRAM);
  colors.domain(data.map((x) => x.name));
};

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
  const { x, y, colors } = initializeScales(comparativeColors);
  const { xAxis, yAxis } = initializeAxes(x, y);
  const g = createDrawingGroup(svg);

  data = preprocessData(data, hypnogramNames);
  setDomainOnScales(x, y, colors, data);
  createHypnogramChart(
    g,
    data,
    x,
    y,
    xAxis,
    yAxis,
    colors,
    chartTitle,
    hypnogramNames,
    comparativeColors
  );
};

export const createSingleHypnogram = (containerNode, data) => {
  createHypnogram(
    containerNode,
    data,
    "Hypnogram",
    ["Classifier"],
    [COMPARATIVE_COLORS.Classifier]
  );
};

export const createComparativeHypnogram = (
  containerNode,
  data,
  hypnogramNames
) => {
  createHypnogram(
    containerNode,
    data,
    `Agreement between ${hypnogramNames[0]} and ${hypnogramNames[1]}`,
    hypnogramNames,
    hypnogramNames.map((x) => COMPARATIVE_COLORS[x])
  );
};
