import { STAGES } from "../constants";

export const MARGIN = {
  TOP: 90,
  RIGHT: 70,
  BOTTOM: 50,
  LEFT: 70,
};

export const CANVAS_WIDTH = 1000;
export const CANVAS_HEIGHT = 600;

export const WIDTH = CANVAS_WIDTH - MARGIN.LEFT - MARGIN.RIGHT;
export const HEIGHT = CANVAS_HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;
export const BAR_HEIGHT = HEIGHT / STAGES.length;
