// 新頁面共用 page shell 行為 module（Stage 2，specs/page-architecture.md）
// 內容自 landing.html 對應 IIFE 搬出：aside accordion 收合、
// 「收合」全部選單、desktop 收折/展開、mobile drawer 開關
// （menu button / backdrop / close / Esc）。
// landing 保留 inline 版 - 過渡性複製（計畫內），Stage 3 收斂去重。
// 新頁沒有公告/訊息/會員安全管理 modal；對應 function icons 會隱藏，
// 避免留下可見但無反應的控制。
export function initPageShell() {
  // aside accordion（分類展開/收合）
  document.querySelectorAll(".accordion-trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var content = trigger.nextElementSibling;
      var icon = trigger.querySelector(".accordion-icon");
      if (!content || !content.classList.contains("hidden")) {
        if (content) content.classList.add("hidden");
        icon && icon.classList.remove("open");
        return;
      }
      if (content.classList.contains("hidden")) {
        content.classList.remove("hidden");
        icon && icon.classList.add("open");
      }
    });
  });

  // 收合全部（系統操作 標題右側「收合」）
  document.querySelectorAll(".menu-collapse-all").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".accordion-trigger")
        .forEach(function (trigger) {
          var content = trigger.nextElementSibling;
          var icon = trigger.querySelector(".accordion-icon");
          if (content) content.classList.add("hidden");
          if (icon) icon.classList.remove("open");
        });
    });
  });

  // Menu role filter (飯店 vs 總部)
  (function () {
    function applyRole(hq) {
      document.querySelectorAll('[data-role="hotel"]').forEach(function (el) {
        el.style.display = hq ? "none" : "";
      });
    }
    var roleSelects = document.querySelectorAll("[data-role-select]");
    roleSelects.forEach(function (sel) {
      sel.addEventListener("change", function () {
        var hq = sel.options[sel.selectedIndex].text.indexOf("總部") !== -1;
        roleSelects.forEach(function (other) {
          if (other !== sel) other.selectedIndex = sel.selectedIndex;
        });
        applyRole(hq);
      });
    });
    if (roleSelects.length > 0) {
      var firstText = roleSelects[0].options[roleSelects[0].selectedIndex].text;
      applyRole(firstText.indexOf("總部") !== -1);
    }
  })();

  // Desktop sidebar collapse / expand
  var sidebarCompact = document.getElementById("sidebarCompact");
  var foldBtn = document.getElementById("foldBtn");
  var expandBtn = document.getElementById("expandBtn");
  var sidebar = document.getElementById("sidebar");

  function collapseSidebar() {
    if (!sidebar || !sidebarCompact) return;
    sidebar.classList.add("md-collapsed");
    sidebarCompact.classList.remove("hidden");
    sidebarCompact.classList.add("flex");
  }

  function expandSidebar() {
    if (!sidebar || !sidebarCompact) return;
    sidebar.classList.remove("md-collapsed");
    sidebarCompact.classList.add("hidden");
    sidebarCompact.classList.remove("flex");
  }

  foldBtn && foldBtn.addEventListener("click", collapseSidebar);
  expandBtn && expandBtn.addEventListener("click", expandSidebar);

  // Compact account icons reuse order-modals.js delegated [data-modal-open].
  var compactLogoutBtn = document.getElementById("compactLogoutBtn");
  var compactSwitchBtn = document.getElementById("compactSwitchBtn");
  if (compactLogoutBtn) {
    compactLogoutBtn.dataset.modalOpen = "modalLogoutBackdrop";
  }
  if (compactSwitchBtn) {
    compactSwitchBtn.dataset.modalOpen = "modalSwitchBackdrop";
  }

  // Hide controls whose target modals are landing-only.
  [
    ["desktopBulletinBtn", "modalBulletinBackdrop"],
    ["mobileBulletinBtn", "modalBulletinBackdrop"],
    ["desktopMessageBtn", "modalAdministerBackdrop"],
    ["mobileMessageBtn", "modalAdministerBackdrop"],
    ["desktopMemberBtn", "modalMemberBackdrop"],
    ["mobileMemberBtn", "modalMemberBackdrop"],
  ].forEach(function (pair) {
    var btn = document.getElementById(pair[0]);
    if (btn && !document.getElementById(pair[1])) {
      btn.classList.add("hidden");
    }
  });

  // Mobile sidebar drawer 開關
  var mobileMenuBtn = document.getElementById("mobileMenuBtn");
  var mobileSidebarBackdrop = document.getElementById(
    "mobileSidebarBackdrop",
  );
  var mobileSidebarClose = document.getElementById("mobileSidebarClose");

  function openMobileSidebar() {
    if (!sidebar || !mobileSidebarBackdrop) return;
    mobileSidebarBackdrop.classList.add("open");
    sidebar.classList.add("mobile-open");
    document.body.classList.add("mobile-sidebar-open");
  }
  function closeMobileSidebar() {
    if (!sidebar || !mobileSidebarBackdrop) return;
    mobileSidebarBackdrop.classList.remove("open");
    sidebar.classList.remove("mobile-open");
    document.body.classList.remove("mobile-sidebar-open");
  }

  mobileMenuBtn && mobileMenuBtn.addEventListener("click", openMobileSidebar);
  mobileSidebarBackdrop &&
    mobileSidebarBackdrop.addEventListener("click", closeMobileSidebar);
  mobileSidebarClose &&
    mobileSidebarClose.addEventListener("click", closeMobileSidebar);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMobileSidebar();
  });
}
