import * as d3 from "d3";
import _ from "lodash";

const RAW_DATA_LABELS = {
  W: 0,
  N1: 1,
  N2: 2,
  N3: 3,
  REM: 4,
};

const SLEEP_LABELS = ["W", "REM", "N1", "N2", "N3"];

const parseTimestampToDate = (timestamp) => {
  // To convert UNIX timestamp to JS Date, we have to convert number of seconds to milliseconds.
  const date = new Date(timestamp * 1000);
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDay(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
};

export const convertTimestampsToDates = (data) =>
  data.map((hypnogram) =>
    hypnogram.map((row) =>
      Object({ ...row, timestamp: parseTimestampToDate(row.timestamp) })
    )
  );

export const convertValuesToLabels = (data) =>
  data.map((hypno) =>
    hypno.map((row) =>
      Object({
        ...row,
        sleep_stage: Object.keys(RAW_DATA_LABELS).find(
          (key) => RAW_DATA_LABELS[key] === parseInt(row.sleep_stage)
        ),
      })
    )
  );

export const convertSources = (data, hypnogramNames) =>
  _.zip(data, hypnogramNames).map((x) =>
    Object({
      name: x[1],
      values: x[0],
    })
  );

export const domainX = (x, data) => {
  // TODO: Préciser les domaines pour les variables "xFocus" et "xContext" pour l'axe X.
  const dates = data[0].values.map((datum) => datum.timestamp);
  x.domain([d3.min(dates), d3.max(dates)]);
};

export const domainY = (y) => {
  y.domain(SLEEP_LABELS);
};

export const domainColor = (data, comparativeColors) => {
  const numberHypnogram = data.length;
  const colors = comparativeColors.slice(0, numberHypnogram);
  return d3
    .scaleOrdinal()
    .domain(data.map((x) => x.name))
    .range(colors);
};
