// landing.html 自己的 modal controller 實例。
// landing 沒有 order-modals.js（那是 op/rb 頁專屬），所以需要獨立建一個
// controller 給它的 session-modals（登出/更換帳號）與 topbar-modals
// （系統商公告/會員安全管理）用；兩個 modal 的 data-modal-open 觸發已經是
// topbar.html / aside.html 裡的靜態屬性，這裡不需要再手動 wiring。
// modal 內部行為（tab 切換等）交給 js/topbar-modals.js 的 initTopbarModals()，
// landing.html 的 bootstrap 會另外呼叫。
import { createModalController } from "./modal-controller.js";

export function initLandingModals() {
  createModalController();
}
