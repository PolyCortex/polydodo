import * as d3 from "d3";
import _ from "lodash";

import {
  MARGIN,
  CANVAS_WIDTH_TO_HEIGHT_RATIO,
  FREQUENCY_KEY,
  TITLE_FONT_SIZE,
  NB_SPECTROGRAM,
  PADDING,
} from "./constants";
import { EPOCH_DURATION_SEC } from "../constants";
import { createLegend } from "./legend";

const initializeScales = (canvasWidth) =>
  Object({
    x: d3.scaleLinear([0, getDimensions(canvasWidth).WIDTH]),
    yLinear: d3.scaleLinear([getSpectrogramHeight(canvasWidth), 0]),
    yBand: d3.scaleBand([getSpectrogramHeight(canvasWidth), 0]),
    yColor: d3.scaleLinear([getSpectrogramHeight(canvasWidth), 0]),
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

const preprocessData = (powerAmplitudesByTimestamp, frequencies) =>
  _.flatMap(
    powerAmplitudesByTimestamp,
    (powerAmplitudeSingleTimestamp, index) =>
      _.map(
        _.zip(powerAmplitudeSingleTimestamp, frequencies),
        ([intensity, frequency]) =>
          Object({
            Intensity: intensity,
            Frequency: frequency,
            Timestamp: getHoursFromIndex(index),
          })
      )
  );

const getHoursFromIndex = (idx) => {
  return (idx * EPOCH_DURATION_SEC) / 60.0 / 60;
};

const createDrawingGroups = (g, canvasWidth) =>
  Object({
    spectrogramDrawingGroup: g
      .append("g")
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`),
    legendDrawingGroup: g
      .append("g")
      .attr(
        "transform",
        `translate(${MARGIN.LEFT + getDimensions(canvasWidth).WIDTH}, ${
          MARGIN.TOP
        })`
      ),
  });

const getScalesAndAxes = (data, channel, canvasWidth) => {
  const { x, yLinear, yBand, yColor, color } = initializeScales(canvasWidth);
  const { xAxis, yAxis } = initializeAxes(x, yLinear);
  const preprocessedData = preprocessData(data[channel], data.frequencies);

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

const createAxes = (g, xAxis, yAxis, canvasWidth) => {
  const spectrogramHeight = getSpectrogramHeight(canvasWidth);

  g.append("text")
    .attr("class", "x axis")
    .attr("y", spectrogramHeight + MARGIN.BOTTOM)
    .attr("x", getDimensions(canvasWidth).WIDTH / 2)
    .attr("fill", "currentColor")
    .style("text-anchor", "middle")
    .text("Time");

  g.append("text")
    .attr("class", "y axis")
    .attr("transform", "rotate(-90)")
    .attr("y", -MARGIN.LEFT)
    .attr("x", -spectrogramHeight / 2)
    .attr("dy", "1em")
    .attr("fill", "currentColor")
    .style("text-anchor", "middle")
    .text("Frequency (Hz)");

  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${spectrogramHeight})`)
    .call(xAxis)
    .selectAll("text")
    .style("font-size", TITLE_FONT_SIZE);

  g.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .selectAll("text")
    .style("font-size", TITLE_FONT_SIZE);
};

const createTitle = (g, channelName, canvasWidth) =>
  g
    .append("text")
    .attr("x", getDimensions(canvasWidth).WIDTH / 2)
    .attr("y", -MARGIN.TOP / 3)
    .style("text-anchor", "middle")
    .style("font-size", TITLE_FONT_SIZE)
    .text(`Spectrogram of channel ${channelName}`);

const createSpectrogramRectangles = (
  canvas,
  scalesAndAxesBySpectrogram,
  width
) => {
  const context = canvas.node().getContext("2d");

  _.each(scalesAndAxesBySpectrogram, ({ x, yBand, color, data }, index) => {
    context.resetTransform();
    context.translate(
      MARGIN.LEFT,
      MARGIN.TOP + index * getSpectrogramCanvasHeight(width)[index]
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

const createSpectrogramAxesAndLegend = (
  svg,
  scalesAndAxesBySpectrogram,
  channelNames,
  width
) =>
  _.forEach(
    _.zip(scalesAndAxesBySpectrogram, channelNames),
    ([{ xAxis, yAxis, color, yColor }, channel], index) => {
      const currentSpectrogramDrawingGroup = svg
        .append("g")
        .attr(
          "transform",
          `translate(0, ${index * getSpectrogramCanvasHeight(width)[index]})`
        )
        .attr("width", width)
        .attr("height", getSpectrogramCanvasHeight(width)[index]);

      const {
        spectrogramDrawingGroup,
        legendDrawingGroup,
      } = createDrawingGroups(currentSpectrogramDrawingGroup, width);

      createTitle(spectrogramDrawingGroup, channel, width);
      createAxes(spectrogramDrawingGroup, xAxis, yAxis, width);
      createLegend(
        legendDrawingGroup,
        color,
        yColor,
        getSpectrogramHeight(width)
      );
    }
  );

const getCanvasHeight = (width) => width * CANVAS_WIDTH_TO_HEIGHT_RATIO;

const getDimensions = (width) =>
  Object({
    WIDTH: width - MARGIN.LEFT - MARGIN.RIGHT,
    HEIGHT: getCanvasHeight(width) - MARGIN.BOTTOM - MARGIN.TOP,
  });

const getSpectrogramCanvasHeight = (width) =>
  _.range(NB_SPECTROGRAM).map((x) => {
    let height = getDimensions(width).HEIGHT / NB_SPECTROGRAM;
    if (x === 0) {
      height += MARGIN.TOP;
    } else if (x === NB_SPECTROGRAM - 1) {
      height += MARGIN.BOTTOM;
    }
    return height;
  });

const getSpectrogramHeight = (width) =>
  (getCanvasHeight(width) - MARGIN.BOTTOM - MARGIN.TOP - PADDING) /
  NB_SPECTROGRAM;

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
  const canvasWidth = parentDiv.node().getBoundingClientRect().width;

  const channelNames = _.filter(
    _.keys(data),
    (keyName) => keyName !== FREQUENCY_KEY
  );
  const scalesAndAxesBySpectrogram = _.map(channelNames, (name) =>
    getScalesAndAxes(data, name, canvasWidth)
  );

  const canvas = parentDiv
    .append("canvas")
    .attr("width", canvasWidth)
    .attr("height", canvasWidth * CANVAS_WIDTH_TO_HEIGHT_RATIO)
    .style("position", "absolute");
  const svg = parentDiv
    .append("svg")
    .attr("width", canvasWidth)
    .attr("height", canvasWidth * CANVAS_WIDTH_TO_HEIGHT_RATIO);

  createSpectrogramRectangles(canvas, scalesAndAxesBySpectrogram, canvasWidth);
  createSpectrogramAxesAndLegend(
    svg,
    scalesAndAxesBySpectrogram,
    channelNames,
    canvasWidth
  );
};

export default createSpectrogram;
