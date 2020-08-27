import _ from 'lodash';

const PADDING = 100;
export const NB_SPECTROGRAM = 2;
export const FREQUENCY_KEY = 'frequencies';
export const NB_POINTS_COLOR_INTERPOLATION = 3;
export const TITLE_FONT_SIZE = '18px';

export const MARGIN = {
  TOP: 50,
  RIGHT: 120,
  BOTTOM: 50,
  LEFT: 70,
};
export const CANVAS_DIMENSION = {
  WIDTH: 1000,
  HEIGHT: 700,
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
export const SPECTROGRAM_HEIGHT = (CANVAS_DIMENSION.HEIGHT - MARGIN.BOTTOM - MARGIN.TOP - PADDING) / NB_SPECTROGRAM;
