// 訂單/房間預定頁 modal orchestrator（Session 87 拆分後）
// 開關核心共用 js/modal-controller.js；四個 modal 各自成 module：
//   order-edit-modal.js（訂單修改 body 注入）/ purchase-addon-modal.js（加購）
//   / member-data-modal.js（會員資料+合約公司）/ order-summary-modal.js（訂單明細）
// 本檔保留：modalApi 組裝（beforeOpen reset 分派）、op 選單接線（訂單/簡訊/修改）、
// 到店「確定」關閉、訂房明細編輯（lock/clear）。
// 對頁面介面不變：initOrderModals() 回傳 { openModal, closeModal }
// （rb 頁餵給 initArrivalMethodModal）。
import { createModalController } from "./modal-controller.js";
import { initPurchaseAddonModal } from "./purchase-addon-modal.js";
import { initOrderSummaryModal } from "./order-summary-modal.js";
import { initMemberDataModal } from "./member-data-modal.js";
import { initOrderEditModal } from "./order-edit-modal.js";

export function initOrderModals() {
  function setRoomEditLocked(locked) {
    var modal = document.getElementById("modalRoomEditBackdrop");
    if (!modal) return;
    var toggle = modal.querySelector("[data-room-edit-lock-toggle]");
    var icon = modal.querySelector("[data-room-edit-lock-icon]");
    if (toggle) {
      toggle.dataset.locked = locked ? "true" : "false";
      toggle.setAttribute("aria-pressed", locked ? "true" : "false");
      toggle.classList.toggle("text-brand-active", locked);
      toggle.classList.toggle("text-status-positive", !locked);
    }
    if (icon) {
      icon.classList.toggle("icon-mask-lock", locked);
      icon.classList.toggle("icon-mask-unlock", !locked);
    }
    modal.querySelectorAll(".room-edit-price-input").forEach(function (input) {
      input.disabled = locked;
      input.classList.toggle("bg-border-default", locked);
      input.classList.toggle("text-text-secondary", locked);
      input.classList.toggle("bg-white", !locked);
      input.classList.toggle("text-text-default", !locked);
    });
  }
  function resetRoomEditModal() {
    var modal = document.getElementById("modalRoomEditBackdrop");
    if (!modal) return;
    setRoomEditLocked(true);
    modal.querySelectorAll(".room-edit-price-input").forEach(function (input) {
      input.value = "1999";
    });
    var textarea = modal.querySelector("[data-room-edit-textarea]");
    if (textarea) textarea.value = "我是 textarea\n- 內容\n- 內容";
  }

  // beforeOpen 於 open 時才呼叫，晚於下方子 module 賦值，late-bind 安全
  var purchaseAddon;
  var orderSummary;
  var modalApi = createModalController({
    beforeOpen: function (id) {
      if (id === "modalRoomEditBackdrop") resetRoomEditModal();
      if (id === "modalPurchaseAddonBackdrop") purchaseAddon.reset();
      if (id === "modalOrderSummaryBackdrop") orderSummary.reset();
    },
  });
  var openModal = modalApi.openModal;
  var closeModal = modalApi.closeModal;

  purchaseAddon = initPurchaseAddonModal();
  orderSummary = initOrderSummaryModal(modalApi);
  initMemberDataModal(modalApi);
  var orderEdit = initOrderEditModal();

  // 訂單處理頁：狀態 pill 下拉選單動作 -> modal 接線
  // 選單自身的收合由 order-processing.js 的 item listener 處理。
  document.addEventListener("click", function (e) {
    var opMenuItem = e.target.closest("[data-op-menu-action]");
    if (!opMenuItem) return;
    var opAction = opMenuItem.dataset.opMenuAction;
    if (opAction === "訂單") {
      // variant 與訂單實際狀態的對應留給後端，demo 一律開 unpaid
      orderSummary.setVariant("unpaid");
      openModal("modalOrderSummaryBackdrop", opMenuItem);
    } else if (opAction === "簡訊") {
      openModal("modalSmsBackdrop", opMenuItem);
    } else if (opAction === "修改") {
      // body 首次以 fetch 注入 partial（async），完成後才開 modal
      orderEdit.build().then(function () {
        openModal("modalOrderEditBackdrop", opMenuItem);
      });
    }
    // 連結 / 複製 / 取消：後端功能，前端僅收合選單
  });

  // 到店方式 modal footer「確定」：landing 版由 arrival IIFE 的 confirm
  // handler 負責 commit（寫回 trigger label）+ 關閉；該 IIFE（chip 切換 /
  // swiper）屬 Stage 2 範圍未搬。本頁 chips 不可切換、commit 無實質意義，
  // 但「確定 = 關閉」行為必須等價，此處補上（取消鈕本來就是 modal-close-btn）
  document.addEventListener("click", function (e) {
    if (!e.target.closest('[data-am-action="confirm"]')) return;
    closeModal("modalArrivalMethodBackdrop");
  });

  // Room booking edit modal state
  (function () {
    var modal = document.getElementById("modalRoomEditBackdrop");
    if (!modal) return;
    var lock = modal.querySelector("[data-room-edit-lock-toggle]");
    lock &&
      lock.addEventListener("click", function () {
        setRoomEditLocked(lock.dataset.locked !== "true");
      });
    var clear = modal.querySelector("[data-room-edit-clear]");
    clear &&
      clear.addEventListener("click", function () {
        modal
          .querySelectorAll(".room-edit-price-input:not(:disabled)")
          .forEach(function (input) {
            input.value = "";
          });
        var textarea = modal.querySelector("[data-room-edit-textarea]");
        if (textarea) textarea.value = "";
      });
    resetRoomEditModal();
  })();

  // 供其他 module 使用同一套開關（單一來源），例如
  // arrival-method-modal.js 的確定 commit 後關閉
  return { openModal: openModal, closeModal: closeModal };
}
