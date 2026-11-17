import { todayIso, periodRange } from "./date-periods.js";
import { renderHousingStatisticsTables } from "./housing-statistics-tables.js";

export function initHousingStatistics() {
  const root = document.querySelector(".hs-content");
  const form = document.getElementById("housingStatisticsFilter");
  if (!root || !form) return;
  const field = (name) => form.elements.namedItem(name);
  const offsets = { today: 0, week: 0, month: 0, year: 0 };
  let appliedFilters;
  renderHousingStatisticsTables(document.getElementById("hsTablesMount"));

  function syncDates() {
    for (const value of root.querySelectorAll("[data-hs-date-value]")) {
      value.textContent = field(value.dataset.hsDateValue).value;
    }
  }

  function getFilters() {
    return {
      dateStart: field("dateStart").value,
      dateEnd: field("dateEnd").value,
      bookingSource: field("bookingSource").value,
      nationality: field("nationality").value,
      categoryOne: field("categoryOne").value,
      categoryTwo: field("categoryTwo").value,
      comparePrevious: field("comparePrevious").checked,
      comparisonScope: field("comparisonScope").value,
      noShow: field("noShow").checked,
    };
  }

  function syncComparison() {
    const enabled = field("comparePrevious").checked;
    field("comparisonScope").disabled = !enabled;
    const region = document.getElementById("hsPreviousYearRegion");
    if (region) region.hidden = !enabled;
  }

  function reset() {
    const today = todayIso();
    field("dateStart").value = today;
    field("dateEnd").value = today;
    syncDates();
    for (const select of form.querySelectorAll("select")) select.value = "all";
    field("comparePrevious").checked = false;
    field("noShow").checked = false;
    for (const period of Object.keys(offsets)) offsets[period] = 0;
    syncComparison();
    appliedFilters = getFilters();
  }

  form.addEventListener("reset", (event) => {
    event.preventDefault();
    reset();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    appliedFilters = getFilters();
    root.dispatchEvent(new CustomEvent("housing-statistics:query", {
      bubbles: true,
      detail: { ...appliedFilters },
    }));
  });
  field("comparePrevious").addEventListener("change", syncComparison);
  form.addEventListener("input", syncDates);
  form.addEventListener("change", syncDates);
  form.addEventListener("click", (event) => {
    const step = event.target.closest("[data-hs-period-step]");
    if (step) {
      const period = step.closest("[data-hs-period]").dataset.hsPeriod;
      const direction = Number(step.dataset.hsPeriodStep);
      offsets[period] = direction === 0 ? 0 : offsets[period] + direction;
      const [start, end] = periodRange(period, offsets[period]);
      field("dateStart").value = start;
      field("dateEnd").value = end;
      syncDates();
    }
    const calendar = event.target.closest("[data-hs-calendar]");
    if (calendar) {
      const input = field(calendar.dataset.hsCalendar);
      input.focus();
      if (typeof input.showPicker === "function") input.showPicker();
      else input.click();
    }
  });
  root.querySelector("[data-hs-download]").addEventListener("click", () => {
    root.dispatchEvent(new CustomEvent("housing-statistics:download", {
      bubbles: true,
      detail: { ...appliedFilters },
    }));
  });
  const help = document.getElementById("hsHelpPopover");
  const helpButton = document.getElementById("hsHelpButton");
  help.addEventListener("toggle", (event) => {
    helpButton.setAttribute("aria-expanded", String(event.newState === "open"));
  });
  reset();
  root.dataset.hsReady = "true";
  return { getFilters, getAppliedFilters: () => ({ ...appliedFilters }) };
}
