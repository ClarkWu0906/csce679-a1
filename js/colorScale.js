/**
 * colorScale.js
 * Maps a temperature to a color.
 */

/**
 * Build a quantized color scale: the temperature domain is cut into
 * `steps` equal bins, each with one color of the Spectral scheme.
 * The scheme is reversed so cold = purple/blue and hot = dark red.
 *
 * @param {[number, number]} domain  e.g. [0, 40]
 * @param {number} steps             number of color bins (3–11)
 */
export function createTemperatureColorScale(domain, steps) {
  const coldToHotColors = [...d3.schemeSpectral[steps]].reverse();
  return d3.scaleQuantize()
    .domain(domain)
    .range(coldToHotColors);
}
