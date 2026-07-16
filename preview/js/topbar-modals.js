// topbar function-icon modals 內部行為（自 landing-modals.js 拆出，2026-07-08）
// 公告(Administer) / 會員安全管理(Member) 兩個
// modal 的 HTML 本體在 partials/topbar-modals.html，全站共用；modal 開關本身
// 由各頁既有的 modal controller 處理（landing 走 landing-modals.js 的
// createModalController()，op/rb 走 order-modals.js 的），這裡只管 modal
// 內部的互動（tab 切換 / 密碼顯示切換），三頁都要各自呼叫一次
// initTopbarModals()。
export function initTopbarModals() {
  bindTabGroup(".administer-tab", "bg-tab-yellow", "font-medium");
  bindMemberSecurityModal();
}

function bindTabGroup(selector, activeBgClass, activeWeightClass) {
  document.querySelectorAll(selector).forEach(function (tab) {
    tab.addEventListener("click", function () {
      document.querySelectorAll(selector).forEach(function (item) {
        item.classList.remove(activeBgClass, activeWeightClass);
        item.classList.add("bg-white");
      });
      tab.classList.remove("bg-white");
      tab.classList.add(activeBgClass, activeWeightClass);
    });
  });
}

function bindMemberSecurityModal() {
  document.querySelectorAll(".member-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      var target = tab.dataset.tab;
      document.querySelectorAll(".member-tab").forEach(function (item) {
        var isActive = item.dataset.tab === target;
        item.classList.toggle("bg-border-default", isActive);
        item.classList.toggle("bg-white", !isActive);
      });
      document.querySelectorAll(".member-panel").forEach(function (panel) {
        panel.classList.toggle("hidden", panel.id !== "memberPanel-" + target);
      });
      var origPwd = document.getElementById("memberOriginalPwd");
      if (origPwd) origPwd.classList.toggle("hidden", target === "ip");
    });
  });

  // 密碼顯示/隱藏 toggle: icon 反映「當前狀態」（2026-07-16 使用者訂正）-
  // eye-open = 資料顯示中, eye-close = 資料隱藏中（預設）。
  // Figma 原稿只畫單一態, 完整互動為預期行為, 見 components/modal.md 與
  // specs/html-conventions.md「密碼欄 eye toggle」段
  document.querySelectorAll(".eye-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var input = btn.parentElement.querySelector("input");
      var icon = btn.querySelector("img");
      if (!input) return;
      var reveal = input.type === "password";
      input.type = reveal ? "text" : "password";
      if (icon) {
        icon.src = reveal
          ? "./assets/icons/eye-open.svg"
          : "./assets/icons/eye-close.svg";
        icon.alt = reveal ? "eye-open" : "eye-close";
      }
    });
  });
}
