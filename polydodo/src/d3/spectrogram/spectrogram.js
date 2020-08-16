import * as d3 from "d3";
import tip from "d3-tip";
import moment from "moment";
import _ from "lodash";

import {
  FREQUENCY_BINS,
  DIMENSION,
  MARGIN,
  CANVAS_DIMENSION,
  SPECTROGRAM_CANVAS_HEIGTH,
  SPECTROGRAM_HEIGHT,
  FREQUENCY_KEY,
} from "./constants";
import {
  domainColor,
  domainX,
  domainY,
  createSources,
  getHoursFromIndex,
} from "./preproc";
import { createLegend } from "./legend";

const initializeScales = () =>
  Object({
    x: d3.scaleLinear([0, DIMENSION.WIDTH]),
    yLinear: d3.scaleLinear([SPECTROGRAM_HEIGHT, 0]),
    yBand: d3.scaleBand([SPECTROGRAM_HEIGHT, 0]),
    yColor: d3.scaleLinear([SPECTROGRAM_HEIGHT, 0]),
    color: d3.scaleSequential().interpolator(d3.interpolatePlasma),
  });

const initializeAxes = (x, y) =>
  Object({
    xAxis: d3.axisBottom(x).tickFormat((d) => `${d}h`),
    yAxis: d3.axisLeft(y).ticks(5, "s"),
  });

const createDrawingGroups = (g) =>
  Object({
    spectrogram_drawing_group: g
      .append("g")
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`),
    legend_drawing_group: g
      .append("g")
      .attr(
        "transform",
        `translate(${MARGIN.LEFT + DIMENSION.WIDTH}, ${MARGIN.TOP})`
      ),
  });

const createSpectrogramChart = (g, node, data) => {
  const { x, yLinear, yBand, yColor, color } = initializeScales();
  const { xAxis, yAxis } = initializeAxes(x, yLinear);
  const {
    spectrogram_drawing_group,
    legend_drawing_group,
  } = createDrawingGroups(g);
  const tooltip = tip().attr("class", "d3-tip").offset([-10, 0]);

  const frequencies = [];
  for (let idx = 0; idx < data.frequencies.length; idx += FREQUENCY_BINS) {
    let binTotal = 0;
    let jdx = 0;
    for (; jdx < FREQUENCY_BINS && idx + jdx < data.frequencies.length; jdx++) {
      binTotal += data.frequencies[idx + jdx];
    }
    frequencies.push(binTotal / FREQUENCY_BINS);
  }

  const sources = createSources(data, node, frequencies);
  domainColor(color, sources);
  domainColor(yColor, sources);
  domainX(x, data, node);
  domainY(yBand, yLinear, frequencies);

  //Creating all the parts of the stacked bar chart
  spectrogram_drawing_group
    .selectAll(".rect")
    .data(sources)
    .enter()
    .append("rect")
    .attr("x", (d) => x(d.Timestamp))
    .attr("y", (d) => yBand(d.Frequency))
    .attr("width", () => x(getHoursFromIndex(1)))
    .attr("height", yBand.bandwidth())
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
  spectrogram_drawing_group
    .append("text")
    .attr("class", "x axis")
    .attr("y", SPECTROGRAM_HEIGHT + MARGIN.BOTTOM)
    .attr("x", DIMENSION.WIDTH / 2)
    .attr("fill", "currentColor")
    .style("text-anchor", "middle")
    .text("Time");

  // titre axe des Y
  spectrogram_drawing_group
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
  spectrogram_drawing_group
    .append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${SPECTROGRAM_HEIGHT})`)
    .call(xAxis)
    .selectAll("text")
    .style("font-size", "18px");

  spectrogram_drawing_group
    .append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .selectAll("text")
    .style("font-size", "18px");

  tooltip.html((d) => getToolTipText.call(this, d));
  g.call(tooltip);

  createLegend(legend_drawing_group, color, yColor);
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

  const channelNames = _.filter(
    _.keys(data),
    (keyName) => keyName !== FREQUENCY_KEY
  );

  _.forEach(channelNames, (channelName, index) => {
    const currentSpectrogramDrawingGroup = svg
      .append("g")
      .attr("transform", `translate(0, ${index * SPECTROGRAM_CANVAS_HEIGTH})`)
      .attr("width", CANVAS_DIMENSION.WIDTH)
      .attr("height", SPECTROGRAM_CANVAS_HEIGTH);

    createSpectrogramChart(currentSpectrogramDrawingGroup, channelName, data);
  });
};

export default createSpectrogram;
