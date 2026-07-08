// topbar function-icon modals 內部行為（自 landing-modals.js 拆出，2026-07-08）
// 公告(Administer) / 管理訊息(Bulletin vendor) / 會員安全管理(Member) 三個
// modal 的 HTML 本體在 partials/topbar-modals.html，全站共用；modal 開關本身
// 由各頁既有的 modal controller 處理（landing 走 landing-modals.js 的
// createModalController()，op/rb 走 order-modals.js 的），這裡只管 modal
// 內部的互動（tab 切換 / 密碼顯示切換 / 公告列展開），三頁都要各自呼叫一次
// initTopbarModals()。
export function initTopbarModals() {
  bindTabGroup(".administer-tab", "bg-tab-yellow", "font-medium");
  bindTabGroup(".bulletin-tab", "bg-tab-yellow", "font-medium");
  bindMemberSecurityModal();
  bindBulletinRows();
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

  document.querySelectorAll(".eye-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var input = btn.parentElement.querySelector("input");
      if (input) input.type = input.type === "password" ? "text" : "password";
    });
  });
}

function bindBulletinRows() {
  document.querySelectorAll("[data-bulletin-row-toggle]").forEach(function (row) {
    row.addEventListener("click", function () {
      var detail = document.getElementById(
        "bulletinRow" + row.dataset.bulletinRowToggle + "Content",
      );
      if (detail) detail.classList.toggle("hidden");
    });
  });
}
