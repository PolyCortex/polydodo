import * as d3 from "d3";
import {
  TIMESTAMP_DURATION,
  DATUM_PER_TIMESTAMP,
  FREQUENCY_BINS,
} from "./constants";

export const domainColor = (color, sources) => {
  const extent = d3.extent(sources, (d) => d.Intensity);
  color.domain(extent);
};

export const domainX = (x, data, node) => {
  x.domain([0, getHoursFromIndex(data[node].length / DATUM_PER_TIMESTAMP)]);
};

export const domainY = (y, yAxisScale, frequencies) => {
  y.domain(frequencies);
  yAxisScale.domain([frequencies[0], frequencies[frequencies.length - 1]]);
};

export const createSources = (data, node, frequencies) => {
  const sources = [];
  const nodeData = data[node];
  for (let idx = 0; idx < nodeData.length; idx += DATUM_PER_TIMESTAMP) {
    for (let jdx = 0; jdx < data.Frequencies.length; jdx += FREQUENCY_BINS) {
      // const frequency = data.Frequencies[jdx];
      let intensity = 0;
      let currFrequencyBin = 0;
      let currTimestampBin = 0;
      for (
        let kdx = idx;
        kdx < idx + DATUM_PER_TIMESTAMP && kdx < nodeData.length;
        kdx++
      ) {
        currTimestampBin++;
        currFrequencyBin = 0;
        for (
          let ldx = jdx;
          ldx < jdx + FREQUENCY_BINS && ldx < data.Frequencies.length;
          ldx++
        ) {
          currFrequencyBin++;
          intensity += nodeData[kdx][ldx];
        }
      }
      const timeStamp = getHoursFromIndex(Math.ceil(idx / DATUM_PER_TIMESTAMP));

      sources.push({
        Frequency: frequencies[Math.ceil(jdx / FREQUENCY_BINS)],
        Intensity: intensity / currTimestampBin / currFrequencyBin,
        Timestamp: timeStamp,
      });
    }
  }

  return sources;
};

export const getHoursFromIndex = (idx) => {
  return (idx * TIMESTAMP_DURATION) / 60.0 / 60;
};
