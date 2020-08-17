import _ from "lodash";

const SECONDS_PER_DATUM = 30;
const PADDING = 50;
export const FREQUENCY_BINS = 1;
export const DATUM_PER_TIMESTAMP = 1;
export const TIMESTAMP_DURATION = SECONDS_PER_DATUM * DATUM_PER_TIMESTAMP;
export const NB_SPECTROGRAM = 2;
export const FREQUENCY_KEY = "frequencies";

export const MARGIN = {
  TOP: 50,
  RIGHT: 200,
  BOTTOM: 50,
  LEFT: 70,
};
export const CANVAS_DIMENSION = {
  WIDTH: 1000,
  HEIGHT: 1000,
};
export const DIMENSION = {
  WIDTH: CANVAS_DIMENSION.WIDTH - MARGIN.LEFT - MARGIN.RIGHT,
  HEIGHT: CANVAS_DIMENSION.HEIGHT - MARGIN.BOTTOM - MARGIN.TOP,
};
export const SPECTROGRAM_CANVAS_HEIGTH = _.range(NB_SPECTROGRAM).map((x) => {
  let height = DIMENSION.HEIGHT / NB_SPECTROGRAM;
  if (x === 0) {
    height += MARGIN.TOP;
  } else if (x === NB_SPECTROGRAM - 1) {
    height += MARGIN.BOTTOM;
  }
  return height;
});
export const SPECTROGRAM_HEIGHT =
  (CANVAS_DIMENSION.HEIGHT - MARGIN.BOTTOM - MARGIN.TOP - PADDING) /
  NB_SPECTROGRAM;
