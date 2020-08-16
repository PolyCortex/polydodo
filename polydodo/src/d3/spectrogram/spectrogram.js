import * as d3 from "d3";
import { initSpectrogram } from "./initSpectrogram";

const createSpectrogram = (containerNode, data) => {
  const margin = {
    top: 100,
    right: 200,
    bottom: 50,
    left: 70,
  };

  const canvasWidth = 1000;
  const canvasHeight = 1200;
  const spectroCanvasHeight = canvasHeight / 2;

  const width = canvasWidth - margin.left - margin.right;
  const spectroHeight = spectroCanvasHeight - margin.top - margin.bottom;

  const svg = d3.select(containerNode);

  svg.attr("width", canvasWidth).attr("height", 2 * spectroCanvasHeight);

  const spectrogramFPZCZ = svg
    .append("g")
    .attr("width", canvasWidth)
    .attr("height", spectroCanvasHeight);

  const spectrogramPZOZ = svg
    .append("g")
    .attr("transform", `translate(0, ${spectroCanvasHeight})`)
    .attr("width", canvasWidth)
    .attr("height", spectroCanvasHeight);

  initSpectrogram(
    spectrogramFPZCZ,
    "Fpz_Cz",
    width,
    spectroHeight,
    margin,
    data
  );
  initSpectrogram(spectrogramPZOZ, "Pz_Oz", width, spectroHeight, margin, data);
};

export default createSpectrogram;
