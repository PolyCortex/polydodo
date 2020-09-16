import * as d3 from 'd3';
import _ from 'lodash';

import {
  MARGIN,
  CANVAS_WIDTH_TO_HEIGHT_RATIO,
  FREQUENCY_KEY,
  HYPNOGRAM_KEY,
  NB_SPECTROGRAM,
  PADDING,
  CANVAS_HEIGHT_WINDOW_FACTOR,
  NOT_HIGHLIGHTED_RECTANGLE_OPACITY,
} from './constants';
import { STAGES_ORDERED } from '../constants';
import drawSpectrogramAxesAndLegend from './axes_legend';
import { convertTimestampsToDates } from '../utils';

// keys are the sleep stage for which we want to display the spectrogram
export let spectrogramCallbacks = {};

const getDimensions = (parentDiv) => {
  const canvasWidth = parentDiv.node().getBoundingClientRect().width;
  const canvasHeight = Math.min(
    canvasWidth * CANVAS_WIDTH_TO_HEIGHT_RATIO,
    window.innerHeight * CANVAS_HEIGHT_WINDOW_FACTOR,
  );
  const spectrogramsHeight = canvasHeight - MARGIN.TOP - MARGIN.BOTTOM;
  const singleSpectrogramCanvasHeight = _.range(NB_SPECTROGRAM).map((x) => {
    let height = spectrogramsHeight / NB_SPECTROGRAM;
    if (x === 0) {
      height += MARGIN.TOP;
    } else if (x === NB_SPECTROGRAM - 1) {
      height += MARGIN.BOTTOM;
    }
    return height;
  });

  return {
    canvasWidth,
    canvasHeight,
    spectrogramsHeight,
    singleSpectrogramCanvasHeight,
    spectrogramWidth: canvasWidth - MARGIN.LEFT - MARGIN.RIGHT,
    singleSpectrogramHeight: (spectrogramsHeight - PADDING) / NB_SPECTROGRAM,
  };
};

const preprocessData = (channel, data) => {
  const powerAmplitudesByTimestamp = data[channel];
  const frequencies = data[FREQUENCY_KEY];
  const hypnogram = convertTimestampsToDates(data[HYPNOGRAM_KEY]);

  return {
    channel,
    frequencies,
    rectangles: _.flatMap(
      _.zip(powerAmplitudesByTimestamp, hypnogram),
      ([powerAmplitudeSingleTimestamp, { sleepStage, timestamp }]) =>
        _.map(
          _.zip(powerAmplitudeSingleTimestamp, frequencies),
          ([intensity, frequency]) =>
            Object({
              intensity,
              frequency,
              timestamp,
              sleepStage,
            }),
        ),
    ),
  };
};

const initializeScales = ({ spectrogramWidth, singleSpectrogramHeight }) =>
  Object({
    x: d3.scaleTime([0, spectrogramWidth]),
    yLinear: d3.scaleLinear([singleSpectrogramHeight, 0]),
    yBand: d3.scaleBand([singleSpectrogramHeight, 0]),
    yColor: d3.scaleLinear([singleSpectrogramHeight, 0]),
    color: d3.scaleSequential().interpolator(d3.interpolatePlasma),
  });

const setDomainOnScales = (
  { rectangles, frequencies },
  x,
  yBand,
  yLinear,
  color,
  yColor,
) => {
  x.domain([_.first(rectangles).timestamp, _.last(rectangles).timestamp]);
  yBand.domain(frequencies);
  yLinear.domain([_.first(frequencies), _.last(frequencies)]);
  color.domain(d3.extent(rectangles, ({ intensity }) => intensity));
  yColor.domain(d3.extent(rectangles, ({ intensity }) => intensity));
};

const initializeAxes = (x, y) =>
  Object({
    xAxis: d3.axisBottom(x).tickFormat((d) => `${d.getHours()}h`),
    yAxis: d3.axisLeft(y).ticks(5, 's'),
  });

const getScalesAndAxes = (data, dimensions) => {
  const { x, yLinear, yBand, yColor, color } = initializeScales(dimensions);
  const { xAxis, yAxis } = initializeAxes(x, yLinear);

  setDomainOnScales(data, x, yBand, yLinear, color, yColor);

  return { x, yBand, yColor, color, xAxis, yAxis };
};

const drawSpectrogramRectangles = (
  canvas,
  scalesAndAxesBySpectrogram,
  data,
  { singleSpectrogramCanvasHeight },
  highlightedSleepStage,
) => {
  const context = canvas.node().getContext('2d');
  const isHighlightNotSelectedOrEqual = (sleepStage) =>
    !highlightedSleepStage || sleepStage === highlightedSleepStage;

  _.each(
    _.zip(scalesAndAxesBySpectrogram, data),
    ([{ x, yBand, color }, { rectangles, frequencies }], index) => {
      const rectangleWidth =
        x(rectangles[frequencies.length].timestamp) -
        x(rectangles[0].timestamp);

      context.resetTransform();
      context.translate(
        MARGIN.LEFT,
        MARGIN.TOP + index * singleSpectrogramCanvasHeight[index],
      );

      _.each(rectangles, ({ timestamp, frequency, intensity, sleepStage }) => {
        context.beginPath();
        context.fillRect(
          x(timestamp),
          yBand(frequency),
          rectangleWidth,
          yBand.bandwidth(),
        );
        context.globalAlpha = isHighlightNotSelectedOrEqual(sleepStage)
          ? 1
          : NOT_HIGHLIGHTED_RECTANGLE_OPACITY;
        context.fillStyle = color(intensity);
        context.fill();
        context.stroke();
      });
    },
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
  const dimensions = getDimensions(parentDiv);

  const canvas = parentDiv
    .append('canvas')
    .attr('width', dimensions.canvasWidth)
    .attr('height', dimensions.canvasHeight)
    .style('position', 'absolute');
  const svg = parentDiv
    .append('svg')
    .attr('width', dimensions.canvasWidth)
    .attr('height', dimensions.canvasHeight);

  const channelNames = _.filter(
    _.keys(data),
    (keyName) => !_.includes([FREQUENCY_KEY, HYPNOGRAM_KEY], keyName),
  );
  const preprocessedData = _.map(channelNames, (channel) =>
    preprocessData(channel, data),
  );
  const scalesAndAxesBySpectrogram = _.map(preprocessedData, (data) =>
    getScalesAndAxes(data, dimensions),
  );

  const createSpectrogramWithHighlightedStageCallback = (
    highlightedSleepStage,
  ) => () => {
    drawSpectrogramRectangles(
      canvas,
      scalesAndAxesBySpectrogram,
      preprocessedData,
      dimensions,
      highlightedSleepStage,
    );
    drawSpectrogramAxesAndLegend(
      svg,
      scalesAndAxesBySpectrogram,
      preprocessedData,
      dimensions,
    );
  };

  spectrogramCallbacks = _.zipObject(
    [null, ...STAGES_ORDERED],
    _.map([null, ...STAGES_ORDERED], (stage) =>
      createSpectrogramWithHighlightedStageCallback(stage),
    ),
  );
  spectrogramCallbacks[null]();
};

export default createSpectrogram;
