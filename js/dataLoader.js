/**
 * dataLoader.js
 * Loads the daily CSV and reshapes it into one record per (year, month).
 */

const parseDate = d3.timeParse("%Y-%m-%d");

/**
 * Convert one raw CSV row (all strings) into typed values.
 * @param {{date: string, max_temperature: string, min_temperature: string}} row
 */
function parseRow(row) {
  return {
    date: parseDate(row.date),
    maxTemperature: +row.max_temperature,
    minTemperature: +row.min_temperature,
  };
}

/** True if a parsed row has a valid date and both temperatures. */
function isValidRow(row) {
  return row.date !== null
    && Number.isFinite(row.maxTemperature)
    && Number.isFinite(row.minTemperature);
}

/**
 * Load the daily temperature file.
 * @param {string} path
 * @returns {Promise<Array<{date: Date, maxTemperature: number, minTemperature: number}>>}
 */
export async function loadDailyTemperatures(path) {
  const rows = await d3.csv(path, parseRow);
  return rows.filter(isValidRow);
}

/**
 * Group daily rows into monthly records.
 *
 * Each record holds:
 *  - year, month (0–11)
 *  - maxTemperature: highest daily max in that month
 *  - minTemperature: lowest daily min in that month
 *  - days: the daily values, sorted by day, for the Level 2 mini line chart
 */
export function aggregateByMonth(dailyRecords) {
  const groupedByYearMonth = d3.groups(
    dailyRecords,
    (record) => record.date.getFullYear(),
    (record) => record.date.getMonth(),
  );

  const monthlyRecords = [];
  for (const [year, months] of groupedByYearMonth) {
    for (const [month, daysInMonth] of months) {
      monthlyRecords.push({
        year,
        month,
        maxTemperature: d3.max(daysInMonth, (d) => d.maxTemperature),
        minTemperature: d3.min(daysInMonth, (d) => d.minTemperature),
        days: daysInMonth
          .map((d) => ({
            day: d.date.getDate(),
            maxTemperature: d.maxTemperature,
            minTemperature: d.minTemperature,
          }))
          .sort((a, b) => a.day - b.day),
      });
    }
  }
  return monthlyRecords;
}

/**
 * Keep only the most recent `yearCount` years.
 * e.g. latest year 2017 and yearCount 10 -> 2008…2017
 */
export function filterRecentYears(monthlyRecords, yearCount) {
  const latestYear = d3.max(monthlyRecords, (d) => d.year);
  const firstYear = latestYear - yearCount + 1;
  return monthlyRecords.filter((d) => d.year >= firstYear);
}
