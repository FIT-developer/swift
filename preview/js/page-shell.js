// 新頁面共用 page shell 行為 module（Stage 2，specs/page-architecture.md）
// 內容自 landing.html 對應 IIFE 原樣搬出：aside accordion 收合、
// 「收合」全部選單、mobile drawer 開關（menu button / backdrop / close / Esc）。
// landing 保留 inline 版 - 過渡性複製（計畫內），Stage 3 收斂去重。
// 未搬項（present-unbound，Stage 3）：foldBtn/expandBtn 桌面收折、
// role filter（data-role-select）、mobile/desktop function icons（公告/訊息/
// 會員安全管理 - 其 target modal 只在 landing）。
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

  // Mobile sidebar drawer 開關
  var mobileMenuBtn = document.getElementById("mobileMenuBtn");
  var mobileSidebarBackdrop = document.getElementById(
    "mobileSidebarBackdrop",
  );
  var sidebar = document.getElementById("sidebar");
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
