import * as d3 from 'd3';
import tip from 'd3-tip';

import data from 'assets/data/spectrograms';
import { domainColor, domainX, domainY, createSources } from './preproc';
import { legend } from './legend';
import { createSpectrgramChart, getToolTipText } from './stages-charts';
import { FREQUENCY_BINS } from './constants';

export const initSpectrogram = (g, node, width, height, margin) => {
  var colorInterpolator = d3.interpolatePlasma;

  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleBand().range([height, 0]);
  var yColor = d3.scaleLinear().range(y.range());
  var yAxisScale = d3.scaleLinear().range(y.range());

  var xAxis = d3.axisBottom(x).tickFormat((d) => `${d}h`);
  var yAxis = d3.axisLeft(yAxisScale).ticks(5, 's');

  // Groupe affichant le graphique principal ().
  var spectrogram = g.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  var gLegend = g.append('g').attr('transform', 'translate(' + (margin.left + width) + ',' + margin.top + ')');

  var color = d3.scaleSequential().interpolator(colorInterpolator);

  var tooltip = tip().attr('class', 'd3-tip').offset([-10, 0]);

  var frequencies = [];
  for (let idx = 0; idx < data.Frequencies.length; idx += FREQUENCY_BINS) {
    var binTotal = 0;
    let jdx = 0;
    for (; jdx < FREQUENCY_BINS && idx + jdx < data.Frequencies.length; jdx++) {
      binTotal += data.Frequencies[idx + jdx];
    }
    frequencies.push(binTotal / FREQUENCY_BINS);
  }

  var sources = createSources(data, node, frequencies);
  domainColor(color, sources);
  domainColor(yColor, sources);
  domainX(x, data, node);
  domainY(y, yAxisScale, frequencies);

  createSpectrgramChart(
    spectrogram,
    sources,
    x,
    y,
    color,
    tooltip,
    height,
    width,
    margin
  );

  // Axes
  spectrogram
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .selectAll('text')
    .style('font-size', '18px');

  spectrogram.append('g').attr('class', 'y axis').call(yAxis).selectAll('text').style('font-size', '18px');

  tooltip.html((d) => getToolTipText.call(this, d));
  g.call(tooltip);

  legend(gLegend, color, yColor, height, margin.right);
};
