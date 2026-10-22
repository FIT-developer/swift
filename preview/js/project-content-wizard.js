const MODAL_ID = "modalProjectContentBackdrop";
const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
const DEFINITIONS = [
  { id: "d1", name: "名間", note: "每日", days: null, color: "daily" },
  { id: "d2", name: "築間真的不要吃", note: "日、一、二", days: [0, 1, 2], color: "blue" },
  { id: "d3", name: "2028 Google", note: "五、六、日", days: [5, 6, 0], color: "green" },
  { id: "d4", name: "林溪縱走 199", note: "2026-12-31 ~ 2027-01-03", extra: "一、三、五", days: [1, 3, 5], start: "2026-12-31", end: "2027-01-03", color: "yellow" },
  ...Array.from({ length: 11 }, (_, index) => ({ id: `d${index + 5}`, name: `名稱名稱 ${index + 5}`, note: "一、三、六", days: [1, 3, 6], color: "daily" })),
];
const ROOMS = [{ id: "room-a", name: "威尼斯水怪房" }, { id: "room-b", name: "蝶蝶飛來飛去房" }];
const escapeValue = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
const definition = (id) => DEFINITIONS.find((item) => item.id === id);
const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
function numericIcon(rank) {
  return `<span class="pcw-number-icon" role="img" aria-label="${rank}" data-pcw-rank="${rank}">${String(rank).split("").map((digit) => `<span class="pcw-number-digit"><img src="./assets/icons/number-${digit}.svg" alt="" /></span>`).join("")}</span>`;
}
function definitionCopy(item) {
  return `<span class="pcw-definition-copy"><span>${item.name}</span><small>${item.note}</small>${item.extra ? `<small>${item.extra}</small>` : ""}</span>`;
}
function resetPanel(panel) {
  panel.querySelectorAll("input, select, textarea").forEach((control) => {
    if (control.type === "checkbox" || control.type === "radio") control.checked = control.defaultChecked;
    else if (control.tagName === "SELECT") control.selectedIndex = 0;
    else control.value = control.defaultValue;
  });
}

export function initProjectWizard() {
  const modal = document.getElementById(MODAL_ID);
  const form = document.getElementById("pcProjectForm");
  if (!modal || !form) return { beforeOpen() {} };
  const body = form.querySelector(".pcw-body");
  const datePanel = form.querySelector('[data-pcw-step="2"]');
  const pricePanel = form.querySelector('[data-pcw-step="3"]');
  let currentStep = 1;
  let joined = ["d1", "d3", "d4"];
  let draft = null;
  let monthOffset = 0;
  let overrides = { "2026-03-02": "d1", "2026-06-05": "d4" };
  let prices = {};
  let selectedDate = null;
  let dayAnchor = null;
  let press = null;
  let drag = null;
  let animation = 0;
  let suppressClick = false;
  let viewOnly = false;

  datePanel.innerHTML = `
    <div class="pcw-date-summary">
      <label class="pcw-field"><span>專案</span><input class="pcw-input" value="xxx-yyy-zzz" readonly /></label>
      <label class="pcw-field"><span>範本</span><select class="pcw-input" data-pcw-template><option>avcd001</option></select></label>
    </div>
    <div class="pcw-date-layout">
      <aside class="pcw-definitions-panel">
        <h3>日期樣本</h3>
        <div class="pcw-definition-hint" data-pcw-hint>
          <img src="./assets/icons/info.svg" alt="" />
          <div data-pcw-hint-copy><p>套用權重：上方優先</p><small>單日個別設定優先於樣本</small><small>長按項目可拖曳排序</small></div>
        </div>
        <div class="pcw-pool-heading"><span>已加入定義</span><span data-pcw-joined-count>3</span></div>
        <div class="pcw-joined-list" data-pcw-joined-list aria-label="已加入定義" tabindex="0"></div>
        <div class="pcw-reorder-actions" data-pcw-reorder-actions hidden>
          <button type="button" class="pcw-footer-button pcw-footer-button--secondary" data-pcw-cancel-order>取消調整</button>
          <button type="button" class="pcw-footer-button pcw-footer-button--primary" data-pcw-save-order>儲存調整</button>
        </div>
        <div class="pcw-source-section">
          <div class="pcw-source-hint"><img src="./assets/icons/info.svg" alt="" /><span>點擊：使用 / 取消使用定義</span></div>
          <div class="pcw-pool-heading"><span>日期定義</span><span data-pcw-source-count>${DEFINITIONS.length}</span></div>
          <div class="pcw-source-list" data-pcw-source-list aria-label="日期定義" tabindex="0"></div>
        </div>
      </aside>
      <div class="pcw-calendars-panel">
        <div class="pcw-calendar-nav"><button type="button" data-pcw-month="-1" aria-label="前一個月"><img src="./assets/icons/left.svg" alt="" /></button><strong data-pcw-month-title></strong><button type="button" data-pcw-month="1" aria-label="下一個月"><img src="./assets/icons/right.svg" alt="" /></button></div>
        <div class="pcw-calendars" data-pcw-calendars></div>
      </div>
    </div>
    <div class="pcw-assigned-dates"><span>指定日期</span><div data-pcw-assignments></div></div>
    <label class="pcw-save-sample"><input type="checkbox" name="saveSample" /><span>將此日期設定儲存成樣本</span></label>`;

  const joinedList = datePanel.querySelector("[data-pcw-joined-list]");
  const sourceList = datePanel.querySelector("[data-pcw-source-list]");
  const popover = document.createElement("div");
  popover.className = "pcw-day-popover";
  popover.hidden = true;
  popover.setAttribute("role", "dialog");
  popover.setAttribute("aria-label", "指定日期定義");
  document.body.appendChild(popover);
  const sheet = document.createElement("div");
  sheet.id = "pcwDateSheet";
  sheet.className = "modal-backdrop pcw-sheet-backdrop";
  sheet.dataset.noDismiss = "";
  sheet.setAttribute("role", "dialog");
  sheet.setAttribute("aria-modal", "true");
  sheet.setAttribute("aria-label", "指定日期定義");
  sheet.innerHTML = '<section class="pcw-day-sheet"><button type="button" class="pcw-sheet-close" data-pcw-sheet-close aria-label="關閉日期定義"><img src="./assets/icons/close.svg" alt="" /></button><div data-pcw-sheet-content></div></section>';
  document.body.appendChild(sheet);

  function activeOrder() { return draft || joined; }
  function matches(item, date) {
    const key = dateKey(date);
    return (!item.start || key >= item.start) && (!item.end || key <= item.end) && (!item.days || item.days.includes(date.getDay()));
  }
  function appliedDefinition(key) {
    if (joined.includes(overrides[key])) return definition(overrides[key]);
    const date = new Date(`${key}T12:00:00`);
    return joined.map(definition).find((item) => matches(item, date));
  }
  function updateMode() {
    const sorting = !!draft;
    joinedList.classList.toggle("is-reordering", sorting);
    datePanel.querySelector("[data-pcw-reorder-actions]").hidden = !sorting;
    datePanel.querySelector("[data-pcw-hint-copy]").innerHTML = sorting
      ? '<p>正在調整優先順序</p><small>拖曳項目改變排序，越上方優先</small>'
      : '<p>套用權重：上方優先</p><small>單日個別設定優先於樣本</small><small>長按項目可拖曳排序</small>';
    joinedList.querySelectorAll("input").forEach((input) => { input.disabled = sorting || viewOnly; });
    sourceList.querySelectorAll("button").forEach((button) => { button.disabled = sorting || viewOnly; });
  }
  function renderJoined() {
    const scroll = joinedList.scrollTop;
    joinedList.innerHTML = activeOrder().map((id, index) => {
      const item = definition(id);
      return `<div class="pcw-definition-row" data-pcw-definition="${id}" tabindex="0" aria-label="${item.name}，長按調整排序"><span class="pcw-definition-swatch pcw-color-${item.color}">${numericIcon(index + 1)}</span>${definitionCopy(item)}<label class="member-data-switch"><input type="checkbox" role="switch" checked data-pcw-remove="${id}" aria-label="使用${item.name}" /><span class="member-data-switch-track" aria-hidden="true"></span><span class="member-data-switch-knob" aria-hidden="true"></span></label></div>`;
    }).join("");
    joinedList.scrollTop = scroll;
    datePanel.querySelector("[data-pcw-joined-count]").textContent = String(joined.length);
    updateMode();
  }
  function syncRanks() {
    const update = (row, rank) => {
      if (row.querySelector("[data-pcw-rank]").dataset.pcwRank !== String(rank)) {
        row.querySelector(".pcw-definition-swatch").innerHTML = numericIcon(rank);
      }
    };
    [...joinedList.children].forEach((row, index) => {
      update(row, index + 1);
      if (drag?.node === row) update(drag.ghost, index + 1);
    });
  }
  function renderSource() {
    sourceList.innerHTML = DEFINITIONS.map((item) => {
      const selected = joined.includes(item.id);
      return `<button type="button" class="pcw-source-choice" data-pcw-source="${item.id}" aria-pressed="${selected}"><img src="./assets/icons/${selected ? "data-usage-checkmark-24-regular" : "data-usage-32-regular"}.svg" alt="" />${definitionCopy(item)}</button>`;
    }).join("");
    updateMode();
  }
  function renderCalendars() {
    const first = new Date(2026, 2 + monthOffset, 1);
    datePanel.querySelector("[data-pcw-month-title]").textContent = `${first.getFullYear()} 年 ${String(first.getMonth() + 1).padStart(2, "0")} 月`;
    const calendars = datePanel.querySelector("[data-pcw-calendars]");
    calendars.innerHTML = Array.from({ length: 4 }, (_, index) => {
      const month = new Date(2026, 2 + monthOffset + index, 1);
      const start = new Date(month.getFullYear(), month.getMonth(), 1 - month.getDay());
      const days = Array.from({ length: 42 }, (_, dayIndex) => {
        const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + dayIndex);
        const key = dateKey(date);
        const item = appliedDefinition(key);
        const outside = date.getMonth() !== month.getMonth();
        return `<button type="button" class="pcw-calendar-day${outside ? " is-outside" : ""}${item ? ` pcw-color-${item.color}` : ""}" data-pcw-date="${key}" data-pcw-applied="${item?.id || ""}" aria-label="${key}${item ? ` ${item.name}` : ""}" ${viewOnly ? "disabled" : ""}><span>${date.getDate()}</span>${item ? `<small>${item.name}</small>` : ""}</button>`;
      }).join("");
      return `<section class="pcw-calendar-card"><h3>${month.getFullYear()} 年 ${String(month.getMonth() + 1).padStart(2, "0")} 月</h3><div class="pcw-weekdays">${WEEKDAYS.map((day, index) => `<span${index === 0 || index === 6 ? ' class="is-weekend"' : ""}>${day}</span>`).join("")}</div><div class="pcw-calendar-days">${days}</div></section>`;
    }).join("");
    const assignments = datePanel.querySelector("[data-pcw-assignments]");
    assignments.innerHTML = Object.entries(overrides).sort(([a], [b]) => a.localeCompare(b)).filter(([, id]) => joined.includes(id)).map(([key, id]) => `<input class="pcw-input" readonly aria-label="指定日期 ${key}" value="${key} 指定為 ${definition(id).name}" />`).join("");
  }
  function renderPrices() {
    const priceRows = (section) => joined.map((id, index) => {
      const item = definition(id);
      const key = `${section}-${id}`;
      return `<div class="pcw-price-row"><div class="pcw-price-definition"><span class="pcw-definition-swatch pcw-color-${item.color}">${numericIcon(index + 1)}</span>${definitionCopy(item)}</div><input class="pcw-input" type="text" inputmode="decimal" value="${escapeValue(prices[key] ?? "8888")}" data-pcw-price="${key}" aria-label="${section} ${item.name}價格" ${viewOnly ? "disabled" : ""} /></div>`;
    }).join("");
    pricePanel.innerHTML = `<label class="pcw-field pcw-price-project"><span>專案</span><input class="pcw-input" readonly value="xxx-yyy-zzz" /></label><div class="pcw-price-summary"><span>間數</span><span>28 間</span><label class="pcw-field"><span>計價</span><input class="pcw-input" readonly value="每間" /></label><label class="pcw-field"><span>天數</span><input class="pcw-input" readonly value="1" /></label></div>${ROOMS.map((room) => `<section class="pcw-room-price-card" data-pcw-room="${room.id}"><h3>${room.name}</h3>${priceRows(room.id)}</section>`).join("")}<section class="pcw-extra-price-section" data-pcw-extra="adult"><h3>加人：成人每位</h3>${priceRows("adult")}</section><section class="pcw-extra-price-section" data-pcw-extra="child"><h3>加人：孩童每位</h3>${priceRows("child")}</section>`;
  }
  function updateDefinitions() {
    Object.keys(overrides).forEach((key) => { if (!joined.includes(overrides[key])) delete overrides[key]; });
    renderJoined();
    renderSource();
    renderCalendars();
    renderPrices();
    if (selectedDate) renderDayChoices();
  }
  function renderDayChoices() {
    if (!selectedDate) return;
    const date = new Date(`${selectedDate}T12:00:00`);
    const selected = appliedDefinition(selectedDate)?.id;
    const choices = `<h3>${selectedDate}（${WEEKDAYS[date.getDay()]}）</h3><div class="pcw-day-choices">${joined.map((id) => `<button type="button" data-pcw-choose="${id}" aria-pressed="${id === selected}"><span class="pcw-choice-check">${id === selected ? '<img src="./assets/icons/check-green.svg" alt="已選" />' : ""}</span><span>${definition(id).name}</span></button>`).join("")}</div>`;
    popover.innerHTML = choices;
    sheet.querySelector("[data-pcw-sheet-content]").innerHTML = choices;
  }
  function closeDayChoices() {
    selectedDate = null;
    popover.hidden = true;
    sheet.classList.remove("open");
    dayAnchor?.setAttribute("aria-expanded", "false");
    dayAnchor = null;
    document.body.style.overflow = document.querySelector(".modal-backdrop.open") ? "hidden" : "";
  }
  function openDayChoices(button) {
    closeDayChoices();
    if (!joined.length) return;
    selectedDate = button.dataset.pcwDate;
    dayAnchor = button;
    button.setAttribute("aria-expanded", "true");
    renderDayChoices();
    if (document.documentElement.clientWidth < 768) {
      sheet.classList.add("open");
      document.body.style.overflow = "hidden";
      return;
    }
    popover.hidden = false;
    const bounds = button.getBoundingClientRect();
    const popup = popover.getBoundingClientRect();
    const width = document.documentElement.clientWidth;
    const left = Math.min(Math.max(12, bounds.left + bounds.width / 2 - popup.width / 2), width - popup.width - 12);
    const below = bounds.bottom + 8;
    const top = below + popup.height <= window.innerHeight - 12 ? below : Math.max(12, bounds.top - popup.height - 8);
    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
  }

  function releasePress() {
    if (press) window.clearTimeout(press.timer);
    press = null;
  }
  function stopDrag(cancelled = false) {
    cancelAnimationFrame(animation);
    animation = 0;
    if (drag) {
      if (cancelled && draft) {
        draft = drag.startOrder;
        draft.forEach((id) => joinedList.appendChild(joinedList.querySelector(`[data-pcw-definition="${id}"]`)));
        syncRanks();
      }
      drag.node.classList.remove("is-dragging");
      drag.ghost.remove();
      try { if (form.hasPointerCapture(drag.pointerId)) form.releasePointerCapture(drag.pointerId); } catch { /* Pointer may already be released. */ }
      drag = null;
      window.setTimeout(() => { suppressClick = false; }, 0);
    }
    releasePress();
  }
  function reorderAtPointer() {
    if (!drag || !draft) return;
    const otherRows = [...joinedList.querySelectorAll("[data-pcw-definition]")].filter((row) => row !== drag.node);
    const before = otherRows.find((row) => drag.y < row.getBoundingClientRect().top + row.getBoundingClientRect().height / 2);
    joinedList.insertBefore(drag.node, before || null);
    draft = [...joinedList.querySelectorAll("[data-pcw-definition]")].map((row) => row.dataset.pcwDefinition);
    syncRanks();
  }
  function autoScroll(time) {
    if (!drag) return;
    const bounds = joinedList.getBoundingClientRect();
    const edge = 32;
    let velocity = 0;
    if (drag.y < bounds.top + edge && drag.y >= bounds.top - edge) velocity = -Math.min(1, (bounds.top + edge - drag.y) / edge);
    if (drag.y > bounds.bottom - edge && drag.y <= bounds.bottom + edge) velocity = Math.min(1, (drag.y - bounds.bottom + edge) / edge);
    const elapsed = drag.lastTime ? Math.min(32, time - drag.lastTime) : 16;
    drag.lastTime = time;
    if (velocity) {
      joinedList.scrollTop += velocity * elapsed * 0.6;
      reorderAtPointer();
    }
    animation = requestAnimationFrame(autoScroll);
  }
  function startDrag(row, event) {
    if (viewOnly) return;
    if (!draft) draft = [...joined];
    updateMode();
    const bounds = row.getBoundingClientRect();
    const ghost = row.cloneNode(true);
    ghost.classList.add("pcw-drag-ghost");
    ghost.setAttribute("aria-hidden", "true");
    ghost.querySelectorAll("input").forEach((input) => { input.disabled = true; });
    ghost.style.width = `${bounds.width}px`;
    ghost.style.left = `${bounds.left}px`;
    ghost.style.top = `${bounds.top}px`;
    document.body.appendChild(ghost);
    drag = { node: row, ghost, pointerId: event.pointerId, x: event.clientX, y: event.clientY, startY: event.clientY, initialTop: bounds.top, startOrder: [...draft], lastTime: 0 };
    row.classList.add("is-dragging");
    suppressClick = true;
    try { form.setPointerCapture(event.pointerId); } catch { /* Synthetic events have no active pointer. */ }
    animation = requestAnimationFrame(autoScroll);
  }
  joinedList.addEventListener("pointerdown", (event) => {
    const row = event.target.closest("[data-pcw-definition]");
    if (!row || event.target.closest("label, input") || event.button !== 0 || viewOnly) return;
    if (event.pointerType === "mouse") event.preventDefault();
    releasePress();
    if (draft) { startDrag(row, event); return; }
    press = { x: event.clientX, y: event.clientY, timer: window.setTimeout(() => { press = null; startDrag(row, event); }, 450) };
  });
  document.addEventListener("pointermove", (event) => {
    if (press && Math.hypot(event.clientX - press.x, event.clientY - press.y) > 8) releasePress();
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    drag.x = event.clientX;
    drag.y = event.clientY;
    drag.ghost.style.top = `${drag.initialTop + event.clientY - drag.startY}px`;
    reorderAtPointer();
  });
  joinedList.addEventListener("touchmove", (event) => { if (drag) event.preventDefault(); }, { passive: false });
  document.addEventListener("pointerup", () => stopDrag());
  document.addEventListener("pointercancel", () => stopDrag(true));
  joinedList.addEventListener("pointerleave", () => { if (!drag) releasePress(); });
  document.addEventListener("pointerup", releasePress);
  form.addEventListener("lostpointercapture", (event) => { if (drag && event.target === form) stopDrag(true); });
  joinedList.addEventListener("keydown", (event) => {
    if (event.key === " " && event.target.matches("[data-pcw-definition]")) {
      event.preventDefault();
      if (!draft) { draft = [...joined]; updateMode(); }
    }
    if (draft && ["ArrowUp", "ArrowDown"].includes(event.key)) {
      const row = event.target.closest("[data-pcw-definition]");
      if (!row) return;
      event.preventDefault();
      const index = draft.indexOf(row.dataset.pcwDefinition);
      const target = Math.max(0, Math.min(draft.length - 1, index + (event.key === "ArrowUp" ? -1 : 1)));
      draft.splice(target, 0, draft.splice(index, 1)[0]);
      draft.forEach((id) => joinedList.appendChild(joinedList.querySelector(`[data-pcw-definition="${id}"]`)));
      syncRanks();
      row.focus({ preventScroll: true });
      row.scrollIntoView({ block: "nearest" });
    }
  });

  function setStep(step) {
    closeDayChoices();
    stopDrag();
    if (draft) { draft = null; renderJoined(); }
    currentStep = Math.max(1, Math.min(3, step));
    form.dataset.pcwCurrentStep = String(currentStep);
    form.querySelectorAll("[data-pcw-step]").forEach((panel) => { panel.hidden = Number(panel.dataset.pcwStep) !== currentStep; });
    form.querySelectorAll("[data-pcw-footer]").forEach((footer) => { footer.hidden = Number(footer.dataset.pcwFooter) !== currentStep; });
    form.querySelectorAll("[data-pcw-step-dot]").forEach((dot) => {
      const active = Number(dot.dataset.pcwStepDot) === currentStep;
      dot.classList.toggle("is-active", active);
      if (active) dot.setAttribute("aria-current", "step"); else dot.removeAttribute("aria-current");
    });
    form.classList.toggle("pcw-modal-box--step-2", currentStep === 2);
    form.classList.toggle("pcw-modal-box--step-3", currentStep === 3);
    const mode = modal.dataset.pcModalMode || "new";
    form.querySelector("[data-pcw-title]").textContent = mode === "view" ? "查看" : mode === "edit" ? "修改" : "新增";
    form.querySelector("[data-pcw-subtitle]").textContent = ["專案", "日期", "價格"][currentStep - 1];
    if (currentStep === 3) renderPrices();
    body.scrollTop = 0;
  }
  form.addEventListener("submit", (event) => event.preventDefault());
  form.addEventListener("input", (event) => {
    if (event.target.matches("[data-pcw-price]")) prices[event.target.dataset.pcwPrice] = event.target.value;
  });
  form.addEventListener("change", (event) => {
    if (event.target.name === "roomTypes") {
      const options = [...form.querySelectorAll('[name="roomTypes"]')];
      const all = options.find((input) => input.value === "all");
      const individual = options.filter((input) => input !== all);
      if (event.target === all) individual.forEach((input) => { input.checked = all.checked; });
      else all.checked = individual.every((input) => input.checked);
    }
    const remove = event.target.closest("[data-pcw-remove]");
    if (remove && !draft && !viewOnly) { joined = joined.filter((id) => id !== remove.dataset.pcwRemove); updateDefinitions(); }
  });
  function chooseDay(event) {
    const choice = event.target.closest("[data-pcw-choose]");
    if (!choice || !selectedDate || !joined.includes(choice.dataset.pcwChoose) || viewOnly) return;
    overrides[selectedDate] = choice.dataset.pcwChoose;
    renderCalendars();
    renderDayChoices();
  }
  popover.addEventListener("click", chooseDay);
  sheet.addEventListener("click", chooseDay);
  sheet.querySelector("[data-pcw-sheet-close]").addEventListener("click", closeDayChoices);
  form.addEventListener("click", (event) => {
    if (suppressClick && event.target.closest("[data-pcw-definition]")) { suppressClick = false; event.preventDefault(); return; }
    if (event.target.closest("[data-pcw-next]")) { setStep(currentStep + 1); return; }
    if (event.target.closest("[data-pcw-previous]")) { setStep(currentStep - 1); return; }
    if (event.target.closest("[data-pcw-clear]")) {
      if (currentStep === 1) resetPanel(form.querySelector('[data-pcw-step="1"]'));
      if (currentStep === 2) { stopDrag(); draft = null; joined = []; overrides = {}; monthOffset = 0; closeDayChoices(); updateDefinitions(); datePanel.querySelector('[name="saveSample"]').checked = false; }
      if (currentStep === 3) { prices = Object.fromEntries(Object.keys(prices).map((key) => [key, ""])); pricePanel.querySelectorAll("[data-pcw-price]").forEach((input) => { input.value = ""; prices[input.dataset.pcwPrice] = ""; }); }
      return;
    }
    const source = event.target.closest("[data-pcw-source]");
    if (source && !draft && !viewOnly) { const id = source.dataset.pcwSource; joined = joined.includes(id) ? joined.filter((value) => value !== id) : [...joined, id]; updateDefinitions(); return; }
    if (event.target.closest("[data-pcw-cancel-order]")) { stopDrag(); draft = null; renderJoined(); renderSource(); return; }
    if (event.target.closest("[data-pcw-save-order]")) { stopDrag(); if (draft) joined = [...draft]; draft = null; updateDefinitions(); return; }
    const monthButton = event.target.closest("[data-pcw-month]");
    if (monthButton) { monthOffset += Number(monthButton.dataset.pcwMonth); closeDayChoices(); renderCalendars(); return; }
    const day = event.target.closest("[data-pcw-date]");
    if (day) openDayChoices(day);
  });
  document.addEventListener("click", (event) => {
    if (!popover.hidden && !event.composedPath().includes(popover) && !event.target.closest("[data-pcw-date]")) closeDayChoices();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !popover.hidden) { event.preventDefault(); event.stopImmediatePropagation(); closeDayChoices(); }
  }, true);
  window.addEventListener("resize", closeDayChoices);
  body.addEventListener("scroll", () => { if (!popover.hidden) closeDayChoices(); }, { passive: true });
  new MutationObserver(() => { if (!modal.classList.contains("open")) { closeDayChoices(); stopDrag(); draft = null; } }).observe(modal, { attributes: true, attributeFilter: ["class"] });
  return { beforeOpen(id) {
    if (id !== MODAL_ID) return;
    stopDrag(); closeDayChoices();
    suppressClick = false;
    viewOnly = modal.dataset.pcModalMode === "view";
    form.reset(); joined = ["d1", "d3", "d4"]; draft = null; monthOffset = 0; overrides = { "2026-03-02": "d1", "2026-06-05": "d4" }; prices = {};
    updateDefinitions();
    form.querySelector('[data-pcw-step="1"]').querySelectorAll("input, select, button").forEach((input) => { input.disabled = viewOnly; });
    datePanel.querySelector("[data-pcw-template]").disabled = viewOnly;
    form.querySelectorAll("[data-pcw-clear], [data-pcw-save]").forEach((button) => { button.hidden = viewOnly; });
    setStep(1);
  } };
}
