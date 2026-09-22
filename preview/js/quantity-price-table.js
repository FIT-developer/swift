var TABLE_DATES = [
  "2026-08-24", "2026-08-25", "2026-08-26", "2026-08-27",
  "2026-08-28", "2026-08-29", "2026-08-30", "2026-09-24",
  "2026-09-25", "2026-09-26", "2026-09-27", "2026-09-28",
  "2026-09-29", "2026-09-30",
];

var RATE_ROWS = [
  { room: "景觀多人房", plan: "Standard Rate 447" },
  { room: "景觀多人房", plan: "Non-refundable (BF,D 503)" },
  { room: "景觀多人房", plan: "Non-refundable (Standar Rate 447)" },
];

var INVENTORY_MONTHS = [
  { year: 2026, month: 9 },
  { year: 2026, month: 10 },
  { year: 2026, month: 11 },
  { year: 2026, month: 12 },
  { year: 2027, month: 1 },
  { year: 2027, month: 2 },
  { year: 2027, month: 3 },
  { year: 2027, month: 4 },
  { year: 2027, month: 5 },
  { year: 2027, month: 6 },
  { year: 2027, month: 7 },
  { year: 2027, month: 8 },
];

var MONTH_NAMES = [
  "一", "二", "三", "四", "五", "六",
  "七", "八", "九", "十", "十一", "十二",
];

var DEMO_TODAY = new Date(2026, 1, 3);

function pad(value) {
  return String(value).padStart(2, "0");
}

function dateKey(date) {
  return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
}

function dateFromKey(value) {
  var parts = value.split("-").map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function sameDate(first, second) {
  return first && second && dateKey(first) === dateKey(second);
}

function renderRateCells() {
  document.querySelectorAll(".qp-rate-row").forEach(function (row, rowIndex) {
    if (row.querySelector(".qp-rate-cell")) return;
    TABLE_DATES.forEach(function (date, dateIndex) {
      var cell = document.createElement("td");
      cell.className = "qp-rate-cell" + (dateIndex === 2 ? " is-today" : "");
      cell.dataset.amount = "8000";
      cell.dataset.date = date;
      cell.dataset.room = RATE_ROWS[rowIndex].room;
      cell.dataset.ratePlan = RATE_ROWS[rowIndex].plan;
      cell.innerHTML = [
        '<button type="button" class="qp-rate-display" data-qp-rate-display>',
        '<span>TWD</span><strong>8000</strong>',
        "</button>",
        '<div class="qp-rate-editor" data-qp-rate-editor hidden>',
        '<button type="button" class="qp-detail-hotspot"',
        ' data-qp-detail-open data-modal-open="modalQuantityPriceDetailBackdrop"',
        ' aria-label="開啟價格細部設定"></button>',
        '<input type="number" value="8000" aria-label="調整價格" />',
        "</div>",
      ].join("");
      row.appendChild(cell);
    });
  });
}

function renderInventoryMonths() {
  document.querySelectorAll("[data-qp-month-table]").forEach(function (slot) {
    if (slot.children.length) return;
    var group = slot.dataset.qpMonthTable;
    var table = document.createElement("table");
    var head = document.createElement("thead");
    var yearRow = document.createElement("tr");
    var body = document.createElement("tbody");
    var monthRow = document.createElement("tr");

    table.className = "qp-month-table";
    table.setAttribute("aria-label", group === "header" ? "全選月份" : "房型設定月份");

    [
      { year: 2026, span: 4 },
      { year: 2027, span: 8 },
    ].forEach(function (item) {
      var yearCell = document.createElement("th");
      yearCell.scope = "colgroup";
      yearCell.colSpan = item.span;
      yearCell.textContent = item.year + " 年";
      yearRow.appendChild(yearCell);
    });

    INVENTORY_MONTHS.forEach(function (item) {
      var cell = document.createElement("td");
      var label = document.createElement("label");
      var input = document.createElement("input");
      var month = document.createElement("span");
      input.type = "checkbox";
      input.name = group + "-" + item.year + "-" + item.month;
      input.setAttribute("aria-label", item.year + " 年 " + item.month + " 月");
      month.className = "qp-month-name";
      month.textContent = (MONTH_NAMES[item.month - 1] + "月").split("").join("\n");
      label.appendChild(month);
      label.appendChild(input);
      cell.appendChild(label);
      monthRow.appendChild(cell);
    });

    head.appendChild(yearRow);
    body.appendChild(monthRow);
    table.appendChild(head);
    table.appendChild(body);
    slot.appendChild(table);
  });
}

function initInlineRates() {
  var table = document.querySelector(".qp-rate-table");
  if (!table) return;

  table.addEventListener("click", function (event) {
    var display = event.target.closest("[data-qp-rate-display]");
    if (display) {
      var cell = display.closest(".qp-rate-cell");
      var editor = cell.querySelector("[data-qp-rate-editor]");
      var input = editor.querySelector("input");
      input.value = cell.dataset.amount;
      display.hidden = true;
      editor.hidden = false;
      input.focus();
      input.select();
      return;
    }

    var detailTrigger = event.target.closest("[data-qp-detail-open]");
    if (!detailTrigger) return;
    var detailCell = detailTrigger.closest(".qp-rate-cell");
    document.getElementById("qpDetailRoomTitle").textContent = detailCell.dataset.room;
    document.getElementById("qpDetailRatePlan").textContent = detailCell.dataset.ratePlan;
    document.getElementById("qpDetailDate").textContent = detailCell.dataset.date;
  });

  table.addEventListener("keydown", function (event) {
    if (event.key !== "Enter") return;
    var input = event.target.closest("[data-qp-rate-editor] input");
    if (!input) return;
    event.preventDefault();
    var cell = input.closest(".qp-rate-cell");
    var display = cell.querySelector("[data-qp-rate-display]");
    var value = input.value;
    cell.dataset.amount = value;
    display.querySelector("strong").textContent = value;
    input.closest("[data-qp-rate-editor]").hidden = true;
    display.hidden = false;
    display.focus();
  });
}

function initDateRangePicker() {
  var trigger = document.getElementById("qpDateRangeButton");
  var popover = document.getElementById("qpDateRangePopover");
  var label = trigger && trigger.querySelector("[data-qp-date-range-label]");
  if (!trigger || !popover || !label) return function () {};

  var viewMonth = new Date(2026, 0, 1);
  var rangeStart = null;
  var rangeEnd = null;

  function updateLabel() {
    if (!rangeStart) {
      label.textContent = "0000-00-00 ~ 0000-00-00";
      return;
    }
    label.textContent = dateKey(rangeStart) + " ~ " + (rangeEnd ? dateKey(rangeEnd) : "0000-00-00");
  }

  function selectDate(date) {
    if (!rangeStart || rangeEnd) {
      rangeStart = date;
      rangeEnd = null;
    } else if (date < rangeStart) {
      rangeEnd = rangeStart;
      rangeStart = date;
    } else {
      rangeEnd = date;
    }
    updateLabel();
    render();
  }

  function renderMonth(container, monthDate) {
    var title = container.querySelector("[data-qp-calendar-title]");
    var days = container.querySelector("[data-qp-calendar-days]");
    var year = monthDate.getFullYear();
    var month = monthDate.getMonth();
    var first = new Date(year, month, 1);
    var mondayOffset = (first.getDay() + 6) % 7;
    var last = new Date(year, month + 1, 0);
    var cellCount = mondayOffset + last.getDate() > 35 ? 42 : 35;
    title.textContent = year + " 年 " + (month + 1) + " 月";
    days.innerHTML = "";

    for (var index = 0; index < cellCount; index += 1) {
      var date = new Date(year, month, index - mondayOffset + 1);
      var isOverflow = date.getMonth() !== month;
      var isPast = date < DEMO_TODAY;
      var isEndpoint = sameDate(date, rangeStart) || sameDate(date, rangeEnd);
      var isMiddle = rangeStart && rangeEnd && date > rangeStart && date < rangeEnd;
      var button = document.createElement("button");
      button.type = "button";
      button.className = "qp-calendar-day";
      button.textContent = String(date.getDate());
      button.dataset.date = dateKey(date);

      if (isOverflow) button.classList.add("is-overflow");
      if (!isOverflow && isPast) button.classList.add("is-disabled");
      if (!isOverflow && sameDate(date, DEMO_TODAY)) button.classList.add("is-today");
      if (!isOverflow && isMiddle) button.classList.add("is-range-middle");
      if (!isOverflow && isEndpoint) button.classList.add("is-range-endpoint");

      button.disabled = isOverflow || isPast;
      button.setAttribute("aria-pressed", isEndpoint || isMiddle ? "true" : "false");
      if (!button.disabled) {
        button.addEventListener("click", function (event) {
          event.stopPropagation();
          selectDate(dateFromKey(this.dataset.date));
        });
      }
      days.appendChild(button);
    }
  }

  function render() {
    document.querySelectorAll("[data-qp-calendar-month]").forEach(function (monthNode) {
      var offset = Number(monthNode.dataset.qpCalendarMonth);
      renderMonth(monthNode, new Date(viewMonth.getFullYear(), viewMonth.getMonth() + offset, 1));
    });
  }

  function close() {
    popover.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  }

  trigger.addEventListener("click", function () {
    var shouldOpen = popover.hidden;
    popover.hidden = !shouldOpen;
    trigger.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
    if (shouldOpen) render();
  });

  popover.querySelector("[data-qp-calendar-previous]").addEventListener("click", function () {
    viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1);
    render();
  });
  popover.querySelector("[data-qp-calendar-next]").addEventListener("click", function () {
    viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1);
    render();
  });

  document.addEventListener("click", function (event) {
    if (popover.hidden || event.target.closest(".qp-date-range-wrap")) return;
    close();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !popover.hidden) close();
  });

  render();
  return function resetCalendar() {
    viewMonth = new Date(2026, 0, 1);
    rangeStart = null;
    rangeEnd = null;
    updateLabel();
    render();
    close();
  };
}

export function initQuantityPriceTable() {
  renderRateCells();
  renderInventoryMonths();
  initInlineRates();
  var resetCalendar = initDateRangePicker();
  var filter = document.getElementById("qpFilterForm");
  if (filter) filter.addEventListener("reset", resetCalendar);

  document.documentElement.dataset.qpReady = "true";

  return {
    beforeOpen: function (id) {
      if (id === "modalQuantityGroupBackdrop") {
        document.getElementById("qpGroupForm").reset();
      }
      if (id === "modalQuantityInventoryBackdrop") {
        document.getElementById("qpInventoryForm").reset();
      }
      if (id === "modalQuantityPriceDetailBackdrop") {
        document.getElementById("qpDetailForm").reset();
      }
    },
  };
}
