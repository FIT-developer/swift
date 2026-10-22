import { initPhotoSort } from "./photo-sort.js";

// Project-owned photo session; layout follows the room-type photo manager.
const SLOT_COUNT = 5;

function emptySlots() {
  return Array.from({ length: SLOT_COUNT }, () => ({ hasImage: false, url: null, isObjectUrl: false }));
}

function savedSlotsWithPhoto(url) {
  const slots = emptySlots();
  slots[0] = { hasImage: true, url, isObjectUrl: false };
  return slots;
}

const savedByCard = {};
let onPhotoCommit = null;
let pendingCardKey = null;
let workingSlots = emptySlots();
let currentCardKey = null;
let pendingObjectUrls = [];
let activeSlotIndex = null;

function cloneSlots(slots) {
  return slots.map((s) => ({ hasImage: s.hasImage, url: s.url, isObjectUrl: s.isObjectUrl }));
}

function revokeAbandonedObjectUrls() {
  const savedUrls = savedByCard[currentCardKey] ? savedByCard[currentCardKey].map((s) => s.url) : [];
  pendingObjectUrls.forEach((url) => {
    if (savedUrls.indexOf(url) === -1) URL.revokeObjectURL(url);
  });
  pendingObjectUrls = [];
}

function render() {
  const grid = document.getElementById("pcProjectPhotoCardGrid");
  if (!grid) return;
  grid.innerHTML = "";
  workingSlots.forEach((slot, idx) => grid.appendChild(buildCard(slot, idx)));
}

function buildCard(slot, idx) {
  const card = document.createElement("div");
  card.className = "lodging-photo-card flex flex-col gap-3 rounded-lg border border-border-disabled p-5";
  card.draggable = true;
  card.dataset.slot = String(idx);

  const head = document.createElement("div");
  head.className = "flex items-center gap-2";
  head.innerHTML =
    '<img src="./assets/icons/dots-line.svg" alt="拖曳排序" class="w-6 h-6 cursor-grab" data-photo-sort-handle role="button" tabindex="0" draggable="false" />' +
    '<span class="text-xl text-text-default">圖片 ' + (idx + 1) + "</span>";
  if (idx === 0) {
    const pill = document.createElement("span");
    pill.className = "inline-flex items-center rounded-full bg-chart-blue px-3 py-0.5 text-base text-white";
    pill.textContent = "主圖";
    head.appendChild(pill);
  }
  card.appendChild(head);

  const body = document.createElement("div");
  body.className = "lodging-photo-card-body";

  const preview = document.createElement("div");
  preview.className = "lodging-photo-preview h-[185px] shrink-0 rounded-2xl overflow-hidden";
  if (slot.hasImage) {
    preview.innerHTML = '<img src="' + slot.url + '" alt="" class="w-full h-full object-cover" />';
  } else {
    preview.className += " flex flex-col items-center justify-center gap-2 border border-border-focus";
    preview.innerHTML =
      '<img src="./assets/icons/image.svg" alt="" class="w-9 h-9 opacity-40" />' +
      '<span class="text-base text-text-default">尚未上傳圖片</span>';
  }
  body.appendChild(preview);

  const actions = document.createElement("div");
  actions.className = "lodging-photo-actions flex justify-center gap-3";

  const replaceBtn = document.createElement("button");
  replaceBtn.type = "button";
  replaceBtn.className =
    "inline-flex flex-1 items-center justify-center gap-2 h-9 px-3 rounded-md border border-menu text-base text-menu cursor-pointer whitespace-nowrap";
  replaceBtn.dataset.action = "replace";
  replaceBtn.innerHTML =
    '<span class="icon-mask icon-mask-' +
    (slot.hasImage ? "image-ai-line" : "upload-outline") +
    ' w-6 h-6"></span><span>' +
    (slot.hasImage ? "更換圖片" : "上傳圖片") +
    "</span>";
  actions.appendChild(replaceBtn);

  if (slot.hasImage) {
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className =
      "inline-flex flex-1 items-center justify-center gap-2 h-9 px-3 rounded-md border border-status-negative text-base text-status-negative cursor-pointer whitespace-nowrap";
    deleteBtn.dataset.action = "delete";
    deleteBtn.innerHTML = '<span class="icon-mask icon-mask-trash-can w-6 h-6"></span><span>刪除</span>';
    actions.appendChild(deleteBtn);
  }

  body.appendChild(actions);
  card.appendChild(body);
  return card;
}

function openForCard(cardKey) {
  revokeAbandonedObjectUrls();
  currentCardKey = cardKey;
  workingSlots = cloneSlots(savedByCard[cardKey] || emptySlots());
  render();
}

function handleReplaceClick(idx) {
  activeSlotIndex = idx;
  const input = document.getElementById("pcProjectPhotoFileInput");
  if (input) input.click();
}

function handleDeleteClick(idx) {
  const slot = workingSlots[idx];
  if (slot.isObjectUrl && pendingObjectUrls.includes(slot.url)) {
    URL.revokeObjectURL(slot.url);
    const pos = pendingObjectUrls.indexOf(slot.url);
    if (pos !== -1) pendingObjectUrls.splice(pos, 1);
  }
  workingSlots[idx] = { hasImage: false, url: null, isObjectUrl: false };
  render();
}

function handleFileChosen(e) {
  const file = e.target.files && e.target.files[0];
  e.target.value = "";
  if (!file || activeSlotIndex === null) return;
  const prev = workingSlots[activeSlotIndex];
  if (prev.isObjectUrl && pendingObjectUrls.includes(prev.url)) {
    URL.revokeObjectURL(prev.url);
    const pos = pendingObjectUrls.indexOf(prev.url);
    if (pos !== -1) pendingObjectUrls.splice(pos, 1);
  }
  const url = URL.createObjectURL(file);
  pendingObjectUrls.push(url);
  workingSlots[activeSlotIndex] = { hasImage: true, url, isObjectUrl: true };
  activeSlotIndex = null;
  render();
}

function handleUploadCommit() {
  if (!currentCardKey) return;
  const previous = savedByCard[currentCardKey] || [];
  previous.forEach((slot) => {
    if (slot.isObjectUrl && slot.url && !workingSlots.some((item) => item.url === slot.url)) URL.revokeObjectURL(slot.url);
  });
  savedByCard[currentCardKey] = cloneSlots(workingSlots);
  pendingObjectUrls = [];
  if (onPhotoCommit) onPhotoCommit(currentCardKey, workingSlots[0].url);
}

function initDragAndDrop() {
  const grid = document.getElementById("pcProjectPhotoCardGrid");
  initPhotoSort(grid, (source, target) => {
    const moved = workingSlots.splice(source, 1)[0];
    workingSlots.splice(target, 0, moved);
    render();
  });
}

export function initProjectPhotoManager(options = {}) {
  onPhotoCommit = options.onCommit;
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-pc-photo-trigger]");
    if (!trigger) return;
    pendingCardKey = trigger.dataset.pcCardId;
    if (!savedByCard[pendingCardKey]) {
      const photo = options.getPhoto ? options.getPhoto(pendingCardKey) : null;
      savedByCard[pendingCardKey] = photo ? savedSlotsWithPhoto(photo) : emptySlots();
    }
  });
  const fileInput = document.getElementById("pcProjectPhotoFileInput");
  fileInput.addEventListener("change", handleFileChosen);
  document.getElementById("pcProjectPhotoUploadBtn").addEventListener("click", handleUploadCommit);
  const modal = document.getElementById("modalProjectPhotoBackdrop");
  new MutationObserver(() => {
    if (!modal.classList.contains("open")) revokeAbandonedObjectUrls();
  }).observe(modal, { attributes: true, attributeFilter: ["class"] });
  document.getElementById("pcProjectPhotoCardGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const index = Number(button.closest("[data-slot]").dataset.slot);
    if (button.dataset.action === "replace") handleReplaceClick(index);
    if (button.dataset.action === "delete") handleDeleteClick(index);
  });
  initDragAndDrop();
  return { beforeOpen(id) {
    if (id === "modalProjectPhotoBackdrop") openForCard(pendingCardKey);
  } };
}
