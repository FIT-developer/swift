// 會員資料 / 合約公司 modal module（自 order-modals.js 拆出，Session 87）
// 開啟觸發點在訂單修改 modal body（runtime 注入的 partial）內，
// script-load 時尚不存在，必須 document 委派。
// 巢狀疊層（修改 -> 會員資料 -> 合約公司）由 openModal 動態 z-index 處理。
export function initMemberDataModal(modalApi) {
  var openModal = modalApi.openModal;

  document.addEventListener("click", function (e) {
    var dataExistsTrigger = e.target.closest(
      "[data-data-exists-trigger]",
    );
    if (dataExistsTrigger) {
      e.preventDefault();
      openModal("modalMemberDataBackdrop", dataExistsTrigger);
      return;
    }
    var contractTrigger = e.target.closest(
      "[data-change-contract-company-trigger]",
    );
    if (contractTrigger) {
      e.preventDefault();
      openModal("modalChangeContractCompanyBackdrop", contractTrigger);
      return;
    }
  });

  (function () {
    var modal = document.getElementById("modalMemberDataBackdrop");
    if (!modal) return;

    // nation-group (臺灣 / 外籍) -> toggle 地址變體
    // Stage 2 修正：不再依賴 initOrderProcessing(document) 涵蓋 -
    // room-booking.html 沒有該 module。此處自行綁定，data-nation-init
    // guard 防止與 order-processing.js 的共用綁定重複（兩邊同 guard）
    modal.querySelectorAll(".nation-group").forEach(function (group) {
      if (group.dataset.nationInit) return;
      group.dataset.nationInit = "1";
      function apply() {
        var checked = group.querySelector(".nation-radio:checked");
        var isForeign = checked && checked.value === "foreign";
        group
          .querySelectorAll(".nation-foreign-only")
          .forEach(function (el) {
            el.classList.toggle("hidden", !isForeign);
          });
        group
          .querySelectorAll('[data-addr-mode="taiwan"]')
          .forEach(function (el) {
            el.classList.toggle("hidden", isForeign);
          });
        group
          .querySelectorAll('[data-addr-mode="foreign"]')
          .forEach(function (el) {
            el.classList.toggle("hidden", !isForeign);
          });
      }
      group.querySelectorAll(".nation-radio").forEach(function (r) {
        r.addEventListener("change", apply);
      });
      apply();
    });

    // honorific (先生 / 小姐) follow 性別 radio
    (function () {
      var radios = modal.querySelectorAll(
        '[data-gender-radio="memberData"]',
      );
      var label = modal.querySelector(
        '[data-honorific-panel="memberData"]',
      );
      if (!radios.length || !label) return;
      function apply() {
        var checked = modal.querySelector(
          '[data-gender-radio="memberData"]:checked',
        );
        if (!checked) return;
        label.textContent = checked.value === "F" ? "小姐" : "先生";
      }
      radios.forEach(function (r) {
        r.addEventListener("change", apply);
      });
      apply();
    })();

    // 會員身份 radio (一般 / 合約) -> toggle panel
    (function () {
      var radios = modal.querySelectorAll(".member-data-status-radio");
      var panels = modal.querySelectorAll("[data-member-status-panel]");
      if (!radios.length) return;
      function apply() {
        var checked = modal.querySelector(
          ".member-data-status-radio:checked",
        );
        var key = checked ? checked.value : "";
        panels.forEach(function (p) {
          p.classList.toggle(
            "hidden",
            p.dataset.memberStatusPanel !== key,
          );
        });
      }
      radios.forEach(function (r) {
        r.addEventListener("change", apply);
      });
      apply();
    })();

    // 訂房記錄 - Title pill chip toggle (單選；click -> 切到 is-selected 黃底)
    (function () {
      var group = modal.querySelector("[data-member-data-chip-group]");
      if (!group) return;
      group
        .querySelectorAll(".member-data-title-chip")
        .forEach(function (chip) {
          chip.addEventListener("click", function () {
            group
              .querySelectorAll(".member-data-title-chip")
              .forEach(function (c) {
                c.classList.toggle("is-selected", c === chip);
              });
          });
        });
    })();

    // 訂房記錄 - Filter tab toggle (單選；click -> 切到 is-active 底線+semibold)
    (function () {
      var group = modal.querySelector("[data-member-data-filter-group]");
      if (!group) return;
      group
        .querySelectorAll(".member-data-filter-tab")
        .forEach(function (tab) {
          tab.addEventListener("click", function () {
            group
              .querySelectorAll(".member-data-filter-tab")
              .forEach(function (t) {
                t.classList.toggle("is-active", t === tab);
              });
          });
        });
    })();
  })();
}
