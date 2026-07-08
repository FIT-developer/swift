// 新頁面共用 page shell 行為 module（Stage 2，specs/page-architecture.md）
// 內容自 landing.html 對應 IIFE 搬出：aside accordion 收合、
// 「收合」全部選單、desktop 收折/展開、mobile drawer 開關
// （menu button / backdrop / close / Esc）。
// landing 與新頁共用同一份 shell 行為。
// function icons（系統商公告/會員安全管理）在三頁一律固定顯示，不因該頁
// 沒有對應 modal 就隱藏（2026-07-08 使用者訂正：這組 icon 一直都是
// 全頁固定顯示的既定規格，Stage 2 引入的隱藏邏輯是誤加，見
// specs/progress.md Session 97）。新頁點擊沒反應是允許的狀態，跟 aside
// 選單裡本來就存在的 inert 項目同一類，不需要為此隱藏 icon。
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
