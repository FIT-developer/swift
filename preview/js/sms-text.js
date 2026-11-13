import { createSmsTextState } from "./sms-text-state.js";
import { initSmsTextSort } from "./sms-text-sort.js";

// The current SMS SVG has the room-type ribbon path translated by (28, 244).
// Keep the exported geometry; colors follow the independent lifecycle state.
const RIBBON_PATH =
  "M60.7647 0.000276299C68.6854 0.000312315 71.7897 10.2777 65.1934 14.6626L12.4288 49.7379C7.11164 53.2725 0 49.4604 0 43.0757V8.00004C0 3.58175 3.58174 1.62863e-05 8.00004 3.63764e-05L60.7647 0.000276299Z";
const SVG_NS = "http://www.w3.org/2000/svg";

export function isSmsTextUsageVisible(card, usageFilter) {
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
  badge.className = `sms-text-scope-badge ${scope === "總部" ? "is-headquarters" : "is-branch"}`;
  badge.textContent = scope;
  return badge;
}

function buildRibbon(card, rank, sortingCardId) {
  const handle = document.createElement("div");
  handle.className = "sms-text-ribbon";
  handle.dataset.smsSortHandle = "true";
  handle.dataset.smsSortId = card.id;
  handle.tabIndex = 0;
  handle.setAttribute("role", "button");
  handle.setAttribute("aria-label", `拖曳排序第 ${rank} 張簡訊卡片`);
  handle.setAttribute("aria-keyshortcuts", "ArrowUp ArrowDown Escape");
  handle.setAttribute("aria-grabbed", String(sortingCardId === card.id));

  const svg = document.createElementNS(SVG_NS, "svg");
  const gradientId = `smsTextRibbon-${card.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
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
  number.className = "sms-text-ribbon-number";
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
  button.className = `sms-text-card-action is-${action}`;
  button.dataset.smsAction = action;
  button.dataset.smsId = card.id;
  button.setAttribute("aria-label", `${label}${card.title ? `：${card.title}` : ""}`);
  button.append(icon(iconName), document.createElement("span"));
  button.lastElementChild.textContent = label;
  return button;
}

function buildPaymentChip(label) {
  const chip = document.createElement("span");
  chip.className = "sms-text-payment-chip";
  chip.textContent = label;
  return chip;
}

function buildToggle(card) {
  if (!card.hasUsageToggle) return null;

  const group = document.createElement("div");
  group.className = "sms-text-usage-toggle-group";
  const label = document.createElement("span");
  label.className = "sms-text-usage-toggle-label";
  label.textContent = card.used ? "使用" : "不使用";

  const control = document.createElement("label");
  control.className = "member-data-switch sms-text-card-switch";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = card.used === true;
  input.setAttribute("role", "switch");
  input.dataset.smsUsageToggle = "true";
  input.dataset.smsId = card.id;
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

function buildCard(card, rank, sortingCardId) {
  const article = document.createElement("article");
  article.className = "sms-text-card";
  article.dataset.smsCardId = card.id;
  if (sortingCardId === card.id) article.classList.add("is-sms-sorting");

  const rankHandle = buildRibbon(card, rank, sortingCardId);
  article.appendChild(rankHandle);

  const inner = document.createElement("div");
  inner.className = "sms-text-card-inner";
  const summary = document.createElement("div");
  summary.className = "sms-text-card-summary";

  const heading = document.createElement("div");
  heading.className = "sms-text-card-heading";
  const title = document.createElement("h2");
  title.className = "sms-text-card-title";
  title.textContent = card.title;
  heading.appendChild(title);
  heading.appendChild(scopeBadge(card.scope));
  if (card.automatic) {
    const automatic = document.createElement("span");
    automatic.className = "sms-text-automatic-badge";
    automatic.textContent = "自動";
    heading.appendChild(automatic);
  }
  summary.appendChild(heading);

  if (card.description) {
    const description = document.createElement("p");
    description.className = "sms-text-card-description";
    description.textContent = card.description;
    summary.appendChild(description);
  }

  if (card.payments.length) {
    const payments = document.createElement("div");
    payments.className = "sms-text-payment-list";
    card.payments.forEach((payment) => payments.appendChild(buildPaymentChip(payment)));
    summary.appendChild(payments);
  }

  const actions = document.createElement("div");
  actions.className = "sms-text-card-controls";
  const toggle = buildToggle(card);
  if (toggle) actions.appendChild(toggle);
  const actionButtons = document.createElement("div");
  actionButtons.className = "sms-text-card-actions";
  if (card.enabled) {
    actionButtons.append(buildAction("edit", card), buildAction("disable", card));
  } else {
    actionButtons.append(buildAction("view", card), buildAction("enable", card));
  }
  actions.appendChild(actionButtons);
  summary.appendChild(actions);
  inner.appendChild(summary);

  const contentWrap = document.createElement("div");
  contentWrap.className = "sms-text-card-content-wrap";
  const content = document.createElement("textarea");
  content.className = "sms-text-card-content";
  content.value = card.content;
  content.readOnly = true;
  content.setAttribute("aria-label", `簡訊內容：${card.title}`);
  contentWrap.appendChild(content);
  inner.appendChild(contentWrap);
  article.appendChild(inner);
  return article;
}

export function initSmsText() {
  const state = createSmsTextState();
  const cardList = document.getElementById("smsTextCardList");
  const enabledCount = document.getElementById("smsTextEnabledCount");
  const disabledCount = document.getElementById("smsTextDisabledCount");
  const statusFilters = document.querySelector(".sms-text-status-filters");
  const usageFilters = document.querySelector(".sms-text-usage-filters");
  const announcement = document.getElementById("smsTextSortAnnouncement");
  let statusFilter = "enabled";
  let usageFilter = true;
  let modalOpen = null;
  let sortingCardId = null;

  function getVisibleCards() {
    return state.listCards().filter((card) => {
      const statusMatches = card.enabled === (statusFilter === "enabled");
      return statusMatches && isSmsTextUsageVisible(card, usageFilter);
    });
  }

  function syncFilters() {
    if (enabledCount && disabledCount) {
      const cards = state.listCards();
      enabledCount.textContent = `（${cards.filter((card) => card.enabled).length}）`;
      disabledCount.textContent = `（${cards.filter((card) => !card.enabled).length}）`;
    }
    if (statusFilters) {
      statusFilters.querySelectorAll("[data-sms-status]").forEach((button) => {
        const active = button.dataset.smsStatus === statusFilter;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    }
    if (usageFilters) {
      usageFilters.querySelectorAll("[data-sms-usage]").forEach((button) => {
        const active = button.dataset.smsUsage === String(usageFilter);
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    }
  }

  function render() {
    if (!cardList) return;
    const focusedHandle = document.activeElement?.closest?.("[data-sms-sort-handle]");
    const focusId = focusedHandle?.dataset.smsSortId || null;
    cardList.replaceChildren();
    const visibleCards = getVisibleCards();
    visibleCards.forEach((card) => {
      cardList.appendChild(buildCard(card, state.getRank(card.id), sortingCardId));
    });
    if (!visibleCards.length) {
      const statusCards = state.listCards().filter((card) => card.enabled === (statusFilter === "enabled"));
      const empty = document.createElement("p");
      empty.className = "sms-text-empty";
      empty.textContent = statusCards.length
        ? "沒有符合條件的卡片"
        : statusFilter === "enabled"
          ? "沒有任何啟用中的卡片"
          : "沒有任何停用中的卡片";
      cardList.appendChild(empty);
    }
    cardList.setAttribute("aria-label", `簡訊文本卡片，共 ${visibleCards.length} 筆`);
    syncFilters();
    if (focusId) {
      const nextHandle = Array.from(cardList.querySelectorAll("[data-sms-sort-handle]")).find(
        (handle) => handle.dataset.smsSortId === focusId,
      );
      if (nextHandle) nextHandle.focus({ preventScroll: true });
    }
  }

  function getVisibleIds() {
    return getVisibleCards().map((card) => card.id);
  }

  render();
  const smsTextSorter = initSmsTextSort({
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
  });

  statusFilters?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-sms-status]");
    if (!button) return;
    smsTextSorter.cancel();
    statusFilter = button.dataset.smsStatus;
    render();
  });

  usageFilters?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-sms-usage]");
    if (!button) return;
    smsTextSorter.cancel();
    usageFilter = button.dataset.smsUsage === "true";
    render();
  });

  cardList?.addEventListener("change", (event) => {
    const toggle = event.target.closest("[data-sms-usage-toggle]");
    if (!toggle || toggle.disabled) return;
    const id = toggle.dataset.smsId;
    const used = toggle.checked;
    smsTextSorter.cancel();
    state.update(id, { used });
    render();
  });

  cardList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-sms-action]");
    if (!button) return;
    const action = button.dataset.smsAction;
    const id = button.dataset.smsId || null;
    smsTextSorter.cancel();
    if (action === "new" || action === "edit" || action === "view") {
      const trigger = id
        ? Array.from(cardList.querySelectorAll("[data-sms-action]"))
            .find((item) => item.dataset.smsAction === action && item.dataset.smsId === id) || button
        : button;
      if (typeof modalOpen === "function") modalOpen(action, id, trigger);
      return;
    }
    if (action === "disable" || action === "enable") {
      state.update(id, { enabled: action === "enable" });
      render();
    }
  });

  document.querySelector(".sms-text-content [data-sms-action='new']")?.addEventListener("click", (event) => {
    smsTextSorter.cancel();
    if (typeof modalOpen === "function") modalOpen("new", null, event.currentTarget);
  });

  return {
    setModalHandler(handler) {
      modalOpen = typeof handler === "function" ? handler : null;
    },
    getCard: state.getCard,
    getRank(id) {
      return id ? state.getRank(id) : state.listCards().length + 1;
    },
    saveCard(id, fields) {
      const card = state.saveCard(id, fields);
      render();
      return card;
    },
  };
}
