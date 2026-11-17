import {
  currentColumns,
  currentGroups,
  previousColumns,
  previousRows,
} from "./housing-statistics-demo.js";

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function createTable(columns, className, id) {
  const table = element("table", `hs-table ${className}`);
  table.id = id;
  table.setAttribute("aria-label", `${columns[0].label} 年住房統計`);
  const colgroup = element("colgroup");
  const heading = element("tr");
  for (const column of columns) {
    colgroup.append(element("col", `hs-col-${column.width}`));
    const cell = element("th", "", column.label);
    cell.scope = "col";
    heading.append(cell);
  }
  const head = element("thead");
  head.append(heading);
  table.append(colgroup, head);
  return table;
}

function valueCell(value) {
  const cell = element("td", "", value);
  if (value.startsWith("\u25bc") || value.startsWith("-")) {
    cell.className = "hs-decline";
  } else if (value.startsWith("\u25b3") || value.startsWith("+")) {
    cell.className = "hs-increase";
  }
  return cell;
}

export function renderHousingStatisticsTables(mount) {
  if (!mount) return;
  const shell = element("div", "hs-table-shell");
  shell.setAttribute("role", "region");
  shell.setAttribute("aria-label", "年度住房統計表");
  shell.tabIndex = 0;
  const layout = element("div", "hs-tables-layout");
  const currentRegion = element("div", "hs-year-region");
  currentRegion.id = "hsCurrentYearRegion";
  currentRegion.setAttribute("role", "region");
  currentRegion.setAttribute("aria-label", "2026 年住房統計表，可橫向捲動");
  currentRegion.tabIndex = 0;
  const current = createTable(currentColumns, "hs-current-table", "hsCurrentYearTable");
  for (const group of currentGroups) {
    const body = element("tbody");
    body.dataset.hsLeadTime = group.index;
    for (const [rowIndex, values] of group.rows.entries()) {
      const row = element("tr", rowIndex === group.rows.length - 1 ? "hs-group-end" : "");
      if (rowIndex === 0) {
        for (const text of [group.index, group.leadTime]) {
          const cell = element("th", "hs-row-group", text);
          cell.scope = "rowgroup";
          cell.rowSpan = group.rows.length;
          row.append(cell);
        }
      }
      for (const value of values) row.append(valueCell(value));
      body.append(row);
    }
    current.append(body);
  }
  currentRegion.append(current);

  const previousRegion = element("div", "hs-year-region");
  previousRegion.id = "hsPreviousYearRegion";
  previousRegion.setAttribute("role", "region");
  previousRegion.setAttribute("aria-label", "2025 年住房統計表，可橫向捲動");
  previousRegion.tabIndex = 0;
  previousRegion.hidden = true;
  const previous = createTable(previousColumns, "hs-previous-table", "hsPreviousYearTable");
  const body = element("tbody");
  for (const [index, values] of previousRows.entries()) {
    const row = element("tr", `hs-previous-row-${index + 1}`);
    for (const value of values) row.append(valueCell(value));
    body.append(row);
  }
  previous.append(body);
  previousRegion.append(previous);
  layout.append(currentRegion, previousRegion);
  shell.append(layout);
  mount.replaceWith(shell);
}
