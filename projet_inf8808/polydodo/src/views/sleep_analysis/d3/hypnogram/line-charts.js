import * as d3 from "d3";

export const createLine = (x, y) => {
  return d3.line()
    .x(d => x(d.timestamp))
    .y(d => y(d.sleep_stage))
    .curve(d3.curveStepAfter);
};

export const createHypnogramChart = (g, data, line, color) => {
  g.selectAll()
      .data(data)
    .enter().append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("d", x => line(x.values))
    .attr("stroke", x => color(x.name))
    .attr("stroke-width", 2);
};
