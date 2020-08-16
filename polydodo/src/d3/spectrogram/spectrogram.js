import * as d3 from "d3";
import { initSpectrogram } from "./initSpectrogram";
import { CANVAS_DIMENSION, SPECTROGRAM_CANVAS_HEIGTH } from "./constants";

const createSpectrogram = (containerNode, data) => {
  const svg = d3.select(containerNode);

  svg
    .attr("width", CANVAS_DIMENSION.WIDTH)
    .attr("height", CANVAS_DIMENSION.HEIGHT);

  const spectrogramFPZCZ = svg
    .append("g")
    .attr("width", CANVAS_DIMENSION.WIDTH)
    .attr("height", SPECTROGRAM_CANVAS_HEIGTH);

  const spectrogramPZOZ = svg
    .append("g")
    .attr("transform", `translate(0, ${SPECTROGRAM_CANVAS_HEIGTH})`)
    .attr("width", CANVAS_DIMENSION.WIDTH)
    .attr("height", SPECTROGRAM_CANVAS_HEIGTH);

  initSpectrogram(spectrogramFPZCZ, "Fpz_Cz", data);
  initSpectrogram(spectrogramPZOZ, "Pz_Oz", data);
};

export default createSpectrogram;
