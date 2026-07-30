// 最小可用 toast（components/lodging-branch-suneditor.md「Toast 元件」，
// 2026-07-29 拍板）：bg Color/Neutral/700、白字、畫面下方短暫顯示後自動
// 消失，不阻塞操作。目前只有 lodging-notice-card.js 使用；之後若其他頁面
// 需要 toast，可直接複用這個 module，不必重新設計。

let hideTimer = null;

export function showToast(message) {
  var el = document.getElementById("lodgingToast");
  if (!el) {
    el = document.createElement("div");
    el.id = "lodgingToast";
    el.className = "lodging-toast";
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("is-visible");
  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = setTimeout(function () {
    el.classList.remove("is-visible");
  }, 2500);
}
