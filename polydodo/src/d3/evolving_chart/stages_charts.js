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
    .attr("class", "rect-stacked")
    .attr("x", ({ start }) => x(start))
    .attr("width", ({ end, start }) => x(end) - x(start))
    .attr("fill", ({ stage }) => color(stage));

export const createTimelineChart = (g, annotations, x, color, tooltip) => {
  const annotationRects = g
    .selectAll(".rect")
    .data(annotations)
    .enter()
    .append("rect");
  setAttrOnAnnotationRects(annotationRects, x, color, tooltip).attr("y", 0);
};
