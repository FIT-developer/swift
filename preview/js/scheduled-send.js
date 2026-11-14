import { createScheduledSendState } from "./scheduled-send-state.js";
import { initCardSort } from "./card-sort.js";

const RIBBON_PATH =
  "M60.7647 0.000276299C68.6854 0.000312315 71.7897 10.2777 65.1934 14.6626L12.4288 49.7379C7.11164 53.2725 0 49.4604 0 43.0757V8.00004C0 3.58175 3.58174 1.62863e-05 8.00004 3.63764e-05L60.7647 0.000276299Z";
const SVG_NS = "http://www.w3.org/2000/svg";

export function isScheduledSendUsageVisible(card, usageFilter) {
  return !card.hasUsageToggle || card.used === usageFilter;
}

function icon(source, label) {
  const image = document.createElement("img");
  image.src = `./assets/icons/${source}.svg`;
  image.alt = label || "";
  image.setAttribute("aria-hidden", label ? "false" : "true");
  return image;
}

function scopeBadge(scope) {
  const badge = document.createElement("span");
  badge.className = `scheduled-send-scope-badge ${scope === "總部" ? "is-headquarters" : "is-branch"}`;
  badge.textContent = scope;
  return badge;
}

function buildRibbon(card, rank, sortingCardId) {
  const handle = document.createElement("div");
  handle.className = "scheduled-send-ribbon";
  handle.dataset.scheduleSortHandle = "true";
  handle.dataset.scheduleSortId = card.id;
  handle.tabIndex = 0;
  handle.setAttribute("role", "button");
  handle.setAttribute("aria-label", `拖曳排序第 ${rank} 張排程卡片`);
  handle.setAttribute("aria-keyshortcuts", "ArrowUp ArrowDown Escape");
  handle.setAttribute("aria-grabbed", String(sortingCardId === card.id));

  const svg = document.createElementNS(SVG_NS, "svg");
  const gradientId = `scheduledSendRibbon-${card.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  svg.setAttribute("viewBox", "0 0 87.25 58");
  svg.setAttribute("width", "87.25");
  svg.setAttribute("height", "58");
  svg.setAttribute("aria-hidden", "true");

  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", RIBBON_PATH);
  path.setAttribute("fill", `url(#${gradientId})`);

  const defs = document.createElementNS(SVG_NS, "defs");
  const gradient = document.createElementNS(SVG_NS, "linearGradient");
  gradient.setAttribute("id", gradientId);
  gradient.setAttribute("x1", "87.25");
  gradient.setAttribute("y1", "42.8683");
  gradient.setAttribute("x2", "0");
  gradient.setAttribute("y2", "42.8683");
  gradient.setAttribute("gradientUnits", "userSpaceOnUse");

  const start = document.createElementNS(SVG_NS, "stop");
  start.setAttribute("stop-color", card.enabled ? "var(--color-brand-100)" : "var(--color-neutral-100)");
  const end = document.createElementNS(SVG_NS, "stop");
  end.setAttribute("offset", "1");
  end.setAttribute("stop-color", "var(--color-neutral-0)");
  gradient.append(start, end);
  defs.appendChild(gradient);
  svg.append(path, defs);
  handle.append(svg);

  const number = document.createElement("span");
  number.className = "scheduled-send-ribbon-number";
  number.textContent = String(rank).padStart(3, "0");
  handle.appendChild(number);
  return handle;
}

function buildAction(action, card) {
  const labels = {
    edit: ["edit", "修改"],
    disable: ["suspend-outline", "停用"],
    view: ["preview-outline", "查看"],
    enable: ["video-play", "啟動"],
  };
  const [iconName, label] = labels[action];
  const button = document.createElement("button");
  button.type = "button";
  button.className = `scheduled-send-card-action is-${action}`;
  button.dataset.scheduleAction = action;
  button.dataset.scheduleId = card.id;
  button.setAttribute("aria-label", `${label}${card.title ? `：${card.title}` : ""}`);
  button.append(icon(iconName), document.createElement("span"));
  button.lastElementChild.textContent = label;
  return button;
}

function buildToggle(card) {
  if (!card.hasUsageToggle) return null;

  const group = document.createElement("div");
  group.className = "scheduled-send-usage-toggle-group";
  const label = document.createElement("span");
  label.className = "scheduled-send-usage-toggle-label";
  label.textContent = card.used ? "使用" : "不使用";

  const control = document.createElement("label");
  control.className = "member-data-switch scheduled-send-card-switch";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = card.used === true;
  input.setAttribute("role", "switch");
  input.dataset.scheduleUsageToggle = "true";
  input.dataset.scheduleId = card.id;
  input.setAttribute("aria-label", `使用狀態：${card.title}`);
  input.setAttribute("aria-checked", String(card.used === true));
  const track = document.createElement("span");
  track.className = "member-data-switch-track";
  track.setAttribute("aria-hidden", "true");
  const knob = document.createElement("span");
  knob.className = "member-data-switch-knob";
  knob.setAttribute("aria-hidden", "true");
  control.append(input, track, knob);
  group.append(label, control);
  return group;
}

function buildResultGroup(className, imageName, imageLabel, lines) {
  const group = document.createElement("div");
  group.className = `scheduled-send-result-group ${className}`;
  const image = icon(imageName, imageLabel);
  const value = document.createElement("div");
  value.className = "scheduled-send-result-value";
  lines.forEach((line) => {
    const text = document.createElement("span");
    text.textContent = line.text;
    if (line.className) text.className = line.className;
    value.appendChild(text);
  });
  group.append(image, value);
  return group;
}

function buildResultStrip(card) {
  const strip = document.createElement("div");
  strip.className = "scheduled-send-result-strip";
  strip.setAttribute("aria-label", "排程結果");
  if (card.eventLabel) {
    strip.appendChild(
      buildResultGroup("is-event", "info", "事件", [{ text: card.eventLabel }]),
    );
  }
  if (card.anchor || card.direction) {
    const lines = [];
    if (card.anchor) lines.push({ text: card.anchor });
    if (card.direction) {
      lines.push({
        text: card.direction,
        className: card.direction === "前" ? "is-before" : "is-after",
      });
    }
    strip.appendChild(buildResultGroup("is-anchor", "calendar", "日期", lines));
  }
  if (card.days || card.hour) {
    const lines = [];
    if (card.days) lines.push({ text: `${card.days} 天` });
    if (card.hour) lines.push({ text: `${card.hour} 時` });
    strip.appendChild(buildResultGroup("is-time", "clock", "時間", lines));
  }
  return strip;
}

function buildPermissionNotice() {
  const notice = document.createElement("p");
  notice.className = "scheduled-send-permission-notice";
  notice.dataset.schedulePermissionNotice = "true";
  notice.textContent = "當館無調整權限，請由總部調整";
  return notice;
}

function buildCard(card, rank, sortingCardId) {
  const article = document.createElement("article");
  article.className = "scheduled-send-card";
  article.dataset.scheduleCardId = card.id;
  article.classList.toggle("is-permission-locked", !card.canAdjust);
  if (sortingCardId === card.id) article.classList.add("is-scheduled-send-sorting");
  article.appendChild(buildRibbon(card, rank, sortingCardId));

  const inner = document.createElement("div");
  inner.className = "scheduled-send-card-inner";
  const summary = document.createElement("div");
  summary.className = "scheduled-send-card-summary";

  const heading = document.createElement("div");
  heading.className = "scheduled-send-card-heading";
  const title = document.createElement("h2");
  title.className = "scheduled-send-card-title";
  title.textContent = card.title;
  heading.append(title, scopeBadge(card.scope));
  summary.append(heading, buildResultStrip(card));

  if (card.canAdjust) {
    const controls = document.createElement("div");
    controls.className = "scheduled-send-card-controls";
    const toggle = buildToggle(card);
    if (toggle) controls.appendChild(toggle);
    const actions = document.createElement("div");
    actions.className = "scheduled-send-card-actions";
    if (card.enabled) {
      actions.append(buildAction("edit", card), buildAction("disable", card));
    } else {
      actions.append(buildAction("view", card), buildAction("enable", card));
    }
    controls.appendChild(actions);
    summary.appendChild(controls);
  }
  inner.appendChild(summary);
  if (!card.canAdjust) inner.appendChild(buildPermissionNotice());

  const contentWrap = document.createElement("div");
  contentWrap.className = "scheduled-send-card-content-wrap";
  const content = document.createElement("textarea");
  content.className = "scheduled-send-card-content";
  content.value = card.content;
  content.readOnly = true;
  content.setAttribute("aria-label", `簡訊內容：${card.title}`);
  contentWrap.appendChild(content);
  inner.appendChild(contentWrap);
  article.appendChild(inner);
  return article;
}

export function initScheduledSend() {
  const state = createScheduledSendState();
  const cardList = document.getElementById("scheduledSendCardList");
  const enabledCount = document.getElementById("scheduledSendEnabledCount");
  const disabledCount = document.getElementById("scheduledSendDisabledCount");
  const statusFilters = document.querySelector(".scheduled-send-status-filters");
  const usageFilters = document.querySelector(".scheduled-send-usage-filters");
  const announcement = document.getElementById("scheduledSendSortAnnouncement");
  let statusFilter = "enabled";
  let usageFilter = true;
  let modalOpen = null;
  let sortingCardId = null;

  function getVisibleCards() {
    return state.listCards().filter((card) => {
      const statusMatches = card.enabled === (statusFilter === "enabled");
      return statusMatches && isScheduledSendUsageVisible(card, usageFilter);
    });
  }

  function syncFilters() {
    if (enabledCount && disabledCount) {
      const cards = state.listCards();
      enabledCount.textContent = `（${cards.filter((card) => card.enabled).length}）`;
      disabledCount.textContent = `（${cards.filter((card) => !card.enabled).length}）`;
    }
    statusFilters?.querySelectorAll("[data-schedule-status]").forEach((button) => {
      const active = button.dataset.scheduleStatus === statusFilter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    usageFilters?.querySelectorAll("[data-schedule-usage]").forEach((button) => {
      const active = button.dataset.scheduleUsage === String(usageFilter);
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function render() {
    if (!cardList) return;
    const focusedHandle = document.activeElement?.closest?.("[data-schedule-sort-handle]");
    const focusId = focusedHandle?.dataset.scheduleSortId || null;
    cardList.replaceChildren();
    const visibleCards = getVisibleCards();
    visibleCards.forEach((card) => {
      cardList.appendChild(buildCard(card, state.getRank(card.id), sortingCardId));
    });
    if (!visibleCards.length) {
      const statusCards = state.listCards().filter((card) => card.enabled === (statusFilter === "enabled"));
      const empty = document.createElement("p");
      empty.className = "scheduled-send-empty";
      empty.textContent = statusCards.length
        ? "沒有符合條件的卡片"
        : statusFilter === "enabled"
          ? "沒有任何啟用中的卡片"
          : "沒有任何停用中的卡片";
      cardList.appendChild(empty);
    }
    cardList.setAttribute("aria-label", `排程發送卡片，共 ${visibleCards.length} 筆`);
    syncFilters();
    if (focusId) {
      const nextHandle = Array.from(cardList.querySelectorAll("[data-schedule-sort-handle]")).find(
        (handle) => handle.dataset.scheduleSortId === focusId,
      );
      if (nextHandle) nextHandle.focus({ preventScroll: true });
    }
  }

  function getVisibleIds() {
    return getVisibleCards().map((card) => card.id);
  }

  render();
  const sorter = initCardSort({
    grid: cardList,
    getVisibleIds,
    reorderVisible: state.reorderVisible,
    replaceOrder: state.replaceOrder,
    snapshotOrder: state.snapshotOrder,
    saveOrder: state.saveOrder,
    render,
    announce: (message) => {
      if (announcement) announcement.textContent = message;
    },
    onSortingChange: (id) => {
      sortingCardId = id;
    },
    namespace: "schedule",
  });

  statusFilters?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-schedule-status]");
    if (!button) return;
    sorter.cancel();
    statusFilter = button.dataset.scheduleStatus;
    render();
  });

  usageFilters?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-schedule-usage]");
    if (!button) return;
    sorter.cancel();
    usageFilter = button.dataset.scheduleUsage === "true";
    render();
  });

  cardList?.addEventListener("change", (event) => {
    const toggle = event.target.closest("[data-schedule-usage-toggle]");
    if (!toggle || toggle.disabled) return;
    sorter.cancel();
    state.update(toggle.dataset.scheduleId, { used: toggle.checked });
    render();
  });

  cardList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-schedule-action]");
    if (!button) return;
    const action = button.dataset.scheduleAction;
    const id = button.dataset.scheduleId || null;
    sorter.cancel();
    if (action === "edit" || action === "view") {
      if (typeof modalOpen === "function") modalOpen(action, id, button);
      return;
    }
    if (action === "disable" || action === "enable") {
      state.update(id, { enabled: action === "enable" });
      render();
    }
  });

  document.querySelector(".scheduled-send-content [data-schedule-action='new']")?.addEventListener(
    "click",
    (event) => {
      sorter.cancel();
      if (typeof modalOpen === "function") modalOpen("new", null, event.currentTarget);
    },
  );

  return {
    setModalHandler(handler) {
      modalOpen = typeof handler === "function" ? handler : null;
    },
    getCard: state.getCard,
    saveCard(id, fields) {
      const card = state.saveCard(id, fields);
      render();
      return card;
    },
  };
}
