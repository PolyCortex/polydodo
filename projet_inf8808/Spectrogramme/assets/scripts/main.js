/**
 * Fichier principal permettant de dessiner les deux graphiques demandés. Ce fichier utilise les autres fichiers
 * que vous devez compléter.
 *
 * 
 */
(function(d3, localization) {
  "use strict";
  /***** Configuration *****/
  // Graphique principal ()
  var margin = {
    top: 100,
    right: 150,
    bottom: 100,
    left: 100
  };
  var width = 2000 /*- margin.left - margin.right*/;
  var height = 1200 - margin.top - margin.bottom;
  /***** Création des éléments *****/
  var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", 2*(height + margin.top + margin.bottom));

  createSpectrogram(svg, width, height, margin);
})(d3, localization);
