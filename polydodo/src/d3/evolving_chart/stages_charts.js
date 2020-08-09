import * as d3 from "d3";

import { TRANSITION_TIME_MS } from "../constants";
import { BAR_HEIGHT } from "./constants";

export const setAttrOnAnnotationRects = (annotationRects, x, color, tooltip) =>
  annotationRects
    .on("mouseover", function (d) {
      tooltip.show(d, this);
      d3.select(this).style("opacity", 0.8);
    })
    .on("mouseout", function () {
      tooltip.hide();
      d3.select(this).style("opacity", 1);
    })
    .attr("height", BAR_HEIGHT)
    .transition()
    .duration(TRANSITION_TIME_MS)
    .attr("x", ({ start }) => x(start))
    .attr("width", ({ end, start }) => x(end) - x(start))
    .attr("fill", ({ stage }) => color(stage));

export const createVerticalAxis = (g, yAxis, color) =>
  g
    .append("g")
    .attr("class", "y axis")
    .style("font-size", "1.5rem")
    .transition()
    .duration(TRANSITION_TIME_MS)
    .call(yAxis)
    .selectAll("text")
    .attr("class", "y-label")
    .attr("y", BAR_HEIGHT / 2)
    .attr("x", -10)
    .style("fill", (d) => color(d))
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");

export const createTimeAxis = (g, xTimeAxis) =>
  g
    .append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${BAR_HEIGHT})`)
    .call(xTimeAxis);