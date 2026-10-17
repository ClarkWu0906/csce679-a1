/**
 * tooltip.js
 * A single floating <div> that follows the mouse.
 */

const OFFSET_FROM_CURSOR = { x: 12, y: -28 };

export class Tooltip {
  constructor() {
    this.element = d3.select("body")
      .append("div")
      .attr("class", "tooltip");
  }

  /** Show the tooltip with the given text near the mouse. */
  show(text, mouseEvent) {
    this.element.text(text).classed("visible", true);
    this.move(mouseEvent);
  }

  /** Keep the tooltip next to the cursor while the mouse moves. */
  move(mouseEvent) {
    this.element
      .style("left", `${mouseEvent.pageX + OFFSET_FROM_CURSOR.x}px`)
      .style("top", `${mouseEvent.pageY + OFFSET_FROM_CURSOR.y}px`);
  }

  hide() {
    this.element.classed("visible", false);
  }
}
