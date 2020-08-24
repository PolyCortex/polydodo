import * as d3 from 'd3';
import _ from 'lodash';

import createHypnogramChart from './line_charts';
import { DIMENSION, MARGIN, COMPARATIVE_COLORS, CANVAS_DIMENSION } from './constants';
import { STAGES_ORDERED } from '../constants';
import { convertTimestampsToDates } from '../utils';

const initializeScales = (comparativeColors) =>
  Object({
    x: d3.scaleTime([0, DIMENSION.WIDTH]),
    y: d3.scaleOrdinal(_.range(0, DIMENSION.HEIGHT + 1, DIMENSION.HEIGHT / STAGES_ORDERED.length)),
    colors: d3.scaleOrdinal(comparativeColors),
  });

const initializeAxes = (x, y) =>
  Object({
    xAxis: d3.axisBottom(x).tickFormat(d3.timeFormat('%H:%M')),
    yAxis: d3.axisLeft(y),
  });

const createDrawingGroup = (svg) => svg.append('g').attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

const preprocessData = (data, hypnogramNames) => {
  data = data.map((hypno) => convertTimestampsToDates(hypno));

  return _.zip(data, hypnogramNames).map((x) =>
    Object({
      name: x[1],
      values: x[0],
    }),
  );
};

const setDomainOnScales = (x, y, colors, data) => {
  const dates = data[0].values.map((datum) => datum.timestamp);
  x.domain([d3.min(dates), d3.max(dates)]);
  y.domain(STAGES_ORDERED);
  colors.domain(data.map((x) => x.name));
};

const createHypnogram = (containerNode, data, chartTitle, hypnogramNames, comparativeColors) => {
  const svg = d3.select(containerNode).attr('width', CANVAS_DIMENSION.WIDTH).attr('height', CANVAS_DIMENSION.HEIGHT);
  const { x, y, colors } = initializeScales(comparativeColors);
  const { xAxis, yAxis } = initializeAxes(x, y);
  const g = createDrawingGroup(svg);

  data = preprocessData(data, hypnogramNames);
  setDomainOnScales(x, y, colors, data);
  createHypnogramChart(g, data, x, y, xAxis, yAxis, colors, chartTitle, hypnogramNames, comparativeColors);
};

export const createSingleHypnogram = (containerNode, data) => {
  createHypnogram(containerNode, data, 'Hypnogram', ['Classifier'], [COMPARATIVE_COLORS.Classifier]);
};

export const createComparativeHypnogram = (containerNode, data, hypnogramNames) => {
  createHypnogram(
    containerNode,
    data,
    `Agreement between ${hypnogramNames[0]} and ${hypnogramNames[1]}`,
    hypnogramNames,
    hypnogramNames.map((x) => COMPARATIVE_COLORS[x]),
  );
};
