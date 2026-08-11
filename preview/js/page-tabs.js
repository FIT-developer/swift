// 共用 page tab chips module（topbar #pageTabsInline）
// 舊 SPA（landing 內 openPage/renderChips state machine）允許複數 tab 共存、
// 可關閉；拆頁後各頁只 render 自己的靜態 chip，複數 tab 行為遺失。
// 本 module 以 sessionStorage 保存「已開啟頁面清單」，三頁載入時 render
// 全部已開 tab，當前頁標 active，恢復舊版行為：
// - 點 chip 本體 -> 導向該頁
// - 點關閉鈕 -> 從清單移除；關閉當前頁時跳最近剩餘 tab（優先右邊、
//   退回左邊），全部關閉回 landing（dashboard）
// - landing 本身不是 tab，只 render 既有清單（皆為 inactive）
var STORAGE_KEY = "swift-open-page-tabs";
var TAB_PAGES = {
  "room-booking.html": "房間預定",
  "order-processing.html": "訂單處理",
  "system-basic.html": "系統基本",
  "account-permission.html": "帳號及權限",
  "lodging-info.html": "民宿資料",
  "room-type.html": "房型",
  "purchase-addon.html": "加購商品",
};

function readTabs() {
  try {
    var raw = sessionStorage.getItem(STORAGE_KEY);
    var list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) return [];
    // 過濾未登記或已改名的頁面，避免 stale 資料殘留
    return list.filter(function (page) {
      return Object.prototype.hasOwnProperty.call(TAB_PAGES, page);
    });
  } catch (e) {
    return [];
  }
}

function writeTabs(list) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    // sessionStorage 不可用（如隱私模式限制）時 tab 僅存活於當頁，不中斷頁面
  }
}

export function initPageTabs() {
  var container = document.getElementById("pageTabsInline");
  if (!container) return;

  var current = location.pathname.split("/").pop();
  var tabs = readTabs();
  if (
    Object.prototype.hasOwnProperty.call(TAB_PAGES, current) &&
    tabs.indexOf(current) === -1
  ) {
    tabs.push(current);
    writeTabs(tabs);
  }

  function render() {
    container.innerHTML = "";
    tabs.forEach(function (page) {
      var tab = document.createElement("div");
      tab.className = "page-tab" + (page === current ? " active" : "");

      var link = document.createElement("a");
      link.href = "./" + page;
      link.className = "page-tab-link";
      link.textContent = TAB_PAGES[page];

      var closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.className = "page-tab-close";
      closeBtn.setAttribute("aria-label", "關閉");
      var closeImg = document.createElement("img");
      closeImg.src = "./assets/icons/close.svg";
      closeImg.alt = "";
      closeImg.className = "w-6 h-6";
      closeBtn.appendChild(closeImg);

      // chip padding 區也可點擊導頁（anchor 只涵蓋文字），與舊版行為一致
      tab.addEventListener("click", function (e) {
        if (closeBtn.contains(e.target) || link.contains(e.target)) return;
        if (page !== current) location.href = "./" + page;
      });
      closeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        closeTab(page);
      });

      tab.appendChild(link);
      tab.appendChild(closeBtn);
      container.appendChild(tab);
    });
  }

  function closeTab(page) {
    var idx = tabs.indexOf(page);
    if (idx === -1) return;
    tabs.splice(idx, 1);
    writeTabs(tabs);
    if (page === current) {
      var next = tabs[Math.min(idx, tabs.length - 1)];
      location.href = next ? "./" + next : "./landing.html";
      return;
    }
    render();
  }

  render();
}
