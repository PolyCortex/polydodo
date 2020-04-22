/**
 * Fichier principal permettant de dessiner les graphiques.
 */
(function(d3, localization) {
  "use strict";
  /***** Configuration *****/
  
  /*** Dimensions ***/
  var margin = {
    top: 100,
    right: 150,
    bottom: 100,
    left: 100
  };
  var canvasWidth = 1920
  var barCanvasHeight = 600
  var spectroCanvasHeight = 600

  var width = canvasWidth - margin.left - margin.right;
  var spectroHeight = spectroCanvasHeight - margin.top - margin.bottom;
  var barHeight = barCanvasHeight - margin.top - margin.bottom;

  /***** Création des éléments *****/
  var svg = d3.select("visualisation")
    .append("svg")
    .attr("width", canvasWidth)
    .attr("height", 2*(spectroCanvasHeight) + barCanvasHeight);
  
  var barChart = svg.append('g')
      .attr("width", canvasWidth)
      .attr("height", barCanvasHeight);

  var spectrogramFPZ = svg.append("g")
      .attr("transform", "translate(0," + barCanvasHeight + ")")
      .attr("width", canvasWidth)
      .attr("height", spectroCanvasHeight);

  var spectrogramPZ = svg.append("g")
      .attr("transform", "translate(0," + (barCanvasHeight + spectroCanvasHeight) + ")")
      .attr("width", canvasWidth)
      .attr("height", spectroCanvasHeight);

  createBarChart(barChart, width, barHeight, margin)
  //createSpectrogram(spectrogramFPZ,"Fpz_Cz", width, spectroHeight, margin);
  //createSpectrogram(spectrogramPZ,"Pz_Oz", width, spectroHeight, margin);
})(d3, localization);
