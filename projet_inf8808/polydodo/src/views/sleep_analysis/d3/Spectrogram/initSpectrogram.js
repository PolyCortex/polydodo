import * as d3 from "d3";
import tip from "d3-tip";
import data from "assets/data/spectrograms";

import { domainColor, domainX, domainY, createSources } from "./preproc";

import { legend } from "./legend";

import { createSpectrgramChart, getToolTipText } from "./stages-charts";

const SECONDS_PER_DATUM = 30;
export const DATUM_PER_TIMESTAMP = 4;
export const TIMESTAMP_DURATION = SECONDS_PER_DATUM * DATUM_PER_TIMESTAMP;
export const FREQUENCY_BINS = 5;

export const initSpectrogram = (g, node, width, height, margin) => {
  /**** Interpolateur de couleurs ****/
  var colorInterpolator = d3.interpolatePlasma;

  /***** Échelles *****/
  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleBand().range([height, 0]);
  var yColor = d3.scaleLinear().range(y.range());
  var yAxisScale = d3.scaleLinear().range(y.range());

  /****** Axes *******/
  var xAxis = d3.axisBottom(x).tickFormat((d) => `${d}h`);
  var yAxis = d3.axisLeft(yAxisScale).ticks(5, "s");

  // Groupe affichant le graphique principal ().
  var spectrogram = g
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var gLegend = g
    .append("g")
    .attr(
      "transform",
      "translate(" + (margin.left + width) + "," + margin.top + ")"
    );

  /***** Chargement des données *****/
  console.log(data);
  /***** Prétraitement des données *****/
  var color = d3.scaleSequential().interpolator(colorInterpolator);

  var tooltip = tip().attr("class", "d3-tip").offset([-10, 0]);

  var frequencies = [];
  for (let idx = 0; idx < data.Frequencies.length; idx += FREQUENCY_BINS) {
    var binTotal = 0;
    let jdx = 0;
    for (; jdx < FREQUENCY_BINS && idx + jdx < data.Frequencies.length; jdx++) {
      binTotal += data.Frequencies[idx + jdx];
    }
    frequencies.push(binTotal / FREQUENCY_BINS);
  }

  var sources = createSources(data, node, frequencies);
  domainColor(color, sources);
  domainColor(yColor, sources);
  domainX(x, data, node);
  domainY(y, yAxisScale, frequencies);

  // /***** Création du graphique Stacked bar chart *****/
  createSpectrgramChart(
    spectrogram,
    sources,
    x,
    y,
    color,
    tooltip,
    height,
    width,
    margin
  );

  // Axes
  spectrogram
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("font-size", "18px");

  spectrogram
    .append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .selectAll("text")
    .style("font-size", "18px");

  // /***** Création de l'infobulle *****/
  tooltip.html(function (d) {
    return getToolTipText.call(this, d);
  });
  g.call(tooltip);

  // /***** Création de la légende *****/
  legend(gLegend, color, yColor, height, margin.right);
};
