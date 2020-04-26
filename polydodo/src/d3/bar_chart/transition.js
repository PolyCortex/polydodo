import * as d3 from "d3";
import { getDurationStringHM } from "../common/duration";

export const addTransitions = (
  g,
  canvas,
  gSecondBarChart,
  gThirdBarChart,
  sources,
  x,
  y,
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
  g.selectAll(".rect-stacked").on("click", () =>
    firstTransition(g, sources, xAxis, yAxis, height, color)
  );

  canvas
    .append("rect")
    .attr("x", 340)
    .attr("y", 10)
    .attr("width", 30)
    .attr("height", 30)
    .style("fill", "white")
    .attr("transform", "translate(" + 100 + "," + 10 + ")")
    .on("click", () =>
      secondTransition(g, sources, xAxis, yAxis, height, color)
    );

  canvas
    .append("rect")
    .attr("x", 340)
    .attr("y", 10)
    .attr("width", 30)
    .attr("height", 30)
    .style("fill", "#e6521c")
    .attr("transform", "translate(" + 140 + "," + 10 + ")")
    .on("click", () =>
      thirdTransition(
        g,
        sources,
        firstStageIndex,
        totalStagePortion,
        width,
        height,
        xAxis,
        x,
        tipStacked
      )
    );

  canvas
    .append("rect")
    .attr("x", 340)
    .attr("y", 10)
    .attr("width", 30)
    .attr("height", 30)
    .style("fill", "#ffdcff")
    .attr("transform", "translate(" + 180 + "," + 10 + ")")
    .on("click", () => {
      g.select(".d3-tip").remove();
      fourthTransition(
        g,
        canvas,
        gSecondBarChart,
        gThirdBarChart,
        sources,
        x,
        xAxis,
        firstStageIndex,
        totalStagePortion,
        width,
        barHeight,
        totalTimeStamp,
        color
      );
    });
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
function firstTransition(g, data, xAxis, yAxis, height, color) {
  g.selectAll(".y.axis").remove();

  //create Y axes
  let axis = g.append("g").attr("class", "y axis");

  axis.transition().duration(2000).call(yAxis);

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

function secondTransition(g, data, xAxis, yAxis, height, color) {
  var newHeight = height / 10;
  g.selectAll(".rect-stacked")
    .transition()
    .duration(2000)
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

function createStagesDurationAxes(data, xAxis, width) {
  var sleepDiff =
    data[data.length - 1].currentStageEnd.getTime() -
    data[0].currentStageDebut.getTime();
  var sleepTotal = sleepDiff / (1000 * 60 * 60);

  var newscale = d3.scaleLinear().domain([0, sleepTotal]).range([0, width]);

  xAxis.scale(newscale).tickFormat((d) => d + " h");
}

//Third data vizualisation
function thirdTransition(
  g,
  data,
  firstIndexes,
  totalStagePortion,
  width,
  height,
  xAxis,
  x,
  tip
) {
  createStagesDurationAxes(data, xAxis, width);

  g.select(".x.axis").transition().duration(500).call(xAxis);

  //Move all part to the left and make the first bar of each row become the cumulative portion of the stage
  g.selectAll(".rect-stacked")
    .on("mouseover", function (d) {
      tip.show(d, this);
      d3.select(this).style("opacity", 0.8);
    })
    .on("mouseout", () => {
      tip.hide();
      d3.select(this).style("opacity", 1);
    })
    .transition()
    .attr("x", 0)
    .attr("width", (d, i) =>
      i === firstIndexes[d.stage] ? totalStagePortion[d.stage] * width : 0
    )
    .duration(2000)
    .on("end", function (d, i) {
      d3.selectAll(".pourc").style("opacity", 1);
    });

  //text containing the % of the sleep stage on the bar
  g.selectAll(".text")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "pourc")
    .text(function (d, i) {
      var rounded = Math.round(totalStagePortion[d.stage] * 100 * 10) / 10;
      return i === firstIndexes[d.stage] ? rounded + "%" : "";
    })
    .attr("x", width / 20)
    .attr("y", (d) => height * d.stage + height / 2)
    .style("opacity", 0)
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .style("font-size", "22px")
    .style("font-weight", 600);
}

function fourthTransition(
  g,
  canvas,
  gSecondBarChart,
  gThirdBarChart,
  data,
  x,
  xAxis,
  firstIndexes,
  totalStagePortion,
  width,
  height,
  totalTimeStamp,
  color
) {
  //Remove y axis and labels
  g.selectAll(".y.axis").remove();
  g.selectAll(".pourc").remove();

  g.select(".x.axis")
    .transition()
    .attr("transform", "translate(0," + height + ")")
    .duration(5000);

  //first barChart
  var stackedBar = g.selectAll(".rect-stacked");

  stackedBar
    .transition()
    .duration(2000)
    .attr(
      "x",
      (d) =>
        totalStagePortion.slice(0, d.stage).reduce((a, b) => a + b, 0) * width
    )
    .transition()
    .duration(2000)
    .attr("y", function (d, i) {
      if (i === firstIndexes[d.stage]) return 0;
    })
    .transition()
    .duration(1000)
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
    .attr("class", "pourcentage")
    .style("opacity", 0)
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("fill", "white")
    .attr("text-anchor", "middle");

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
    .attr("y", function (d, i) {
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
    .attr("y", function (d, i) {
      if (i === firstIndexes[d.stage]) return 60;
    })
    .attr("font-size", "20px")
    .attr("font-weight", 10);

  //label
  g.append("text")
    .attr("class", "label-sleepType")
    .attr("x", 0)
    .attr("y", -15)
    .text("You")
    .style("opacity", 0)
    .style("fill", "black")
    .style("font-size", "25px")
    .style("font-weight", 600)
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");

  //Restless barChart
  const restlessSleepData = [0.156, 0.098, 0.506, 0.049, 0.19];
  createSmallStackedBarChart(
    gSecondBarChart,
    restlessSleepData,
    data,
    "Restless Legs Syndrome",
    totalTimeStamp,
    x,
    xAxis,
    width,
    height,
    color
  );
  //Sleep apnea barChart
  const sleepApneaData = [0.326, 0.216, 0.329, 0.071, 0.057];
  createSmallStackedBarChart(
    gThirdBarChart,
    sleepApneaData,
    data,
    "Sleep Apnea",
    totalTimeStamp,
    x,
    xAxis,
    width,
    height,
    color
  );
}

function createSmallStackedBarChart(
  g,
  pourcentageData,
  data,
  name,
  totalTimeStamp,
  x,
  xAxis,
  width,
  height,
  color
) {
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

  var text = stackedBar
    .append("text")
    .attr("class", "pourcentage")
    .style("opacity", 0)
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("fill", "white");

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
    .text(name)
    .style("opacity", 0)
    .style("fill", "black")
    .style("font-size", "25px")
    .style("font-weight", 600)
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");
}
