import * as d3 from "d3";
import tip from "d3-tip";
import moment from "moment";

import {
  FREQUENCY_BINS,
  DIMENSION,
  MARGIN,
  CANVAS_DIMENSION,
  SPECTROGRAM_CANVAS_HEIGTH,
  SPECTROGRAM_HEIGHT,
} from "./constants";
import {
  domainColor,
  domainX,
  domainY,
  createSources,
  getHoursFromIndex,
} from "./preproc";
import { createLegend } from "./legend";

const createSpectrogramChart = (g, node, data) => {
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

  const color = d3.scaleSequential().interpolator(d3.interpolatePlasma);

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

  //Creating all the parts of the stacked bar chart
  spectrogram
    .selectAll(".rect")
    .data(sources)
    .enter()
    .append("rect")
    .attr("x", (d) => x(d.Timestamp))
    .attr("y", (d) => y(d.Frequency))
    .attr("width", () => x(getHoursFromIndex(1)))
    .attr("height", y.bandwidth())
    .attr("fill", (d) => color(d.Intensity))
    .on("mouseover", function (d) {
      tooltip.show(d, this);
      d3.select(this).style("opacity", 0.8);
    })
    .on("mouseout", function () {
      tooltip.hide();
      d3.select(this).style("opacity", 1);
    });

  // Titre axe des X
  spectrogram
    .append("text")
    .attr("class", "x axis")
    .attr("y", SPECTROGRAM_HEIGHT + MARGIN.BOTTOM)
    .attr("x", DIMENSION.WIDTH / 2)
    .attr("fill", "currentColor")
    .style("text-anchor", "middle")
    .text("Time");

  // titre axe des Y
  spectrogram
    .append("text")
    .attr("class", "y axis")
    .attr("transform", "rotate(-90)")
    .attr("y", -MARGIN.LEFT)
    .attr("x", -SPECTROGRAM_HEIGHT / 2)
    .attr("dy", "1em")
    .attr("fill", "currentColor")
    .style("text-anchor", "middle")
    .text("Frequency (Hz)");

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

const getToolTipText = (d) => {
  return `Power : <strong> ${d.Intensity.toFixed(2)} </strong> dB<br>\
          Frequency: <strong> ${d.Frequency.toFixed(2)} </strong> Hz <br>\
          Time: <strong> ${moment(d.Timestamp * 3.6e6)
            .utc()
            .format("HH:mm:ss")} </strong>`;
};

const createSpectrogram = (containerNode, data) => {
  const svg = d3.select(containerNode);
  console.log(data);

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

  createSpectrogramChart(spectrogramFPZCZ, "Fpz_Cz", data);
  createSpectrogramChart(spectrogramPZOZ, "Pz_Oz", data);
};

export default createSpectrogram;
