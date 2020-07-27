import * as d3 from "d3";
import moment from "moment";

import { getHoursFromIndex } from "./preproc";

export const createSpectrgramChart = (
  g,
  sources,
  x,
  y,
  color,
  tip,
  height,
  width,
  margin
) => {
  //Creating all the parts of the stacked bar chart
  g.selectAll(".rect")
    .data(sources)
    .enter()
    .append("rect")
    .attr("x", (d) => x(d.Timestamp))
    .attr("y", (d) => y(d.Frequency))
    .attr("width", () => x(getHoursFromIndex(1)))
    .attr("height", y.bandwidth())
    .attr("fill", (d) => color(d.Intensity))
    .on("mouseover", function (d) {
      tip.show(d, this);
      d3.select(this).style("opacity", 0.8);
    })
    .on("mouseout", function () {
      tip.hide();
      d3.select(this).style("opacity", 1);
    });

  // Titre axe des X
  g.append("text")
    .attr("class", "x axis")
    .attr("y", height + margin.bottom)
    .attr("x", width / 2)
    .attr("fill", "currentColor")
    .style("text-anchor", "middle")
    .text("Time");

  // titre axe des Y
  g.append("text")
    .attr("class", "y axis")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("fill", "currentColor")
    .style("text-anchor", "middle")
    .text("Frequence (Hz)");
};

export const getToolTipText = (d) => {
  //TODO : Fix name
  return `Puissance : <strong> ${d.Intensity.toFixed(2)} </strong> dB<br>\
          Fréquence: <strong> ${d.Frequency.toFixed(2)} </strong> Hz <br>\
          Moment: <strong> ${moment()
            .hour(d.Timestamp)
            .format("LTS")} </strong>`;
};
