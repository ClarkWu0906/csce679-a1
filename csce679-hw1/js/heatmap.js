/**
 * heatmap.js
 * The Year (x) × Month (y) matrix. Used by both levels:
 *  - Level 1: colored cells only
 *  - Level 2: colored cells + a mini line chart in each cell
 */

import { MONTH_NAMES, TEMPERATURE_MODE, TRANSITION_DURATION } from "./config.js";
import { drawColorLegend, drawLineLegend } from "./legend.js";
import { drawMiniLineChart } from "./miniLineChart.js";

const LEGEND_OFFSET_X = 25;   // gap between the matrix and the legend

/** "2002-03" style label for the tooltip. */
function formatYearMonth(record) {
  return `${record.year}-${String(record.month + 1).padStart(2, "0")}`;
}

export class TemperatureHeatmap {
  /**
   * @param {object} options
   * @param {string} options.containerSelector  where to put the <svg>
   * @param {Array}  options.monthlyRecords     output of aggregateByMonth()
   * @param {d3.ScaleQuantize} options.colorScale
   * @param {Tooltip} options.tooltip
   * @param {object} options.layout             LEVEL1_LAYOUT / LEVEL2_LAYOUT
   * @param {boolean} [options.showMiniCharts]  true for Level 2
   * @param {{max: string, min: string}} [options.lineColors]
   * @param {Function} [options.onCellClick]    called when a cell is clicked
   */
  constructor(options) {
    this.containerSelector = options.containerSelector;
    this.monthlyRecords = options.monthlyRecords;
    this.colorScale = options.colorScale;
    this.tooltip = options.tooltip;
    this.layout = options.layout;
    this.showMiniCharts = options.showMiniCharts ?? false;
    this.lineColors = options.lineColors;
    this.onCellClick = options.onCellClick ?? (() => {});
    this.mode = TEMPERATURE_MODE.MAX;
  }

  /** Temperature the cell color currently encodes (max or min). */
  getDisplayedTemperature(record) {
    return this.mode === TEMPERATURE_MODE.MAX
      ? record.maxTemperature
      : record.minTemperature;
  }

  /** Draw everything once. */
  render() {
    const { cellWidth, cellHeight, cellGapRatio, margin } = this.layout;

    // Every year from first to last, so missing years still get a column.
    const [firstYear, lastYear] = d3.extent(this.monthlyRecords, (d) => d.year);
    const years = d3.range(firstYear, lastYear + 1);
    const months = d3.range(12);

    const matrixWidth = years.length * cellWidth;
    const matrixHeight = months.length * cellHeight;

    this.xScale = d3.scaleBand()
      .domain(years)
      .range([0, matrixWidth])
      .paddingInner(cellGapRatio)
      .paddingOuter(cellGapRatio / 2);

    this.yScale = d3.scaleBand()
      .domain(months)
      .range([0, matrixHeight])
      .paddingInner(cellGapRatio)
      .paddingOuter(cellGapRatio / 2);

    const svg = d3.select(this.containerSelector)
      .append("svg")
      .attr("width", margin.left + matrixWidth + margin.right)
      .attr("height", margin.top + matrixHeight + margin.bottom);

    this.chartArea = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    this.drawAxes();
    this.drawCells();
    this.drawLegends(matrixWidth);
  }

  /** Year labels on top, month names on the left. */
  drawAxes() {
    this.chartArea.append("g")
      .attr("class", "axis axis-year")
      .call(d3.axisTop(this.xScale).tickSizeOuter(0));

    this.chartArea.append("g")
      .attr("class", "axis axis-month")
      .call(d3.axisLeft(this.yScale)
        .tickFormat((monthIndex) => MONTH_NAMES[monthIndex])
        .tickSizeOuter(0));
  }

  /** One <g> per month record, containing a colored rect (+ mini chart). */
  drawCells() {
    const cellWidth = this.xScale.bandwidth();
    const cellHeight = this.yScale.bandwidth();

    this.cellGroups = this.chartArea.append("g")
      .attr("class", "cells")
      .selectAll("g.cell")
      .data(this.monthlyRecords)
      .join("g")
      .attr("class", "cell")
      .attr("transform", (d) => `translate(${this.xScale(d.year)}, ${this.yScale(d.month)})`);

    this.cellRects = this.cellGroups.append("rect")
      .attr("width", cellWidth)
      .attr("height", cellHeight)
      .attr("fill", (d) => this.colorScale(this.getDisplayedTemperature(d)));

    if (this.showMiniCharts) {
      this.drawMiniCharts(cellWidth, cellHeight);
    }

    this.attachInteractions();
  }

  /** Level 2: daily max/min lines inside every cell. */
  drawMiniCharts(cellWidth, cellHeight) {
    // Use one shared temperature range for every cell so lines are comparable.
    const temperatureExtent = [
      d3.min(this.monthlyRecords, (d) => d.minTemperature),
      d3.max(this.monthlyRecords, (d) => d.maxTemperature),
    ];

    const chartOptions = {
      width: cellWidth,
      height: cellHeight,
      padding: this.layout.miniChartPadding,
      temperatureExtent,
      lineColors: this.lineColors,
    };

    this.cellGroups.each((record, index, nodes) => {
      drawMiniLineChart(d3.select(nodes[index]), record.days, chartOptions);
    });
  }

  /** Hover -> tooltip + highlight; click -> callback (used to switch max/min). */
  attachInteractions() {
    this.cellGroups
      .on("mouseenter", (event, record) => {
        d3.select(event.currentTarget).classed("hovered", true);
        this.tooltip.show(
          `Date: ${formatYearMonth(record)}; max: ${record.maxTemperature} min: ${record.minTemperature}`,
          event,
        );
      })
      .on("mousemove", (event) => this.tooltip.move(event))
      .on("mouseleave", (event) => {
        d3.select(event.currentTarget).classed("hovered", false);
        this.tooltip.hide();
      })
      .on("click", () => this.onCellClick());
  }

  drawLegends(matrixWidth) {
    const legendX = matrixWidth + LEGEND_OFFSET_X;
    const colorLegendHeight = drawColorLegend(this.chartArea, this.colorScale, { x: legendX, y: 0 });

    if (this.showMiniCharts) {
      drawLineLegend(this.chartArea, this.lineColors, { x: legendX, y: colorLegendHeight + 35 });
    }
  }

  /** Switch the color encoding between monthly max and monthly min. */
  setMode(mode) {
    this.mode = mode;
    this.cellRects
      .transition()
      .duration(TRANSITION_DURATION)
      .attr("fill", (d) => this.colorScale(this.getDisplayedTemperature(d)));
  }
}
