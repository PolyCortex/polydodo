import * as d3 from "d3";
import initializeBarChart from "./initBarChart";
import { CANVAS_WIDTH, CANVAS_HEIGHT, HEIGHT } from "./constants";

const createBarChart = async (containerNode) => {
  const svg = d3.select(containerNode);
  svg.attr("width", CANVAS_WIDTH).attr("height", CANVAS_HEIGHT);

  await initializeBarChart(svg, HEIGHT);
};

export default createBarChart;
