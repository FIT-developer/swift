// 房型頁 - 新增/修改 modal 行為（components/modal.md state=room-type）
// 房間介紹文案／房間名稱文案：單語言版 caption card（modal.md 沒有語言 tab
// 維度，跟 lodging-branch-content-card.js 的 3 語言版不同，故獨立實作，
// 不 import 該檔案 - 兩頁 JS 各自獨立，2026-07-30 使用者明確要求）。
import { mountSunEditorPlaceholder } from "./suneditor-instance.js";

const ROOM_COUNT_BASELINE = 14;
const ROOM_INVENTORY_HINT_OFF = "不更新房型庫存";
const ROOM_INVENTORY_HINT_ON = "同步更新房型庫存，至 2027-09-11";

function emptyCaptionState() {
  return { saved: { status: "empty", content: "" }, edit: null };
}

const captionState = {
  roomTypeNewIntroCard: emptyCaptionState(),
  roomTypeNewNameCard: emptyCaptionState(),
  roomTypeEditIntroCard: emptyCaptionState(),
  roomTypeEditNameCard: emptyCaptionState(),
};

function buildEditButton() {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.dataset.captionEdit = "1";
  btn.className =
    "mx-auto inline-flex items-center gap-2 h-[42px] px-4 rounded-full border border-border-disabled bg-white text-base text-text-default cursor-pointer";
  btn.innerHTML =
    '<img src="./assets/icons/edit.svg" alt="" class="w-6 h-6" /><span>編輯</span>';
  return btn;
}

function buildEditFooter() {
  const footer = document.createElement("div");
  footer.className = "flex justify-end gap-2 pt-1";
  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.dataset.captionCancel = "1";
  cancel.className =
    "shrink-0 whitespace-nowrap inline-flex h-9 items-center rounded-md border border-border-disabled bg-border-disabled px-3 text-base text-text-default cursor-pointer";
  cancel.textContent = "取消";
  const save = document.createElement("button");
  save.type = "button";
  save.dataset.captionSave = "1";
  save.className =
    "shrink-0 whitespace-nowrap inline-flex h-9 items-center rounded-md border border-border-disabled bg-text-default px-3 text-base text-text-inverse cursor-pointer";
  save.textContent = "儲存";
  footer.appendChild(cancel);
  footer.appendChild(save);
  return footer;
}

function renderCaptionCard(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const state = captionState[containerId];
  container.innerHTML = "";
  const area = document.createElement("div");

  if (state.edit) {
    area.className = "flex flex-col gap-3 rounded-xl border border-border-default bg-surface-hover p-5";
    const editorHost = document.createElement("div");
    area.appendChild(editorHost);
    mountSunEditorPlaceholder(editorHost, {
      value: state.edit.draft,
      onInput: (value) => {
        state.edit.draft = value;
      },
    });
    area.appendChild(buildEditFooter());
    container.appendChild(area);
    return;
  }

  area.className =
    "flex flex-col items-center gap-5 rounded-xl border border-border-default bg-surface-hover p-5";
  const label = document.createElement("span");
  label.className = "text-base text-text-default";
  label.textContent = state.saved.status === "saved" ? state.saved.content : "尚未填寫";
  area.appendChild(label);
  area.appendChild(buildEditButton());
  container.appendChild(area);
}

function initCaptionCard(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) return;
    const state = captionState[containerId];

    if (e.target.closest("[data-caption-edit]")) {
      state.edit = { draft: state.saved.content };
      renderCaptionCard(containerId);
      return;
    }
    if (e.target.closest("[data-caption-cancel]")) {
      state.edit = null;
      renderCaptionCard(containerId);
      return;
    }
    if (e.target.closest("[data-caption-save]")) {
      const content = (state.edit.draft || "").trim();
      state.saved = { status: content ? "saved" : "empty", content };
      state.edit = null;
      renderCaptionCard(containerId);
      return;
    }
  });

  renderCaptionCard(containerId);
}

function initFacilityChips(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.addEventListener("click", (e) => {
    const chip = e.target.closest(".room-type-facility-chip");
    if (!chip || chip.disabled) return;
    const selected = chip.dataset.facilitySelected === "true";
    chip.dataset.facilitySelected = selected ? "false" : "true";
  });
}

function formatRoomCountDelta(diff) {
  if (diff > 0) return `增加 ${diff} 間`;
  if (diff < 0) return `減少 ${Math.abs(diff)} 間`;
  return "";
}

function initRoomCountScope(scope) {
  const input = scope.querySelector("[data-room-count-input]");
  const delta = scope.querySelector("[data-room-count-delta]");
  const inventoryRow = scope.querySelector("[data-room-inventory-row]");
  const inventoryToggle = scope.querySelector("[data-room-inventory-toggle]");
  const inventoryHint = scope.querySelector("[data-room-inventory-hint]");
  const networkRow = scope.querySelector("[data-room-network-row]");
  const baseline = Number(scope.dataset.roomCountDefault || ROOM_COUNT_BASELINE);
  const readonly = scope.hasAttribute("data-room-count-readonly");

  function syncInventoryHint() {
    if (!inventoryHint || !inventoryToggle) return;
    const active = inventoryToggle.checked;
    inventoryHint.textContent = active ? ROOM_INVENTORY_HINT_ON : ROOM_INVENTORY_HINT_OFF;
    inventoryHint.classList.toggle("text-brand-500", active && !readonly);
    inventoryHint.classList.toggle("text-text-default", !active || readonly);
  }

  function syncRoomCount() {
    if (!input || !delta || !inventoryRow || !networkRow) return;
    const value = Number(input.value);
    const diff = Number.isFinite(value) ? value - baseline : 0;
    const changed = diff !== 0;

    delta.textContent = formatRoomCountDelta(diff);
    delta.classList.toggle("hidden", !changed);
    inventoryRow.classList.toggle("hidden", !changed);
    inventoryRow.classList.toggle("flex", changed);
    networkRow.classList.toggle("is-room-count-changed", changed);

    if (!readonly) {
      input.classList.toggle("is-room-count-changed", changed);
      if (!changed && inventoryToggle) inventoryToggle.checked = false;
    }

    syncInventoryHint();
  }

  if (inventoryToggle && !readonly) {
    inventoryToggle.addEventListener("change", syncInventoryHint);
  }
  if (input && !readonly) {
    input.addEventListener("input", syncRoomCount);
  }
  syncRoomCount();
}

export function initRoomTypeModals() {
  ["roomTypeNewIntroCard", "roomTypeNewNameCard", "roomTypeEditIntroCard", "roomTypeEditNameCard"].forEach(
    initCaptionCard,
  );
  ["roomTypeNewFacilityChips", "roomTypeEditFacilityChips"].forEach(initFacilityChips);
  document.querySelectorAll("[data-room-count-scope]").forEach(initRoomCountScope);
}
