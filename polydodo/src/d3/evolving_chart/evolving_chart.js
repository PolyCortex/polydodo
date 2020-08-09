import * as d3 from "d3";
import _ from "lodash";
import moment from "moment";

import { preprocessData } from "./preproc";
import { barLegend } from "./legend";
import {
  setAttrOnAnnotationRects,
  createVerticalAxis,
  createProportionLabels,
  getCumulativeProportionOfNightAtStartOfStage,
} from "./stages_charts";
import {
  WIDTH,
  HEIGHT,
  MARGIN,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  BAR_HEIGHT,
} from "./constants";
import {
  EPOCH_DURATION_MS,
  TRANSITION_TIME_MS,
  STAGES_ORDERED,
  STAGE_TO_COLOR,
} from "../constants";
import { initializeTooltips } from "./mouse_over";

export let instanceChartCallbacks = {};
export let timelineChartCallbacks = {};
export let barChartCallbacks = {};
export let stackedBarChartCallbacks = {};

const initializeScales = () => {
  const xTime = d3.scaleTime([0, WIDTH]);
  const xLinear = d3.scaleLinear([0, WIDTH]);
  const y = d3.scaleOrdinal(_.range(0, HEIGHT + 1, BAR_HEIGHT));
  const colors = d3.scaleOrdinal(STAGES_ORDERED.map((x) => STAGE_TO_COLOR[x]));

  return { xTime, xLinear, y, colors };
};

const setDomainOnScales = (xTime, xLinear, y, colors, epochs) => {
  const start = _.first(epochs).timestamp;
  const end = _.last(epochs).timestamp;
  const nightDuration = moment.duration(moment(end).diff(start));

  xTime.domain([start, end]);
  xLinear.domain([0, nightDuration.asHours()]);
  y.domain(STAGES_ORDERED);
  colors.domain(STAGES_ORDERED);
};

const initializeAxes = (xTime, xLinear, y) => {
  const xTimeAxis = d3.axisBottom(xTime).tickFormat((d) => `${d.getHours()}h`);
  const xLinearAxis = d3.axisBottom(xLinear).tickFormat((d) => `${d}h`);
  const yAxis = d3.axisLeft(y).tickSize(-WIDTH); //will create the lines in second visualisation

  return { xTimeAxis, xLinearAxis, yAxis };
};

const createDrawingGroup = (svg) => {
  return svg
    .append("g")
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);
};

const bindAnnotationsToRects = (g, annotations) =>
  g
    .selectAll(".rect")
    .data(annotations)
    .enter()
    .append("rect")
    .attr("class", "rect-stacked");

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

const createInstanceChartCallbacks = (g, x, xTimeAxis, yAxis, color, tooltip) =>
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

const createBarChartCallbacks = (g, data, xAxisLinear, tip, yAxis, color) =>
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

const createStackedBarChartCallbacks = (
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

const createEvolvingChart = (containerNode, data) => {
  const svg = d3
    .select(containerNode)
    .attr("width", CANVAS_WIDTH)
    .attr("height", CANVAS_HEIGHT);
  const { xTime, xLinear, y, colors } = initializeScales();
  const { xTimeAxis, xLinearAxis, yAxis } = initializeAxes(xTime, xLinear, y);
  const gBarChart = createDrawingGroup(svg);

  data = preprocessData(data);

  setDomainOnScales(xTime, xLinear, y, colors, data.epochs);
  const { barToolTip, stackedToolTip } = initializeTooltips(svg, data);
  bindAnnotationsToRects(gBarChart, data.annotations);

  timelineChartCallbacks = createTimelineChartCallbacks(
    gBarChart,
    xTime,
    colors,
    barToolTip,
    xTimeAxis
  );

  instanceChartCallbacks = createInstanceChartCallbacks(
    gBarChart,
    xTime,
    xTimeAxis,
    yAxis,
    colors,
    barToolTip
  );

  barChartCallbacks = createBarChartCallbacks(
    gBarChart,
    data,
    xLinearAxis,
    stackedToolTip,
    yAxis,
    colors
  );

  stackedBarChartCallbacks = createStackedBarChartCallbacks(
    gBarChart,
    data.annotations,
    data.firstStageIndexes,
    data.stageTimeProportions,
    data.epochs.length
  );

  timelineChartCallbacks.fromInitial();

  //get tick
  d3.selectAll('.tick').select('text').style('font-weight', 540);

  barLegend(svg, colors);
};

export default createEvolvingChart;
