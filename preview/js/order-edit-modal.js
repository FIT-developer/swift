// 訂單修改 modal module（自 order-modals.js 拆出，Session 87）
// body = partials/room-booking-sections.html [A]-[E] 注入 + 四項差異；
// 規格 components/order-edit-modal.md。開啟接線在 orchestrator 的 op-menu。
import { initRoomBookingBehaviors } from "./room-booking-behaviors.js";

export function initOrderEditModal() {
  var orderEditBuildPromise = null;
  function buildOrderEditModalBody() {
    if (orderEditBuildPromise) return orderEditBuildPromise;
    orderEditBuildPromise = fetch("./partials/room-booking-sections.html")
      .then(function (res) {
        if (!res.ok) {
          throw new Error("partial not found: room-booking-sections");
        }
        return res.text();
      })
      .then(function (html) {
        var modal = document.getElementById("modalOrderEditBackdrop");
        var body = modal && modal.querySelector("[data-order-edit-body]");
        if (!body) return;
        var tpl = document.createElement("template");
        tpl.innerHTML = html;
        var wrapper = tpl.content.firstElementChild;
        if (!wrapper) return;
        Array.from(wrapper.children).forEach(function (section) {
          body.appendChild(section);
        });
        // [A] 差異：標題「空房與庫存查詢」改「庫存」；modal 內只有庫存模式
        // （mode 切換/Excel/棟別 chips 由 CSS 隱藏，init 後程式切到庫存模式）
        var aHeader = body.children[0]
          ? body.children[0].querySelector(".rb-accordion-header span")
          : null;
        if (aHeader) aHeader.textContent = "庫存";
        // [B] 差異 1：移除客戶類型 toggle（會員類型在訂單生成時已定，modal 內無切換路徑）
        var customerToggle = body.querySelector(".customer-toggle");
        if (customerToggle) customerToggle.remove();
        // [B] 差異 2：cart 區塊頂部加「訂單編號」列
        var cartBlock = body.children[1];
        if (cartBlock) {
          cartBlock.insertAdjacentHTML(
            "afterbegin",
            '<p class="text-base text-text-default mb-4">訂單編號：BXY00322212AZZ</p>',
          );
        }
        // [D] 差異：header 清除右邊加「還原」（範圍只限訂房資料區塊，行為後端實作）
        var orderDataClear = body.querySelector("#orderDataClear");
        if (orderDataClear) {
          orderDataClear.insertAdjacentHTML(
            "afterend",
            '<button type="button" class="flex items-center gap-2 cursor-pointer text-base text-text-default" aria-label="還原訂房資料區塊">' +
              '<img src="./assets/icons/restore.svg" alt="" class="w-4 h-4" />' +
              "<span>還原</span></button>",
          );
        }
        initRoomBookingBehaviors(body);
        // [B] 購物車內容 rehydrate（同 landing showSubPage 流程）
        if (typeof window.renderPurchaseAddonCart === "function") {
          window.renderPurchaseAddonCart();
        }
        // init 後把 [A] 切到庫存模式（月曆按鈕 + 庫存表 + 訂/餘/保）
        var btnInventory = body.querySelector("#btnInventory");
        if (btnInventory) btnInventory.click();
      });
    return orderEditBuildPromise;
  }

  return { build: buildOrderEditModalBody };
}
