import * as d3 from "d3";
import _ from "lodash";

import {
  DIMENSION,
  MARGIN,
  CANVAS_DIMENSION,
  SPECTROGRAM_CANVAS_HEIGTH,
  SPECTROGRAM_HEIGHT,
  FREQUENCY_KEY,
} from "./constants";
import { preprocessData, getHoursFromIndex } from "./preproc";
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

const setDomainOnScales = (
  currentData,
  frequencies,
  preprocessedData,
  x,
  yBand,
  yLinear,
  color,
  yColor
) => {
  x.domain([0, getHoursFromIndex(currentData.length)]);
  yBand.domain(frequencies);
  yLinear.domain([_.first(frequencies), _.last(frequencies)]);
  color.domain(d3.extent(preprocessedData, ({ Intensity }) => Intensity));
  yColor.domain(d3.extent(preprocessedData, ({ Intensity }) => Intensity));
};

const createDrawingGroups = (g) =>
  Object({
    spectrogramDrawingGroup: g
      .append("g")
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`),
    legendDrawingGroup: g
      .append("g")
      .attr(
        "transform",
        `translate(${MARGIN.LEFT + DIMENSION.WIDTH}, ${MARGIN.TOP})`
      ),
  });

const getScalesAndAxes = (data, channel) => {
  const { x, yLinear, yBand, yColor, color } = initializeScales();
  const { xAxis, yAxis } = initializeAxes(x, yLinear);
  const preprocessedData = preprocessData(data, channel, data.frequencies);

  setDomainOnScales(
    data[channel],
    data.frequencies,
    preprocessedData,
    x,
    yBand,
    yLinear,
    color,
    yColor
  );

  return { data: preprocessedData, x, yBand, yColor, color, xAxis, yAxis };
};

const createSpectrogramRectangles = (canvas, scalesAndAxesBySpectrogram) => {
  const context = canvas.node().getContext("2d");

  _.each(scalesAndAxesBySpectrogram, ({ x, yBand, color, data }, index) => {
    context.resetTransform();
    context.translate(
      MARGIN.LEFT,
      MARGIN.TOP + index * SPECTROGRAM_CANVAS_HEIGTH[index]
    );

    _.each(data, ({ Timestamp, Frequency, Intensity }) => {
      context.beginPath();
      context.fillRect(
        x(Timestamp),
        yBand(Frequency),
        x(getHoursFromIndex(1)),
        yBand.bandwidth()
      );
      context.fillStyle = color(Intensity);
      context.fill();
      context.stroke();
    });
  });
};

const createSpectrogramAxesAndLegend = (svg, scalesAndAxesBySpectrogram) => {
  _.forEach(
    scalesAndAxesBySpectrogram,
    ({ xAxis, yAxis, color, yColor }, index) => {
      const currentSpectrogramDrawingGroup = svg
        .append("g")
        .attr(
          "transform",
          `translate(0, ${index * SPECTROGRAM_CANVAS_HEIGTH[index]})`
        )
        .attr("width", CANVAS_DIMENSION.WIDTH)
        .attr("height", SPECTROGRAM_CANVAS_HEIGTH[index]);

      const {
        spectrogramDrawingGroup,
        legendDrawingGroup,
      } = createDrawingGroups(currentSpectrogramDrawingGroup);

      // Titre axe des X
      spectrogramDrawingGroup
        .append("text")
        .attr("class", "x axis")
        .attr("y", SPECTROGRAM_HEIGHT + MARGIN.BOTTOM)
        .attr("x", DIMENSION.WIDTH / 2)
        .attr("fill", "currentColor")
        .style("text-anchor", "middle")
        .text("Time");

      // titre axe des Y
      spectrogramDrawingGroup
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
      spectrogramDrawingGroup
        .append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${SPECTROGRAM_HEIGHT})`)
        .call(xAxis)
        .selectAll("text")
        .style("font-size", "18px");

      spectrogramDrawingGroup
        .append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll("text")
        .style("font-size", "18px");

      createLegend(legendDrawingGroup, color, yColor);
    }
  );
};

const createSpectrogram = (containerNode, data) => {
  /*
  Considering the number of rectangles to display is well over 1k,
  we will use a canvas instead of a svg element to display the visualisation.
  (https://stackoverflow.com/a/50143500).
  We will seperatly create the axes and legend, overlaid over the canvas element, because d3-axis
  module was only conceived to be used inside a svg element.
  We have done so by setting the same dimensions to both svg and canvas, and then by
  setting the first element's position, in this case the canvas, to absolute.
  */
  const parentDiv = d3.select(containerNode);
  const channelNames = _.filter(
    _.keys(data),
    (keyName) => keyName !== FREQUENCY_KEY
  );
  const scalesAndAxesBySpectrogram = _.map(channelNames, (name) =>
    getScalesAndAxes(data, name)
  );

  const canvas = parentDiv
    .append("canvas")
    .attr("width", CANVAS_DIMENSION.WIDTH)
    .attr("height", CANVAS_DIMENSION.HEIGHT)
    .style("position", "absolute");
  const svg = parentDiv
    .append("svg")
    .attr("width", CANVAS_DIMENSION.WIDTH)
    .attr("height", CANVAS_DIMENSION.HEIGHT);

  createSpectrogramRectangles(canvas, scalesAndAxesBySpectrogram);
  createSpectrogramAxesAndLegend(svg, scalesAndAxesBySpectrogram);
};

export default createSpectrogram;
