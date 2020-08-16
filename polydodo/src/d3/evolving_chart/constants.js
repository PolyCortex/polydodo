import { STAGES_ORDERED } from "../constants";

export const CANVAS_DIMENSION = {
  WIDTH: 1000,
  HEIGHT: 600,
};
export const MARGIN = {
  TOP: 90,
  RIGHT: 70,
  BOTTOM: 50,
  LEFT: 70,
};
export const DIMENSION = {
  WIDTH: CANVAS_DIMENSION.WIDTH - MARGIN.LEFT - MARGIN.RIGHT,
  HEIGHT: CANVAS_DIMENSION.HEIGHT - MARGIN.TOP - MARGIN.BOTTOM,
};

export const BAR_HEIGHT = DIMENSION.HEIGHT / STAGES_ORDERED.length;
