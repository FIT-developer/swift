// 房型頁 - 卡片列表渲染 + 頁面行為（specs/pages/room-type.md,
// components/room-type-card.md）。6 張卡完整資料來自 2026-07-31 figma-go
// 重讀（components/room-type-card.md 完整 6 卡資料表），逐張渲染，不省略。
const ROOM_TYPE_CARDS = [
  {
    id: "room-1",
    ribbon: "199",
    name: "四人房",
    hasSubtitle: true,
    hasPhoto: true,
    photoUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop",
    state: "active",
    stats: { code: "雙人", bed: "超多床位", count: "99999", operation: "非住宿" },
  },
  {
    id: "room-2",
    ribbon: "888",
    name: "賽亞人房",
    hasSubtitle: true,
    hasPhoto: false,
    state: "active",
    stats: { code: "DT", bed: "二大床", count: "22", operation: "住宿" },
  },
  {
    id: "room-3",
    ribbon: "155",
    name: "賽亞人房 1",
    hasSubtitle: true,
    hasPhoto: false,
    state: "deleted",
    stats: { code: "DT", bed: "二大床", count: "22", operation: "住宿" },
  },
  {
    id: "room-4",
    ribbon: "72",
    name: "亞歷山大",
    hasSubtitle: true,
    hasPhoto: false,
    state: "deleted",
    stats: { code: "DT", bed: "二大床", count: "22", operation: "住宿" },
  },
  {
    id: "room-5",
    ribbon: "921",
    name: "嗚啦啦",
    hasSubtitle: false,
    hasPhoto: true,
    photoUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop",
    state: "deleted",
    stats: { code: "DT", bed: "二大床", count: "22", operation: "住宿" },
  },
  {
    id: "room-6",
    ribbon: "878",
    name: "嘿吼嘿吼",
    hasSubtitle: true,
    hasPhoto: false,
    state: "deleted",
    stats: { code: "DT", bed: "二大床", count: "22", operation: "住宿" },
  },
];

function buildPhotoArea(card) {
  const wrap = document.createElement("button");
  wrap.type = "button";
  wrap.className =
    "relative w-40 h-40 shrink-0 rounded-full mx-auto cursor-pointer";
  wrap.dataset.roomTypePhotoTrigger = card.id;
  wrap.dataset.modalOpen = "modalRoomTypePhotoGalleryBackdrop";
  wrap.setAttribute("aria-label", "編輯" + card.name + "照片");

  if (card.hasPhoto) {
    // 有照片才疊右下角「更換照片」小圓 badge；無照片時 Figma 只有單一
    // image-empty 圖示，沒有 badge（2026-07-31 使用者截圖覆核訂正）。
    wrap.innerHTML = '<img src="' + card.photoUrl + '" alt="" class="w-full h-full rounded-full object-cover" />';
    const badge = document.createElement("span");
    badge.className =
      "absolute bottom-1 right-1 w-11 h-11 rounded-full bg-white border border-surface-default flex items-center justify-center";
    badge.innerHTML = '<img src="./assets/icons/image.svg" alt="" class="w-6 h-6" />';
    wrap.appendChild(badge);
  } else {
    wrap.innerHTML =
      '<span class="w-full h-full rounded-full border border-border-focus bg-white flex items-center justify-center">' +
      '<img src="./assets/icons/image-empty.svg" alt="" class="w-[74px] h-[74px]" />' +
      "</span>";
  }
  return wrap;
}

function buildActionButtons(card) {
  const row = document.createElement("div");
  row.className = "flex flex-wrap justify-center gap-3";

  function btn(cls, icon, label, extra) {
    const b = document.createElement("button");
    b.type = "button";
    b.className =
      "room-type-btn-" +
      cls +
      " inline-flex items-center gap-2 h-9 px-4 rounded-full border text-base text-text-default cursor-pointer";
    if (extra) Object.assign(b, extra);
    b.innerHTML = '<img src="./assets/icons/' + icon + '.svg" alt="" class="w-6 h-6" /><span>' + label + "</span>";
    return b;
  }

  if (card.state === "active") {
    const modify = btn("modify", "edit", "修改");
    modify.classList.add("border-brand-400");
    modify.dataset.modalOpen = "modalRoomTypeEditBackdrop";
    row.appendChild(modify);

    const duplicate = btn(
      "duplicate",
      "duplicate",
      "複製",
    );
    duplicate.classList.add("border-[var(--color-accent-linear-function-button-duplication)]");
    row.appendChild(duplicate);

    // 停用（原「刪除」，2026-07-31 使用者改名+換色）：icon 換
    // icons/suspend-outline、文字/icon 由紅改黑，邊框/漸層維持原本的粉色不變
    const disable = btn("delete", "suspend-outline", "停用");
    disable.classList.add("border-[var(--color-accent-linear-function-button-delete)]");
    disable.dataset.cardAction = "disable";
    disable.dataset.cardId = card.id;
    row.appendChild(disable);
  } else {
    const view = btn("view", "preview-outline", "查看");
    view.classList.add("border-border-disabled");
    view.dataset.modalOpen = "modalRoomTypeViewBackdrop";
    row.appendChild(view);

    // 啟用（原「還原」，2026-07-31 使用者改名+換色）：icon 換
    // icons/video-play、icon 由綠改黑（文字本來就是黑），邊框/漸層維持原本的
    // 淺綠不變
    const enable = btn("restore", "video-play", "啟用");
    enable.classList.add("border-[var(--color-accent-light-green)]");
    enable.dataset.cardAction = "enable";
    enable.dataset.cardId = card.id;
    row.appendChild(enable);
  }
  return row;
}

function buildStatTable(card) {
  const wrap = document.createElement("div");
  wrap.className = "overflow-x-auto";
  wrap.innerHTML =
    '<table class="room-type-stat-table w-full border-collapse">' +
    "<thead><tr>" +
    '<th class="px-2 py-2 text-xl text-text-default font-normal border-b border-border-disabled">代號</th>' +
    '<th class="px-2 py-2 text-xl text-text-default font-normal border-b border-border-disabled">床型</th>' +
    '<th class="px-2 py-2 text-xl text-text-default font-normal border-b border-border-disabled">間數</th>' +
    '<th class="px-2 py-2 text-xl text-text-default font-normal border-b border-border-disabled">營運方式</th>' +
    "</tr></thead><tbody><tr>" +
    '<td class="px-2 py-2 text-base text-text-default">' + card.stats.code + "</td>" +
    '<td class="px-2 py-2 text-base text-text-default">' + card.stats.bed + "</td>" +
    '<td class="px-2 py-2 text-base text-text-default">' + card.stats.count + "</td>" +
    '<td class="px-2 py-2 text-base text-text-default">' + card.stats.operation + "</td>" +
    "</tr></tbody></table>";
  return wrap;
}

// Ribbon 三角色塊：path/漸層座標取自 get_screenshot(SVG) 對節點 2137:100899
// 的精確匯出（2026-07-31 使用者覆核訂正，取代原本 clip-path 三角形近似）。
// 8px 邊距（Figma bounds x:8,y:8，非貼齊卡片邊緣）用外層 wrapper 的
// top-2 left-2 還原；圓角尖端直接來自 path 本身，不需要額外 CSS 圓角。
// 漸層終點色跟卡片狀態連動（2026-07-31 使用者訂正，SVG 覆核 2137:101205
// 已刪除卡片確認）：使用中（有「修改」按鈕）= Brand-100 淡橘；
// 已刪除（有「查看」按鈕）= Neutral-100 淡灰。
function buildRibbon(card) {
  const gradientId = "roomTypeRibbonGradient-" + card.id;
  const stopColor = card.state === "active" ? "var(--color-brand-100)" : "var(--color-neutral-100)";
  const wrap = document.createElement("div");
  wrap.className = "absolute top-2 left-2 w-[87.25px] h-[58px]";
  wrap.innerHTML =
    '<svg width="87.25" height="58" viewBox="0 0 87.25 58" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M60.7647 0.000276299C68.6854 0.000312315 71.7897 10.2777 65.1934 14.6626L12.4288 49.7379C7.11164 53.2725 0 49.4604 0 43.0757V8.00004C0 3.58175 3.58174 1.62863e-05 8.00004 3.63764e-05L60.7647 0.000276299Z" fill="url(#' +
    gradientId +
    ')"/>' +
    "<defs><linearGradient id=\"" +
    gradientId +
    '" x1="87.25" y1="42.8683" x2="0" y2="42.8683" gradientUnits="userSpaceOnUse">' +
    '<stop stop-color="' +
    stopColor +
    '"/>' +
    '<stop offset="1" stop-color="var(--color-neutral-0)"/>' +
    "</linearGradient></defs>" +
    "</svg>" +
    '<span class="absolute top-[3px] left-[7px] text-xl text-text-default">' +
    card.ribbon +
    "</span>";
  return wrap;
}

function buildCard(card) {
  const el = document.createElement("div");
  el.className =
    "room-type-card relative flex flex-col gap-4 rounded-xl border border-border-focus bg-white p-4";

  el.appendChild(buildRibbon(card));

  el.appendChild(buildPhotoArea(card));

  const nameWrap = document.createElement("div");
  nameWrap.className = "flex flex-col items-center gap-2 text-center";
  const name = document.createElement("h3");
  name.className = "text-2xl font-semibold text-text-default";
  name.textContent = card.name;
  nameWrap.appendChild(name);
  if (card.hasSubtitle) {
    const subtitle = document.createElement("p");
    subtitle.className = "text-base text-text-default";
    subtitle.textContent = "房價跟隨：XYZ !!! 222 XYZ";
    nameWrap.appendChild(subtitle);
  }
  el.appendChild(nameWrap);

  el.appendChild(buildActionButtons(card));

  // 統計列（分隔線+table）永遠貼齊卡片底部：Figma 6 張卡實測全部同一總高度
  // 446px（get_screenshot 逐張比對像素高度一致，先前 spec 誤記「無副標
  // 412px 變矮」是錯的，已訂正），缺副標騰出的空間由這段的 mt-auto 吸收，
  // 不是整張卡變矮。card list 是 CSS grid，同一列卡片預設 stretch 等高，
  // 這裡才有多餘高度可以讓 mt-auto 生效。
  const bottomSection = document.createElement("div");
  bottomSection.className = "flex flex-col gap-4 mt-auto";
  const divider = document.createElement("hr");
  divider.className = "border-border-disabled";
  bottomSection.appendChild(divider);
  bottomSection.appendChild(buildStatTable(card));
  el.appendChild(bottomSection);

  return el;
}

// 啟用/停用狀態篩選（2026-07-31 使用者拍板新增，figma-go node 2139:105271）：
// 預設顯示啟用中卡片，tab 切換即時篩選，讀 card.state 當下的值（不是初始值），
// 所以卡片本身的停用/啟用切換會立刻反映在篩選結果上。
let currentStatusFilter = "active";

// 篩選結果為空狀態文案（figma-go node 2139:105859）：20px 一行文字，靠左，
// 上下各 24px padding，位置取代卡片列表本身。
const EMPTY_FILTER_MESSAGE = {
  active: "沒有任何啟用中的卡片",
  deleted: "沒有任何停用中的卡片",
};

// tab 數量後綴（figma-go node 2140:106117，文案「啟用（2）」「停用（8）」）：
// 全形括號，隨 ROOM_TYPE_CARDS 當下狀態動態統計，每次 renderCardList() 都
// 重新計算，卡片停用/啟用切換後立刻反映最新數字，不是 Figma 示範的固定值。
function updateStatusFilterCounts() {
  const activeCount = ROOM_TYPE_CARDS.filter((card) => card.state === "active").length;
  const deletedCount = ROOM_TYPE_CARDS.filter((card) => card.state === "deleted").length;
  const activeEl = document.getElementById("roomTypeActiveCount");
  const deletedEl = document.getElementById("roomTypeDeletedCount");
  if (activeEl) activeEl.textContent = "（" + activeCount + "）";
  if (deletedEl) deletedEl.textContent = "（" + deletedCount + "）";
}

function renderCardList() {
  const list = document.getElementById("roomTypeCardList");
  if (!list) return;
  updateStatusFilterCounts();
  list.innerHTML = "";
  const filtered = ROOM_TYPE_CARDS.filter((card) => card.state === currentStatusFilter);
  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "col-span-full text-xl text-text-default py-6";
    empty.textContent = EMPTY_FILTER_MESSAGE[currentStatusFilter];
    list.appendChild(empty);
    return;
  }
  filtered.forEach((card) => list.appendChild(buildCard(card)));
}

function initStatusFilterTabs() {
  const group = document.getElementById("roomTypeStatusFilter");
  if (!group) return;
  group.addEventListener("click", (e) => {
    const tab = e.target.closest("[data-status-filter]");
    if (!tab) return;
    currentStatusFilter = tab.dataset.statusFilter;
    group.querySelectorAll(".member-data-filter-tab").forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
    renderCardList();
  });
}

function initReloadButton() {
  const btn = document.getElementById("roomTypeReloadBtn");
  if (!btn) return;
  btn.addEventListener("click", () => location.reload());
}

// 停用/啟用切換（2026-07-31 使用者拍板新增行為）：純前端 in-memory 狀態，
// 點擊後立刻切換卡片狀態並整份重繪，prototype 階段尚未接後端 API。
function initCardActionToggle() {
  const list = document.getElementById("roomTypeCardList");
  if (!list) return;
  list.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-card-action]");
    if (!btn) return;
    const card = ROOM_TYPE_CARDS.find((c) => c.id === btn.dataset.cardId);
    if (!card) return;
    card.state = btn.dataset.cardAction === "disable" ? "deleted" : "active";
    renderCardList();
  });
}

export function initRoomType() {
  initStatusFilterTabs();
  renderCardList();
  initReloadButton();
  initCardActionToggle();
}
