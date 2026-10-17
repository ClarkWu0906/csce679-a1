/**
 * main.js
 * Entry point: load data, build both heatmaps, wire up the max/min toggle.
 */

import {
  DATA_PATH,
  COLOR_CONFIG,
  LEVEL1_LAYOUT,
  LEVEL2_LAYOUT,
  LEVEL2_RECENT_YEAR_COUNT,
  MINI_LINE_COLORS,
  TEMPERATURE_MODE,
} from "./config.js";
import { loadDailyTemperatures, aggregateByMonth, filterRecentYears } from "./dataLoader.js";
import { createTemperatureColorScale } from "./colorScale.js";
import { Tooltip } from "./tooltip.js";
import { TemperatureHeatmap } from "./heatmap.js";

/** Current color encoding, shared by both charts. */
let currentMode = TEMPERATURE_MODE.MAX;
let heatmaps = [];

/** Update every chart and the toggle buttons to the given mode. */
function setMode(mode) {
  currentMode = mode;
  heatmaps.forEach((heatmap) => heatmap.setMode(mode));

  d3.selectAll(".mode-button")
    .classed("active", function () { return this.dataset.mode === mode; });
}

/** Clicking any cell flips between max and min. */
function toggleMode() {
  setMode(currentMode === TEMPERATURE_MODE.MAX ? TEMPERATURE_MODE.MIN : TEMPERATURE_MODE.MAX);
}

function setupModeButtons() {
  d3.selectAll(".mode-button")
    .on("click", function () { setMode(this.dataset.mode); });
}

async function main() {
  const dailyRecords = await loadDailyTemperatures(DATA_PATH);
  const monthlyRecords = aggregateByMonth(dailyRecords);

  const colorScale = createTemperatureColorScale(COLOR_CONFIG.domain, COLOR_CONFIG.steps);
  const tooltip = new Tooltip();

  // Level 1: every year, colored cells only
  const level1Heatmap = new TemperatureHeatmap({
    containerSelector: "#level1-chart",
    monthlyRecords,
    colorScale,
    tooltip,
    layout: LEVEL1_LAYOUT,
    onCellClick: toggleMode,
  });

  // Level 2: last N years, colored cells + daily mini line charts
  const level2Heatmap = new TemperatureHeatmap({
    containerSelector: "#level2-chart",
    monthlyRecords: filterRecentYears(monthlyRecords, LEVEL2_RECENT_YEAR_COUNT),
    colorScale,
    tooltip,
    layout: LEVEL2_LAYOUT,
    showMiniCharts: true,
    lineColors: MINI_LINE_COLORS,
    onCellClick: toggleMode,
  });

  heatmaps = [level1Heatmap, level2Heatmap];
  heatmaps.forEach((heatmap) => heatmap.render());

  setupModeButtons();
  setMode(currentMode);
}

main().catch((error) => {
  console.error("Failed to build the visualization:", error);
  d3.select("#level1-chart").text("Could not load the data. Open this page through Live Server.");
});
