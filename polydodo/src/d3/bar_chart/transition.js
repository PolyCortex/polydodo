import * as d3 from "d3";
import { getDurationStringHM } from "../common/duration";
import {
  createSmallStackedBarChart,
  createStagesDurationAxes,
} from "./stages-charts";
import { TRANSITION_TIME_MS } from "d3/common/constantes";

export let firstCallback = () => {};
export let secondCallback = () => {};
export let thirdCallback = () => {};
export let fourthCallback = () => {};
export let fifthCallback = () => {};
export let sixthCallback = () => {};

export const addTransitions = (
  g,
  gSecondBarChart,
  gThirdBarChart,
  sources,
  color,
  height,
  barHeight,
  width,
  tipStacked,
  xAxis,
  yAxis,
  firstStageIndex,
  totalStagePortion,
  totalTimeStamp
) => {
  firstCallback = firstTransition(g, xAxis, yAxis, height, color);
  secondCallback = secondTransition(g, yAxis, height);
  thirdCallback = thirdTransition(g, sources, firstStageIndex, totalStagePortion, width, height, xAxis, tipStacked);
  fourthCallback = fourthTransition(g, sources, firstStageIndex, totalStagePortion, width, barHeight, totalTimeStamp);
  fifthCallback = fifthTransition(gSecondBarChart, sources,xAxis, width, barHeight, totalTimeStamp, color);
  sixthCallback = sixthTransition(gThirdBarChart, sources,xAxis, width, barHeight, totalTimeStamp, color);
};

/**
 * Réalise une transition entre les données actuellement utilisées et les nouvelles qui doivent être utilisées.
 *
 * @param g       Le groupe SVG dans lequel le graphique à bulles est dessiné.
 * @param data    Les nouvelles données à utiliser.
 * @param x       L'échelle pour l'axe X.
 * @param y       L'échelle pour l'axe Y.
 * @param r       L'échelle pour le rayon des cercles.
 */
const firstTransition = (g, xAxis, yAxis, height, color) => () => {
  g.selectAll(".y.axis").remove();

  //create Y axes
  let axis = g.append("g").attr("class", "y axis");

  axis.transition().duration(TRANSITION_TIME_MS).call(yAxis);

  axis
    .selectAll("text")
    .attr("class", "y-label")
    .attr("y", height / 2)
    .attr("x", -10)
    .style("fill", (d) => color(d))
    .style("font-size", "20px")
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");

  //Move every sleep stage portion to the correspending stage row
  g.selectAll(".rect-stacked")
    .transition()
    .duration(2000)
    .attr("y", (d) => height * d.stage)
    .attr("height", height);

  //Move X axes
  g.select(".x.axis")
    .transition()
    .attr("transform", "translate(0," + height * 5 + ")")
    .duration(2000)
    .call(xAxis);
}

const secondTransition = (g, yAxis, height) => () => {
  var newHeight = height / 10;
  g.selectAll(".rect-stacked")
    .transition()
    .duration(TRANSITION_TIME_MS)
    .attr("y", (d) => height * d.stage)
    .attr("height", newHeight);

  g.select(".y.axis")
    .transition()
    .duration(2000)
    .attr("transform", "translate(0," + 0 + ")")
    .call(yAxis)
    .selectAll(".y-label") //The left labels with different colors in Y axes
    .attr("y", newHeight / 2)
    .attr("x", -10);
}

//Third data vizualisation
const thirdTransition = (
  g,
  data,
  firstIndexes,
  totalStagePortion,
  width,
  height,
  xAxis,
  tip
) => () => {
  createStagesDurationAxes(data, xAxis, width);

  g.select(".x.axis").transition().duration(500).call(xAxis);

  //Move all part to the left and make the first bar of each row become the cumulative portion of the stage
  g.selectAll(".rect-stacked")
    .on("mouseover", function (d) {
      tip.show(d, this);
      d3.select(this).style("opacity", 0.8);
    })
    .on("mouseout", function() {
      tip.hide();
      d3.select(this).style("opacity", 1);
    })
    .transition()
    .attr("x", 0)
    .attr("width", (d, i) =>
      i === firstIndexes[d.stage] ? totalStagePortion[d.stage] * width : 0
    )
    .duration(TRANSITION_TIME_MS)
    .on("end", () => g.selectAll(".pourcentage").style("opacity", 1));

  //text containing the % of the sleep stage on the bar
  g.selectAll(".text")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "pourcentage")
    .text((d, i) =>
      i === firstIndexes[d.stage]
        ? Math.round(totalStagePortion[d.stage] * 1000) / 10 + "%"
        : ""
    )
    .attr("x", width / 20)
    .attr("y", (d) => height * d.stage + height / 2)
    .style("fill", "black");
}

const fourthTransition = (
  g,
  data,
  firstIndexes,
  totalStagePortion,
  width,
  height,
  totalTimeStamp,
) => () => {
  //Remove y axis and labels
  g.selectAll(".y.axis").remove();
  g.selectAll(".pourcentage").remove();

  g.select(".x.axis")
    .transition()
    .attr("transform", "translate(0," + height + ")")
    .duration(TRANSITION_TIME_MS);

  //first barChart
  var stackedBar = g.selectAll(".rect-stacked");

  stackedBar
    .transition()
    .duration(TRANSITION_TIME_MS/3)
    .attr(
      "x",
      (d) =>
        totalStagePortion.slice(0, d.stage).reduce((a, b) => a + b, 0) * width
    )
    .transition()
    .duration(TRANSITION_TIME_MS/3)
    .attr("y", (d, i) => {
      if (i === firstIndexes[d.stage]) return 0;
    })
    .transition()
    .duration(TRANSITION_TIME_MS/3)
    .attr("height", height)
    .on("end", () => {
      g.selectAll(".pourcentage").style("opacity", 1);
      g.selectAll(".label-sleepType").style("opacity", 1);
    });

  var text = g
    .selectAll(".text")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "pourcentage");

  //hours
  text
    .append("tspan")
    .text((d, i) =>
      i === firstIndexes[d.stage]
        ? getDurationStringHM(totalStagePortion[d.stage] * totalTimeStamp * 30)
        : ""
    )
    .attr(
      "x",
      (d) =>
        totalStagePortion.slice(0, d.stage).reduce((a, b) => a + b, 0) * width +
        (totalStagePortion[d.stage] / 2) * width
    )
    .attr("y", (d, i) => {
      if (i === firstIndexes[d.stage]) return 40;
    })
    .attr("font-size", "25px")
    .attr("font-weight", 15);

  //percentage
  text
    .append("tspan")
    .text((d, i) =>
      i === firstIndexes[d.stage]
        ? Math.round(totalStagePortion[d.stage] * 1000) / 10 + "%"
        : ""
    )
    .attr(
      "x",
      (d) =>
        totalStagePortion.slice(0, d.stage).reduce((a, b) => a + b, 0) * width +
        (totalStagePortion[d.stage] / 2) * width
    )
    .attr("y", (d, i) => {
      if (i === firstIndexes[d.stage]) return 60;
    })
    .attr("font-size", "20px")
    .attr("font-weight", 10);

  //label
  g.append("text")
    .attr("class", "label-sleepType")
    .attr("x", 0)
    .attr("y", -15)
    .text("You");

}
const fifthTransition = (
  gSecondBarChart,
  data,
  xAxis,
  width,
  height,
  totalTimeStamp,
  color
) => () => {
    //Restless barChart
    const restlessSleepData = [0.156, 0.098, 0.506, 0.049, 0.19];
    createSmallStackedBarChart(
      gSecondBarChart,
      restlessSleepData,
      data,
      "Restless Legs Syndrome",
      totalTimeStamp,
      xAxis,
      width,
      height,
      color
    );
}

const sixthTransition = (
  gThirdBarChart,
  data,
  xAxis,
  width,
  height,
  totalTimeStamp,
  color
) => () => {
  //Sleep apnea barChart
  const sleepApneaData = [0.326, 0.216, 0.329, 0.071, 0.057];
  createSmallStackedBarChart(
    gThirdBarChart,
    sleepApneaData,
    data,
    "Sleep Apnea",
    totalTimeStamp,
    xAxis,
    width,
    height,
    color
  );
}
