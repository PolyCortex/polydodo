import * as d3 from "d3";
import _ from "lodash";
import {
  MARGIN,
  SPECTROGRAM_HEIGHT,
  NB_POINTS_COLOR_INTERPOLATION,
  TITLE_FONT_SIZE,
} from "./constants";

export const createLegend = (svg, color, y) => {
  const interpolate = d3.interpolate(color.domain()[0], color.domain()[1]);

  const colors = _.map(_.range(NB_POINTS_COLOR_INTERPOLATION + 1), (x) =>
    color(interpolate(x / NB_POINTS_COLOR_INTERPOLATION))
  );

  const svgDefs = svg.append("defs");
  const GRADIENT_ID = "mainGradient";

  svgDefs
    .append("linearGradient")
    .attr("id", GRADIENT_ID)
    .attr("x1", "0%")
    .attr("x2", "0%")
    .attr("y1", "100%")
    .attr("y2", "0%")
    .selectAll("stop")
    .data(colors)
    .enter()
    .append("stop")
    .attr("stop-color", (d) => d)
    .attr("offset", (_, i) => i / (colors.length - 1));

  svg
    .append("rect")
    .attr("fill", `url(#${GRADIENT_ID})`)
    .attr("x", MARGIN.RIGHT / 10)
    .attr("y", 0)
    .attr("width", MARGIN.RIGHT / 6)
    .attr("height", SPECTROGRAM_HEIGHT);

  const yAxis = d3.axisRight(y).ticks(5, "s");
  svg
    .append("g")
    .attr("class", "y axis")
    .attr("transform", `translate(${MARGIN.RIGHT / 3.7},0)`)
    .call(yAxis)
    .selectAll("text");

  svg
    .append("text")
    .attr("class", "y axis")
    .attr("transform", "rotate(90)")
    .attr("y", -MARGIN.RIGHT)
    .attr("x", SPECTROGRAM_HEIGHT / 2)
    .attr("dy", "1em")
    .attr("fill", "currentColor")
    .style("text-anchor", "middle")
    .style("font-size", TITLE_FONT_SIZE)
    .text("Power (uV²/Hz)");
};
