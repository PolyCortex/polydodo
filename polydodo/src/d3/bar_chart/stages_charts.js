import * as d3 from 'd3';
import { addZero, getDurationString, getDurationSecondString, getDurationStringHM } from '../duration';
import { TRANSITION_TIME_MS } from '../constants';

export const createStackedBarChart = (g, sources, x, color, tip, height) => {
  g.selectAll(".rect")
    .data(sources)
    .enter()
    .append('rect')
    .attr('class', 'rect-stacked')
    .attr('x', (d) => x(d.currentStageDebut))
    .attr('y', 0)
    .attr('width', (d) => x(d.currentStageEnd) - x(d.currentStageDebut))
    .attr('height', height)
    .attr('fill', (d) => color(d.stageText))
    .on('mouseover', function (d) {
      tip.show(d, this);
      d3.select(this).style('opacity', 0.8);
    })
    .on('mouseout', function () {
      tip.hide();
      d3.select(this).style('opacity', 1);
    });
};

export const getToolTipText = (d) => {
  const h = addZero(d.currentStageDebut.getHours());
  const m = addZero(d.currentStageDebut.getMinutes());
  const hf = addZero(d.currentStageEnd.getHours());
  const mf = addZero(d.currentStageEnd.getMinutes());
  let hourDiff = d.currentStageEnd - d.currentStageDebut; //in ms

  hourDiff /= 3.6e6; //in h

  return `Stage : <strong> ${d.stageText} </strong> <br>
          Début  :  <strong> ${h} h ${m}  </strong>
            -  Fin : <strong> ${hf} h ${mf} </strong> <br>
          Durée: <strong> ${getDurationString(hourDiff)} </strong>`; //TO DO ADD HOURS
};

export const getStackedToolTipText = (d, totalStagesPortion, totalTimeStamp) => {
  return `Stage : <strong> ${d.stageText} </strong><br> 
          Durée : <strong> ${getDurationSecondString(totalStagesPortion[d.stage] * totalTimeStamp * 30)} </strong><br>`;
};

export const createStagesDurationAxes = (data, xAxis, width) => {
  var sleepDiff = data[data.length - 1].currentStageEnd.getTime() - data[0].currentStageDebut.getTime();
  var sleepTotal = sleepDiff / (1000 * 60 * 60);

  var newscale = d3.scaleLinear().domain([0, sleepTotal]).range([0, width]);

  xAxis.scale(newscale).tickFormat((d) => d + ' h');
};

export const createSmallStackedBarChart = (g, pourcentageData, data, name, totalTimeStamp, xAxis, width, height, color) => {
  var stackedBar = g.selectAll('.stacked-bar').data(pourcentageData).enter().append('g');

  stackedBar
    .append('rect')
    .transition()
    .duration(TRANSITION_TIME_MS)
    .attr('class', 'rect-stacked')
    .attr(
      'x',
      (d, i) =>
        pourcentageData
          .slice(0, i)
          .map((a) => a.value)
          .reduce((a, b) => a + b, 0) * width,
    )
    .attr('width', (d) => d.value * width)
    .attr('height', 80)
    .attr('fill', (d) => color(d.stage))
    .on('end', () => {
      g.selectAll('.pourcentage').style('opacity', 1);
      g.selectAll('.label-sleepType').style('opacity', 1);
    });

  var text = stackedBar.append('text').attr('class', 'pourcentage');

  text
    .append('tspan')
    .text((d) => getDurationStringHM(d.value * totalTimeStamp * 30))
    .attr(
      'x',
      (d, i) =>
        pourcentageData
          .slice(0, i)
          .map((a) => a.value)
          .reduce((a, b) => a + b, 0) *
          width +
        (pourcentageData[i].value / 2) * width,
    )
    .attr('y', height / 3)
    .attr('font-size', '25px')
    .attr('font-weight', 15);

  text
    .append('tspan')
    .text((d) => d.value * 100 + '%')
    .attr('x', (d, i) => {
      return (
        pourcentageData
          .slice(0, i)
          .map((a) => a.value)
          .reduce((a, b) => a + b, 0) *
          width +
        (pourcentageData[i].value / 2) * width
      );
    })
    .attr('y', (2 * height) / 3)
    .attr('font-size', '20px')
    .attr('font-weight', 10);

  createStagesDurationAxes(data, xAxis, width);

  g.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + 80 + ')')
    .transition()
    .duration(TRANSITION_TIME_MS)
    .call(xAxis)
    .selectAll('text')
    .style('font-size', '18px');

  g.append("text")
    .attr("class", "label-sleepType")
    .attr("x", 0)
    .attr("y", -15)
    .text(name);
};
