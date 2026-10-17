/**
 * legend.js
 * Draws the color legend (and, for Level 2, the line legend).
 */

import { COLOR_CONFIG } from "./config.js";

const LEGEND_BLOCK = { width: 22, height: 22 };

/**
 * Vertical stack of color blocks, coldest on top, labeled at both ends.
 *
 * @param {d3.Selection} parent  an SVG <g> to draw into
 * @param {d3.ScaleQuantize} colorScale
 * @param {{x: number, y: number}} position
 * @returns {number} total height used, so callers can place things below
 */
export function drawColorLegend(parent, colorScale, position) {
  const colors = colorScale.range();
  const { low: lowLabel, high: highLabel } = COLOR_CONFIG.legendLabels;

  const legend = parent.append("g")
    .attr("class", "color-legend")
    .attr("transform", `translate(${position.x}, ${position.y})`);

  legend.selectAll("rect")
    .data(colors)
    .join("rect")
    .attr("x", 0)
    .attr("y", (_, index) => index * LEGEND_BLOCK.height)
    .attr("width", LEGEND_BLOCK.width)
    .attr("height", LEGEND_BLOCK.height)
    .attr("fill", (color) => color);

  const totalHeight = colors.length * LEGEND_BLOCK.height;

  legend.append("text")
    .attr("class", "legend-label")
    .attr("x", LEGEND_BLOCK.width + 6)
    .attr("y", 10)
    .text(lowLabel);

  legend.append("text")
    .attr("class", "legend-label")
    .attr("x", LEGEND_BLOCK.width + 6)
    .attr("y", totalHeight + 4)
    .text(highLabel);

  return totalHeight;
}

/**
 * Small key explaining the two lines in each Level 2 cell.
 *
 * @param {d3.Selection} parent
 * @param {{max: string, min: string}} lineColors
 * @param {{x: number, y: number}} position
 */
export function drawLineLegend(parent, lineColors, position) {
  const entries = [
    { label: "Daily max", color: lineColors.max },
    { label: "Daily min", color: lineColors.min },
  ];
  const rowHeight = 18;

  const legend = parent.append("g")
    .attr("class", "line-legend")
    .attr("transform", `translate(${position.x}, ${position.y})`);

  const rows = legend.selectAll("g")
    .data(entries)
    .join("g")
    .attr("transform", (_, index) => `translate(0, ${index * rowHeight})`);

  rows.append("line")
    .attr("x1", 0).attr("x2", 22)
    .attr("y1", 0).attr("y2", 0)
    .attr("stroke", (d) => d.color)
    .attr("stroke-width", 2.5);

  rows.append("text")
    .attr("class", "legend-label")
    .attr("x", 28)
    .attr("dy", "0.35em")
    .text((d) => d.label);
}