import * as d3 from "d3";

import hypnogramData from "assets/data/hypnogram.csv";

import {
  parseTimestampToDate,
  convertValuesToLabels,
  domainX,
  domainY,
} from "./preproc";

import {
  createLine,
  createFocusLineChart,
} from "./line-charts";

const initializeHypnogram = (margin, width, height, svg) => {

  const initializeScales = () => {
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleOrdinal().range([...Array(6).keys()].map(x => (x / 5) * height));

    return { x, y };
  };

  const initializeAxes = (x, y) => {
    const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%I:%M"));
    const yAxis = d3.axisLeft().scale(y);

    return { xAxis, yAxis };
  };

  const createDrawingGroup = () => {
      svg.attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const graph = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    return graph;
  }

  const { x, y } = initializeScales();
  const { xAxis, yAxis } = initializeAxes(x, y);
  const graph = createDrawingGroup();

  return { x, y, xAxis, yAxis, graph };
};


const createHypnogram = (containerNode) => {
  const svg = d3.select(containerNode);
  const sleep_labels = ['W', 'REM', 'N1', 'N2', 'N3'];

  const margin = {
    top: 10,
    right: 10,
    bottom: 100,
    left: 60
  };
  const width = 1000 - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;

  const { x, y, xAxis, yAxis, graph } = initializeHypnogram(margin, width, height, svg);

  // Fonctions pour dessiner les lignes
  const line = createLine(x, y);

  /***** Chargement des données *****/
  d3.csv(hypnogramData).then(function (data) {
    /***** Prétraitement des données *****/
    parseTimestampToDate(data);
    convertValuesToLabels(data);

    // domainColor(color, label_values);
    domainX(x, data);
    domainY(y, sleep_labels);

    // /***** Création du graphique focus *****/
    createFocusLineChart(graph, data, line, y);

    graph.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);

    graph.append("g")
      .attr("class", "y axis")
      .call(yAxis);
  });
};

export default createHypnogram;
