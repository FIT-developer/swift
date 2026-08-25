// 加購商品頁行為（specs/pages/purchase-addon.md）
// 產品 / 類別 table 走跟房型頁相同的 state-driven render：啟用/停用
// tab 依當下 state 即時計數，停用/啟用會把資料移到另一個 tab。
const PAGE_SIZE = 5;
const PHOTO_SLOT_COUNT = 5;
const PROJECT_ITEMS = [
  { id: "999", label: "[999] 飛天六人滿意", tags: ["網", "企"] },
  { id: "419", label: "[419] 不可告人優惠", tags: [] },
  { id: "123", label: "[123] 劍湖山吃到飽", tags: [] },
  { id: "443", label: "[443] 大利大吉", tags: ["註"] },
  { id: "89", label: "[89] 地勤很辛苦", tags: [] },
  { id: "09", label: "[09] 空姐滿班", tags: [] },
];
const FLIGHT_PROJECT_ITEM_IDS = ["999", "89", "09"];

const productRows = [
  product("product-1", "22", true, "房費折抵", "沖帳", "58888", "active", {
    listed: true,
    languages: [
      { code: "zh-TW", label: "繁中", selected: true },
      { code: "en", label: "英文", selected: false },
    ],
  }),
  product("product-2", "33", false, "退寵物入住保證金", "特別費", "78888", "active"),
  product("product-3", "44", true, "火鍋", "嗚啦啦", "555", "active", {
    lodging: true,
  }),
  product("product-4", "66", false, "花瓶", "餐飲類", "-100000", "active", {
    limited: true,
  }),
  product("product-5", "1999", false, "金紙", "餐飲服務", "89898989", "active", {
    nonLimited: true,
  }),
  product("product-6", "2001", true, "早餐券", "餐飲服務", "300", "active", {
    lodging: true,
  }),
  product("product-7", "2002", false, "停車折抵", "停車", "200", "active"),
  product("product-8", "2003", true, "迎賓花束", "禮品", "1200", "active", {
    limited: true,
  }),
  product("product-9", "2004", false, "晚退費", "特別費", "800", "active"),
  product("product-10", "2005", true, "寵物清潔費", "寵物", "600", "active"),
  product("product-11", "2006", false, "接駁服務", "交通", "1500", "active", {
    nonLimited: true,
  }),
  product("product-12", "2007", true, "蛋糕", "餐飲類", "980", "active", {
    limited: true,
  }),
  product("product-13", "2008", false, "按摩券", "休閒", "2200", "active"),
  product("product-14", "2009", true, "客房佈置", "禮品", "3500", "active"),
  product("product-15", "3001", false, "舊版餐券", "餐飲服務", "100", "deleted", {
    limited: true,
  }),
  product("product-16", "3002", false, "舊版停車費", "停車", "100", "deleted"),
  product("product-17", "3003", true, "舊版花束", "禮品", "900", "deleted"),
  product("product-18", "3004", false, "舊版接駁", "交通", "1200", "deleted"),
  product("product-19", "3005", false, "舊版折抵", "沖帳", "500", "deleted", {
    nonLimited: true,
  }),
];

const categoryRows = [
  category("category-1", "22", "總部", "餐飲服務", "商品", "21", "active", {
    lodging: true,
  }),
  category("category-2", "33", "本館", "音樂服務", "商品", "5", "active"),
  category("category-3", "44", "本館", "三加餐宵夜", "商品", "99", "active"),
  category("category-4", "66", "總部", "大聯盟贊助", "商品", "1", "active"),
  category("category-5", "1999", "總部", "PEACE", "商品", "1", "active"),
  category("category-6", "201", "本館", "早餐類", "商品", "12", "active", {
    lodging: true,
  }),
  category("category-7", "202", "總部", "交通類", "商品", "4", "active"),
  category("category-8", "203", "本館", "禮品類", "商品", "8", "active"),
  category("category-9", "204", "總部", "休閒服務", "商品", "6", "active"),
  category("category-10", "205", "本館", "寵物服務", "商品", "3", "active"),
  category("category-11", "206", "總部", "折抵項目", "商品", "9", "active"),
  category("category-12", "207", "本館", "客房服務", "商品", "11", "active"),
  category("category-13", "208", "總部", "特殊專案", "商品", "7", "active"),
  category("category-14", "209", "本館", "其他服務", "商品", "10", "active"),
  category("category-15", "301", "總部", "舊版餐飲", "商品", "1", "deleted"),
  category("category-16", "302", "本館", "舊版交通", "商品", "1", "deleted"),
  category("category-17", "303", "總部", "舊版禮品", "商品", "1", "deleted"),
  category("category-18", "304", "本館", "舊版休閒", "商品", "1", "deleted"),
  category("category-19", "305", "總部", "舊版其他", "商品", "1", "deleted"),
];

const tableState = {
  product: { filter: "active", all: true, page: 1 },
  category: { filter: "active", all: true, page: 1 },
};

const publishScheduleState = {
  enabled: false,
  startDate: "2026-02-10",
  endDate: "2026-03-11",
};

const photoSavedByProduct = {};
let photoWorkingSlots = emptyPhotoSlots();
let currentPhotoKey = null;
let activePhotoSlotIndex = null;
let pendingObjectUrls = [];
let dragSourceIndex = null;
let projectModalState = {
  rowId: null,
  mode: "none",
  condition: "all",
  selectionMode: "all",
  readonly: false,
  selectedIds: new Set(PROJECT_ITEMS.map(function (item) { return item.id; })),
};

productRows.forEach(function (row) {
  photoSavedByProduct[row.id] = row.hasPhoto
    ? savedPhotoSlots(row.photoClass)
    : emptyPhotoSlots();
});

export function initPurchaseAddon() {
  initSectionToggles();
  initSingleSelectGroups("[data-pa-quick-filters]", ".pa-quick-chip");
  initStatusTabs();
  initDisplayModeToggles();
  initClearButtons();
  initReloadButtons();
  initTableActions();
  initLanguageToggles();
  initModalTitles();
  initPublishSchedule();
  initProjectModal();
  initPhotoModal();
  renderAllTables();
}

function product(id, code, hasPhoto, name, categoryName, price, state, options) {
  const opts = options || {};
  return {
    id,
    code,
    hasPhoto,
    photoClass: hasPhoto ? (id === "product-3" ? "pa-sample-photo-food" : "pa-sample-photo-hotel") : "",
    name,
    categoryName,
    price,
    state,
    sort: "1",
    listed: !!opts.listed,
    lodging: !!opts.lodging,
    limited: !!opts.limited,
    nonLimited: !!opts.nonLimited,
    languages: (opts.languages || []).map(function (language) {
      return {
        code: language.code,
        label: language.label,
        selected: !!language.selected,
      };
    }),
  };
}

function category(id, code, branch, name, type, count, state, options) {
  const opts = options || {};
  return {
    id,
    code,
    branch,
    name,
    type,
    count,
    state,
    sort: "1",
    lodging: !!opts.lodging,
  };
}

function rowsForKind(kind) {
  return kind === "product" ? productRows : categoryRows;
}

function initSectionToggles() {
  document.querySelectorAll("[data-pa-section-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var section = btn.closest("[data-pa-section]");
      if (!section) return;
      var body = section.querySelector(".pa-section-body");
      var icon = btn.querySelector(".pa-section-toggle-icon");
      if (!body) return;
      var open = body.classList.toggle("pa-hidden") === false;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (icon) icon.classList.toggle("pa-closed", !open);
    });
  });
}

function initSingleSelectGroups(groupSelector, itemSelector) {
  document.querySelectorAll(groupSelector).forEach(function (group) {
    group.addEventListener("click", function (event) {
      var item = event.target.closest(itemSelector);
      if (!item || !group.contains(item)) return;
      group.querySelectorAll(itemSelector).forEach(function (candidate) {
        candidate.classList.toggle("is-active", candidate === item);
      });
    });
  });
}

function initStatusTabs() {
  document.querySelectorAll("[data-pa-status-tabs]").forEach(function (group) {
    group.addEventListener("click", function (event) {
      var tab = event.target.closest("[data-pa-status-filter]");
      if (!tab || !group.contains(tab)) return;
      var kind = group.dataset.paStatusTabs;
      tableState[kind].filter = tab.dataset.paStatusFilter;
      tableState[kind].page = 1;
      group.querySelectorAll(".member-data-filter-tab").forEach(function (item) {
        item.classList.toggle("is-active", item === tab);
      });
      renderTable(kind);
    });
  });
}

function initDisplayModeToggles() {
  document.querySelectorAll("[data-pa-display-button]").forEach(function (button) {
    button.addEventListener("click", function () {
      var kind = button.dataset.paDisplayButton;
      tableState[kind].all = !tableState[kind].all;
      tableState[kind].page = 1;
      renderTable(kind);
    });
  });
}

function initClearButtons() {
  document.querySelectorAll("[data-pa-clear]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var root = btn.closest("[data-pa-filter-panel]");
      if (!root) return;
      root.querySelectorAll("input[type='text']").forEach(function (input) {
        input.value = "";
      });
    });
  });
}

function initReloadButtons() {
  document.querySelectorAll("[data-pa-reload]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      window.location.reload();
    });
  });
}

function initTableActions() {
  document.addEventListener("click", function (event) {
    var actionBtn = event.target.closest("[data-pa-row-action]");
    if (!actionBtn) return;
    var kind = actionBtn.dataset.paKind;
    var row = rowsForKind(kind).find(function (item) {
      return item.id === actionBtn.dataset.paRowId;
    });
    if (!row) return;

    if (actionBtn.dataset.paRowAction === "disable") {
      row.state = "deleted";
      tableState[kind].filter = "active";
      tableState[kind].page = 1;
      setStatusActive(kind, "active");
      renderTable(kind);
    }

    if (actionBtn.dataset.paRowAction === "enable") {
      row.state = "active";
      tableState[kind].filter = "deleted";
      tableState[kind].page = 1;
      setStatusActive(kind, "deleted");
      renderTable(kind);
    }
  });
}

function initLanguageToggles() {
  document.addEventListener("click", function (event) {
    var badge = event.target.closest("[data-pa-language]");
    if (!badge) return;
    var row = productRows.find(function (item) {
      return item.id === badge.dataset.paRowId;
    });
    if (!row) return;
    var language = row.languages.find(function (item) {
      return item.code === badge.dataset.paLanguage;
    });
    if (!language) return;
    language.selected = !language.selected;
    renderTable("product");
  });
}

function initModalTitles() {
  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-pa-modal-mode]");
    if (!trigger) return;
    if (trigger.dataset.modalOpen !== "modalPurchaseAddonDataBackdrop") return;
    var title = document.getElementById("paDataModalTitle");
    if (!title) return;
    var mode = trigger.dataset.paModalMode;
    var isCategory = trigger.dataset.paKind === "category";
    if (isCategory) {
      title.textContent =
        mode === "new"
          ? "類別新增設定"
          : mode === "view"
            ? "類別查看"
            : "類別修改設定";
    } else {
      title.textContent =
        mode === "new" ? "產品新增" : mode === "view" ? "產品查看" : "產品修改";
    }
    var productBody = document.querySelector("[data-pa-product-body]");
    var categoryBody = document.querySelector("[data-pa-category-body]");
    if (productBody) productBody.classList.toggle("hidden", isCategory);
    if (categoryBody) categoryBody.classList.toggle("hidden", !isCategory);
    setDataModalReadonly(mode === "view");
    renderPublishSchedule();
    if (isCategory || mode === "view" || !publishScheduleState.enabled)
      closePublishSchedulePanel();
    else openPublishSchedulePanel();
  });
}

function setDataModalReadonly(readonly) {
  var modal = document.getElementById("modalPurchaseAddonDataBackdrop");
  if (!modal) return;
  modal.classList.toggle("pa-data-modal-readonly", readonly);
  modal.querySelectorAll("[data-pa-data-field]").forEach(function (field) {
    field.disabled = readonly || field.hasAttribute("data-pa-always-disabled");
  });
  modal.querySelectorAll("[data-pa-disable-on-view]").forEach(function (control) {
    control.disabled = readonly;
    control.setAttribute("aria-disabled", readonly ? "true" : "false");
  });
  modal.querySelectorAll("[data-pa-publish-switch]").forEach(function (switchEl) {
    switchEl.setAttribute("aria-disabled", readonly ? "true" : "false");
  });
  var cancel = modal.querySelector("[data-pa-data-cancel]");
  var save = modal.querySelector("[data-pa-data-save]");
  if (cancel) cancel.textContent = readonly ? "關閉" : "取消";
  if (save) save.classList.toggle("hidden", readonly);
}

function initPublishSchedule() {
  var toggle = document.querySelector("[data-pa-publish-toggle]");
  var panel = document.querySelector("[data-pa-publish-panel]");
  if (!toggle || !panel) return;
  toggle.addEventListener("click", function (event) {
    if (toggle.disabled) return;
    event.stopPropagation();
    publishScheduleState.enabled = toggle.checked;
    renderPublishSchedule();
    if (toggle.checked) openPublishSchedulePanel();
    else closePublishSchedulePanel();
  });
  panel.querySelectorAll("input").forEach(function (control) {
    control.addEventListener("change", syncPublishScheduleFromPanel);
  });
  renderPublishSchedule();
}

function syncPublishScheduleFromPanel() {
  var panel = document.querySelector("[data-pa-publish-panel]");
  if (!panel) return;
  var startDate = panel.querySelector("[data-pa-publish-start-date]");
  var endDate = panel.querySelector("[data-pa-publish-end-date]");
  if (startDate) publishScheduleState.startDate = startDate.value;
  if (endDate) publishScheduleState.endDate = endDate.value;
}

function renderPublishSchedule() {
  var toggle = document.querySelector("[data-pa-publish-toggle]");
  var panel = document.querySelector("[data-pa-publish-panel]");
  if (!panel) return;
  if (toggle) toggle.checked = publishScheduleState.enabled;
  var startDate = panel.querySelector("[data-pa-publish-start-date]");
  var endDate = panel.querySelector("[data-pa-publish-end-date]");
  if (startDate) startDate.value = publishScheduleState.startDate;
  if (endDate) endDate.value = publishScheduleState.endDate;
}

function openPublishSchedulePanel() {
  var panel = document.querySelector("[data-pa-publish-panel]");
  if (panel) panel.classList.remove("hidden");
}

function closePublishSchedulePanel() {
  var panel = document.querySelector("[data-pa-publish-panel]");
  if (panel) panel.classList.add("hidden");
}

function initProjectModal() {
  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-pa-row-action='project']");
    if (!trigger) return;
    var row = productRows.find(function (item) {
      return item.id === trigger.dataset.paRowId;
    });
    if (!row) return;
    openProjectModal(row);
  });
  document.addEventListener("click", function (event) {
    if (event.target.closest("[data-pa-project-select-all]")) {
      if (projectModalState.readonly) return;
      setProjectSelection(true);
      renderProjectModal();
    }
    if (event.target.closest("[data-pa-project-clear-all]")) {
      if (projectModalState.readonly) return;
      setProjectSelection(false);
      renderProjectModal();
    }
  });

  var modeSelect = document.querySelector("[data-pa-project-mode]");
  if (modeSelect) {
    modeSelect.addEventListener("change", function () {
      if (projectModalState.readonly) {
        renderProjectModal();
        return;
      }
      projectModalState.mode = modeSelect.value;
      renderProjectModal();
    });
  }
  var conditionSelect = document.querySelector("[data-pa-project-condition]");
  if (conditionSelect) {
    conditionSelect.addEventListener("change", function () {
      if (projectModalState.readonly) {
        renderProjectModal();
        return;
      }
      projectModalState.condition = conditionSelect.value;
      renderProjectModal();
    });
  }

  var list = document.querySelector("[data-pa-project-list]");
  if (list) {
    list.addEventListener("click", function (event) {
      var chip = event.target.closest("[data-pa-project-chip]");
      if (!chip) return;
      if (projectModalState.readonly) return;
      var id = chip.dataset.paProjectChip;
      if (projectModalState.selectedIds.has(id)) projectModalState.selectedIds.delete(id);
      else projectModalState.selectedIds.add(id);
      syncProjectSelectionMode();
      renderProjectModal();
    });
  }
}

function openProjectModal(row) {
  var code = document.querySelector("[data-pa-project-code]");
  var name = document.querySelector("[data-pa-project-name]");
  if (code) code.value = row.code;
  if (name) name.value = row.name;
  projectModalState.rowId = row.id;
  projectModalState.mode = "none";
  projectModalState.condition = "all";
  projectModalState.selectionMode = "all";
  projectModalState.readonly = row.state === "deleted";
  projectModalState.selectedIds = new Set(PROJECT_ITEMS.map(function (item) { return item.id; }));
  renderProjectModal();
}

function renderProjectModal() {
  var modeSelect = document.querySelector("[data-pa-project-mode]");
  var conditionRow = document.querySelector("[data-pa-project-condition-row]");
  var conditionField = document.querySelector("[data-pa-project-condition-field]");
  var conditionSelect = document.querySelector("[data-pa-project-condition]");
  var actions = document.querySelector("[data-pa-project-list-actions]");
  var list = document.querySelector("[data-pa-project-list]");
  var modalBox = document.querySelector("#modalPurchaseAddonProjectBackdrop .modal-box");
  var cancelButton = document.querySelector("[data-pa-project-cancel]");
  var saveButton = document.querySelector("[data-pa-project-save]");
  if (modeSelect) modeSelect.value = projectModalState.mode;
  if (modeSelect) modeSelect.disabled = projectModalState.readonly;
  if (conditionSelect) conditionSelect.value = projectModalState.condition;
  if (conditionSelect) conditionSelect.disabled = projectModalState.readonly;
  if (modalBox) modalBox.classList.toggle("pa-project-modal-readonly", projectModalState.readonly);
  if (cancelButton) cancelButton.textContent = projectModalState.readonly ? "關閉" : "取消";
  if (saveButton) {
    saveButton.disabled = projectModalState.readonly;
    saveButton.classList.toggle("hidden", projectModalState.readonly);
  }
  if (conditionRow) conditionRow.classList.toggle("is-unlimited", projectModalState.mode === "none");
  if (conditionField) conditionField.classList.toggle("hidden", projectModalState.mode === "none");
  syncProjectSelectionMode();
  if (actions) {
    var disabledAttr = projectModalState.readonly ? ' disabled aria-disabled="true"' : "";
    actions.innerHTML =
      '<button type="button" class="pa-project-mini-action' +
      (projectModalState.selectionMode === "all" ? " is-filled" : "") +
      '"' +
      disabledAttr +
      " data-pa-project-select-all>全選</button>" +
      '<button type="button" class="pa-project-mini-action' +
      (projectModalState.selectionMode === "none" ? " is-filled" : "") +
      '"' +
      disabledAttr +
      " data-pa-project-clear-all>取消全選</button>";
  }
  if (!list) return;
  var chipDisabledAttr = projectModalState.readonly ? ' disabled aria-disabled="true"' : "";
  list.innerHTML = visibleProjectItems().map(function (item) {
    var selected = projectModalState.selectedIds.has(item.id);
    return (
      '<button type="button" class="pa-project-chip' +
      (selected ? " is-selected" : "") +
      '"' +
      chipDisabledAttr +
      ' data-pa-project-chip="' +
      item.id +
      '">' +
      '<span class="pa-project-chip-label">' +
      '<span>' +
      item.label +
      "</span>" +
      item.tags.map(function (tag) {
        return '<span class="pa-project-tag">' + tag + "</span>";
      }).join("") +
      "</span>" +
      "</button>"
    );
  }).join("");
}

function visibleProjectItems() {
  if (projectModalState.mode === "none" || projectModalState.condition !== "flight") return PROJECT_ITEMS;
  return PROJECT_ITEMS.filter(function (item) {
    return FLIGHT_PROJECT_ITEM_IDS.includes(item.id);
  });
}

function setProjectSelection(selected) {
  PROJECT_ITEMS.forEach(function (item) {
    if (selected) projectModalState.selectedIds.add(item.id);
    else projectModalState.selectedIds.delete(item.id);
  });
  syncProjectSelectionMode();
}

function syncProjectSelectionMode() {
  var visibleItems = visibleProjectItems();
  var selectedVisibleCount = visibleItems.filter(function (item) {
    return projectModalState.selectedIds.has(item.id);
  }).length;
  if (selectedVisibleCount === visibleItems.length) {
    projectModalState.selectionMode = "all";
  } else if (selectedVisibleCount === 0) {
    projectModalState.selectionMode = "none";
  } else {
    projectModalState.selectionMode = "custom";
  }
}

function setStatusActive(kind, filter) {
  var group = document.querySelector('[data-pa-status-tabs="' + kind + '"]');
  if (!group) return;
  group.querySelectorAll("[data-pa-status-filter]").forEach(function (tab) {
    tab.classList.toggle("is-active", tab.dataset.paStatusFilter === filter);
  });
}

function renderAllTables() {
  renderTable("product");
  renderTable("category");
}

function renderTable(kind) {
  updateCounts(kind);
  updateDisplayToggle(kind);
  var tbody = document.querySelector("[data-pa-table-body='" + kind + "']");
  if (!tbody) return;
  var rows = rowsForKind(kind).filter(function (row) {
    return row.state === tableState[kind].filter;
  });
  var visible = visibleRows(kind, rows);
  tbody.innerHTML = visible
    .map(function (row, index) {
      return kind === "product"
        ? renderProductRow(row, rowIndex(kind, index))
        : renderCategoryRow(row, rowIndex(kind, index));
    })
    .join("");
  renderPagination(kind, rows.length);
}

function rowIndex(kind, index) {
  if (tableState[kind].all) return index + 1;
  return (tableState[kind].page - 1) * PAGE_SIZE + index + 1;
}

function visibleRows(kind, rows) {
  if (tableState[kind].all) return rows;
  var start = (tableState[kind].page - 1) * PAGE_SIZE;
  return rows.slice(start, start + PAGE_SIZE);
}

function updateCounts(kind) {
  var rows = rowsForKind(kind);
  var active = rows.filter(function (row) {
    return row.state === "active";
  }).length;
  var deleted = rows.filter(function (row) {
    return row.state === "deleted";
  }).length;
  var activeEl = document.querySelector("[data-pa-active-count='" + kind + "']");
  var deletedEl = document.querySelector("[data-pa-deleted-count='" + kind + "']");
  if (activeEl) activeEl.textContent = "（" + active + "）";
  if (deletedEl) deletedEl.textContent = "（" + deleted + "）";
}

function updateDisplayToggle(kind) {
  var label = document.querySelector("[data-pa-display-label='" + kind + "']");
  var button = document.querySelector("[data-pa-display-button='" + kind + "']");
  var icon = document.querySelector("[data-pa-display-icon='" + kind + "']");
  var count = rowsForKind(kind).filter(function (row) {
    return row.state === tableState[kind].filter;
  }).length;
  var pages = pageCount(count);
  if (button) button.setAttribute("aria-pressed", tableState[kind].all ? "true" : "false");
  if (icon) {
    icon.src = tableState[kind].all
      ? "./assets/icons/all-pages.svg"
      : "./assets/icons/split-page.svg";
  }
  if (label) {
    label.textContent = tableState[kind].all
      ? "全部顯示（" + count + " 筆）"
      : "分頁（" + pages + " 頁 / " + count + " 筆）";
  }
}

function renderPagination(kind, count) {
  var root = document.querySelector("[data-pa-pagination='" + kind + "']");
  if (!root) return;
  if (tableState[kind].all) {
    root.innerHTML = "";
    return;
  }
  var pages = pageCount(count);
  if (tableState[kind].page > pages) tableState[kind].page = pages;
  var current = tableState[kind].page;
  var prevDisabled = current <= 1;
  var nextDisabled = current >= pages;
  root.innerHTML =
    '<div class="pa-pagination">' +
    paginationNavButton(kind, current - 1, "prev", prevDisabled) +
    '<span class="pa-page-current" aria-current="page">' +
    current +
    "</span>" +
    paginationNavButton(kind, current + 1, "next", nextDisabled) +
    "</div>";
  root.querySelectorAll("[data-pa-page-target]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (btn.disabled) return;
      tableState[kind].page = Number(btn.dataset.paPageTarget);
      renderTable(kind);
    });
  });
}

function pageCount(count) {
  return Math.max(1, Math.ceil(count / PAGE_SIZE));
}

function paginationNavButton(kind, page, direction, disabled) {
  var label = direction === "prev" ? "上一頁" : "下一頁";
  var icon = direction === "prev" ? "left" : "right";
  return (
    '<button type="button" class="pa-page-nav" data-pa-kind="' +
    kind +
    '" data-pa-page-target="' +
    page +
    '"' +
    (disabled ? " disabled aria-disabled=\"true\"" : ' aria-disabled="false"') +
    ' aria-label="' +
    label +
    '">' +
    '<img src="./assets/icons/' +
    icon +
    '.svg" alt="" class="w-5 h-5" />' +
    "</button>"
  );
}

function renderProductRow(row, order) {
  return (
    "<tr>" +
    '<td class="pa-seq-cell">' +
    order +
    "</td>" +
    "<td>" +
    row.code +
    "</td>" +
    "<td>" +
    renderPhotoTrigger(row) +
    "</td>" +
    "<td>" +
    row.name +
    "</td>" +
    "<td>" +
    renderCategoryLabel(row) +
    "</td>" +
    "<td>" +
    row.price +
    "</td>" +
    "<td>" +
    row.sort +
    "</td>" +
    "<td>" +
    (row.listed ? '<img src="./assets/icons/check-green.svg" alt="" class="w-6 h-6" />' : "") +
    "</td>" +
    "<td>" +
    renderLanguages(row) +
    "</td>" +
    "<td>" +
    renderActionButtons("product", row) +
    "</td>" +
    "</tr>"
  );
}

function renderCategoryRow(row, order) {
  return (
    "<tr>" +
    '<td class="pa-seq-cell">' +
    order +
    "</td>" +
    "<td>" +
    row.code +
    "</td>" +
    "<td>" +
    row.branch +
    "</td>" +
    "<td>" +
    row.name +
    "</td>" +
    "<td>" +
    renderCategoryType(row) +
    "</td>" +
    "<td>" +
    (row.id === "category-1"
      ? '<a href="#" class="text-menu no-underline" aria-label="設定數量 ' +
        row.count +
        '">' +
        row.count +
        "</a>"
      : row.count) +
    "</td>" +
    "<td>" +
    row.sort +
    "</td>" +
    "<td>" +
    renderActionButtons("category", row) +
    "</td>" +
    "</tr>"
  );
}

function renderPhotoTrigger(row) {
  var content = row.hasPhoto
    ? '<span class="pa-photo-thumb ' + row.photoClass + '" aria-hidden="true"></span>'
    : '<span class="pa-photo-thumb pa-photo-empty"><img src="./assets/icons/image-empty.svg" alt="" /></span>';
  return (
    '<button type="button" class="pa-photo-trigger" data-pa-photo-trigger="' +
    row.id +
    '" data-modal-open="modalPurchaseAddonPhotoGalleryBackdrop" aria-label="編輯' +
    row.name +
    '照片">' +
    content +
    "</button>"
  );
}

function renderLanguages(row) {
  if (!row.languages.length) return "";
  return (
    '<div class="pa-language-options">' +
    row.languages
      .map(function (language) {
        return (
          '<button type="button" class="pa-language-badge' +
          (language.selected ? " is-selected" : "") +
          '" aria-pressed="' +
          (language.selected ? "true" : "false") +
          '" data-pa-row-id="' +
          row.id +
          '" data-pa-language="' +
          language.code +
          '">' +
          language.label +
          "</button>"
        );
      })
      .join("") +
    "</div>"
  );
}

function renderCategoryLabel(row) {
  return row.categoryName;
}

function renderCategoryType(row) {
  return row.type;
}

function renderActionButtons(kind, row) {
  if (row.state === "deleted") {
    return (
      '<div class="pa-table-actions">' +
      actionBtn(kind, row, "view", "preview-outline", "查看", "modalPurchaseAddonDataBackdrop") +
      (kind === "product" && hasProjectState(row)
        ? actionBtn(kind, row, "project", "projects", "專案", "modalPurchaseAddonProjectBackdrop")
        : "") +
      actionBtn(kind, row, "enable", "video-play", "啟用") +
      "</div>"
    );
  }
  return (
    '<div class="pa-table-actions">' +
    actionBtn(kind, row, "modify", "edit", "修改", "modalPurchaseAddonDataBackdrop") +
    actionBtn(kind, row, "duplicate", "duplicate", "複製") +
    (kind === "product" && hasProjectState(row)
      ? actionBtn(kind, row, "project", "projects", "專案", "modalPurchaseAddonProjectBackdrop")
      : "") +
    actionBtn(kind, row, "disable", "suspend-outline", "停用") +
    "</div>"
  );
}

function hasProjectState(row) {
  return !!(row.limited || row.nonLimited);
}

function actionBtn(kind, row, action, icon, label, modalId) {
  var limitedClass = action === "project" && row.limited ? " is-limited" : "";
  var attrs =
    ' data-pa-row-action="' +
    (action === "modify" || action === "view" ? "" : action) +
    '" data-pa-kind="' +
    kind +
    '" data-pa-row-id="' +
    row.id +
    '"';
  if (modalId) {
    attrs +=
      ' data-modal-open="' +
      modalId +
      '" data-pa-modal-mode="' +
      (action === "modify" ? "edit" : action) +
      '" data-pa-row-name="' +
      row.name +
      '"';
  }
  return (
    '<button type="button" class="pa-row-btn pa-row-btn-' +
    action +
    limitedClass +
    '"' +
    attrs +
    ">" +
    '<img src="./assets/icons/' +
    icon +
    '.svg" alt="" class="w-6 h-6" />' +
    "<span>" +
    label +
    "</span>" +
    "</button>"
  );
}

function emptyPhotoSlots() {
  return Array.from({ length: PHOTO_SLOT_COUNT }, function () {
    return { hasImage: false, photoClass: "", url: null, isObjectUrl: false };
  });
}

function savedPhotoSlots(photoClass) {
  var slots = emptyPhotoSlots();
  slots[0] = { hasImage: true, photoClass, url: null, isObjectUrl: false };
  return slots;
}

function clonePhotoSlots(slots) {
  return slots.map(function (slot) {
    return {
      hasImage: slot.hasImage,
      photoClass: slot.photoClass,
      url: slot.url,
      isObjectUrl: slot.isObjectUrl,
    };
  });
}

function initPhotoModal() {
  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-pa-photo-trigger]");
    if (!trigger) return;
    openPhotoModal(trigger.dataset.paPhotoTrigger);
  });

  var fileInput = document.getElementById("purchaseAddonPhotoFileInput");
  if (fileInput) fileInput.addEventListener("change", handlePhotoFileChosen);

  var uploadBtn = document.getElementById("purchaseAddonPhotoUploadBtn");
  if (uploadBtn) {
    uploadBtn.addEventListener("click", function () {
      if (currentPhotoKey) {
        photoSavedByProduct[currentPhotoKey] = clonePhotoSlots(photoWorkingSlots);
        pendingObjectUrls = [];
      }
      var backdrop = document.getElementById("modalPurchaseAddonPhotoGalleryBackdrop");
      if (backdrop) backdrop.classList.remove("open");
      document.body.style.overflow = "";
    });
  }

  var grid = document.getElementById("purchaseAddonPhotoCardGrid");
  if (grid) {
    grid.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-pa-photo-action]");
      if (!btn) return;
      var card = event.target.closest("[data-slot]");
      if (!card) return;
      var idx = Number(card.dataset.slot);
      if (btn.dataset.paPhotoAction === "replace") handlePhotoReplaceClick(idx);
      if (btn.dataset.paPhotoAction === "delete") handlePhotoDeleteClick(idx);
    });
    initPhotoDragAndDrop(grid);
  }
}

function openPhotoModal(key) {
  currentPhotoKey = key;
  revokeAbandonedObjectUrls();
  photoWorkingSlots = clonePhotoSlots(photoSavedByProduct[key] || emptyPhotoSlots());
  renderPhotoGrid();
}

function renderPhotoGrid() {
  var grid = document.getElementById("purchaseAddonPhotoCardGrid");
  if (!grid) return;
  grid.innerHTML = "";
  photoWorkingSlots.forEach(function (slot, idx) {
    grid.appendChild(buildPhotoCard(slot, idx));
  });
}

function buildPhotoCard(slot, idx) {
  var card = document.createElement("div");
  card.className = "lodging-photo-card flex flex-col gap-3 rounded-lg border border-border-disabled p-5";
  card.draggable = true;
  card.dataset.slot = String(idx);
  var head = document.createElement("div");
  head.className = "flex items-center gap-2";
  head.innerHTML =
    '<img src="./assets/icons/dots-line.svg" alt="拖曳排序" class="w-6 h-6 cursor-grab" />' +
    '<span class="text-xl text-text-default">圖片 ' +
    (idx + 1) +
    "</span>";
  if (idx === 0) {
    var pill = document.createElement("span");
    pill.className = "inline-flex items-center rounded-full bg-chart-blue px-3 py-0.5 text-base text-white";
    pill.textContent = "主圖";
    head.appendChild(pill);
  }
  card.appendChild(head);

  var body = document.createElement("div");
  body.className = "lodging-photo-card-body";
  var preview = document.createElement("div");
  preview.className = "lodging-photo-preview h-[185px] shrink-0 rounded-2xl overflow-hidden";
  if (slot.hasImage) {
    if (slot.isObjectUrl) {
      preview.innerHTML = '<img src="' + slot.url + '" alt="" class="w-full h-full object-cover" />';
    } else {
      preview.className += " " + slot.photoClass;
    }
  } else {
    preview.className += " flex flex-col items-center justify-center gap-2 border border-border-focus";
    preview.innerHTML =
      '<img src="./assets/icons/image.svg" alt="" class="w-9 h-9 opacity-40" />' +
      '<span class="text-base text-text-default">尚未上傳圖片</span>';
  }
  body.appendChild(preview);

  var actions = document.createElement("div");
  actions.className = "lodging-photo-actions flex justify-center gap-3";
  var replaceBtn = document.createElement("button");
  replaceBtn.type = "button";
  replaceBtn.className =
    "inline-flex flex-1 items-center justify-center gap-2 h-9 px-3 rounded-md border border-menu text-base text-menu cursor-pointer whitespace-nowrap";
  replaceBtn.dataset.paPhotoAction = "replace";
  replaceBtn.innerHTML =
    '<span class="icon-mask icon-mask-' +
    (slot.hasImage ? "image-ai-line" : "upload-outline") +
    ' w-6 h-6"></span><span>' +
    (slot.hasImage ? "更換圖片" : "上傳圖片") +
    "</span>";
  actions.appendChild(replaceBtn);

  if (slot.hasImage) {
    var deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className =
      "inline-flex flex-1 items-center justify-center gap-2 h-9 px-3 rounded-md border border-status-negative text-base text-status-negative cursor-pointer whitespace-nowrap";
    deleteBtn.dataset.paPhotoAction = "delete";
    deleteBtn.innerHTML = '<span class="icon-mask icon-mask-trash-can w-6 h-6"></span><span>刪除</span>';
    actions.appendChild(deleteBtn);
  }
  body.appendChild(actions);
  card.appendChild(body);
  return card;
}

function handlePhotoReplaceClick(idx) {
  activePhotoSlotIndex = idx;
  var input = document.getElementById("purchaseAddonPhotoFileInput");
  if (input) input.click();
}

function handlePhotoDeleteClick(idx) {
  var slot = photoWorkingSlots[idx];
  if (slot.isObjectUrl && slot.url) {
    URL.revokeObjectURL(slot.url);
    var pos = pendingObjectUrls.indexOf(slot.url);
    if (pos !== -1) pendingObjectUrls.splice(pos, 1);
  }
  photoWorkingSlots[idx] = { hasImage: false, photoClass: "", url: null, isObjectUrl: false };
  renderPhotoGrid();
}

function handlePhotoFileChosen(event) {
  var file = event.target.files && event.target.files[0];
  event.target.value = "";
  if (!file || activePhotoSlotIndex === null) return;
  var previous = photoWorkingSlots[activePhotoSlotIndex];
  if (previous.isObjectUrl && previous.url) {
    URL.revokeObjectURL(previous.url);
  }
  var url = URL.createObjectURL(file);
  pendingObjectUrls.push(url);
  photoWorkingSlots[activePhotoSlotIndex] = {
    hasImage: true,
    photoClass: "",
    url,
    isObjectUrl: true,
  };
  activePhotoSlotIndex = null;
  renderPhotoGrid();
}

function revokeAbandonedObjectUrls() {
  var savedUrls = photoSavedByProduct[currentPhotoKey]
    ? photoSavedByProduct[currentPhotoKey].map(function (slot) {
        return slot.url;
      })
    : [];
  pendingObjectUrls.forEach(function (url) {
    if (savedUrls.indexOf(url) === -1) URL.revokeObjectURL(url);
  });
  pendingObjectUrls = [];
}

function initPhotoDragAndDrop(grid) {
  grid.addEventListener("dragstart", function (event) {
    var card = event.target.closest("[data-slot]");
    if (!card) return;
    dragSourceIndex = Number(card.dataset.slot);
    event.dataTransfer.effectAllowed = "move";
  });
  grid.addEventListener("dragover", function (event) {
    event.preventDefault();
  });
  grid.addEventListener("drop", function (event) {
    event.preventDefault();
    var card = event.target.closest("[data-slot]");
    if (!card || dragSourceIndex === null) return;
    var targetIndex = Number(card.dataset.slot);
    if (targetIndex === dragSourceIndex) return;
    var moved = photoWorkingSlots.splice(dragSourceIndex, 1)[0];
    photoWorkingSlots.splice(targetIndex, 0, moved);
    dragSourceIndex = null;
    renderPhotoGrid();
  });
}
