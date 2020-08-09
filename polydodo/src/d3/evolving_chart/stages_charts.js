import * as d3 from "d3";
import _ from "lodash";

import { BAR_HEIGHT, WIDTH } from "./constants";
import { TRANSITION_TIME_MS, STAGES_ORDERED } from "../constants";

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

export const createProportionLabels = (g, data) =>
  g
    .selectAll("text.proportion")
    .data(data.annotations)
    .enter()
    .append("text")
    .attr("class", "proportion")
    .text(({ stage }, i) =>
      i === data.firstStageIndexes[stage]
        ? Math.round(data.stageTimeProportions[stage] * 1000) / 10 + "%"
        : ""
    )
    .attr("x", WIDTH / 20)
    .attr(
      "y",
      ({ stage }) => BAR_HEIGHT * STAGES_ORDERED.indexOf(stage) + BAR_HEIGHT / 2
    )
    .style("fill", "black");

export const getCumulativeProportionOfNightAtStartOfStage = (
  stage,
  totalStageProportions
) =>
  _.sum(
    _.slice(
      STAGES_ORDERED.map(
        (stage_ordered) => totalStageProportions[stage_ordered]
      ),
      0,
      _.indexOf(STAGES_ORDERED, stage)
    )
  );
