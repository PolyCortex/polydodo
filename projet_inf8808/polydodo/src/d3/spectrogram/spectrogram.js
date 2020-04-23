import * as d3 from "d3";
import { initSpectrogram } from "./initSpectrogram";
import { initializeBarChart } from "../bar_chart/initBarChart";

const createSpectrogram = (countainerNode) => {
  /***** Configuration *****/

  /*** Dimensions ***/
  var margin = {
    top: 100,
    right: 150,
    bottom: 100,
    left: 100,
  };
  var canvasWidth = window.innerWidth / 1.9;
  var barCanvasHeight = window.innerHeight / 4;
  var spectroCanvasHeight = (window.innerHeight - barCanvasHeight) / 2;

  var width = canvasWidth - margin.left - margin.right;
  var spectroHeight = spectroCanvasHeight - margin.top - margin.bottom;
  var barHeight = barCanvasHeight - margin.top - margin.bottom;

  /***** Création des éléments *****/
  var svg = d3.select(countainerNode);

  svg
    .attr("width", canvasWidth)
    .attr("height", 2 * spectroCanvasHeight + barCanvasHeight);

  var barChart = svg
    .append("g")
    .attr("width", canvasWidth)
    .attr("height", barCanvasHeight);

  var spectrogramFPZ = svg
    .append("g")
    .attr("transform", "translate(0," + barCanvasHeight + ")")
    .attr("width", canvasWidth)
    .attr("height", spectroCanvasHeight);

  var spectrogramPZ = svg
    .append("g")
    .attr(
      "transform",
      "translate(0," + (barCanvasHeight + spectroCanvasHeight) + ")"
    )
    .attr("width", canvasWidth)
    .attr("height", spectroCanvasHeight);

  initializeBarChart(barChart, width, barHeight, margin, false);
  initSpectrogram(spectrogramFPZ, "Fpz_Cz", width, spectroHeight, margin);
  initSpectrogram(spectrogramPZ, "Pz_Oz", width, spectroHeight, margin);
};

export default createSpectrogram;
