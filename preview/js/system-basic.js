// 系統基本頁行為 module（specs/pages/system-basic.md）
// 當日網路訂房：toggle off -> 終止時間 input disabled（灰底，沿用
// room-booking lock toggle 的 bg-border-default 慣例）；on -> 恢復可輸入
export function initSystemBasic() {
  var toggle = document.querySelector("[data-sb-sameday-toggle]");
  var input = document.querySelector("[data-sb-sameday-input]");
  if (!toggle || !input) return;

  function applySamedayState() {
    var on = toggle.checked;
    input.disabled = !on;
    input.classList.toggle("bg-white", on);
    input.classList.toggle("bg-border-default", !on);
  }

  toggle.addEventListener("change", applySamedayState);
  applySamedayState();
}
