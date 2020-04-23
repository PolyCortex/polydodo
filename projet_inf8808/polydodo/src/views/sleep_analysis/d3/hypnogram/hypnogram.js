import * as d3 from "d3";

import hypnogramData from "assets/data/hypnogram.csv";
import hypnogramDataPredicted from "assets/data/hypnogram-predicted.csv";

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
} from "./line-charts";

import {
  createMouseOver,
} from "./mouse-over";

const initializeScales = ({ width, height }) => {
  const x = d3.scaleTime().range([0, width]);
  const y = d3.scaleOrdinal().range([...Array(6).keys()].map(x => (x / 5) * height));

  return { x, y };
};

const initializeAxes = (x, y) => {
  const xAxis = d3
    .axisBottom(x)
    .tickFormat(d3.timeFormat("%H:%M"));
  const yAxis = d3
    .axisLeft()
    .scale(y);

  return { xAxis, yAxis };
};

const createDrawingGroup = (svg, dimensions, margin) => {
  const { width, height } = dimensions;
  const { left, top, right, bottom } = margin;
  svg.attr("width", width + left + right)
    .attr("height", height + top + bottom);

  const g = svg.append("g")
    .attr("transform", `translate(${left}, ${top})`);

  return g;
}


const createHypnogram = (containerNode) => {
  const svg = d3.select(containerNode);
  const sleepLabels = ['W', 'REM', 'N1', 'N2', 'N3'];
  const hypnogramNames = ["predicted", "scored"];
  const comparativeColors = ["#006aff", "#ff7575"];
  // const labelColors = {
  //   'W': "#E3624B",
  //   'REM': "#FFD443",
  //   'N1': "#B0C9D9",
  //   'N2': "#4da6fe",
  //   'N3': "#48587f",
  // };

  const margin = {
    top: 10,
    right: 10,
    bottom: 50,
    left: 30
  };
  const dimensions = {
    width: 1000 - margin.left - margin.right,
    height: 300 - margin.top - margin.bottom
  };

  const { x, y } = initializeScales(dimensions);
  const { xAxis, yAxis } = initializeAxes(x, y);
  const g = createDrawingGroup(svg, dimensions, margin);
  const line = createLine(x, y);

  /***** Chargement des données *****/
  Promise.all([
    d3.csv(hypnogramData),
    d3.csv(hypnogramDataPredicted)
  ]).then((data) => {
    parseTimestampToDate(data);
    convertValuesToLabels(data);
    data = convertSources(data, hypnogramNames);

    domainX(x, data);
    domainY(y, sleepLabels);
    const colorDomain = domainColor(data, comparativeColors);

    createHypnogramChart(g, data, line, colorDomain);
    createMouseOver(g, x, y, data, margin, dimensions, colorDomain);

    g.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${dimensions.height})`)
      .call(xAxis);

    g.append("g")
      .attr("class", "y axis")
      .call(yAxis);
  });
};

export default createHypnogram;