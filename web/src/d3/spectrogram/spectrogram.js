import * as d3 from 'd3';
import _ from 'lodash';

import {
  MARGIN,
  CANVAS_WIDTH_TO_HEIGHT_RATIO,
  FREQUENCY_KEY,
  HYPNOGRAM_KEY,
  TITLE_FONT_SIZE,
  NB_SPECTROGRAM,
  PADDING,
  CANVAS_HEIGHT_WINDOW_FACTOR,
} from './constants';
import { EPOCH_DURATION_SEC } from '../constants';
import { createLegend } from './legend';

const initializeScales = ({ spectrogramWidth, singleSpectrogramHeight }) =>
  Object({
    x: d3.scaleLinear([0, spectrogramWidth]),
    yLinear: d3.scaleLinear([singleSpectrogramHeight, 0]),
    yBand: d3.scaleBand([singleSpectrogramHeight, 0]),
    yColor: d3.scaleLinear([singleSpectrogramHeight, 0]),
    color: d3.scaleSequential().interpolator(d3.interpolatePlasma),
  });

const initializeAxes = (x, y) =>
  Object({
    xAxis: d3.axisBottom(x).tickFormat((d) => `${d}h`),
    yAxis: d3.axisLeft(y).ticks(5, 's'),
  });

const setDomainOnScales = (currentData, frequencies, preprocessedData, x, yBand, yLinear, color, yColor) => {
  x.domain([0, getHoursFromIndex(currentData.length)]);
  yBand.domain(frequencies);
  yLinear.domain([_.first(frequencies), _.last(frequencies)]);
  color.domain(d3.extent(preprocessedData, ({ Intensity }) => Intensity));
  yColor.domain(d3.extent(preprocessedData, ({ Intensity }) => Intensity));
};

const preprocessData = (powerAmplitudesByTimestamp, frequencies) =>
  _.flatMap(powerAmplitudesByTimestamp, (powerAmplitudeSingleTimestamp, index) =>
    _.map(_.zip(powerAmplitudeSingleTimestamp, frequencies), ([intensity, frequency]) =>
      Object({
        Intensity: intensity,
        Frequency: frequency,
        Timestamp: getHoursFromIndex(index),
      }),
    ),
  );

const getHoursFromIndex = (idx) => (idx * EPOCH_DURATION_SEC) / 3600;

const createDrawingGroups = (g, spectrogramWidth) =>
  Object({
    spectrogramDrawingGroup: g.append('g').attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`),
    legendDrawingGroup: g.append('g').attr('transform', `translate(${MARGIN.LEFT + spectrogramWidth}, ${MARGIN.TOP})`),
  });

const getScalesAndAxes = (data, channel, dimensions) => {
  const { x, yLinear, yBand, yColor, color } = initializeScales(dimensions);
  const { xAxis, yAxis } = initializeAxes(x, yLinear);
  const preprocessedData = preprocessData(data[channel], data.frequencies);

  setDomainOnScales(data[channel], data.frequencies, preprocessedData, x, yBand, yLinear, color, yColor);

  return { data: preprocessedData, x, yBand, yColor, color, xAxis, yAxis };
};

const createAxes = (g, xAxis, yAxis, singleSpectrogramHeight, spectrogramWidth) => {
  g.append('text')
    .attr('class', 'x axis')
    .attr('y', singleSpectrogramHeight + MARGIN.BOTTOM)
    .attr('x', spectrogramWidth / 2)
    .attr('fill', 'currentColor')
    .style('text-anchor', 'middle')
    .text('Time');

  g.append('text')
    .attr('class', 'y axis')
    .attr('transform', 'rotate(-90)')
    .attr('y', -MARGIN.LEFT)
    .attr('x', -singleSpectrogramHeight / 2)
    .attr('dy', '1em')
    .attr('fill', 'currentColor')
    .style('text-anchor', 'middle')
    .text('Frequency (Hz)');

  g.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${singleSpectrogramHeight})`)
    .call(xAxis)
    .selectAll('text')
    .style('font-size', TITLE_FONT_SIZE);

  g.append('g').attr('class', 'y axis').call(yAxis).selectAll('text').style('font-size', TITLE_FONT_SIZE);
};

const createTitle = (g, channelName, spectrogramWidth) =>
  g
    .append('text')
    .attr('x', spectrogramWidth / 2)
    .attr('y', -MARGIN.TOP / 3)
    .style('text-anchor', 'middle')
    .style('font-size', TITLE_FONT_SIZE)
    .text(`Spectrogram of channel ${channelName}`);

const createSpectrogramRectangles = (canvas, scalesAndAxesBySpectrogram, { singleSpectrogramCanvasHeight }) => {
  const context = canvas.node().getContext('2d');

  _.each(scalesAndAxesBySpectrogram, ({ x, yBand, color, data }, index) => {
    context.resetTransform();
    context.translate(MARGIN.LEFT, MARGIN.TOP + index * singleSpectrogramCanvasHeight[index]);

    _.each(data, ({ Timestamp, Frequency, Intensity }) => {
      context.beginPath();
      context.fillRect(x(Timestamp), yBand(Frequency), x(getHoursFromIndex(1)), yBand.bandwidth());
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
  { canvasWidth, spectrogramWidth, singleSpectrogramCanvasHeight, singleSpectrogramHeight },
) =>
  _.forEach(_.zip(scalesAndAxesBySpectrogram, channelNames), ([{ xAxis, yAxis, color, yColor }, channel], index) => {
    const currentSpectrogramDrawingGroup = svg
      .append('g')
      .attr('transform', `translate(0, ${index * singleSpectrogramCanvasHeight[index]})`)
      .attr('width', canvasWidth)
      .attr('height', singleSpectrogramCanvasHeight[index]);

    const { spectrogramDrawingGroup, legendDrawingGroup } = createDrawingGroups(currentSpectrogramDrawingGroup, spectrogramWidth);

    createTitle(spectrogramDrawingGroup, channel, spectrogramWidth);
    createAxes(spectrogramDrawingGroup, xAxis, yAxis, singleSpectrogramHeight, spectrogramWidth);
    createLegend(legendDrawingGroup, color, yColor, singleSpectrogramHeight);
  });

const getSpectrogramCanvasHeight = (spectrogramHeight) =>
  _.range(NB_SPECTROGRAM).map((x) => {
    let height = spectrogramHeight / NB_SPECTROGRAM;
    if (x === 0) {
      height += MARGIN.TOP;
    } else if (x === NB_SPECTROGRAM - 1) {
      height += MARGIN.BOTTOM;
    }
    return height;
  });

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
  const canvasHeight = Math.min(canvasWidth * CANVAS_WIDTH_TO_HEIGHT_RATIO, window.innerHeight * CANVAS_HEIGHT_WINDOW_FACTOR);
  const dimensions = {
    canvasWidth: canvasWidth,
    canvasHeight: canvasHeight,
    spectrogramWidth: canvasWidth - MARGIN.LEFT - MARGIN.RIGHT,
    spectrogramsHeight: canvasHeight - MARGIN.TOP - MARGIN.BOTTOM,
    singleSpectrogramCanvasHeight: getSpectrogramCanvasHeight(canvasHeight - MARGIN.TOP - MARGIN.BOTTOM),
    singleSpectrogramHeight: (canvasHeight - MARGIN.BOTTOM - MARGIN.TOP - PADDING) / NB_SPECTROGRAM,
  };

  const channelNames = _.filter(_.keys(data), (keyName) => !_.includes([FREQUENCY_KEY, HYPNOGRAM_KEY], keyName));
  const scalesAndAxesBySpectrogram = _.map(channelNames, (name) => getScalesAndAxes(data, name, dimensions));

  const canvas = parentDiv
    .append('canvas')
    .attr('width', dimensions.canvasWidth)
    .attr('height', dimensions.canvasHeight)
    .style('position', 'absolute');
  const svg = parentDiv.append('svg').attr('width', dimensions.canvasWidth).attr('height', dimensions.canvasHeight);

  createSpectrogramRectangles(canvas, scalesAndAxesBySpectrogram, dimensions);
  createSpectrogramAxesAndLegend(svg, scalesAndAxesBySpectrogram, channelNames, dimensions);
};

export default createSpectrogram;
