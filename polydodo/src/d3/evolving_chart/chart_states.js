import * as d3 from "d3";
import _ from "lodash";
import moment from "moment";

import { BAR_HEIGHT, WIDTH } from "./constants";
import {
  EPOCH_DURATION_MS,
  TRANSITION_TIME_MS,
  STAGES_ORDERED,
} from "../constants";

export const createTimelineChartCallbacks = (g, x, color, tooltip, xTimeAxis) =>
  Object({
    fromInitial: () => {
      const annotationRects = g.selectAll(".rect-stacked");

      setAttrOnAnnotationRects(annotationRects, x, color, tooltip).attr("y", 0);
      g.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${BAR_HEIGHT})`)
        .call(xTimeAxis);
    },
    fromInstance: () => {
      g.selectAll(".y.axis").remove();

      g.selectAll(".rect-stacked")
        .transition()
        .duration(TRANSITION_TIME_MS)
        .attr("y", 0);

      g.select(".x.axis")
        .transition()
        .duration(TRANSITION_TIME_MS)
        .attr("transform", `translate(0, ${BAR_HEIGHT})`);
    },
  });

export const createInstanceChartCallbacks = (
  g,
  x,
  xTimeAxis,
  yAxis,
  color,
  tooltip
) =>
  Object({
    fromTimeline: () => {
      const annotationRects = g.selectAll(".rect-stacked");

      createVerticalAxis(g, yAxis, color);

      annotationRects
        .transition()
        .duration(TRANSITION_TIME_MS)
        .attr("y", (d) => BAR_HEIGHT * STAGES_ORDERED.indexOf(d.stage));

      g.select(".x.axis")
        .transition()
        .duration(TRANSITION_TIME_MS)
        .attr("transform", `translate(0, ${5 * BAR_HEIGHT})`);
    },
    fromBarChart: () => {
      g.selectAll("text.proportion").remove();

      g.select(".x.axis").transition().call(xTimeAxis);

      setAttrOnAnnotationRects(g.selectAll(".rect-stacked"), x, color, tooltip);
    },
  });

export const createBarChartCallbacks = (
  g,
  data,
  xAxisLinear,
  tip,
  yAxis,
  color
) =>
  Object({
    fromInstance: () => {
      const { firstStageIndexes, stageTimeProportions } = data;

      g.select(".x.axis").transition().call(xAxisLinear);

      //Move all part to the left and make the first bar of each row become the cumulative portion of the stage
      g.selectAll(".rect-stacked")
        .on("mouseover", function (d) {
          tip.show(d, this);
          d3.select(this).style("opacity", 0.8);
        })
        .on("mouseout", function () {
          tip.hide();
          d3.select(this).style("opacity", 1);
        })
        .transition()
        .attr("x", 0)
        .attr("width", ({ stage }, i) =>
          i === firstStageIndexes[stage]
            ? stageTimeProportions[stage] * WIDTH
            : 0
        )
        .duration(TRANSITION_TIME_MS)
        .on("end", () => g.selectAll("text.proportion").style("opacity", 1));

      createProportionLabels(g, data);
    },
    fromStackedBarChart: () => {
      g.selectAll("text.label-sleepType").remove();
      g.selectAll("text.proportion").remove();

      createVerticalAxis(g, yAxis, color);

      g.select(".x.axis")
        .transition()
        .duration(TRANSITION_TIME_MS)
        .attr("transform", `translate(0, ${5 * BAR_HEIGHT})`);

      g.selectAll(".rect-stacked")
        .transition()
        .duration(TRANSITION_TIME_MS / 2)
        .attr("y", (d) => BAR_HEIGHT * STAGES_ORDERED.indexOf(d.stage))
        .transition()
        .duration(TRANSITION_TIME_MS / 2)
        .attr("x", 0)
        .on("end", () => g.selectAll("text.proportion").style("opacity", 1));

      createProportionLabels(g, data);
    },
  });

export const createStackedBarChartCallbacks = (
  g,
  data,
  firstIndexes,
  totalStageProportions,
  totalTimeStamp
) =>
  Object({
    fromBarChart: () => {
      //Remove y axis and labels
      g.selectAll(".y.axis").remove();
      g.selectAll("text.proportion").remove();

      g.select(".x.axis")
        .transition()
        .duration(TRANSITION_TIME_MS)
        .attr("transform", `translate(0, ${BAR_HEIGHT})`);

      g.selectAll(".rect-stacked")
        .transition()
        .duration(TRANSITION_TIME_MS / 3)
        .attr(
          "x",
          ({ stage }) =>
            getCumulativeProportionOfNightAtStartOfStage(
              stage,
              totalStageProportions
            ) * WIDTH
        )
        .transition()
        .duration(TRANSITION_TIME_MS / 3)
        .attr("y", (d, i) => {
          if (i === firstIndexes[d.stage]) return 0;
        })
        .transition()
        .duration(TRANSITION_TIME_MS / 3)
        .attr("height", BAR_HEIGHT)
        .on("end", () => {
          g.selectAll(".pourcentage").style("opacity", 1);
          g.selectAll(".label-sleepType").style("opacity", 1);
        });

      const text = g
        .selectAll(".text")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "proportion")
        .append("tspan")
        .text((d, i) =>
          i === firstIndexes[d.stage]
            ? moment
                .utc(
                  totalStageProportions[d.stage] *
                    totalTimeStamp *
                    EPOCH_DURATION_MS
                )
                .format("HH:mm")
            : ""
        )
        .attr(
          "x",
          ({ stage }) =>
            (getCumulativeProportionOfNightAtStartOfStage(
              stage,
              totalStageProportions
            ) +
              totalStageProportions[stage] / 2) *
            WIDTH
        )
        .attr("y", (d, i) => {
          if (i === firstIndexes[d.stage]) return 40;
        })
        .attr("font-size", "25px")
        .attr("font-weight", 15);

      text
        .append("tspan")
        .text((d, i) =>
          i === firstIndexes[d.stage]
            ? Math.round(totalStageProportions[d.stage] * 1000) / 10 + "%"
            : ""
        )
        .attr(
          "x",
          ({ stage }) =>
            getCumulativeProportionOfNightAtStartOfStage(
              stage,
              totalStageProportions
            ) *
              WIDTH +
            (totalStageProportions[stage] / 2) * WIDTH
        )
        .attr("y", (d, i) => {
          if (i === firstIndexes[d.stage]) return 60;
        })
        .attr("font-size", "20px")
        .attr("font-weight", 10);

      //label
      g.append("text")
        .attr("class", "label-sleepType")
        .attr("x", 0)
        .attr("y", -15)
        .text("You");
    },
  });

const setAttrOnAnnotationRects = (annotationRects, x, color, tooltip) =>
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

const createVerticalAxis = (g, yAxis, color) =>
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

const createProportionLabels = (g, data) =>
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

const getCumulativeProportionOfNightAtStartOfStage = (
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
