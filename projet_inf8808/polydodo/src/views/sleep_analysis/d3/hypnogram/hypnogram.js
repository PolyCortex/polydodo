import * as d3 from "d3";

import hypnogramData from "assets/data/hypnogram.csv";

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

const initializeHypnogram = (margin, width, height, svg, dateFormat) => {

  const initializeScales = () => {
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleOrdinal().range([...Array(6).keys()].map(x => (x / 5) * height));

    return { x, y };
  };

  const initializeAxes = (x, y) => {
    const xAxis = d3.axisBottom(x).tickFormat(dateFormat);
    const yAxis = d3.axisLeft().scale(y);

    return { xAxis, yAxis };
  };

  const createDrawingGroup = () => {
    svg.attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    return g;
  }

  const { x, y } = initializeScales();
  const { xAxis, yAxis } = initializeAxes(x, y);
  const g = createDrawingGroup();

  return { x, y, xAxis, yAxis, g };
};


const createHypnogram = (containerNode) => {
  const svg = d3.select(containerNode);
  const sleepLabels = ['W', 'REM', 'N1', 'N2', 'N3'];
  const dateFormat = d3.timeFormat("%H:%M");
  const hypnogramNames = ["predicted"];
  const comparativeColors = ["#006aff", "#ff7575"];
  const labelColors = {
    'W': "#E3624B",
    'REM': "#FFD443",
    'N1': "#B0C9D9",
    'N2': "#4da6fe",
    'N3': "#48587f",
  };

  const margin = {
    top: 10,
    right: 10,
    bottom: 50,
    left: 60
  };
  const width = 1000 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const { x, y, xAxis, yAxis, g } = initializeHypnogram(margin, width, height, svg, dateFormat);
  const line = createLine(x, y);

  /***** Chargement des données *****/
  d3.csv(hypnogramData).then((data) => {
    parseTimestampToDate(data);
    convertValuesToLabels(data);
    data = convertSources([data], hypnogramNames);

    domainX(x, data);
    domainY(y, sleepLabels);
    const colorDomain = domainColor(data, comparativeColors);

    createHypnogramChart(g, data, line, colorDomain);
    createMouseOver(g, x, y, data, margin, width, height, dateFormat, colorDomain);

    g.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);

    g.append("g")
      .attr("class", "y axis")
      .call(yAxis);
  });
};

export default createHypnogram;
