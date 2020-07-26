import _ from "lodash";

const RAW_DATA_LABELS = {
  W: 0,
  N1: 1,
  N2: 2,
  N3: 3,
  REM: 4,
};

export const preprocessData = (data, hypnogramNames) => {
  data = convertTimestampsToDates(data);
  data = convertValuesToLabels(data);

  return _.zip(data, hypnogramNames).map((x) =>
    Object({
      name: x[1],
      values: x[0],
    })
  );
};

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

const convertTimestampsToDates = (data) =>
  data.map((hypnogram) =>
    hypnogram.map((row) =>
      Object({ ...row, timestamp: parseTimestampToDate(row.timestamp) })
    )
  );

const convertValuesToLabels = (data) =>
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
