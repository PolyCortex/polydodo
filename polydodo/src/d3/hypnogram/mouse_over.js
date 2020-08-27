import * as d3 from 'd3';
import { DIMENSION, MARGIN } from './constants';

const getHoveredData = (data, x, mouse, bisectTime) => {
  const timestamps = data[0].values.map((x) => x.timestamp);
  const currentTimeDate = x.invert(mouse[0]);
  const idx = bisectTime(timestamps, currentTimeDate, 1);
  const epochIdx = currentTimeDate - timestamps[idx - 1] > timestamps[idx] - currentTimeDate ? idx : idx - 1;

  return data.map((x) => {
    x.currentValue = x.values[epochIdx];
    return x;
  });
};

const createMouseOver = (g, x, y, data, color) => {
  const { WIDTH, HEIGHT } = DIMENSION;
  const bisectTime = d3.bisector((d) => d).left; // https://github.com/d3/d3-array#bisector_left

  // Act as a child of `g` to make sure mouse events are received from the whole chart (not only the lines)
  g.append('rect').attr('width', WIDTH).attr('height', HEIGHT).attr('opacity', 0);

  const lineHover = g
    .append('line')
    .attr('class', 'lineHover')
    .attr('y1', HEIGHT)
    .attr('y2', 0)
    .attr('stroke-width', 1)
    .style('stroke', '#999')
    .style('shape-rendering', 'crispEdges')
    .style('opacity', 0);

  const dateHover = g
    .append('text')
    .attr('class', 'lineHoverDate')
    .attr('text-anchor', 'middle')
    .attr('font-size', 15)
    .attr('font-weight', 'bold')
    .style('opacity', 0);

  const circleHover = g
    .selectAll('.hoverCircle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'hoverCircle')
    .style('fill', 'none')
    .attr('stroke', (x) => color(x.name))
    .attr('r', 5)
    .attr('stroke-width', '1px')
    .style('opacity', 0);

  const textHover = g
    .selectAll('.textHover')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'textHover')
    .style('fill', 'black')
    .attr('text-anchor', 'start')
    .attr('font-size', 12)
    .style('opacity', 0)
    .attr('stroke', (x) => color(x.name))
    .attr('dy', (_, i) => 1 + i * 1.25 + 'em');

  const mouseMove = function () {
    const mouse = d3.mouse(this);

    const hoveredData = getHoveredData(data, x, mouse, bisectTime);
    const timestamp = hoveredData[0].currentValue.timestamp;

    lineHover.attr('x1', mouse[0]).attr('x2', mouse[0]).style('opacity', 1);

    dateHover
      .text(d3.timeFormat('%H:%M:%S')(timestamp))
      .attr('transform', `translate(${x(timestamp)},${HEIGHT + MARGIN.BOTTOM - 10})`)
      .style('opacity', 1);

    circleHover
      .attr('cy', (x) => y(x.currentValue.sleepStage))
      .attr('cx', x(timestamp))
      .style('opacity', 1);

    textHover
      .attr('transform', `translate(${x(timestamp)},${(5 / 6) * HEIGHT})`)
      .text((x) => `${x.name}: ${x.currentValue.sleepStage}`)
      .style('opacity', 1);

    x(timestamp) > (4 / 5) * WIDTH ? textHover.attr('text-anchor', 'end').attr('dx', -10) : textHover.attr('text-anchor', 'start').attr('dx', 10);
  };

  const mouseLeave = () => {
    lineHover.style('opacity', 0);
    dateHover.style('opacity', 0);
    circleHover.style('opacity', 0);
    textHover.style('opacity', 0);
  };

  g.on('mousemove', mouseMove).on('mouseleave', mouseLeave);
};

export default createMouseOver;
