/**
 * miniLineChart.js
 * Draws the small daily max/min line chart inside one Level 2 cell.
 */

const DAYS_IN_LONGEST_MONTH = 31;

/**
 * @param {d3.Selection} cellGroup  <g> positioned at the cell's top-left corner
 * @param {Array<{day: number, maxTemperature: number, minTemperature: number}>} days
 * @param {object} options
 * @param {number} options.width
 * @param {number} options.height
 * @param {number} options.padding        inner padding so lines don't touch the edge
 * @param {[number, number]} options.temperatureExtent  shared y range for all cells,
 *                                        so every mini chart is directly comparable
 * @param {{max: string, min: string}} options.lineColors
 */
export function drawMiniLineChart(cellGroup, days, options) {
  const { width, height, padding, temperatureExtent, lineColors } = options;

  // x: day of month. A fixed 1–31 domain makes shorter months
  // (e.g. February) end earlier, just like a calendar.
  const xScale = d3.scaleLinear()
    .domain([1, DAYS_IN_LONGEST_MONTH])
    .range([padding, width - padding]);

  // y: temperature (higher = further up)
  const yScale = d3.scaleLinear()
    .domain(temperatureExtent)
    .range([height - padding, padding]);

  /** Build a line generator for one of the temperature fields. */
  const lineFor = (temperatureField) => d3.line()
    .x((d) => xScale(d.day))
    .y((d) => yScale(d[temperatureField]));

  cellGroup.append("path")
    .datum(days)
    .attr("class", "mini-line")
    .attr("stroke", lineColors.min)
    .attr("d", lineFor("minTemperature"));

  cellGroup.append("path")
    .datum(days)
    .attr("class", "mini-line")
    .attr("stroke", lineColors.max)
    .attr("d", lineFor("maxTemperature"));
}
