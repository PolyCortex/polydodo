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
import { createLegend } from './legend';
import { convertTimestampsToDates } from '../utils';

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

const initializeScales = ({ spectrogramWidth, singleSpectrogramHeight }) =>
  Object({
    x: d3.scaleTime([0, spectrogramWidth]),
    yLinear: d3.scaleLinear([singleSpectrogramHeight, 0]),
    yBand: d3.scaleBand([singleSpectrogramHeight, 0]),
    yColor: d3.scaleLinear([singleSpectrogramHeight, 0]),
    color: d3.scaleSequential().interpolator(d3.interpolatePlasma),
  });

const initializeAxes = (x, y) =>
  Object({
    xAxis: d3.axisBottom(x).tickFormat((d) => `${d.getHours()}h`),
    yAxis: d3.axisLeft(y).ticks(5, 's'),
  });

const setDomainOnScales = (
  { rectangles, frequencies },
  x,
  yBand,
  yLinear,
  color,
  yColor,
) => {
  x.domain([_.first(rectangles).Timestamp, _.last(rectangles).Timestamp]);
  yBand.domain(frequencies);
  yLinear.domain([_.first(frequencies), _.last(frequencies)]);
  color.domain(d3.extent(rectangles, ({ Intensity }) => Intensity));
  yColor.domain(d3.extent(rectangles, ({ Intensity }) => Intensity));
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
              Intensity: intensity,
              Frequency: frequency,
              Timestamp: timestamp,
            }),
        ),
    ),
  };
};

const createDrawingGroups = (g, spectrogramWidth) =>
  Object({
    spectrogramDrawingGroup: g
      .append('g')
      .attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`),
    legendDrawingGroup: g
      .append('g')
      .attr(
        'transform',
        `translate(${MARGIN.LEFT + spectrogramWidth}, ${MARGIN.TOP})`,
      ),
  });

const getScalesAndAxes = (data, dimensions) => {
  const { x, yLinear, yBand, yColor, color } = initializeScales(dimensions);
  const { xAxis, yAxis } = initializeAxes(x, yLinear);

  setDomainOnScales(data, x, yBand, yLinear, color, yColor);

  return { x, yBand, yColor, color, xAxis, yAxis };
};

const createAxes = (
  g,
  xAxis,
  yAxis,
  singleSpectrogramHeight,
  spectrogramWidth,
) => {
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

  g.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .selectAll('text')
    .style('font-size', TITLE_FONT_SIZE);
};

const createTitle = (g, channelName, spectrogramWidth) =>
  g
    .append('text')
    .attr('x', spectrogramWidth / 2)
    .attr('y', -MARGIN.TOP / 3)
    .style('text-anchor', 'middle')
    .style('font-size', TITLE_FONT_SIZE)
    .text(`Spectrogram of channel ${channelName}`);

const createSpectrogramRectangles = (
  canvas,
  scalesAndAxesBySpectrogram,
  data,
  { singleSpectrogramCanvasHeight },
) => {
  const context = canvas.node().getContext('2d');

  _.each(
    _.zip(scalesAndAxesBySpectrogram, data),
    ([{ x, yBand, color }, { rectangles, frequencies }], index) => {
      const rectangleWidth =
        x(rectangles[frequencies.length].Timestamp) -
        x(rectangles[0].Timestamp);

      context.resetTransform();
      context.translate(
        MARGIN.LEFT,
        MARGIN.TOP + index * singleSpectrogramCanvasHeight[index],
      );

      _.each(rectangles, ({ Timestamp, Frequency, Intensity }) => {
        context.beginPath();
        context.fillRect(
          x(Timestamp),
          yBand(Frequency),
          rectangleWidth,
          yBand.bandwidth(),
        );
        context.fillStyle = color(Intensity);
        context.fill();
        context.stroke();
      });
    },
  );
};

const createSpectrogramAxesAndLegend = (
  svg,
  scalesAndAxesBySpectrogram,
  data,
  {
    canvasWidth,
    spectrogramWidth,
    singleSpectrogramCanvasHeight,
    singleSpectrogramHeight,
  },
) =>
  _.forEach(
    _.zip(scalesAndAxesBySpectrogram, data),
    ([{ xAxis, yAxis, color, yColor }, { channel }], index) => {
      const currentSpectrogramDrawingGroup = svg
        .append('g')
        .attr(
          'transform',
          `translate(0, ${index * singleSpectrogramCanvasHeight[index]})`,
        )
        .attr('width', canvasWidth)
        .attr('height', singleSpectrogramCanvasHeight[index]);

      const {
        spectrogramDrawingGroup,
        legendDrawingGroup,
      } = createDrawingGroups(currentSpectrogramDrawingGroup, spectrogramWidth);

      createTitle(spectrogramDrawingGroup, channel, spectrogramWidth);
      createAxes(
        spectrogramDrawingGroup,
        xAxis,
        yAxis,
        singleSpectrogramHeight,
        spectrogramWidth,
      );
      createLegend(legendDrawingGroup, color, yColor, singleSpectrogramHeight);
    },
  );

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

  createSpectrogramRectangles(
    canvas,
    scalesAndAxesBySpectrogram,
    preprocessedData,
    dimensions,
  );
  createSpectrogramAxesAndLegend(
    svg,
    scalesAndAxesBySpectrogram,
    preprocessedData,
    dimensions,
  );
};

export default createSpectrogram;
