"use strict";

const parseTimestampToDate = (data) => {
  data.forEach(row => {
    // To convert UNIX timestamp to JS Date, we have to convert nb of seconds to milliseconds.
    const date = new Date(row.timestamp * 1000);
    row.timestamp = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDay(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds());
  });
};

const convertValuesToLabels = (data) => {
  const raw_data_labels_value = {
    'W': 0,
    'N1': 1,
    'N2': 2,
    'N3': 3,
    'REM': 4,
  }

  data.forEach(row => {
    row.sleep_stage = Object
      .keys(raw_data_labels_value)
      .find(key => raw_data_labels_value[key] == row.sleep_stage);;
  });
};

const domainX = (x, data) => {
  // TODO: Préciser les domaines pour les variables "xFocus" et "xContext" pour l'axe X.
  const dates = data.map(datum => datum.timestamp);
  x.domain([d3.min(dates), d3.max(dates)]);
};

const domainY = (y, sleep_labels) => {
  y.domain(sleep_labels);
}
