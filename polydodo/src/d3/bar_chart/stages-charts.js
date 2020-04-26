import * as d3 from "d3";
import {
  addZero,
  getDurationString,
  getDurationSecondString,
  getDurationStringHM
} from "../common/duration";

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
export const createStackedBarChart = (g, sources, x, color, tip, height) => {
  //Creating all the parts of the stacked bar chart
  g.selectAll(".rect")
    .data(sources)
    .enter()
    .append("rect")
    .attr("class", "rect-stacked")
    .attr("x", (d) => x(d.currentStageDebut))
    .attr("y", 0)
    .attr("width", (d) => x(d.currentStageEnd) - x(d.currentStageDebut))
    .attr("height", height)
    .attr("fill", (d) => color(d.stageText))
    .on("mouseover", function (d) {
      tip.show(d, this);
      d3.select(this).style("opacity", 0.8);
    })
    .on("mouseout", () => {
      tip.hide();
      d3.select(this).style("opacity", 1);
    });
};
/**
 * Obtient le texte associé à l'infobulle.
 *
 * @param d               Les données associées à la barre survollée par la souris.
 * @param currentData     Les données qui sont actuellement utilisées.
 * @param formatPercent   Fonction permettant de formater correctement un pourcentage.
 * @return {string}       Le texte à afficher dans l'infobulle.
 */

export const getToolTipText = (d) => {
  var h = addZero(d.currentStageDebut.getHours());
  var m = addZero(d.currentStageDebut.getMinutes());
  var hf = addZero(d.currentStageEnd.getHours());
  var mf = addZero(d.currentStageEnd.getMinutes());

  var hourDiff = d.currentStageEnd - d.currentStageDebut; //in ms
  hourDiff /= 3.6e6; //in h

  return `Stage : <strong> ${d.stageText} </strong> <br>
          Début  :  <strong> ${h} h ${m}  </strong>
            -  Fin : <strong> ${hf} h ${mf} </strong> <br>
          Durée: <strong> ${getDurationString(hourDiff)} </strong>`; //TO DO ADD HOURS
};

/**
 * Obtient le texte associé à l'infobulle.
 *
 * @param d               Les données associées à la barre survollée par la souris.
 * @return {string}       Le texte à afficher dans l'infobulle.
 */
export const getStackedToolTipText = (
  d,
  totalStagesPortion,
  totalTimeStamp
) => {
  return `Stage : <strong> ${d.stageText} </strong><br> 
          Durée : <strong> ${getDurationSecondString(
            totalStagesPortion[d.stage] * totalTimeStamp * 30
          )} </strong><br>`;
};

export const createStagesDurationAxes = (data, xAxis, width) => {
  var sleepDiff =
    data[data.length - 1].currentStageEnd.getTime() -
    data[0].currentStageDebut.getTime();
  var sleepTotal = sleepDiff / (1000 * 60 * 60);

  var newscale = d3.scaleLinear().domain([0, sleepTotal]).range([0, width]);

  xAxis.scale(newscale).tickFormat((d) => d + " h");
};

export const createSmallStackedBarChart = (
  g,
  pourcentageData,
  data,
  name,
  totalTimeStamp,
  xAxis,
  width,
  height,
  color
) => {
  var stackedBar = g
    .selectAll(".stacked-bar")
    .data(pourcentageData)
    .enter()
    .append("g");

  stackedBar
    .append("rect")
    .transition()
    .delay(3000)
    .duration(1000)
    .attr("class", "rect-stacked")
    .attr(
      "x",
      (d, i) => pourcentageData.slice(0, i).reduce((a, b) => a + b, 0) * width
    )
    .attr("width", (d) => d * width)
    .attr("height", 80)
    .attr("fill", (d, i) => color(i))
    .on("end", () => {
      g.selectAll(".pourcentage").style("opacity", 1);
      g.selectAll(".label-sleepType").style("opacity", 1);
    });

  var text = stackedBar.append("text").attr("class", "pourcentage");

  //hours
  text
    .append("tspan")
    .text((d) => getDurationStringHM(d * totalTimeStamp * 30))
    .attr(
      "x",
      (d, i) =>
        pourcentageData.slice(0, i).reduce((a, b) => a + b, 0) * width +
        (pourcentageData[i] / 2) * width
    )
    .attr("y", height / 3)
    .attr("font-size", "25px")
    .attr("font-weight", 15);

  //pourcentage
  text
    .append("tspan")
    .text((d) => d * 100 + "%")
    .attr(
      "x",
      (d, i) =>
        pourcentageData.slice(0, i).reduce((a, b) => a + b, 0) * width +
        (pourcentageData[i] / 2) * width
    )
    .attr("y", (2 * height) / 3)
    .attr("font-size", "20px")
    .attr("font-weight", 10);

  //create stackedbar axes
  createStagesDurationAxes(data, xAxis, width);

  g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + 80 + ")")
    .transition()
    .delay(3000)
    .duration(4000)
    .call(xAxis)
    .selectAll("text")
    .style("font-size", "18px");

  //label
  g.append("text")
    .attr("class", "label-sleepType")
    .attr("x", 0)
    .attr("y", -15)
    .text(name);
};
