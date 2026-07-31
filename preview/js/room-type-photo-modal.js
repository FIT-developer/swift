// 房型頁 - 照片管理 modal 行為（components/modal.md state=photo-gallery 版型沿用）
// 版型跟「系統設定 -> 民宿資料」頁共用，但這裡是獨立 instance
// (#modalRoomTypePhotoGalleryBackdrop)，JS 完全獨立不 import
// lodging-info-modals.js、不共用 state（2026-07-30 使用者明確要求）。
// 每張房型卡各自一份 5 張圖片資料，開啟時從「上次上傳成功後的狀態」複製一份
// working 副本，邏輯比照 lodging-info-modals.js 的 row1/row2 pattern，
// 這裡改成依卡片 id 動態建立（6 張卡）。
const SLOT_COUNT = 5;

function emptySlots() {
  return Array.from({ length: SLOT_COUNT }, () => ({ hasImage: false, url: null, isObjectUrl: false }));
}

function savedSlotsWithPhoto(url) {
  const slots = emptySlots();
  slots[0] = { hasImage: true, url, isObjectUrl: false };
  return slots;
}

// 6 張房型卡：只有 #1(四人房)、#5(嗚啦啦) 是「有照片」樣本，其餘維持空 slot
const savedByCard = {
  "room-1": savedSlotsWithPhoto(
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop",
  ),
  "room-2": emptySlots(),
  "room-3": emptySlots(),
  "room-4": emptySlots(),
  "room-5": savedSlotsWithPhoto(
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop",
  ),
  "room-6": emptySlots(),
};

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
  const grid = document.getElementById("roomTypePhotoCardGrid");
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
    '<img src="./assets/icons/dots-line.svg" alt="拖曳排序" class="w-6 h-6 cursor-grab" />' +
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
  currentCardKey = cardKey;
  revokeAbandonedObjectUrls();
  workingSlots = cloneSlots(savedByCard[cardKey] || emptySlots());
  render();
}

function handleReplaceClick(idx) {
  activeSlotIndex = idx;
  const input = document.getElementById("roomTypePhotoFileInput");
  if (input) input.click();
}

function handleDeleteClick(idx) {
  const slot = workingSlots[idx];
  if (slot.isObjectUrl && slot.url) {
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
  if (prev.isObjectUrl && prev.url) {
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
  savedByCard[currentCardKey] = cloneSlots(workingSlots);
  pendingObjectUrls = [];
}

let dragSourceIndex = null;

function initDragAndDrop() {
  const grid = document.getElementById("roomTypePhotoCardGrid");
  if (!grid) return;

  grid.addEventListener("dragstart", (e) => {
    const card = e.target.closest("[data-slot]");
    if (!card) return;
    dragSourceIndex = Number(card.dataset.slot);
    e.dataTransfer.effectAllowed = "move";
  });

  grid.addEventListener("dragover", (e) => e.preventDefault());

  grid.addEventListener("drop", (e) => {
    e.preventDefault();
    const card = e.target.closest("[data-slot]");
    if (!card || dragSourceIndex === null) return;
    const targetIndex = Number(card.dataset.slot);
    if (targetIndex === dragSourceIndex) return;
    const moved = workingSlots.splice(dragSourceIndex, 1)[0];
    workingSlots.splice(targetIndex, 0, moved);
    dragSourceIndex = null;
    render();
  });
}

export function initRoomTypePhotoModal() {
  // Delegated on document (不是逐一 bind)：卡片列表會因為停用/啟用切換整份
  // 重繪（room-type.js renderCardList()），直接 bind 在當時存在的節點上
  // 會在重繪後失效，2026-07-31 加入停用/啟用互動時發現這個回歸並修正。
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-room-type-photo-trigger]");
    if (!trigger) return;
    openForCard(trigger.dataset.roomTypePhotoTrigger);
  });

  const fileInput = document.getElementById("roomTypePhotoFileInput");
  if (fileInput) fileInput.addEventListener("change", handleFileChosen);

  const uploadBtn = document.getElementById("roomTypePhotoUploadBtn");
  if (uploadBtn) {
    uploadBtn.addEventListener("click", () => {
      handleUploadCommit();
      const backdrop = document.getElementById("modalRoomTypePhotoGalleryBackdrop");
      if (backdrop) backdrop.classList.remove("open");
    });
  }

  const grid = document.getElementById("roomTypePhotoCardGrid");
  if (grid) {
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const card = e.target.closest("[data-slot]");
      const idx = Number(card.dataset.slot);
      if (btn.dataset.action === "replace") handleReplaceClick(idx);
      if (btn.dataset.action === "delete") handleDeleteClick(idx);
    });
  }

  initDragAndDrop();
}
