"use strict";

/**
 * Fichier permettant de dessiner les graphiques "focus" et "contexte".
 */

/**
 * Crée le graphique focus.
 *
 * @param g         Le groupe SVG dans lequel le graphique doit être dessiné.
 * @param sources   Les données à utiliser.
 * @param line      La fonction permettant de dessiner les lignes du graphique.
 * @param color     L'échelle de couleurs ayant une couleur associée à un nom de rue.
 */
function createStackedBarChart(g,sources, x, y, color, tip, height) {
  //Creating all the parts of the stacked bar chart
  g.selectAll(".rect")
    .data(sources)
    .enter()
    .append("rect")
      .attr("class", "rect-stacked")
      .attr("x", function (d) {
        return x(d.currentStageDebut);
      })
      .attr("y", function (d) {
        return 0;
      })
      .attr("width", function (d) {
        return x(d.currentStageEnd) - x(d.currentStageDebut);
      })
      .attr("height", height)
      .attr("fill", function(d) { 
        return color(d.stage); 
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

function getBarToolTipText(d) {
 
  var h = addZero(d.currentStageDebut.getHours());
  var m = addZero(d.currentStageDebut.getMinutes());
  var hf = addZero(d.currentStageEnd.getHours());
  var mf = addZero(d.currentStageEnd.getMinutes());

  var hourDiff = d.currentStageEnd - d.currentStageDebut; //in ms
  hourDiff/= 3.6e6; //in h

  return `Stage : <strong> ${d.stageText} </strong> <br>
          Début  :  <strong> ${h} h ${m}  </strong>
            -  Fin : <strong> ${hf} h ${mf} </strong> <br>
          Durée: <strong> ${getDurationString(hourDiff)} </strong>`; //TO DO ADD HOURS
}

/**
 * Obtient le texte associé à l'infobulle.
 *
 * @param d               Les données associées à la barre survollée par la souris.
 * @return {string}       Le texte à afficher dans l'infobulle.
 */
function getStackedToolTipText(d,totalStagesPortion, totalTimeStamp) {
  return `Stage : <strong> ${d.stageText} </strong><br> 
          Durée : <strong> ${getDurationSecondString(totalStagesPortion[d.stage]*totalTimeStamp*30)} </strong><br>`;
}
function getDurationSecondString(duration){

  duration = Number(duration);
  var h = Math.floor(duration / 3600);
  var m = Math.floor(duration % 3600 / 60);
  var s = Math.floor(duration % 3600 % 60)
   
  return `${addZero(h)}h ${addZero(m)}min ${addZero(s)}secs`
}

//Get the new index of the stage (with array INDEX)
function getStageColorIndex(i){
  var ci = 0;
  if(i === 1) ci = 4;
  else if(i === 2) ci = 1;
  else if(i === 3) ci = 2;
  else if(i === 4) ci = 3;
  return ci;
}

//Get row position of each stage for second viz (with STAGE)
function getStageRow(stage){
  var yRow = 0;
  if(stage === 1) yRow = 2;
  else if(stage === 2) yRow = 3;
  else if(stage === 3) yRow = 4;
  else if(stage === 4) yRow = 1;
  return yRow;
}

