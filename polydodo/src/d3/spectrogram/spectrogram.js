import * as d3 from "d3";
import tip from "d3-tip";

import {
  FREQUENCY_BINS,
  DIMENSION,
  MARGIN,
  CANVAS_DIMENSION,
  SPECTROGRAM_CANVAS_HEIGTH,
  SPECTROGRAM_HEIGHT,
} from "./constants";
import { domainColor, domainX, domainY, createSources } from "./preproc";
import { createLegend } from "./legend";
import { createSpectrogramChart, getToolTipText } from "./stages-charts";

const initSpectrogram = (g, node, data) => {
  const colorInterpolator = d3.interpolatePlasma;

  const x = d3.scaleLinear().range([0, DIMENSION.WIDTH]);
  const y = d3.scaleBand().range([SPECTROGRAM_HEIGHT, 0]);
  const yColor = d3.scaleLinear().range(y.range());
  const yAxisScale = d3.scaleLinear().range(y.range());

  const xAxis = d3.axisBottom(x).tickFormat((d) => `${d}h`);
  const yAxis = d3.axisLeft(yAxisScale).ticks(5, "s");

  const spectrogram = g
    .append("g")
    .attr("transform", "translate(" + MARGIN.LEFT + "," + MARGIN.TOP + ")");
  const gLegend = g
    .append("g")
    .attr(
      "transform",
      "translate(" + (MARGIN.LEFT + DIMENSION.WIDTH) + "," + MARGIN.TOP + ")"
    );

  const color = d3.scaleSequential().interpolator(colorInterpolator);

  const tooltip = tip().attr("class", "d3-tip").offset([-10, 0]);

  const frequencies = [];
  for (let idx = 0; idx < data.Frequencies.length; idx += FREQUENCY_BINS) {
    let binTotal = 0;
    let jdx = 0;
    for (; jdx < FREQUENCY_BINS && idx + jdx < data.Frequencies.length; jdx++) {
      binTotal += data.Frequencies[idx + jdx];
    }
    frequencies.push(binTotal / FREQUENCY_BINS);
  }

  const sources = createSources(data, node, frequencies);
  domainColor(color, sources);
  domainColor(yColor, sources);
  domainX(x, data, node);
  domainY(y, yAxisScale, frequencies);

  createSpectrogramChart(spectrogram, sources, x, y, color, tooltip);

  // Axes
  spectrogram
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + SPECTROGRAM_HEIGHT + ")")
    .call(xAxis)
    .selectAll("text")
    .style("font-size", "18px");

  spectrogram
    .append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .selectAll("text")
    .style("font-size", "18px");

  tooltip.html((d) => getToolTipText.call(this, d));
  g.call(tooltip);

  createLegend(gLegend, color, yColor);
};

const createSpectrogram = (containerNode, data) => {
  const svg = d3.select(containerNode);

  svg
    .attr("width", CANVAS_DIMENSION.WIDTH)
    .attr("height", CANVAS_DIMENSION.HEIGHT);

  const spectrogramFPZCZ = svg
    .append("g")
    .attr("width", CANVAS_DIMENSION.WIDTH)
    .attr("height", SPECTROGRAM_CANVAS_HEIGTH);

  const spectrogramPZOZ = svg
    .append("g")
    .attr("transform", `translate(0, ${SPECTROGRAM_CANVAS_HEIGTH})`)
    .attr("width", CANVAS_DIMENSION.WIDTH)
    .attr("height", SPECTROGRAM_CANVAS_HEIGTH);

  initSpectrogram(spectrogramFPZCZ, "Fpz_Cz", data);
  initSpectrogram(spectrogramPZOZ, "Pz_Oz", data);
};

export default createSpectrogram;
