import * as d3 from 'd3';
import _ from 'lodash';

export const parseTimestampToDate = (data) => {
  data.forEach((hypno) => {
    hypno.forEach((row) => {
      // To convert UNIX timestamp to JS Date, we have to convert nb of seconds to milliseconds.
      const date = new Date(row.timestamp * 1000);
      row.timestamp = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDay(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds(),
      );
    });
  });
};

export const convertValuesToLabels = (data) => {
  const raw_data_labels_value = {
    W: 0,
    N1: 1,
    N2: 2,
    N3: 3,
    REM: 4,
  };

  data.forEach((hypno) => {
    hypno.forEach((row) => {
      row.sleep_stage = Object.keys(raw_data_labels_value).find((key) => raw_data_labels_value[key] === parseInt(row.sleep_stage));
    });
  });
};

export const convertSources = (data, hypnogramNames) => {
  data = _.zip(data, hypnogramNames).map((x) => {
    return {
      name: x[1],
      values: x[0],
    };
  });

  return data;
};

export const domainX = (x, data) => {
  // TODO: Préciser les domaines pour les variables "xFocus" et "xContext" pour l'axe X.
  const dates = data[0].values.map((datum) => datum.timestamp);
  x.domain([d3.min(dates), d3.max(dates)]);
};

export const domainY = (y, sleepLabels) => {
  y.domain(sleepLabels);
};

export const domainColor = (data, comparativeColors) => {
  const numberHypnogram = data.length;
  const colors = comparativeColors.slice(0, numberHypnogram);
  return d3
    .scaleOrdinal()
    .domain(data.map((x) => x.name))
    .range(colors);
};
