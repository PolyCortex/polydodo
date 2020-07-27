import { STAGES } from "d3/constants";

export const barLegend = (svg, color) => {
  var size = 20;

  svg
    .selectAll("dots")
    .data(STAGES)
    .enter()
    .append('rect')
    .attr('class', 'legend')
    .attr('x', function (d, i) {
      if (i === 0) return 30;
      else if (i === STAGES.length - 1) return 50 + i * 60;
      else return 30 + i * 60;
    })
    .attr('y', 40)
    .attr('width', size)
    .attr('height', size)
    .style('fill', function (d, i) {
      return color(i);
    })
    .attr("transform", "translate(" + 100 + "," + 0 + ")");

  svg
    .selectAll("names")
    .data(STAGES)
    .enter()
    .append('text')
    .attr('class', 'legend')
    .attr('x', function (d, i) {
      return i * 60;
    })
    .attr('y', 53)
    .text(function (d) {
      return d;
    })
    .style('fill', function (d, i) {
      return color(i);
    })
    .style('font-size', '20px')
    .attr('text-anchor', 'left')
    .style('alignment-baseline', 'middle')
    .attr('transform', 'translate(' + 100 + ',' + 0 + ')');
};
