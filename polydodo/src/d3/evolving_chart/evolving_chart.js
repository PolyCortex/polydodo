import * as d3 from "d3";
import _ from "lodash";
import moment from "moment";

import { preprocessData } from "./preproc";
import { barLegend } from "./legend";
import {
  setAttrOnAnnotationRects,
  createVerticalAxis,
  createTimeAxis,
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
  TRANSITION_TIME_MS,
  STAGES_ORDERED,
  STAGE_TO_COLOR,
} from "../constants";
import { initializeTooltips } from "./mouse_over";

export let instanceChartCallbacks = {};
export let timelineChartCallbacks = {};
export let barChartCallbacks = {};

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
    onEnter: () => {
      const annotationRects = g.selectAll(".rect-stacked");

      setAttrOnAnnotationRects(annotationRects, x, color, tooltip).attr("y", 0);
      createTimeAxis(g, xTimeAxis);
    },
    onExit: () => {},
  });

const createInstanceChartCallbacks = (g, x, xTimeAxis, yAxis, color, tooltip) =>
  Object({
    onEnter: () => {
      const annotationRects = g.selectAll(".rect-stacked");

      createVerticalAxis(g, yAxis, color);

      setAttrOnAnnotationRects(annotationRects, x, color, tooltip)
        .attr("y", (d) => BAR_HEIGHT * STAGES_ORDERED.indexOf(d.stage))
        .attr("height", BAR_HEIGHT);

      g.select(".x.axis")
        .transition()
        .attr("transform", `translate(0, ${5 * BAR_HEIGHT})`)
        .duration(TRANSITION_TIME_MS)
        .call(xTimeAxis);
    },
    onExit: () => {
      g.selectAll(".x.axis").remove();
      g.selectAll(".y.axis").remove();
    },
  });

const createBarChartCallbacks = (g, data, xAxisLinear, tip) =>
  Object({
    onEnter: () => {
      const { annotations, firstStageIndexes, stageTimeProportions } = data;

      g.select(".x.axis")
        .transition()
        .duration(TRANSITION_TIME_MS)
        .call(xAxisLinear);

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

      //text containing the % of the sleep stage on the bar
      g.selectAll("text.proportion")
        .data(annotations)
        .enter()
        .append("text")
        .attr("class", "proportion")
        .text(({ stage }, i) =>
          i === firstStageIndexes[stage]
            ? Math.round(stageTimeProportions[stage] * 1000) / 10 + "%"
            : ""
        )
        .attr("x", WIDTH / 20)
        .attr(
          "y",
          ({ stage }) =>
            BAR_HEIGHT * STAGES_ORDERED.indexOf(stage) + BAR_HEIGHT / 2
        )
        .style("fill", "black");
    },
    onExit: () => {
      g.selectAll(".y.axis").remove();
      g.selectAll("text.proportion").remove();
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
    stackedToolTip
  );

  timelineChartCallbacks.onEnter();

  //get tick
  d3.selectAll(".tick").select("text").style("font-weight", 540);

  barLegend(svg, colors);
};

export default createEvolvingChart;
