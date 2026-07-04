// 共用 partial 載入器（規範 specs/page-architecture.md）
// - 掃描 [data-partial]，fetch partials/{name}.html 注入
// - 全部完成後 dispatch "partials:loaded"（頁面 module 在此之後綁定行為）
export async function loadPartials(root) {
  var scope = root || document;
  var mounts = Array.from(scope.querySelectorAll("[data-partial]"));
  await Promise.all(
    mounts.map(async function (mount) {
      var name = mount.dataset.partial;
      var res = await fetch("./partials/" + name + ".html");
      if (!res.ok) {
        throw new Error("partial not found: " + name);
      }
      var html = await res.text();
      var tpl = document.createElement("template");
      tpl.innerHTML = html;
      mount.replaceWith(tpl.content);
    }),
  );
  markActivePage();
  document.dispatchEvent(new CustomEvent("partials:loaded"));
}

// aside 選單 active 態：依 <body data-page="{選單項目文字}"> 標示當前頁
// Stage 1d：獨立頁項目改為 <a>（如 訂單處理），selector 需同時涵蓋 div 與 a；
// 標示同時展開所屬分類（新頁面沒有 landing 的 accordion JS，收合會看不到 active）
function markActivePage() {
  var page = document.body.dataset.page;
  if (!page) return;
  document
    .querySelectorAll(".menu-category .accordion-trigger + div > :is(div, a)")
    .forEach(function (item) {
      if (item.textContent.trim() === page) {
        item.classList.add("sub-item-selected");
        var submenu = item.parentElement;
        if (submenu) submenu.classList.remove("hidden");
        // 同步 accordion icon 展開態（page-shell 的收合行為依此 class）
        var trigger = submenu ? submenu.previousElementSibling : null;
        var icon = trigger ? trigger.querySelector(".accordion-icon") : null;
        if (icon) icon.classList.add("open");
      }
    });
}
