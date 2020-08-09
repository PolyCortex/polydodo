import * as d3 from "d3";
import moment from "moment";
import _ from "lodash";

import {
  createStagesDurationAxes,
  setAttrOnAnnotationRects,
} from "./stages_charts";
import {
  TRANSITION_TIME_MS,
  STAGES_ORDERED,
  EPOCH_DURATION_MS,
} from "../constants";
import { BAR_HEIGHT, WIDTH } from "./constants";

export let firstCallback = () => {};
export let secondCallback = () => {};
export let thirdCallback = () => {};
export let fourthCallback = () => {};
export let fifthCallback = () => {};

export const addTransitions = (
  g,
  sources,
  color,
  tipStacked,
  x,
  xAxis,
  yAxis,
  firstStageIndex,
  totalStageProportions,
  totalTimeStamp,
  tooltip
) => {
  firstCallback = instanceChartState(g, x, xAxis, yAxis, color, tooltip);
  secondCallback = secondTransition(
    g,
    sources,
    firstStageIndex,
    totalStageProportions,
    xAxis,
    tipStacked
  );
  thirdCallback = thirdTransition(
    g,
    sources,
    firstStageIndex,
    totalStageProportions,
    totalTimeStamp
  );
};

const instanceChartState = (g, x, xAxis, yAxis, color, tooltip) => () => {
  const annotationRects = g.selectAll(".rect-stacked");

  g.selectAll(".y.axis").remove();
  g.selectAll("text.pourcentage").remove();

  g.append("g")
    .attr("class", "y axis")
    .transition()
    .duration(TRANSITION_TIME_MS)
    .call(yAxis)
    .selectAll("text")
    .attr("class", "y-label")
    .attr("y", BAR_HEIGHT / 2)
    .attr("x", -10)
    .style("fill", (d) => color(d))
    .style("font-size", "20px")
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");

  //Move every sleep stage portion to the correspending stage row
  setAttrOnAnnotationRects(annotationRects, x, color, tooltip)
    .attr("y", (d) => BAR_HEIGHT * STAGES_ORDERED.indexOf(d.stage))
    .attr("height", BAR_HEIGHT);

  g.select(".x.axis")
    .transition()
    .attr("transform", `translate(0, ${5 * BAR_HEIGHT})`)
    .duration(TRANSITION_TIME_MS)
    .call(xAxis);
};

const secondTransition = (
  g,
  data,
  firstIndexes,
  totalStageProportions,
  xAxis,
  tip
) => () => {
  createStagesDurationAxes(data, xAxis, WIDTH);

  g.select(".x.axis").transition().duration(TRANSITION_TIME_MS).call(xAxis);

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
    .attr("width", (d, i) =>
      i === firstIndexes[d.stage] ? totalStageProportions[d.stage] * WIDTH : 0
    )
    .duration(TRANSITION_TIME_MS)
    .on("end", () => g.selectAll(".pourcentage").style("opacity", 1));

  //text containing the % of the sleep stage on the bar
  g.selectAll("text.pourcentage")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "pourcentage")
    .text((d, i) =>
      i === firstIndexes[d.stage]
        ? Math.round(totalStageProportions[d.stage] * 1000) / 10 + "%"
        : ""
    )
    .attr("x", WIDTH / 20)
    .attr(
      "y",
      (d) => BAR_HEIGHT * STAGES_ORDERED.indexOf(d.stage) + BAR_HEIGHT / 2
    )
    .style("fill", "black");
};

const thirdTransition = (
  g,
  data,
  firstIndexes,
  totalStageProportions,
  totalTimeStamp
) => () => {
  //Remove y axis and labels
  g.selectAll(".y.axis").remove();
  g.selectAll(".pourcentage").remove();

  g.select(".x.axis")
    .transition()
    .attr("transform", `translate(0, ${BAR_HEIGHT})`)
    .duration(TRANSITION_TIME_MS);

  //first barChart
  var stackedBar = g.selectAll(".rect-stacked");

  stackedBar
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

  var text = g
    .selectAll(".text")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "pourcentage");

  text
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

  //percentage
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
};

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
