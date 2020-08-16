import * as d3 from "d3";
import moment from "moment";

import { getHoursFromIndex } from "./preproc";
import { SPECTROGRAM_HEIGHT, MARGIN, DIMENSION } from "./constants";

export const createSpectrogramChart = (g, sources, x, y, color, tip) => {
  //Creating all the parts of the stacked bar chart
  g.selectAll('.rect')
    .data(sources)
    .enter()
    .append('rect')
    .attr('x', (d) => x(d.Timestamp))
    .attr('y', (d) => y(d.Frequency))
    .attr('width', () => x(getHoursFromIndex(1)))
    .attr('height', y.bandwidth())
    .attr('fill', (d) => color(d.Intensity))
    .on('mouseover', function (d) {
      tip.show(d, this);
      d3.select(this).style('opacity', 0.8);
    })
    .on('mouseout', function () {
      tip.hide();
      d3.select(this).style('opacity', 1);
    });

  // Titre axe des X
  g.append("text")
    .attr("class", "x axis")
    .attr("y", SPECTROGRAM_HEIGHT + MARGIN.BOTTOM)
    .attr("x", DIMENSION.WIDTH / 2)
    .attr("fill", "currentColor")
    .style("text-anchor", "middle")
    .text("Time");

  // titre axe des Y
  g.append("text")
    .attr("class", "y axis")
    .attr("transform", "rotate(-90)")
    .attr("y", -MARGIN.LEFT)
    .attr("x", -SPECTROGRAM_HEIGHT / 2)
    .attr("dy", "1em")
    .attr("fill", "currentColor")
    .style("text-anchor", "middle")
    .text("Frequency (Hz)");
};

export const getToolTipText = (d) => {
  return `Power : <strong> ${d.Intensity.toFixed(2)} </strong> dB<br>\
          Frequency: <strong> ${d.Frequency.toFixed(2)} </strong> Hz <br>\
          Time: <strong> ${moment(d.Timestamp * 3.6e6)
            .utc()
            .format("HH:mm:ss")} </strong>`;
};
