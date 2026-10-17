/**
 * config.js
 * All tunable constants live here, so the look of the charts can be
 * changed without touching any drawing logic.
 */

/** Path of the CSV file (relative to index.html). */
export const DATA_PATH = "temperature_daily.csv";

/** Display names for month indices 0–11 (JavaScript months are 0-based). */
export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Which temperature the cell color encodes. */
export const TEMPERATURE_MODE = {
  MAX: "max",
  MIN: "min",
};

/**
 * Color encoding: temperatures from 0 to 39 °C split into 11 equal color bins.
 * The 0–39 range was chosen so every cell's color matches the reference
 * images exactly (e.g. 24 °C -> yellow, 25 °C -> orange, 36 °C -> dark red).
 */
export const COLOR_CONFIG = {
  domain: [0, 39],   // °C
  steps: 11,         // d3.schemeSpectral supports 3–11 steps
  // Text shown at the two ends of the color legend (matches the reference image).
  legendLabels: { low: "0 Celsius", high: "40 Celsius" },
};

/** Level 2 only shows the most recent N years. */
export const LEVEL2_RECENT_YEAR_COUNT = 10;

/** Colors of the two lines inside each Level 2 cell. */
export const MINI_LINE_COLORS = {
  max: "#2ca25f",   // green  = daily maximum
  min: "#9ecae1",   // light blue = daily minimum
};

/**
 * Layout of each heatmap.
 *  - cellWidth / cellHeight: size of one year/month slot (including the gap)
 *  - cellGapRatio: fraction of each slot left empty between cells
 *  - margin: room around the matrix for axes and the legend
 */
export const LEVEL1_LAYOUT = {
  cellWidth: 42,
  cellHeight: 36,
  cellGapRatio: 0.18,
  margin: { top: 40, right: 130, bottom: 20, left: 85 },
};

export const LEVEL2_LAYOUT = {
  cellWidth: 98,
  cellHeight: 72,
  cellGapRatio: 0.2,
  margin: { top: 40, right: 130, bottom: 20, left: 85 },
  miniChartPadding: 5,   // inner padding of the line chart inside a cell
};

/** Duration (ms) of the color transition when switching max/min. */
export const TRANSITION_DURATION = 500;