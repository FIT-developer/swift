var PROJECT_MODAL_ID = "modalProjectContentBackdrop";

function setPressedTab(buttons, activeButton, className) {
  buttons.forEach(function (button) {
    var active = button === activeButton;
    button.classList.toggle(className, active);
    button.setAttribute("aria-selected", String(active));
  });
}

function resetPanel(panel) {
  panel.querySelectorAll("input, select, textarea").forEach(function (control) {
    if (control.type === "checkbox" || control.type === "radio") {
      control.checked = control.defaultChecked;
      return;
    }
    if (control.tagName === "SELECT") {
      control.selectedIndex = 0;
      return;
    }
    control.value = control.defaultValue;
  });
}

function createCalendarCard(month, dayCount, selectedDay, selectedClass) {
  var card = document.createElement("section");
  card.className = "pc-calendar-card";

  var title = document.createElement("h3");
  title.textContent = "2026 年 " + String(month).padStart(2, "0") + " 月";
  card.appendChild(title);

  var weekdays = document.createElement("div");
  weekdays.className = "pc-calendar-weekdays";
  ["日", "一", "二", "三", "四", "五", "六"].forEach(function (day, index) {
    var label = document.createElement("span");
    label.textContent = day;
    if (index === 0 || index === 6) label.classList.add("is-weekend");
    weekdays.appendChild(label);
  });
  card.appendChild(weekdays);

  var days = document.createElement("div");
  days.className = "pc-calendar-days";
  for (var day = 1; day <= dayCount; day += 1) {
    var button = document.createElement("button");
    button.type = "button";
    button.textContent = String(day);
    button.setAttribute(
      "aria-label",
      "2026-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0"),
    );
    if (day === selectedDay) button.classList.add("is-selected", selectedClass);
    days.appendChild(button);
  }
  card.appendChild(days);
  return card;
}

function renderCalendars(root) {
  if (!root || root.children.length) return;
  [
    [3, 31, 2, "is-weekday"],
    [4, 30, 3, "is-holiday"],
    [5, 31, 0, ""],
    [6, 30, 5, "is-long-holiday"],
  ].forEach(function (entry) {
    root.appendChild(createCalendarCard(entry[0], entry[1], entry[2], entry[3]));
  });
}

function renderExtraPriceTable(table, namespace) {
  if (!table || table.children.length) return;
  var rows = [
    ["weekday", "平日"],
    ["holiday", "假日"],
    ["long-holiday", "連續假日"],
  ];
  var body = document.createElement("tbody");
  rows.forEach(function (entry) {
    var row = document.createElement("tr");
    var name = "pc-" + namespace + "-" + entry[0];
    row.innerHTML =
      '<th><i class="pc-date-swatch pc-date-swatch--' +
      entry[0] +
      '"></i>' +
      entry[1] +
      '</th><td><label><input type="radio" name="' +
      name +
      '" checked /> 開啟</label></td><td><label><input type="radio" name="' +
      name +
      '" /> 不開啟</label></td><td><input type="text" value="8888" /></td>';
    body.appendChild(row);
  });
  table.appendChild(body);
}

export function initProjectContent() {
  var activeKind = "lodging";
  var pendingMode = "new";
  var currentStep = 1;
  var modal = document.getElementById(PROJECT_MODAL_ID);
  var form = document.getElementById("pcProjectForm");
  var modalTitle = document.getElementById("pcModalTitle");
  var kindTabs = Array.prototype.slice.call(document.querySelectorAll("[data-pc-kind]"));
  var statusTabs = Array.prototype.slice.call(document.querySelectorAll("[data-pc-status]"));
  var roomToggle = document.querySelector("[data-pc-room-toggle]");
  var roomMenu = document.getElementById("pcRoomMenu");

  renderCalendars(document.querySelector("[data-pc-calendar-grid]"));
  document.querySelectorAll("[data-pc-extra-table]").forEach(function (table) {
    renderExtraPriceTable(table, table.dataset.pcExtraTable);
  });

  kindTabs.forEach(function (button) {
    button.addEventListener("click", function () {
      activeKind = button.dataset.pcKind;
      setPressedTab(kindTabs, button, "is-active");
    });
  });

  statusTabs.forEach(function (button) {
    button.addEventListener("click", function () {
      statusTabs.forEach(function (tab) {
        tab.classList.toggle("is-active", tab === button);
      });
    });
  });

  document.querySelectorAll("[data-pc-modal-mode]").forEach(function (button) {
    button.addEventListener("click", function () {
      pendingMode = button.dataset.pcModalMode;
    });
  });

  function setStep(step) {
    currentStep = Math.max(1, Math.min(3, step));
    form.dataset.pcCurrentStep = String(currentStep);
    form.querySelectorAll("[data-pc-step-panel]").forEach(function (panel) {
      panel.hidden = Number(panel.dataset.pcStepPanel) !== currentStep;
    });
    form.querySelectorAll("[data-pc-step-dot]").forEach(function (dot) {
      dot.classList.toggle("is-active", Number(dot.dataset.pcStepDot) === currentStep);
    });
    form.querySelectorAll("[data-pc-footer]").forEach(function (footer) {
      footer.hidden = Number(footer.dataset.pcFooter) !== currentStep;
    });
    var body = form.querySelector(".pc-modal-body");
    if (body) body.scrollTop = 0;
  }

  form.querySelectorAll("[data-pc-next]").forEach(function (button) {
    button.addEventListener("click", function () {
      setStep(currentStep + 1);
    });
  });
  form.querySelectorAll("[data-pc-previous]").forEach(function (button) {
    button.addEventListener("click", function () {
      setStep(currentStep - 1);
    });
  });
  form.querySelectorAll("[data-pc-clear]").forEach(function (button) {
    button.addEventListener("click", function () {
      var panel = form.querySelector('[data-pc-step-panel="' + currentStep + '"]');
      if (panel) resetPanel(panel);
    });
  });

  if (roomToggle && roomMenu) {
    roomToggle.addEventListener("click", function () {
      var shouldOpen = roomMenu.hidden;
      roomMenu.hidden = !shouldOpen;
      roomToggle.setAttribute("aria-expanded", String(shouldOpen));
    });
    document.addEventListener("click", function (event) {
      if (roomMenu.hidden) return;
      if (roomMenu.contains(event.target) || roomToggle.contains(event.target)) return;
      roomMenu.hidden = true;
      roomToggle.setAttribute("aria-expanded", "false");
    });
  }

  function beforeOpen(id) {
    if (id !== PROJECT_MODAL_ID) return;
    form.reset();
    form.dataset.pcModalKind = activeKind;
    modal.dataset.pcModalKind = activeKind;
    modal.dataset.pcModalMode = pendingMode;
    modalTitle.textContent = pendingMode === "edit" ? "修改" : "新增";
    form.querySelectorAll("[data-pc-channel-only]").forEach(function (node) {
      node.hidden = activeKind !== "channel";
    });
    form.querySelectorAll("[data-pc-lodging-only]").forEach(function (node) {
      node.hidden = activeKind !== "lodging";
    });
    setStep(1);
  }

  return { beforeOpen: beforeOpen };
}
