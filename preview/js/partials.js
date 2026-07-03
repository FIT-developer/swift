// 共用 partial 載入器（新頁面用；規範 specs/page-architecture.md）
// - 掃描 [data-partial]，fetch partials/{name}.html 注入
// - 全部完成後 dispatch "partials:loaded"（頁面 module 在此之後綁定行為）
// - landing.html 不用本檔（它的 sidebar 綁定散佈於 load-time IIFE，
//   走同步注入，見 landing.html 的 asideMount 註解）
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
function markActivePage() {
  var page = document.body.dataset.page;
  if (!page) return;
  document
    .querySelectorAll(".menu-category .accordion-trigger + div > div")
    .forEach(function (item) {
      if (item.textContent.trim() === page) {
        item.classList.add("sub-item-selected");
      }
    });
}
