import * as d3 from 'd3';
import { initSpectrogram } from './initSpectrogram';
import initializeBarChart from '../bar_chart/initBarChart';

const createSpectrogram = (containerNode, data) => {
  const margin = {
    top: 100,
    right: 200,
    bottom: 50,
    left: 70,
  };

  var canvasWidth = 1000;
  var canvisHeight = 1200;
  var barCanvasHeight = canvisHeight / 6;
  var spectroCanvasHeight = (canvisHeight - barCanvasHeight) / 2;

  var width = canvasWidth - margin.left - margin.right;
  var spectroHeight = spectroCanvasHeight - margin.top - margin.bottom;

  var svg = d3.select(containerNode);

  svg.attr('width', canvasWidth).attr('height', 2 * spectroCanvasHeight + barCanvasHeight);

  var barChart = svg.append('g').attr('width', canvasWidth).attr('height', barCanvasHeight);

  var spectrogramFPZ = svg
    .append('g')
    .attr('transform', 'translate(0,' + barCanvasHeight + ')')
    .attr('width', canvasWidth)
    .attr('height', spectroCanvasHeight);

  var spectrogramPZ = svg
    .append('g')
    .attr('transform', 'translate(0,' + (barCanvasHeight + spectroCanvasHeight) + ')')
    .attr('width', canvasWidth)
    .attr('height', spectroCanvasHeight);

  initializeBarChart(barChart, data, false);
  initSpectrogram(spectrogramFPZ, "Fpz_Cz", width, spectroHeight, margin);
  initSpectrogram(spectrogramPZ, "Pz_Oz", width, spectroHeight, margin);
};

export default createSpectrogram;
