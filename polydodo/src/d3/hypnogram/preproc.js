import _ from "lodash";

import { convertTimestampsToDates } from "../utils";

export const preprocessData = (data, hypnogramNames) => {
  data = data.map((hypno) => convertTimestampsToDates(hypno));

  return _.zip(data, hypnogramNames).map((x) =>
    Object({
      name: x[1],
      values: x[0],
    })
  );
};
