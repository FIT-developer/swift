// 帳號及權限 頁面行為（specs/pages/account-permission.md,
// components/account-accordion.md）
// - accordion 開關（關=up / 開=down, 全站慣例）
// - 模式切換 修改/紀錄/刪除（一次僅一顆 active）
// - 分館清單 展開/收摺（>=3 間才有 bar）
// - 密碼 eye toggle（icon 反映當前狀態）
// - 修改面板 清除
// - 重整 = 刷新當前頁
export function initAccountPermission() {
  // 重整
  var reloadBtn = document.getElementById("apReloadBtn");
  if (reloadBtn) {
    reloadBtn.addEventListener("click", function () {
      window.location.reload();
    });
  }

  // accordion 開關
  var header = document.getElementById("apAccordionHeader");
  var content = document.getElementById("apAccordionContent");
  var icon = document.getElementById("apAccordionIcon");
  if (header && content && icon) {
    header.addEventListener("click", function () {
      var opening = content.classList.contains("ap-hidden");
      content.classList.toggle("ap-hidden");
      icon.src = opening
        ? "./assets/icons/down.svg"
        : "./assets/icons/up.svg";
      icon.alt = opening ? "down" : "up";
    });
  }

  // 模式切換
  var panels = {
    edit: document.getElementById("apPanelEdit"),
    records: document.getElementById("apPanelRecords"),
    delete: document.getElementById("apPanelDelete"),
  };
  var modeBtns = document.querySelectorAll(".ap-mode-btn");
  modeBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var mode = btn.getAttribute("data-ap-mode");
      modeBtns.forEach(function (b) {
        b.classList.toggle("ap-mode-active", b === btn);
      });
      Object.keys(panels).forEach(function (key) {
        if (panels[key]) {
          panels[key].classList.toggle("ap-hidden", key !== mode);
        }
      });
    });
  });

  // 分館清單 展開/收摺
  var branchToggle = document.getElementById("apBranchToggle");
  if (branchToggle) {
    branchToggle.addEventListener("click", function () {
      var expanded = branchToggle.getAttribute("aria-expanded") === "true";
      var next = !expanded;
      branchToggle.setAttribute("aria-expanded", next ? "true" : "false");
      document
        .querySelectorAll(".ap-branch-extra")
        .forEach(function (row) {
          row.classList.toggle("ap-hidden", !next);
        });
      branchToggle
        .querySelector("[data-branch-more]")
        .classList.toggle("ap-hidden", next);
      branchToggle
        .querySelector("[data-branch-less]")
        .classList.toggle("ap-hidden", !next);
      var img = branchToggle.querySelector("img");
      img.src = next
        ? "./assets/icons/outline-minus.svg"
        : "./assets/icons/outline-plus.svg";
      img.alt = next ? "collapse" : "expand";
    });
  }

  // 密碼 eye toggle（eye-open = 顯示中 / eye-close = 隱藏中）
  var pwdInput = document.getElementById("apPwdInput");
  var pwdEye = document.getElementById("apPwdEye");
  if (pwdInput && pwdEye) {
    pwdEye.addEventListener("click", function () {
      var reveal = pwdInput.type === "password";
      pwdInput.type = reveal ? "text" : "password";
      var img = pwdEye.querySelector("img");
      img.src = reveal
        ? "./assets/icons/eye-open.svg"
        : "./assets/icons/eye-close.svg";
      img.alt = reveal ? "eye-open" : "eye-close";
    });
  }

  // 修改面板 清除 = 清空 inputs
  var clearBtn = document.getElementById("apEditClearBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      document
        .querySelectorAll(
          "#apPanelEdit input, #apPanelEdit textarea"
        )
        .forEach(function (el) {
          el.value = "";
        });
    });
  }
}
