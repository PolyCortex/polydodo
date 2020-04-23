import * as d3 from "d3";
import{
  addZero,
  getDurationString,
  getDurationSecondString
} from "../Common/duration"

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
export const createStackedBarChart = (g,sources, x, y, color, tip, height) => {
  //Creating all the parts of the stacked bar chart
  g.selectAll(".rect")
    .data(sources)
    .enter()
    .append("rect")
      .attr("class", "rect-stacked")
      .attr("x", d => x(d.currentStageDebut))
      .attr("y", 0)
      .attr("width", d => x(d.currentStageEnd) - x(d.currentStageDebut))
      .attr("height", height)
      .attr("fill", d => color(d.stageText))
      .on("mouseover", function(d){
        tip.show(d, this);
        d3.select(this).style("opacity", 0.8);
      })
      .on("mouseout", () => {
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

export const getBarToolTipText = (d) => {
 
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
export const getStackedToolTipText = (d,totalStagesPortion, totalTimeStamp) => {
  return `Stage : <strong> ${d.stageText} </strong><br> 
          Durée : <strong> ${getDurationSecondString(totalStagesPortion[d.stage]*totalTimeStamp*30)} </strong><br>`;
}
