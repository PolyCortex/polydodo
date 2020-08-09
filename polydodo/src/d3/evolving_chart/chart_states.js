import * as d3 from "d3";
import _ from "lodash";
import moment from "moment";

import { BAR_HEIGHT, WIDTH } from "./constants";
import {
  EPOCH_DURATION_MS,
  TRANSITION_TIME_MS,
  STAGES_ORDERED,
} from "../constants";

export const createTimelineChartCallbacks = (
  g,
  xTime,
  xTimeAxis,
  color,
  tooltip
) =>
  Object({
    fromInitial: () => {
      const annotationRects = g.selectAll(".rect-stacked");

      setAttrOnAnnotationRects(annotationRects, xTime, color, tooltip).attr(
        "y",
        0
      );

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
  xTime,
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

      setAttrOnAnnotationRects(
        g.selectAll(".rect-stacked"),
        xTime,
        color,
        tooltip
      );
    },
  });

export const createBarChartCallbacks = (
  g,
  data,
  xAxisLinear,
  yAxis,
  color,
  tip
) =>
  Object({
    fromInstance: () => {
      const { firstStageIndexes, stageTimeProportions } = data;

      g.select(".x.axis").transition().call(xAxisLinear);

      //Move all part to the left and make the first bar of each row become the cumulative portion of the stage
      setTooltip(g.selectAll(".rect-stacked"), tip)
        .transition()
        .duration(TRANSITION_TIME_MS)
        .attr("x", 0)
        .attr("width", ({ stage }, i) =>
          i === firstStageIndexes[stage]
            ? stageTimeProportions[stage] * WIDTH
            : 0
        )
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

export const createStackedBarChartCallbacks = (g, data) =>
  Object({
    fromBarChart: () => {
      const {
        annotations,
        firstStageIndexes,
        stageTimeProportions,
        epochs,
      } = data;
      //Remove y axis and labels
      g.selectAll(".y.axis").remove();
      g.selectAll("text.proportion").remove();

      g.select(".x.axis")
        .transition()
        .duration(TRANSITION_TIME_MS)
        .attr("transform", `translate(0, ${BAR_HEIGHT})`);

      g.selectAll(".rect-stacked")
        .transition()
        .duration(TRANSITION_TIME_MS / 2)
        .attr(
          "x",
          ({ stage }) =>
            getCumulativeProportionOfNightAtStartOfStage(
              stage,
              stageTimeProportions
            ) * WIDTH
        )
        .transition()
        .duration(TRANSITION_TIME_MS / 2)
        .attr("y", 0);

      const text = g
        .selectAll(".text")
        .data(annotations)
        .enter()
        .append("text")
        .attr("class", "proportion")
        .style("text-anchor", "middle")
        .append("tspan")
        .text((d, i) =>
          i === firstStageIndexes[d.stage]
            ? moment
                .utc(
                  stageTimeProportions[d.stage] *
                    epochs.length *
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
              stageTimeProportions
            ) +
              stageTimeProportions[stage] / 2) *
            WIDTH
        )
        .attr("y", (d, i) => {
          if (i === firstStageIndexes[d.stage]) return 40;
        })
        .attr("font-size", "25px")
        .attr("font-weight", 15);

      text
        .append("tspan")
        .text((d, i) =>
          i === firstStageIndexes[d.stage]
            ? Math.round(stageTimeProportions[d.stage] * 1000) / 10 + "%"
            : ""
        )
        .attr(
          "x",
          ({ stage }) =>
            getCumulativeProportionOfNightAtStartOfStage(
              stage,
              stageTimeProportions
            ) *
              WIDTH +
            (stageTimeProportions[stage] / 2) * WIDTH
        )
        .attr("y", (d, i) => {
          if (i === firstStageIndexes[d.stage]) return 60;
        })
        .attr("font-size", "20px")
        .attr("font-weight", 10);
    },
  });

const setAttrOnAnnotationRects = (annotationRects, x, color, tooltip) =>
  setTooltip(annotationRects, tooltip)
    .attr("height", BAR_HEIGHT)
    .transition()
    .duration(TRANSITION_TIME_MS)
    .attr("x", ({ start }) => x(start))
    .attr("width", ({ end, start }) => x(end) - x(start))
    .attr("fill", ({ stage }) => color(stage));

const setTooltip = (element, tooltip) =>
  element
    .on("mouseover", function (d) {
      tooltip.show(d, this);
      d3.select(this).style("opacity", 0.8);
    })
    .on("mouseout", function () {
      tooltip.hide();
      d3.select(this).style("opacity", 1);
    });

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
