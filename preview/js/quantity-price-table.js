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

var INVENTORY_MONTHS = [];
for (var monthIndex = 0; monthIndex < 14; monthIndex += 1) {
  var inventoryDate = new Date(2026, 7 + monthIndex, 1);
  INVENTORY_MONTHS.push({
    year: inventoryDate.getFullYear(),
    month: inventoryDate.getMonth() + 1,
  });
}

var INVENTORY_ROOMS = [
  { key: "aac", name: "（AAC）維力雜醬麵房", availableUntil: "2027-08" },
  { key: "azc", name: "（AZC）味全真的不要喝房", availableUntil: "2027-09" },
  { key: "zzo", name: "（ZZO）火鍋讚", availableUntil: "2027-07" },
];

var GROUP_OPTIONS = {
  "option 1": [
    { items: ["ABC", "XYZ"] },
    { items: ["頻道 1", "頻道 2"] },
  ],
  "option 2": [
    { title: "Title", items: ["ABC", "FCG"] },
    { title: "Title", items: ["XZZ", "FOG"] },
    { items: ["頻道 1", "頻道 2"] },
  ],
  "option 3": [
    { title: "Title", items: ["IOP", "ZOQ"] },
    { title: "Title", items: ["BBQ", "FUC"] },
    { items: ["頻道 1", "頻道 2"] },
  ],
};

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

function makeElement(tagName, className, text) {
  var element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function makeCheckboxControl(options) {
  var config = options || {};
  var control = makeElement("span", "qp-check-control");
  var input = document.createElement("input");
  var visual = makeElement("span", "qp-check-visual");

  input.type = "checkbox";
  if (config.name) input.name = config.name;
  if (config.label) input.setAttribute("aria-label", config.label);
  if (config.checked) {
    input.checked = true;
    input.defaultChecked = true;
  }
  if (config.disabled) input.disabled = true;
  if (config.batch) input.setAttribute("data-qp-inventory-batch", "");
  if (config.room) input.setAttribute("data-qp-inventory-room", config.room);
  if (config.monthKey) input.dataset.monthKey = config.monthKey;
  if (config.groupKey) input.dataset.qpGroupKey = config.groupKey;
  if (config.selectAll) input.setAttribute("data-qp-group-select-all", "");
  if (config.groupItem) input.setAttribute("data-qp-group-item", "");

  visual.setAttribute("aria-hidden", "true");
  control.appendChild(input);
  control.appendChild(visual);
  return { control: control, input: input };
}

function monthKey(item) {
  return item.year + "-" + pad(item.month);
}

function roomIsAvailable(room, month) {
  return monthKey(month) <= room.availableUntil;
}

function isSampleInventoryChecked(rowKey, item) {
  var key = monthKey(item);
  if (key === "2027-03") return true;
  return rowKey === "aac" && key === "2026-12";
}

function renderInventoryTable() {
  var columns = document.querySelector("[data-qp-inventory-columns]");
  var head = document.querySelector("[data-qp-inventory-head]");
  var body = document.querySelector("[data-qp-inventory-rows]");
  if (!columns || !head || !body || body.children.length) return;

  columns.appendChild(makeElement("col", "qp-inventory-room-column"));
  INVENTORY_MONTHS.forEach(function () {
    columns.appendChild(makeElement("col", "qp-inventory-month-column"));
  });
  columns.appendChild(makeElement("col", "qp-inventory-total-column"));

  var yearRow = document.createElement("tr");
  var roomHeader = makeElement("th", "", "房型");
  roomHeader.scope = "col";
  roomHeader.rowSpan = 2;
  yearRow.appendChild(roomHeader);

  [
    { year: 2026, span: 5 },
    { year: 2027, span: 9 },
  ].forEach(function (year) {
    var cell = makeElement("th", "", year.year + " 年");
    cell.scope = "colgroup";
    cell.colSpan = year.span;
    cell.setAttribute("data-qp-inventory-year-header", "");
    yearRow.appendChild(cell);
  });

  var totalHeader = makeElement("th", "", "總房數");
  totalHeader.scope = "col";
  totalHeader.rowSpan = 2;
  yearRow.appendChild(totalHeader);
  head.appendChild(yearRow);

  var monthRow = document.createElement("tr");
  INVENTORY_MONTHS.forEach(function (item, index) {
    var cell = makeElement("th", index >= 12 ? "qp-inventory-extra-month" : "", item.month + "月");
    cell.scope = "col";
    cell.dataset.monthKey = monthKey(item);
    cell.setAttribute("data-qp-inventory-month-header", "");
    if (index >= 12) cell.setAttribute("data-qp-inventory-extra-month", "");
    monthRow.appendChild(cell);
  });
  head.appendChild(monthRow);

  var rows = [{ key: "all", name: "全部房型", batch: true }].concat(
    INVENTORY_ROOMS.map(function (room) {
      return { key: room.key, name: room.name, batch: false, room: room };
    }),
  );

  rows.forEach(function (rowData) {
    var row = document.createElement("tr");
    var nameCell = makeElement("th");
    nameCell.scope = "row";
    nameCell.appendChild(makeElement("span", "qp-inventory-room-name", rowData.name));
    if (rowData.batch) {
      nameCell.appendChild(makeElement("span", "qp-inventory-batch-badge", "批次套用"));
    }
    row.appendChild(nameCell);

    INVENTORY_MONTHS.forEach(function (item) {
      var key = monthKey(item);
      var td = makeElement("td", "qp-inventory-cell");
      var label = makeElement("label", "qp-inventory-cell-label");
      var unavailable = rowData.batch
        ? INVENTORY_ROOMS.some(function (room) {
            return !roomIsAvailable(room, item);
          })
        : !roomIsAvailable(rowData.room, item);
      var rowLabel = rowData.name + "，" + item.year + " 年 " + item.month + " 月";
      var checkbox = makeCheckboxControl({
        batch: rowData.batch,
        room: rowData.batch ? "" : rowData.key,
        monthKey: key,
        name: "qp-inventory-" + rowData.key + "-" + key,
        label: rowLabel,
        disabled: unavailable,
        checked: !unavailable && isSampleInventoryChecked(rowData.key, item),
      });

      td.dataset.monthKey = key;
      if (unavailable) td.classList.add("is-disabled");
      label.appendChild(checkbox.control);
      td.appendChild(label);
      row.appendChild(td);
    });

    var totalCell = makeElement("td", "qp-inventory-total-cell");
    if (rowData.batch) {
      var totalMark = makeElement("span", "qp-inventory-total-mark");
      var totalIcon = document.createElement("img");
      totalIcon.src = "./assets/icons/outline-minus.svg";
      totalIcon.alt = "";
      totalMark.setAttribute("data-qp-inventory-total-mark", "");
      totalMark.appendChild(totalIcon);
      totalCell.appendChild(totalMark);
    } else {
      var total = document.createElement("input");
      total.className = "qp-inventory-total";
      total.setAttribute("data-qp-inventory-total", "");
      total.type = "number";
      total.value = "999";
      total.defaultValue = "999";
      total.setAttribute("aria-label", rowData.name + "總房數");
      totalCell.appendChild(total);
    }
    row.appendChild(totalCell);
    body.appendChild(row);
  });

  body.querySelectorAll("[data-qp-inventory-room]").forEach(function (roomInput) {
    syncInventoryBatch(roomInput.dataset.monthKey);
  });
}

function syncInventoryBatch(key) {
  var table = document.querySelector(".qp-inventory-table");
  if (!table) return;
  var batch = Array.from(table.querySelectorAll("[data-qp-inventory-batch]"))
    .find(function (input) {
      return input.dataset.monthKey === key;
    });
  if (!batch || batch.disabled) return;
  var rooms = Array.from(table.querySelectorAll("[data-qp-inventory-room]"))
    .filter(function (input) {
      return input.dataset.monthKey === key;
    });
  batch.checked = rooms.length > 0 && rooms.every(function (input) { return input.checked; });
}

function initInventorySync() {
  var table = document.querySelector(".qp-inventory-table");
  if (!table) return;
  table.addEventListener("change", function (event) {
    var input = event.target.closest("[data-qp-inventory-batch], [data-qp-inventory-room]");
    if (!input) return;
    var key = input.dataset.monthKey;
    if (input.hasAttribute("data-qp-inventory-batch")) {
      table.querySelectorAll("[data-qp-inventory-room]").forEach(function (roomInput) {
        if (roomInput.dataset.monthKey === key) roomInput.checked = input.checked;
      });
    }
    syncInventoryBatch(key);
  });
}

function renderGroupLists(setValue) {
  var root = document.getElementById("qpGroupLists");
  var groups = GROUP_OPTIONS[setValue] || GROUP_OPTIONS["option 1"];
  if (!root) return;
  root.innerHTML = "";

  groups.forEach(function (group, index) {
    var key = "group-" + (index + 1);
    var section = makeElement(
      "section",
      "qp-group-list" + (group.title ? " qp-group-list--titled" : ""),
    );
    section.dataset.qpGroupList = "";
    section.dataset.qpGroupKey = key;

    var header = makeElement("div", "qp-group-list-header");
    if (group.title) {
      var title = makeElement("h3", "qp-group-list-title", group.title);
      header.appendChild(title);
    } else {
      header.appendChild(makeElement("span"));
    }

    var selectAllLabel = makeElement("label", "qp-group-select-all");
    var selectAll = makeCheckboxControl({ groupKey: key, selectAll: true, label: "全選" });
    selectAllLabel.appendChild(selectAll.control);
    selectAllLabel.appendChild(makeElement("span", "", "全選"));
    header.appendChild(selectAllLabel);
    section.appendChild(header);

    var itemList = makeElement("div", "qp-group-items");
    group.items.forEach(function (item) {
      var itemLabel = makeElement("label", "qp-group-item");
      var itemCheckbox = makeCheckboxControl({
        groupKey: key,
        groupItem: true,
        label: item,
      });
      itemLabel.appendChild(itemCheckbox.control);
      itemLabel.appendChild(makeElement("span", "", item));
      itemList.appendChild(itemLabel);
    });
    section.appendChild(itemList);
    root.appendChild(section);
  });
}

function resetGroupForm(optionValue) {
  var form = document.getElementById("qpGroupForm");
  if (!form) return;
  var set = document.getElementById("qpGroupSet");
  set.value = optionValue || "option 1";
  form.classList.toggle("is-expanded", set.value !== "option 1");
  document.getElementById("qpGroupTo").value = "0";
  document.getElementById("qpGroupStartDate").value = "";
  document.getElementById("qpGroupEndDate").value = "";
  form.querySelectorAll('input[name="weekday"]').forEach(function (input) {
    input.checked = false;
  });
  renderGroupLists(set.value);
}

function initGroupForm() {
  var form = document.getElementById("qpGroupForm");
  var set = document.getElementById("qpGroupSet");
  var lists = document.getElementById("qpGroupLists");
  if (!form || !set || !lists) return;

  set.addEventListener("change", function () {
    resetGroupForm(set.value);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  form.querySelector("[data-qp-group-clear]").addEventListener("click", function () {
    resetGroupForm(set.value);
  });

  lists.addEventListener("change", function (event) {
    var input = event.target.closest("[data-qp-group-select-all], [data-qp-group-item]");
    if (!input) return;
    var group = input.closest("[data-qp-group-list]");
    if (!group) return;

    if (input.hasAttribute("data-qp-group-select-all")) {
      group.querySelectorAll("[data-qp-group-item]").forEach(function (item) {
        item.checked = input.checked;
      });
      return;
    }

    var items = Array.from(group.querySelectorAll("[data-qp-group-item]"));
    var selectAll = group.querySelector("[data-qp-group-select-all]");
    selectAll.checked = items.length > 0 && items.every(function (item) { return item.checked; });
  });

  resetGroupForm("option 1");
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
      button.setAttribute("aria-label", dateKey(date));
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
    if (!popover.hidden) positionPopover();
  }

  function close() {
    popover.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  }

  function positionPopover() {
    var root = document.documentElement;
    var rootStyle = window.getComputedStyle(root);
    var gutter = parseFloat(rootStyle.getPropertyValue("--spacing-12")) || 12;
    var gap = parseFloat(rootStyle.getPropertyValue("--spacing-8")) || 8;
    var triggerRect = trigger.getBoundingClientRect();
    var popoverRect = popover.getBoundingClientRect();
    var maxLeft = Math.max(gutter, root.clientWidth - popoverRect.width - gutter);
    var left = Math.min(Math.max(triggerRect.left, gutter), maxLeft);
    var top = triggerRect.bottom + gap;
    var maxTop = Math.max(gutter, root.clientHeight - popoverRect.height - gutter);

    if (top > maxTop && triggerRect.top - popoverRect.height - gap >= gutter) {
      top = triggerRect.top - popoverRect.height - gap;
    }
    top = Math.min(Math.max(top, gutter), maxTop);
    popover.style.setProperty("--qp-calendar-left", Math.round(left) + "px");
    popover.style.setProperty("--qp-calendar-top", Math.round(top) + "px");
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
  window.addEventListener("resize", positionPopover);
  window.addEventListener("scroll", positionPopover, true);

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

function resetFilterDefaults(filter) {
  if (!filter) return;
  filter.querySelectorAll("select[data-qp-filter]").forEach(function (select) {
    var defaultIndex = Array.from(select.options).findIndex(function (option) {
      return option.defaultSelected;
    });
    select.selectedIndex = defaultIndex;
  });
}

export function initQuantityPriceTable() {
  renderRateCells();
  renderInventoryTable();
  initInventorySync();
  initGroupForm();
  initInlineRates();
  var resetCalendar = initDateRangePicker();
  var filter = document.getElementById("qpFilterForm");
  if (filter) {
    resetFilterDefaults(filter);
    filter.addEventListener("reset", function (event) {
      event.preventDefault();
      resetFilterDefaults(filter);
      resetCalendar();
    });
  }

  document.documentElement.dataset.qpReady = "true";

  return {
    beforeOpen: function (id) {
      if (id === "modalQuantityGroupBackdrop") {
        resetGroupForm("option 1");
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
