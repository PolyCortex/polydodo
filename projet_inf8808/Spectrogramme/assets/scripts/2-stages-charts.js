"use strict";

/**
 * Fichier permettant de dessiner les graphiques "focus" et "contexte".
 */

/**
 * Crée le graphique focus.
 *
 * @param g         Le groupe SVG dans lequel le graphique doit être dessiné.
 * @param sources   Les données à utiliser.
 * @param x         L'échelle de l'axe des x
 * @param y         L'échelle de l'axe des y
 * @param color     L'échelle de couleurs ayant une couleur associée à un nom de rue.
 */
function createSpectrgrammeBarChart(g, sources, x, y, color, tip, xAxis, yAxis) {
  //Creating all the parts of the stacked bar chart
  g.selectAll(".rect")
    .data(sources)
    .enter()
    .append("rect")
      .attr("x", function (d) {
        return x(d.Timestamp);
      })
      .attr("y", function (d) {
        return y(d.Frequency);
      })
      .attr("width", function (d) {
        return x(d.Timestamp + 1) - x(d.Timestamp);
      })
      .attr("height", function (d) {
        return y.bandwidth();
      })
      .attr("fill", function(d) { 
        return color(d.Intensity); 
      }).on("mouseover", function(d, i) {
        tip.show(d);
        d3.select(this).style("opacity", 0.8);
      })
      .on("mouseout",function(d){
        tip.hide();
        d3.select(this).style("opacity", 1);
      }) 
}

/**
 * Obtient le texte associé à l'infobulle.
 *
 * @param d               Les données associées à la barre survollée par la souris.
 * @param currentData     Les données qui sont actuellement utilisées.
 * @param formatPercent   Fonction permettant de formater correctement un pourcentage.
 * @return {string}       Le texte à afficher dans l'infobulle.
 */

function getToolTipText(d) {
 //TODO : Fix name
  return `Intensité : <strong> ${d.Intensity.toFixed(2)} </strong> Stonks<br>\
          Fréquence: <strong> ${d.Frequency.toFixed(2)} </strong> Hz <br>\
          Moment: <strong> ${getDurationString(d.Timestamp)} </strong>`; 
}

function getDurationString(duration){
  var hours = Math.floor(duration)
  var minutes = (duration % 1.0) * 60.0
  var seconds = (minutes % 1.0) * 60.0
  minutes = Math.floor(minutes)
  seconds = Math.floor(seconds)
  
  return `${addZero(hours)}h ${addZero(minutes)}min ${addZero(seconds)}secs`
}

//Will add zero to display time in this format : 00:00:00 instead of 0:0:0
function addZero(i) {
  if (i < 10) i = "0" + i;
  return i;
}