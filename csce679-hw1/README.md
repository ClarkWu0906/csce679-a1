# CSCE 679 Assignment 1 — Hong Kong Temperature Heatmap

Year × Month matrix views of Hong Kong daily temperature (`temperature_daily.csv`), built with D3.js v7.

- **Level 1** — every year (1997–2017); each cell's color is the monthly maximum or minimum temperature.
- **Level 2** — last 10 years; each cell also contains a mini line chart of the daily max (green) and daily min (light blue).

## Interactions
- **Hover** a cell: tooltip shows the month and its max / min temperature.
- **Click** any cell, or use the buttons at the top: switch the color between monthly max and monthly min.

## Run
The page loads a CSV, so it must be served over HTTP (opening the file directly is blocked by the browser):
- VS Code: right-click `index.html` → *Open with Live Server*, or
- `python3 -m http.server` and open http://localhost:8000

## Code structure
```
index.html            page layout + max/min buttons
css/style.css         styling
js/config.js          all constants (colors, sizes, year count, paths)
js/dataLoader.js      read CSV, aggregate daily rows into monthly records
js/colorScale.js      temperature -> color (11-step reversed Spectral, 0–40 °C)
js/heatmap.js         TemperatureHeatmap class: axes, cells, tooltip, mode switch
js/miniLineChart.js   daily line chart drawn inside a Level 2 cell
js/legend.js          color legend + line legend
js/tooltip.js         floating tooltip
js/main.js            entry point: wires everything together
```
