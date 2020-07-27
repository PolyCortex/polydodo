import _ from "lodash";

import { convertTimestampsToDates } from "../utils";

const RAW_DATA_LABELS = {
  W: 0,
  N1: 1,
  N2: 2,
  N3: 3,
  REM: 4,
};

export const preprocessData = (data, hypnogramNames) => {
  data = data.map((hypno) => convertTimestampsToDates(hypno));
  data = convertValuesToLabels(data);

  return _.zip(data, hypnogramNames).map((x) =>
    Object({
      name: x[1],
      values: x[0],
    })
  );
};

const convertValuesToLabels = (data) =>
  data.map((hypno) =>
    hypno.map((row) =>
      Object({
        ...row,
        sleepStage: Object.keys(RAW_DATA_LABELS).find(
          (key) => RAW_DATA_LABELS[key] === parseInt(row.sleepStage)
        ),
      })
    )
  );
