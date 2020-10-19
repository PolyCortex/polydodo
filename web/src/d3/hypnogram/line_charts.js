import * as d3 from 'd3';
import _ from 'lodash';

import createMouseOver from './mouse_over';
import { DIMENSION, MARGIN } from './constants';

import '../style.css';

import './style.css';

const createHypnogramChart = (g, data, x, y, xAxis, yAxis, color, chartTitle, hypnogramNames, comparativeColors) => {
  const line = createLine(x, y);
  const g_chart = g.append('g');
  g_chart
    .selectAll()
    .data(data)
    .enter()
    .append('path')
    .attr('class', 'hypnogram__line')
    .attr('fill', 'none')
    .attr('d', (x) => line(x.values))
    .attr('stroke', (x) => color(x.name))
    .attr('stroke-width', 2);

  createMouseOver(g_chart, x, y, data, color);
  createAxes(g, xAxis, yAxis);
  createTitle(g, chartTitle);
  createLegend(g, hypnogramNames, comparativeColors);
};

const createLine = (x, y) =>
  d3
    .line()
    .x((d) => x(d.timestamp))
    .y((d) => y(d.sleepStage))
    .curve(d3.curveStepAfter);

const createAxes = (g, xAxis, yAxis) => {
  const { HEIGHT, WIDTH } = DIMENSION;

  g.append('g').attr('class', 'x visualization__axis').attr('transform', `translate(0,${HEIGHT})`).call(xAxis);

  g.append('g').attr('class', 'y visualization__axis').call(yAxis);

  g.append('text')
    .text('Time')
    .attr('text-anchor', 'end')
    .attr('x', WIDTH)
    .attr('y', HEIGHT + (2 / 3) * MARGIN.BOTTOM);

  g.append('text')
    .text('Sleep stage')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .attr('x', -HEIGHT / 2)
    .attr('y', -(2 / 3) * MARGIN.LEFT);
};

const createTitle = (g, title) => {
  g.append('text')
    .text(title)
    .attr('class', 'chart-title')
    .attr('text-anchor', 'middle')
    .attr('y', -(3 / 4) * MARGIN.TOP)
    .attr('x', (1 / 2) * DIMENSION.WIDTH);
};

const createLegend = (g, hypnogramNames, comparativeColors) => {
  const legendData = _.zip(hypnogramNames, comparativeColors).map((x) => {
    return {
      name: x[0],
      color: x[1],
    };
  });

  g.selectAll('.rect.legend')
    .data(legendData)
    .enter()
    .append('rect')
    .attr('class', 'legend')
    .attr('stroke-width', 1)
    .attr('fill', (x) => x.color)
    .attr('width', '1em')
    .attr('height', '1em')
    .attr('y', -(1 / 2) * MARGIN.TOP)
    .attr('x', (_, i) => `${i * 8}em`);

  g.selectAll('.text.legend')
    .data(legendData)
    .enter()
    .append('text')
    .attr('class', 'legend')
    .text((x) => x.name)
    .attr('font-size', 12)
    .attr('dominant-baseline', 'hanging')
    .attr('y', -(1 / 2) * MARGIN.TOP)
    .attr('dy', 0.25 + 'em')
    .attr('x', (_, i) => `${1.5 + i * 11}em`);
};

export default createHypnogramChart;
