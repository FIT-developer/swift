import { MemberDataState } from "./member-data-state.js";
import { createMemberDataDemo } from "./member-data-demo.js";
import { periodRange } from "./date-periods.js";

const COLUMNS = [
  { key: "category", label: "類別", sortable: true },
  { key: "name", label: "名稱", sortable: true },
  { key: "locked", label: "鎖定狀態" },
  { key: "gender", label: "性別", sortable: true },
  { key: "identity", label: "證號", sortable: true },
  { key: "birthday", label: "生日", sortable: true },
  { key: "phone", label: "行動電話 / 市話" },
  { key: "nationality", label: "國籍", sortable: true },
  { key: "address", label: "地址" },
  { key: "email", label: "Email" },
  { key: "bookingAmount", label: "訂房金額", sortable: true },
  { key: "bookingCount", label: "訂房次數", sortable: true },
  { key: "stayCount", label: "入住次數", sortable: true },
  { key: "createdAt", label: "帳號建立日", sortable: true },
  { key: "remark", label: "備註" },
];
const TEXT_FIELDS = ["name", "identity", "phone", "email", "address", "remark"];
const SELECT_FIELDS = ["branch", "nationality", "integration", "gender"];
const NUMBER_FIELDS = ["bookingAmount", "bookingCount", "stayCount"];
const numberFormat = new Intl.NumberFormat("en-US");

function format(template, values) {
  return template.replace(/\{(\w+)\}/g, function (_, key) {
    return String(values[key]);
  });
}

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[char];
  });
}

function icon(name) {
  return '<img src="./assets/icons/' + name + '.svg" alt="" />';
}

function checkbox(attribute, value, label, checked) {
  return (
    '<label class="member-page-checkbox"><input type="checkbox" ' +
    attribute + '="' + escapeHtml(value) + '" aria-label="' +
    escapeHtml(label) + '"' + (checked ? " checked" : "") +
    ' /><span aria-hidden="true"></span></label>'
  );
}

function makePredicate(values, dateType) {
  return function (record) {
    for (const key of TEXT_FIELDS) {
      if (values[key] && !String(record[key] || "").toLowerCase().includes(values[key].toLowerCase())) {
        return false;
      }
    }
    for (const key of SELECT_FIELDS) {
      if (values[key] && values[key] !== "all" && values[key] !== record[key]) return false;
    }
    const containsField = { email: "email", phone: "phone", address: "address" }[values.contains];
    if (containsField && !record[containsField]) return false;
    for (const range of [
      ["bookingCount", "bookingMin", "bookingMax"],
      ["stayCount", "stayMin", "stayMax"],
    ]) {
      if (values[range[1]] !== "" && values[range[1]] != null &&
          record[range[0]] < Number(values[range[1]])) return false;
      if (values[range[2]] !== "" && values[range[2]] != null &&
          record[range[0]] > Number(values[range[2]])) return false;
    }
    // Only account creation has a confirmed date field in the demo records.
    // Birthday/booker/guest and consumption mappings belong to backend logic.
    if (dateType === "createdAt") {
      if (values.dateStart && record.createdAt < values.dateStart) return false;
      if (values.dateEnd && record.createdAt > values.dateEnd) return false;
    }
    return true;
  };
}

export function initMemberDataPage() {
  const root = document.querySelector(".member-page-content");
  const form = document.getElementById("memberFilterForm");
  if (!root || !form) return;
  const demo = createMemberDataDemo();
  const state = new MemberDataState(demo, { pageSize: 5 });
  const recordIds = demo.map(function (record) { return record.id; });
  const table = document.getElementById("memberTable");
  const head = document.getElementById("memberTableHead");
  const body = document.getElementById("memberTableBody");
  const columns = document.getElementById("memberTableCols");
  const footer = document.getElementById("memberBatchFooter");
  const pagination = document.getElementById("memberPagination");
  const periodOffsets = { today: 0, week: 0, month: 0, year: 0 };
  let dateType = "";

  columns.innerHTML = COLUMNS.map(function (column) {
    return '<col data-member-column="' + column.key + '" />';
  }).join("");

  function rememberFocus() {
    const active = document.activeElement;
    if (!active || !root.contains(active)) return null;
    for (const attribute of [
      "data-member-select-all", "data-member-select-row", "data-member-row-lock",
      "data-member-row-enable", "data-member-sort", "data-member-batch-toggle",
    ]) {
      if (active.hasAttribute(attribute)) {
        return [attribute, active.getAttribute(attribute)];
      }
    }
    return null;
  }

  function renderHeader() {
    const batch = state.isBatchMode();
    const sort = state.getSort();
    head.innerHTML = "<tr>" + COLUMNS.map(function (column) {
      let content;
      if (column.key === "locked") {
        content = '<div class="member-page-lock-heading"><span>鎖定狀態</span>' +
          '<button type="button" class="member-page-batch-toggle' +
          (batch ? " is-active" : "") + '" data-member-batch-toggle aria-pressed="' +
          String(batch) + '">' + (batch ? "結束批次" : "批次調整") + "</button></div>";
      } else if (column.sortable) {
        content = '<button type="button" class="member-page-sort-button" data-member-sort="' +
          column.key + '" aria-label="' + escapeHtml(format("依{name}排序", { name: column.label })) +
          '"><span>' + column.label + "</span>" + icon("sort-alt-2") + "</button>";
        if (column.key === "category" && batch) {
          content = '<div class="member-page-category-heading">' +
            checkbox("data-member-select-all", "", "全選搜尋結果", false) + content + "</div>";
        }
      } else {
        content = column.label;
      }
      const direction = sort && sort.field === column.key
        ? (sort.direction === "asc" ? "ascending" : "descending") : "none";
      return '<th scope="col"' +
        (column.sortable ? ' aria-sort="' + direction + '"' : "") +
        ">" + content + "</th>";
    }).join("") + "</tr>";
    const selectAll = head.querySelector("[data-member-select-all]");
    if (selectAll) {
      const headerState = state.getHeaderSelectionState();
      selectAll.checked = headerState === "checked";
      selectAll.indeterminate = headerState === "mixed";
      selectAll.disabled = state.getFilteredRows().length === 0;
    }
  }

  function renderName(record) {
    const disabled = state.isBatchMode() || record.locked;
    const action = record.enabled ? "停用" : "啟用";
    return '<div class="member-page-name-line"><span>' + escapeHtml(record.name) +
      '</span><button type="button" class="member-page-data-button" data-data-exists-trigger ' +
      'data-member-record="' + record.id + '" aria-label="' +
      escapeHtml(format("查看{name}的會員資料", { name: record.name })) + '"' +
      (state.isBatchMode() ? " disabled" : "") + ">" + icon("attached-link") + "</button></div>" +
      '<div class="member-page-row-actions"><button type="button" class="member-page-state-action ' +
      (record.enabled ? "is-disable" : "is-enable") + '" data-member-row-enable="' +
      record.id + '"' + (disabled ? " disabled" : "") + ">" + action + "</button>" +
      '<button type="button" class="member-page-delete-action" data-member-row-delete="' +
      record.id + '"' + (disabled ? " disabled" : "") + ">刪除個資</button></div>";
  }

  function renderLock(record) {
    const label = record.locked ? "已鎖定" : "未鎖定";
    if (state.isBatchMode()) {
      return '<div class="member-page-lock-status">' +
        icon(record.locked ? "lock" : "unlock") + "<span>" + label + "</span></div>";
    }
    return '<label class="member-page-lock-control"><span>' + label + "</span>" +
      '<span class="member-data-switch"><input type="checkbox" role="switch" ' +
      'data-member-row-lock="' + record.id + '" aria-label="' +
      escapeHtml(format("切換{name}的鎖定狀態", { name: record.name })) + '"' +
      (record.locked ? " checked" : "") +
      ' /><span class="member-data-switch-track"></span><span class="member-data-switch-knob"></span></span></label>';
  }

  function renderRows() {
    const rows = state.getVisibleRows();
    if (!rows.length) {
      body.innerHTML = '<tr class="member-page-empty-row"><td colspan="15">沒有符合條件的會員資料</td></tr>';
      return;
    }
    body.innerHTML = rows.map(function (record) {
      return '<tr class="member-page-row' + (state.isSelected(record.id) ? " is-selected" : "") +
        '" data-member-row="' + record.id + '">' + COLUMNS.map(function (column) {
          let content;
          if (column.key === "category") {
            content = '<div class="member-page-category">';
            if (state.isBatchMode()) {
              content += checkbox("data-member-select-row", record.id,
                format("選取{name}", { name: record.name }), state.isSelected(record.id));
            }
            content += '<span><span class="block">' + escapeHtml(record.category[0]) +
              '</span><span class="block">' + escapeHtml(record.category[1]) + "</span></span></div>";
          } else if (column.key === "name") content = renderName(record);
          else if (column.key === "locked") content = renderLock(record);
          else if (column.key === "phone") {
            content = '<div class="member-page-phone-lines"><span>' + escapeHtml(record.phone) +
              "</span><span>" + escapeHtml(record.landline) + "</span></div>";
          } else if (NUMBER_FIELDS.includes(column.key)) {
            content = numberFormat.format(record[column.key]);
          } else content = escapeHtml(record[column.key]);
          return '<td' + (column.key === "phone" ? ' class="member-page-phone-cell"' : "") +
            ">" + content + "</td>";
        }).join("") + "</tr>";
    }).join("");
  }

  function render() {
    const focus = rememberFocus();
    const infoBeforeClamp = state.getPageInfo();
    state.setPage(infoBeforeClamp.pageIndex);
    const info = state.getPageInfo();
    const filters = state.getFilters();
    table.classList.toggle("is-batch", state.isBatchMode());
    renderHeader();
    renderRows();

    const allRows = recordIds.map(function (id) { return state.getRecord(id); });
    for (const button of root.querySelectorAll("[data-member-status]")) {
      const enabled = button.dataset.memberStatus === "enabled";
      const count = allRows.filter(function (record) { return record.enabled === enabled; }).length;
      const active = filters.enabled === enabled;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
      button.querySelector("[data-member-status-count]").textContent =
        format("\uFF08{count}\uFF09", { count: count });
    }
    for (const button of root.querySelectorAll("[data-member-lock-filter]")) {
      const key = button.dataset.memberLockFilter;
      const active = key === "all" ? filters.locked === null :
        filters.locked === (key === "locked");
      button.classList.toggle("is-selected", active);
      button.setAttribute("aria-pressed", String(active));
    }
    const displayToggle = root.querySelector("[data-member-display-toggle]");
    const allMode = info.displayMode === "all";
    displayToggle.dataset.memberDisplay = info.displayMode;
    displayToggle.setAttribute("aria-pressed", String(allMode));
    displayToggle.querySelector("[data-member-display-icon]").src =
      "./assets/icons/" + (allMode ? "all-pages.svg" : "split-page.svg");
    displayToggle.querySelector("[data-member-display-label]").textContent = allMode
      ? format("全部顯示\uFF08{count} 筆\uFF09", { count: info.filteredCount })
      : format("分頁\uFF08{pages}頁 | {count} 筆\uFF09", {
          pages: Math.ceil(info.filteredCount / info.pageSize),
          count: info.filteredCount,
        });
    pagination.hidden = info.displayMode !== "paged";
    pagination.querySelector("[data-member-page-label]").textContent =
      String(info.filteredCount ? info.pageIndex + 1 : 0);
    pagination.querySelector('[data-member-page="prev"]').disabled = info.pageIndex === 0;
    pagination.querySelector('[data-member-page="next"]').disabled =
      info.pageCount === 0 || info.pageIndex + 1 >= info.pageCount;
    footer.hidden = !state.isBatchMode();
    const counts = state.getEligibleCounts();
    const allSelected = state.getHeaderSelectionState() === "checked" &&
      counts.selectedCount === info.filteredCount;
    footer.querySelector("[data-member-selected-label]").textContent = allSelected
      ? format("已全選搜尋結果共 {count} 筆資料", { count: counts.selectedCount })
      : format("已選取 {count} 筆資料", { count: counts.selectedCount });
    for (const action of ["lock", "unlock"]) {
      const count = action === "lock" ? counts.lockEligibleCount : counts.unlockEligibleCount;
      const button = footer.querySelector("[data-member-batch-" + action + "]");
      button.disabled = count === 0;
      button.querySelector("[data-member-batch-count]").textContent = String(count);
    }
    if (focus) {
      const target = root.querySelector("[" + focus[0] + '="' + CSS.escape(focus[1]) + '"]');
      if (target && !target.disabled) target.focus({ preventScroll: true });
    }
  }

  function submitQuery() {
    const values = Object.fromEntries(new FormData(form));
    state.setFilters({ query: "", fields: {}, predicate: makePredicate(values, dateType) });
    state.setPage(0);
    render();
  }

  function downloadCsv() {
    const lines = [COLUMNS.map(function (column) { return column.label; })];
    for (const record of state.getFilteredRows()) {
      lines.push(COLUMNS.map(function (column) {
        if (column.key === "locked") return record.locked ? "已鎖定" : "未鎖定";
        if (column.key === "category") return record.category.join(" / ");
        if (column.key === "phone") return [record.phone, record.landline].filter(Boolean).join(" / ");
        return record[column.key];
      }));
    }
    const csv = lines.map(function (line) {
      return line.map(function (value) {
        let cell = String(value == null ? "" : value);
        if (/^[=+\-@\t\r]/.test(cell)) cell = "'" + cell;
        return '"' + cell.replace(/"/g, '""') + '"';
      }).join(",");
    }).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "member-data.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    submitQuery();
  });

  root.addEventListener("change", function (event) {
    const input = event.target;
    if (input.matches("[data-member-select-all]")) state.toggleSelectAllFiltered();
    else if (input.matches("[data-member-select-row]")) {
      state.setSelected(input.dataset.memberSelectRow, input.checked);
    } else if (input.matches("[data-member-row-lock]")) {
      state.toggleRowLock(input.dataset.memberRowLock);
    } else return;
    render();
  });

  root.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button || !root.contains(button) || button.disabled) return;
    if (button.hasAttribute("data-member-batch-toggle")) {
      if (state.isBatchMode()) state.endBatchMode();
      else state.enterBatchMode();
    } else if (button.hasAttribute("data-member-batch-lock")) state.applyBatchLock();
    else if (button.hasAttribute("data-member-batch-unlock")) state.applyBatchUnlock();
    else if (button.hasAttribute("data-member-clear-selection")) state.clearSelection();
    else if (button.hasAttribute("data-member-status")) {
      state.setFilters({ enabled: button.dataset.memberStatus });
      state.setPage(0);
    } else if (button.hasAttribute("data-member-lock-filter")) {
      state.setFilters({ locked: button.dataset.memberLockFilter });
      state.setPage(0);
    } else if (button.hasAttribute("data-member-display-toggle")) {
      state.setDisplayMode(state.getPageInfo().displayMode === "all" ? "paged" : "all");
      state.setPage(0);
    } else if (button.hasAttribute("data-member-page")) {
      const direction = button.dataset.memberPage === "prev" ? -1 : 1;
      state.setPage(Math.max(0, state.getPageInfo().pageIndex + direction));
    } else if (button.hasAttribute("data-member-sort")) {
      state.sortBy(button.dataset.memberSort);
    } else if (button.hasAttribute("data-member-row-enable")) {
      state.toggleEnabled(button.dataset.memberRowEnable);
    } else if (button.hasAttribute("data-member-row-delete")) {
      if (state.canDeletePersonalData(button.dataset.memberRowDelete)) {
        window.confirm("是否刪除個資?");
      }
      return;
    } else if (button.hasAttribute("data-member-clear-filter")) {
      form.reset();
      dateType = "";
      for (const key of Object.keys(periodOffsets)) periodOffsets[key] = 0;
      for (const chip of form.querySelectorAll("[data-member-date-type]")) {
        chip.classList.remove("is-selected");
        chip.setAttribute("aria-pressed", "false");
      }
      state.setFilters({ query: "", fields: {}, predicate: null });
      state.setPage(0);
    } else if (button.hasAttribute("data-member-date-type")) {
      dateType = button.dataset.memberDateType;
      for (const chip of form.querySelectorAll("[data-member-date-type]")) {
        const active = chip === button;
        chip.classList.toggle("is-selected", active);
        chip.setAttribute("aria-pressed", String(active));
      }
      return;
    } else if (button.hasAttribute("data-member-period-step")) {
      const period = button.closest("[data-member-period]").dataset.memberPeriod;
      const step = Number(button.dataset.memberPeriodStep);
      periodOffsets[period] = step === 0 ? 0 : periodOffsets[period] + step;
      const dates = periodRange(period, periodOffsets[period]);
      form.elements.namedItem("dateStart").value = dates[0];
      form.elements.namedItem("dateEnd").value = dates[1];
      return;
    } else if (button.hasAttribute("data-member-download")) {
      downloadCsv();
      return;
    } else return;
    render();
  });

  render();
}
