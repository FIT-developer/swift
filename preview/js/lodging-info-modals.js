// 民宿資料頁 - 照片管理 modal 行為（components/modal.md state=photo-gallery）
// 每個 headquarters/分館卡各自獨立一份 5 張圖片資料（demo 用 row1/row2 兩組
// local state），開啟時从「上次上傳成功後的狀態」複製一份 working 副本；
// 拖曳排序/新增/刪除都只改 working，按「上傳」才寫回 saved，「取消」或其他
// 關閉方式下次開啟一律回到 saved（不需額外攔截 cancel，因為 working 每次
// 開啟都重新從 saved clone）。
const SLOT_COUNT = 5;

function emptySlots() {
  return Array.from({ length: SLOT_COUNT }, function () {
    return { hasImage: false, url: null, isObjectUrl: false };
  });
}

const savedByRow = {
  row1: (function () {
    var slots = emptySlots();
    slots[0] = {
      hasImage: true,
      url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop",
      isObjectUrl: false,
    };
    return slots;
  })(),
  row2: emptySlots(),
};

let workingSlots = emptySlots();
let currentRowKey = null;
let pendingObjectUrls = [];
let activeSlotIndex = null;

function cloneSlots(slots) {
  return slots.map(function (s) {
    return { hasImage: s.hasImage, url: s.url, isObjectUrl: s.isObjectUrl };
  });
}

function revokeAbandonedObjectUrls() {
  var savedUrls = savedByRow[currentRowKey]
    ? savedByRow[currentRowKey].map(function (s) {
        return s.url;
      })
    : [];
  pendingObjectUrls.forEach(function (url) {
    if (savedUrls.indexOf(url) === -1) {
      URL.revokeObjectURL(url);
    }
  });
  pendingObjectUrls = [];
}

function render() {
  var grid = document.getElementById("lodgingPhotoCardGrid");
  if (!grid) return;
  grid.innerHTML = "";
  workingSlots.forEach(function (slot, idx) {
    grid.appendChild(buildCard(slot, idx));
  });
}

function buildCard(slot, idx) {
  var card = document.createElement("div");
  card.className =
    "lodging-photo-card flex flex-col gap-3 rounded-lg border border-border-disabled p-5";
  card.draggable = true;
  card.dataset.slot = String(idx);

  var head = document.createElement("div");
  head.className = "flex items-center gap-2";
  head.innerHTML =
    '<img src="./assets/icons/dots-line.svg" alt="拖曳排序" class="w-6 h-6 cursor-grab" />' +
    '<span class="text-xl text-text-default">圖片 ' + (idx + 1) + "</span>";
  if (idx === 0 && slot.hasImage) {
    var pill = document.createElement("span");
    pill.className =
      "inline-flex items-center rounded-full bg-chart-blue px-3 py-0.5 text-base text-white";
    pill.textContent = "主圖";
    head.appendChild(pill);
  }
  card.appendChild(head);

  var body = document.createElement("div");
  body.className = "lodging-photo-card-body";

  var preview = document.createElement("div");
  preview.className =
    "lodging-photo-preview h-[185px] shrink-0 rounded-2xl overflow-hidden";
  if (slot.hasImage) {
    preview.innerHTML =
      '<img src="' +
      slot.url +
      '" alt="" class="w-full h-full object-cover" />';
  } else {
    preview.className +=
      " flex flex-col items-center justify-center gap-2 border border-border-focus";
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
  replaceBtn.dataset.action = "replace";
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
    deleteBtn.dataset.action = "delete";
    deleteBtn.innerHTML =
      '<span class="icon-mask icon-mask-trash-can w-6 h-6"></span><span>刪除</span>';
    actions.appendChild(deleteBtn);
  }

  body.appendChild(actions);
  card.appendChild(body);
  return card;
}

function openForRow(rowKey) {
  currentRowKey = rowKey;
  revokeAbandonedObjectUrls();
  workingSlots = cloneSlots(savedByRow[rowKey]);
  render();
}

function handleReplaceClick(idx) {
  activeSlotIndex = idx;
  var input = document.getElementById("lodgingPhotoFileInput");
  if (input) input.click();
}

function handleDeleteClick(idx) {
  var slot = workingSlots[idx];
  if (slot.isObjectUrl && slot.url) {
    URL.revokeObjectURL(slot.url);
    var pos = pendingObjectUrls.indexOf(slot.url);
    if (pos !== -1) pendingObjectUrls.splice(pos, 1);
  }
  workingSlots[idx] = { hasImage: false, url: null, isObjectUrl: false };
  render();
}

function handleFileChosen(e) {
  var file = e.target.files && e.target.files[0];
  e.target.value = "";
  if (!file || activeSlotIndex === null) return;
  var prev = workingSlots[activeSlotIndex];
  if (prev.isObjectUrl && prev.url) {
    URL.revokeObjectURL(prev.url);
    var pos = pendingObjectUrls.indexOf(prev.url);
    if (pos !== -1) pendingObjectUrls.splice(pos, 1);
  }
  var url = URL.createObjectURL(file);
  pendingObjectUrls.push(url);
  workingSlots[activeSlotIndex] = { hasImage: true, url: url, isObjectUrl: true };
  activeSlotIndex = null;
  render();
}

function handleUploadCommit() {
  if (!currentRowKey) return;
  savedByRow[currentRowKey] = cloneSlots(workingSlots);
  pendingObjectUrls = [];
}

let dragSourceIndex = null;

function initDragAndDrop() {
  var grid = document.getElementById("lodgingPhotoCardGrid");
  if (!grid) return;

  grid.addEventListener("dragstart", function (e) {
    var card = e.target.closest("[data-slot]");
    if (!card) return;
    dragSourceIndex = Number(card.dataset.slot);
    e.dataTransfer.effectAllowed = "move";
  });

  grid.addEventListener("dragover", function (e) {
    e.preventDefault();
  });

  grid.addEventListener("drop", function (e) {
    e.preventDefault();
    var card = e.target.closest("[data-slot]");
    if (!card || dragSourceIndex === null) return;
    var targetIndex = Number(card.dataset.slot);
    if (targetIndex === dragSourceIndex) return;
    var moved = workingSlots.splice(dragSourceIndex, 1)[0];
    workingSlots.splice(targetIndex, 0, moved);
    dragSourceIndex = null;
    render();
  });
}

export function initLodgingInfoModals() {
  // 觸發器本身已用 data-modal-open="modalPhotoGalleryBackdrop"（見
  // lodging-info.html）交給 js/modal-controller.js 的通用開關處理；這裡只
  // 負責在同一次 click 內先切換 row1/row2 各自的圖片資料再 render，
  // 執行順序不影響 modal 本身的開啟時機
  var row1Trigger = document.getElementById("lodgingRow1PhotoTrigger");
  var row2Trigger = document.getElementById("lodgingRow2PhotoTrigger");
  if (row1Trigger) {
    row1Trigger.addEventListener("click", function () {
      openForRow("row1");
    });
  }
  if (row2Trigger) {
    row2Trigger.addEventListener("click", function () {
      openForRow("row2");
    });
  }

  var fileInput = document.getElementById("lodgingPhotoFileInput");
  if (fileInput) fileInput.addEventListener("change", handleFileChosen);

  var uploadBtn = document.getElementById("lodgingPhotoUploadBtn");
  if (uploadBtn) {
    uploadBtn.addEventListener("click", function () {
      handleUploadCommit();
      var backdrop = document.getElementById("modalPhotoGalleryBackdrop");
      if (backdrop) backdrop.classList.remove("open");
    });
  }

  var grid = document.getElementById("lodgingPhotoCardGrid");
  if (grid) {
    grid.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-action]");
      if (!btn) return;
      var card = e.target.closest("[data-slot]");
      var idx = Number(card.dataset.slot);
      if (btn.dataset.action === "replace") handleReplaceClick(idx);
      if (btn.dataset.action === "delete") handleDeleteClick(idx);
    });
  }

  initDragAndDrop();
}
