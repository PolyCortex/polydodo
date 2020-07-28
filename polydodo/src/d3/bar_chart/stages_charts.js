import * as d3 from "d3";
import moment from "moment";

import { TRANSITION_TIME_MS, EPOCH_DURATION_MS } from "../constants";
import { BAR_HEIGHT, WIDTH } from "./constants";

export const createStackedBarChart = (g, sources, x, color, tip) => {
  g.selectAll(".rect")
    .data(sources)
    .enter()
    .append("rect")
    .attr("class", "rect-stacked")
    .attr("x", (d) => x(d.start))
    .attr("y", 0)
    .attr("width", (d) => x(d.end) - x(d.start))
    .attr("height", BAR_HEIGHT)
    .attr("fill", (d) => color(d.stage))
    .on("mouseover", function (d) {
      tip.show(d, this);
      d3.select(this).style('opacity', 0.8);
    })
    .on('mouseout', function () {
      tip.hide();
      d3.select(this).style('opacity', 1);
    });
};

export const createStagesDurationAxes = (data, xAxis) => {
  var sleepDiff = data[data.length - 1].end.getTime() - data[0].start.getTime();
  var sleepTotal = sleepDiff / (1000 * 60 * 60);

  var newscale = d3.scaleLinear().domain([0, sleepTotal]).range([0, WIDTH]);

  xAxis.scale(newscale).tickFormat((d) => d + ' h');
};

export const createSmallStackedBarChart = (
  g,
  pourcentageData,
  data,
  name,
  totalTimeStamp,
  xAxis,
  color
) => {
  var stackedBar = g
    .selectAll(".stacked-bar")
    .data(pourcentageData)
    .enter()
    .append("g");

  stackedBar
    .append('rect')
    .transition()
    .duration(TRANSITION_TIME_MS)
    .attr('class', 'rect-stacked')
    .attr(
      'x',
      (d, i) =>
        pourcentageData
          .slice(0, i)
          .map((a) => a.value)
          .reduce((a, b) => a + b, 0) * WIDTH
    )
    .attr("width", (d) => d.value * WIDTH)
    .attr("height", 80)
    .attr("fill", (d) => color(d.stage))
    .on("end", () => {
      g.selectAll(".pourcentage").style("opacity", 1);
      g.selectAll(".label-sleepType").style("opacity", 1);
    });

  var text = stackedBar.append('text').attr('class', 'pourcentage');

  text
    .append("tspan")
    .text((d) =>
      moment.utc(d.value * totalTimeStamp * EPOCH_DURATION_MS).format("HH:mm")
    )
    .attr(
      'x',
      (d, i) =>
        pourcentageData
          .slice(0, i)
          .map((a) => a.value)
          .reduce((a, b) => a + b, 0) *
          WIDTH +
        (pourcentageData[i].value / 2) * WIDTH
    )
    .attr("y", BAR_HEIGHT / 3)
    .attr("font-size", "25px")
    .attr("font-weight", 15);

  text
    .append('tspan')
    .text((d) => d.value * 100 + '%')
    .attr('x', (d, i) => {
      return (
        pourcentageData
          .slice(0, i)
          .map((a) => a.value)
          .reduce((a, b) => a + b, 0) *
          WIDTH +
        (pourcentageData[i].value / 2) * WIDTH
      );
    })
    .attr("y", (2 * BAR_HEIGHT) / 3)
    .attr("font-size", "20px")
    .attr("font-weight", 10);

  createStagesDurationAxes(data, xAxis);

  g.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + 80 + ')')
    .transition()
    .duration(TRANSITION_TIME_MS)
    .call(xAxis)
    .selectAll('text')
    .style('font-size', '18px');

  g.append("text")
    .attr("class", "label-sleepType")
    .attr("x", 0)
    .attr("y", -15)
    .text(name);
};
