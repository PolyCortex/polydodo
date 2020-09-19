import * as d3 from 'd3';
import _ from 'lodash';
import {
  MARGIN,
  NB_POINTS_COLOR_INTERPOLATION,
  TITLE_FONT_SIZE,
  TITLE_POSITION_Y,
} from './constants';

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

const drawTitle = (g, channelName, spectrogramWidth) =>
  g
    .append('text')
    .attr('x', spectrogramWidth / 2)
    .attr('y', TITLE_POSITION_Y)
    .style('text-anchor', 'middle')
    .style('font-size', TITLE_FONT_SIZE)
    .text(`Spectrogram of channel ${channelName}`);

const drawAxes = (
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
    .selectAll('text');

  g.append('g').attr('class', 'y axis').call(yAxis).selectAll('text');
};

const drawLegend = (svg, color, y, spectrogramHeight) => {
  const interpolate = d3.interpolate(color.domain()[0], color.domain()[1]);

  const colors = _.map(_.range(NB_POINTS_COLOR_INTERPOLATION + 1), (x) =>
    color(interpolate(x / NB_POINTS_COLOR_INTERPOLATION)),
  );

  const svgDefs = svg.append('defs');
  const GRADIENT_ID = 'mainGradient';

  svgDefs
    .append('linearGradient')
    .attr('id', GRADIENT_ID)
    .attr('x1', '0%')
    .attr('x2', '0%')
    .attr('y1', '100%')
    .attr('y2', '0%')
    .selectAll('stop')
    .data(colors)
    .enter()
    .append('stop')
    .attr('stop-color', (d) => d)
    .attr('offset', (_, i) => i / (colors.length - 1));
  svg
    .append('rect')
    .attr('fill', `url(#${GRADIENT_ID})`)
    .attr('x', MARGIN.RIGHT / 10)
    .attr('y', 0)
    .attr('width', MARGIN.RIGHT / 6)
    .attr('height', spectrogramHeight);

  const yAxis = d3.axisRight(y).ticks(5, 's');
  svg
    .append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${MARGIN.RIGHT / 3.7},0)`)
    .call(yAxis)
    .selectAll('text');

  svg
    .append('text')
    .attr('class', 'y axis')
    .attr('transform', 'rotate(90)')
    .attr('y', -MARGIN.RIGHT)
    .attr('x', spectrogramHeight / 2)
    .attr('dy', '1em')
    .attr('fill', 'currentColor')
    .style('text-anchor', 'middle')
    .text('Power (uV²/Hz)');
};

const drawSpectrogramAxesAndLegend = (
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

      drawTitle(spectrogramDrawingGroup, channel, spectrogramWidth);
      drawAxes(
        spectrogramDrawingGroup,
        xAxis,
        yAxis,
        singleSpectrogramHeight,
        spectrogramWidth,
      );
      drawLegend(legendDrawingGroup, color, yColor, singleSpectrogramHeight);
    },
  );

export default drawSpectrogramAxesAndLegend;
