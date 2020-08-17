import {
  TIMESTAMP_DURATION,
  DATUM_PER_TIMESTAMP,
  FREQUENCY_BINS,
} from "./constants";

export const preprocessData = (data, node, frequencies) => {
  const sources = [];
  const nodeData = data[node];
  for (let idx = 0; idx < nodeData.length; idx += DATUM_PER_TIMESTAMP) {
    for (let jdx = 0; jdx < data.frequencies.length; jdx += FREQUENCY_BINS) {
      // const frequency = data.frequencies[jdx];
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
          ldx < jdx + FREQUENCY_BINS && ldx < data.frequencies.length;
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
