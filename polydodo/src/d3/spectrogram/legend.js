import * as d3 from "d3";
import { MARGIN, SPECTROGRAM_HEIGHT } from "./constants";

export const legend = (svg, color, y) => {
  var interpolate = d3.interpolate(color.domain()[0], color.domain()[1]);

  var colors = [];
  var totalPoints = 3;
  for (let index = 0; index <= totalPoints; index++) {
    var interpolateIndex = index / totalPoints;
    var scaleIndex = interpolate(interpolateIndex);
    colors.push(color(scaleIndex));
  }

  var svgDefs = svg.append('defs');

  var mainGradient = svgDefs
    .append('linearGradient')
    .attr('id', 'mainGradient')
    .attr('x1', '0%')
    .attr('x2', '0%')
    .attr('y1', '100%')
    .attr('y2', '0%');

  mainGradient
    .selectAll('stop')
    .data(colors)
    .enter()
    .append('stop')
    .attr('stop-color', (d) => d)
    .attr('offset', (d, i) => i / (colors.length - 1));

  svg
    .append("rect")
    .attr("fill", "url(#mainGradient)")
    .attr("x", MARGIN.RIGHT / 4)
    .attr("y", 0)
    .attr("width", MARGIN.RIGHT / 4)
    .attr("height", SPECTROGRAM_HEIGHT);

  var yAxis = d3.axisRight(y).ticks(5, "s");
  svg
    .append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + MARGIN.RIGHT / 2 + ",0)")
    .call(yAxis)
    .selectAll('text')
    .style('font-size', '18px');

  // Titre axe des Y
  svg
    .append("text")
    .attr("class", "y axis")
    .attr("transform", "rotate(90)")
    .attr("y", -MARGIN.RIGHT)
    .attr("x", SPECTROGRAM_HEIGHT / 2)
    .attr("dy", "1em")
    .attr("fill", "currentColor")
    .style("text-anchor", "middle")
    .text("Puissance");
};
