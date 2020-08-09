import { STAGES_ORDERED } from "d3/constants";
import { MARGIN } from "./constants";

const SQUARE_SIZE = 20;
const LABEL_Y_OFFSET = 55;
const COLOR_Y_OFFSET = 40;
const MAP_STAGE_TO_LABEL_OFFSET = {
  W: 0,
  REM: 55,
  N1: 135,
  N2: 200,
  N3: 270,
};
const MAP_STAGE_TO_COLOR_OFFSET = {
  W: MAP_STAGE_TO_LABEL_OFFSET.W + 25,
  REM: MAP_STAGE_TO_LABEL_OFFSET.REM + 50,
  N1: MAP_STAGE_TO_LABEL_OFFSET.N1 + 35,
  N2: MAP_STAGE_TO_LABEL_OFFSET.N2 + 35,
  N3: MAP_STAGE_TO_LABEL_OFFSET.N3 + 35,
};

export const createLegend = (svg, color) => {
  svg
    .selectAll("names")
    .data(STAGES_ORDERED)
    .enter()
    .append("text")
    .attr("class", "legend")
    .attr("x", (stage) => MAP_STAGE_TO_LABEL_OFFSET[stage])
    .attr("y", LABEL_Y_OFFSET)
    .text((d) => d)
    .style("fill", (_, i) => color(i))
    .style("font-size", "20px")
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .attr("transform", `translate(${MARGIN.LEFT}, 0)`);

  svg
    .selectAll("dots")
    .data(STAGES_ORDERED)
    .enter()
    .append("rect")
    .attr("class", "legend")
    .attr("x", (stage) => MAP_STAGE_TO_COLOR_OFFSET[stage])
    .attr("y", COLOR_Y_OFFSET)
    .attr("width", SQUARE_SIZE)
    .attr("height", SQUARE_SIZE)
    .style("fill", (_, i) => color(i))
    .attr("transform", `translate(${MARGIN.LEFT}, 0)`);
};
