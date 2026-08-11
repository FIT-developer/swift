#!/usr/bin/env node
// Browser smoke test - 驗證三頁在真實瀏覽器中「載得起來、基本互動活著」
//
// 涵蓋（規範來源 start.md 產出驗證 + specs/page-architecture.md）:
//   - 三頁載入 console 無 error（含 partial fetch 失敗、JS exception）
//   - landing: 4 張 Chart.js chart 已實例化且 dataset 非空
//   - aside: accordion 展開/收合、收合全部、mobile drawer 開關
//   - session modals（登出/帳號切換）: 開啟、backdrop 關、close-btn 關、ESC 關
//   - landing 2 個 topbar modal（公告/會員安全管理）開關
//   - order-processing: partial 組裝 + op 列表 + modal 系統初始化
//   - room-booking: partial 組裝 + [A] calendar 42 格渲染
//   - app.css entrypoint: expected domain CSS imports are present and non-empty
//
// 零依賴設計: Node >= 22（原生 WebSocket）+ 系統 Chrome headless CDP +
// python3 http.server。不引入 npm 套件，符合專案無 build step 約束。
//
// 用法: node scripts/smoke-test.mjs
// exit 0 = 全部通過; exit 1 = 有 fail（逐項列出）

import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PREVIEW_DIR = join(ROOT, "preview");
const CHROME =
  process.env.CHROME_BIN ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const READY_TIMEOUT_MS = 20000;

function freePort() {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.listen(0, "127.0.0.1", () => {
      const port = srv.address().port;
      srv.close(() => resolve(port));
    });
    srv.on("error", reject);
  });
}

async function waitHttp(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) return;
    } catch {
      /* server not up yet */
    }
    await new Promise((r) => setTimeout(r, 150));
  }
  throw new Error("http server did not start: " + url);
}

// --- CDP client（flat session mode）---
class CDP {
  constructor(ws) {
    this.ws = ws;
    this.seq = 0;
    this.pending = new Map();
    this.eventHandlers = [];
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id !== undefined && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else if (msg.method) {
        for (const fn of this.eventHandlers) fn(msg);
      }
    });
  }
  send(method, params, sessionId) {
    return new Promise((resolve, reject) => {
      const id = ++this.seq;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params: params || {}, sessionId }));
    });
  }
  onEvent(fn) {
    this.eventHandlers.push(fn);
  }
}

function connectWs(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    ws.addEventListener("open", () => resolve(ws));
    ws.addEventListener("error", (e) => reject(new Error("ws error: " + e.message)));
  });
}

async function launchChrome(userDataDir) {
  const proc = spawn(CHROME, [
    "--headless=new",
    "--remote-debugging-port=0",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--user-data-dir=" + userDataDir,
    "about:blank",
  ]);
  const wsUrl = await new Promise((resolve, reject) => {
    let buf = "";
    const timer = setTimeout(
      () => reject(new Error("chrome devtools endpoint timeout")),
      15000,
    );
    proc.stderr.on("data", (chunk) => {
      buf += chunk.toString();
      const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
      if (m) {
        clearTimeout(timer);
        resolve(m[1]);
      }
    });
    proc.on("exit", (code) => reject(new Error("chrome exited early: " + code)));
  });
  return { proc, wsUrl };
}

// --- 頁面內共用檢查函式（注入 page context）---
// modalCheck: 點 trigger 開 modal -> backdrop 點擊關 -> 再開 -> close-btn 關
const PAGE_HELPERS = `
window.__smoke = {
  modalCheck: function (triggerSel, modalId) {
    var t = document.querySelector(triggerSel);
    if (!t) return "trigger missing: " + triggerSel;
    var m = document.getElementById(modalId);
    if (!m) return "modal missing: " + modalId;
    t.click();
    if (!m.classList.contains("open")) return modalId + " did not open";
    if (document.body.style.overflow !== "hidden")
      return modalId + " open but body scroll not locked";
    m.click();
    if (m.classList.contains("open")) return modalId + " backdrop click did not close";
    if (document.body.style.overflow === "hidden")
      return modalId + " closed but body scroll still locked";
    t.click();
    if (!m.classList.contains("open")) return modalId + " did not reopen";
    var closeBtn = m.querySelector('.modal-close-btn[data-modal="' + modalId + '"]');
    if (closeBtn) {
      closeBtn.click();
      if (m.classList.contains("open")) return modalId + " close-btn did not close";
    } else {
      m.click();
    }
    return true;
  },
  escCheck: function (triggerSel, modalId) {
    var t = document.querySelector(triggerSel);
    var m = document.getElementById(modalId);
    if (!t || !m) return "esc-check elements missing: " + modalId;
    t.click();
    if (!m.classList.contains("open")) return modalId + " did not open for esc test";
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    if (m.classList.contains("open")) return modalId + " ESC did not close";
    return true;
  },
  accordionCheck: function () {
    var t = document.querySelector(".accordion-trigger");
    if (!t) return "no .accordion-trigger";
    var c = t.nextElementSibling;
    if (!c) return "accordion has no submenu sibling";
    var before = c.classList.contains("hidden");
    t.click();
    if (c.classList.contains("hidden") === before) return "accordion did not toggle";
    t.click();
    if (c.classList.contains("hidden") !== before) return "accordion did not restore";
    return true;
  },
  collapseAllCheck: function () {
    var btn = document.querySelector(".menu-collapse-all");
    if (!btn) return "no .menu-collapse-all";
    var t = document.querySelector(".accordion-trigger");
    var c = t && t.nextElementSibling;
    if (!c) return "no accordion submenu";
    if (c.classList.contains("hidden")) t.click();
    if (c.classList.contains("hidden")) return "cannot open first category";
    btn.click();
    var open = Array.prototype.filter.call(
      document.querySelectorAll(".accordion-trigger"),
      function (x) {
        var s = x.nextElementSibling;
        return s && !s.classList.contains("hidden");
      },
    );
    return open.length ? "still open after collapse-all: " + open.length : true;
  },
  drawerCheck: function () {
    var btn = document.getElementById("mobileMenuBtn");
    var bd = document.getElementById("mobileSidebarBackdrop");
    var sb = document.getElementById("sidebar");
    if (!btn || !bd || !sb) return "drawer elements missing";
    btn.click();
    if (!bd.classList.contains("open") || !sb.classList.contains("mobile-open"))
      return "drawer did not open";
    bd.click();
    if (bd.classList.contains("open") || sb.classList.contains("mobile-open"))
      return "drawer did not close";
    return true;
  },
};
true;
`;

// --- 三頁的 ready 條件與檢查項 ---
// expr 回傳 true = pass；回傳字串 = fail 原因
const SESSION_MODAL_CHECKS = [
  {
    name: "logout modal open/close (backdrop + close-btn)",
    expr: `__smoke.modalCheck('[data-modal-open="modalLogoutBackdrop"]', "modalLogoutBackdrop")`,
  },
  {
    name: "logout modal closes on ESC",
    expr: `__smoke.escCheck('[data-modal-open="modalLogoutBackdrop"]', "modalLogoutBackdrop")`,
  },
];

const SHELL_CHECKS = [
  { name: "aside accordion toggles", expr: "__smoke.accordionCheck()" },
  { name: "collapse-all collapses categories", expr: "__smoke.collapseAllCheck()" },
  { name: "mobile drawer opens and closes", expr: "__smoke.drawerCheck()" },
];

// app.css 是分域 CSS 檔（shell/dashboard/modals/room-booking/order-processing/system-basic 等）
// 的 @import entrypoint。Session 90 教訓：斷頭註解（兩個 /* 沒有任何 */）會讓
// 整份檔案含全部 @import 被吞進同一個未閉合註解，document.styleSheets 裡的
// app.css 會是空的（cssRules.length === 0），但這個失效狀態不會拋 JS 例外、
// 不會被既有 lint（只 regex 檢查行，不驗證 CSS 語法）攔到，三頁看起來
// "大致正常"（多數版面由 Tailwind utility class 撐起）。
// 此檢查直接驗證瀏覽器實際解析出的 CSSOM：app.css 必須依序 import 固定
// domain CSS 檔（順序即 page-architecture.md 記錄的 cascade 順序，
// shell -> dashboard -> modals -> room-booking -> order-processing ->
// system-basic -> 後續頁面 domain），且
// 每個 domain 檔自己的 cssRules.length > 0。少 import、多 import、順序錯、
// 重複 import 都判定失敗（陣列不完全相等即 fail，一次覆蓋四種錯法）。
//
// 新增/刪除/改名 domain CSS 檔時，記得同步改下面的 expected 陣列，否則
// 這裡會 FAIL（這是預期行為，不是 bug - 代表 app.css 跟這份清單不同步了）。
const APP_CSS_LOADED_CHECK = {
  name: "app.css @import chain matches expected domain CSS order and parses",
  expr: `
    (function () {
      // Keep this list in the same order as preview/assets/css/app.css.
      // When adding, removing, renaming, or reordering domain CSS files, update both.
      var expected = [
        "shell.css",
        "dashboard.css",
        "modals.css",
        "room-booking.css",
        "order-processing.css",
        "system-basic.css",
        "lodging-info.css",
        "room-type.css",
        "purchase-addon.css"
      ];
      var sheet = Array.from(document.styleSheets).find(function (s) {
        return s.href && s.href.indexOf("/assets/css/app.css") !== -1;
      });
      if (!sheet) return "app.css not found in document.styleSheets";
      var rules;
      try {
        rules = Array.from(sheet.cssRules);
      } catch (e) {
        return "app.css cssRules unreadable: " + e.message;
      }
      if (!rules.length) return "app.css has 0 rules (unterminated comment or empty file?)";
      var imports = rules.filter(function (r) { return r.type === CSSRule.IMPORT_RULE; });
      if (!imports.length) return "app.css has rules but no @import (expected domain CSS split)";
      var importedNames = imports.map(function (r) {
        return String(r.href || "").split("/").pop();
      });
      if (importedNames.join(",") !== expected.join(",")) {
        return "app.css imports mismatch; expected=" + expected.join(",") +
          " actual=" + importedNames.join(",");
      }
      var empty = imports.filter(function (r) {
        try {
          return !r.styleSheet || !r.styleSheet.cssRules || r.styleSheet.cssRules.length === 0;
        } catch (e) {
          return true;
        }
      });
      if (empty.length) {
        return "empty imported stylesheet(s): " + empty.map(function (r) { return r.href; }).join(", ");
      }
      return true;
    })()
  `,
};

const PAGES = [
  {
    file: "landing.html",
    readyExpr: `
      !document.querySelector("[data-partial]") &&
      !!document.getElementById("sidebar") &&
      !!document.getElementById("modalLogoutBackdrop") &&
      !!window.Chart &&
      !!Chart.getChart(document.getElementById("chartBar"))
    `,
    checks: [
      APP_CSS_LOADED_CHECK,
      {
        name: "4 charts instantiated with data",
        expr: `
          (function () {
            var ids = ["chartBar", "chartLine", "chartDoughnut", "chartDiverging"];
            var bad = ids.filter(function (id) {
              var c = document.getElementById(id);
              if (!c || c.width === 0) return true;
              var inst = window.Chart && Chart.getChart(c);
              return !inst || !inst.data.datasets.length;
            });
            return bad.length ? "empty/missing charts: " + bad.join(",") : true;
          })()
        `,
      },
      ...SHELL_CHECKS,
      ...SESSION_MODAL_CHECKS,
      {
        name: "topbar administer-message modal open/close",
        expr: `__smoke.modalCheck("#desktopMessageBtn", "modalAdministerBackdrop")`,
      },
      {
        name: "topbar member-security modal open/close",
        expr: `__smoke.modalCheck("#desktopMemberBtn", "modalMemberBackdrop")`,
      },
    ],
  },
  {
    file: "order-processing.html",
    readyExpr: `
      !document.querySelector("[data-partial]") &&
      !!document.getElementById("sidebar") &&
      !!document.getElementById("modalLogoutBackdrop") &&
      !!document.getElementById("modalOrderSummaryBackdrop")
    `,
    checks: [
      APP_CSS_LOADED_CHECK,
      {
        name: "order list rendered (op-status-pill rows)",
        expr: `document.querySelectorAll(".op-status-pill").length > 0 || "no .op-status-pill rows"`,
      },
      {
        name: "order status pill text and triangle keep fixed spacing",
        expr: `
          (function () {
            var triangleSpacingRaw = getComputedStyle(document.documentElement)
              .getPropertyValue("--spacing-12");
            var expected = parseFloat(triangleSpacingRaw) || 12;
            var failures = Array.from(document.querySelectorAll(".op-status-pill"))
              .map(function (pill, index) {
                var text = pill.querySelector(".op-status-pill-text");
                var triangle = pill.querySelector(".op-status-pill-triangle");
                if (!text || !triangle) return "pill " + (index + 1) + " missing text/triangle";
                var textRect = text.getBoundingClientRect();
                var triangleRect = triangle.getBoundingClientRect();
                var measured = triangleRect.left - textRect.right;
                var triangleStyle = getComputedStyle(triangle);
                var textStyle = getComputedStyle(text);
                var margin = parseFloat(triangleStyle.marginLeft) || 0;
                var triangleWidth = triangle.getBoundingClientRect().width;
                if (Math.abs(margin - expected) > 0.5) {
                  return "pill " + (index + 1) + " margin-left " + margin;
                }
                if (textStyle.flexShrink !== "0") {
                  return "pill " + (index + 1) + " text flex-shrink " + textStyle.flexShrink;
                }
                if (triangleStyle.flexShrink !== "0" || Math.abs(triangleWidth - 16) > 0.5) {
                  return "pill " + (index + 1) + " triangle size/shrink " +
                    triangleWidth.toFixed(2) + "/" + triangleStyle.flexShrink;
                }
                if (measured < expected - 0.5) {
                  return "pill " + (index + 1) + " measured gap " + measured.toFixed(2);
                }
                return null;
              })
              .filter(Boolean);
            return failures.length ? failures.join("; ") : true;
          })()
        `,
      },
      {
        name: "order-edit shell + modal partial mounted",
        expr: `
          (document.getElementById("modalOrderEditBackdrop") &&
           document.getElementById("modalSmsBackdrop") &&
           document.getElementById("invCalendarOffcanvas")) ? true : "modal ids missing"
        `,
      },
      ...SHELL_CHECKS,
      ...SESSION_MODAL_CHECKS,
    ],
  },
  {
    file: "system-basic.html",
    readyExpr: `
      !document.querySelector("[data-partial]") &&
      !!document.getElementById("sidebar") &&
      !!document.getElementById("modalLogoutBackdrop") &&
      document.querySelectorAll(".member-data-switch").length >= 5
    `,
    checks: [
      APP_CSS_LOADED_CHECK,
      {
        name: "setting cards rendered (toggles + status icons)",
        expr: `
          (function () {
            var switches = document.querySelectorAll(".member-data-switch").length;
            var status = document.querySelectorAll(
              'img[src$="check-green.svg"], img[src$="failure-red.svg"]'
            ).length;
            if (switches < 5) return "switch count: " + switches;
            if (status < 3) return "status icon count: " + status;
            return true;
          })()
        `,
      },
      {
        name: "template preview mounted (sb-template block)",
        expr: `
          document.querySelectorAll(".sb-template-image").length >= 3
            ? true
            : "sb-template-image count: " +
              document.querySelectorAll(".sb-template-image").length
        `,
      },
      ...SHELL_CHECKS,
      ...SESSION_MODAL_CHECKS,
    ],
  },
  {
    file: "account-permission.html",
    readyExpr: `
      !document.querySelector("[data-partial]") &&
      !!document.getElementById("sidebar") &&
      !!document.getElementById("modalLogoutBackdrop") &&
      !!document.getElementById("apAccordionHeader")
    `,
    checks: [
      APP_CSS_LOADED_CHECK,
      {
        name: "accordion toggles open/close (chevron follows)",
        expr: `
          (function () {
            var header = document.getElementById("apAccordionHeader");
            var content = document.getElementById("apAccordionContent");
            var icon = document.getElementById("apAccordionIcon");
            if (!content.classList.contains("ap-hidden"))
              return "initial state should be closed";
            header.click();
            if (content.classList.contains("ap-hidden"))
              return "content did not open";
            if (!/down\\.svg$/.test(icon.src)) return "open icon not down.svg";
            header.click();
            if (!content.classList.contains("ap-hidden"))
              return "content did not close";
            if (!/up\\.svg$/.test(icon.src)) return "closed icon not up.svg";
            header.click(); // 留在展開態給後續檢查
            return true;
          })()
        `,
      },
      {
        name: "mode buttons swap panels (edit/records/delete)",
        expr: `
          (function () {
            var btns = document.querySelectorAll(".ap-mode-btn");
            var byMode = {};
            btns.forEach(function (b) {
              byMode[b.getAttribute("data-ap-mode")] = b;
            });
            var panels = {
              edit: document.getElementById("apPanelEdit"),
              records: document.getElementById("apPanelRecords"),
              delete: document.getElementById("apPanelDelete"),
            };
            function visible(key) {
              return !panels[key].classList.contains("ap-hidden");
            }
            if (!visible("edit")) return "edit panel should be default";
            byMode.records.click();
            if (!visible("records") || visible("edit"))
              return "records switch failed";
            byMode["delete"].click();
            if (!visible("delete") || visible("records"))
              return "delete switch failed";
            byMode.edit.click();
            if (!visible("edit") || visible("delete"))
              return "edit switch back failed";
            return true;
          })()
        `,
      },
      {
        name: "branch list expand/collapse bar",
        expr: `
          (function () {
            var toggle = document.getElementById("apBranchToggle");
            var extras = document.querySelectorAll(".ap-branch-extra");
            if (extras.length !== 3) return "extra branches: " + extras.length;
            function shownCount() {
              var n = 0;
              extras.forEach(function (r) {
                if (!r.classList.contains("ap-hidden")) n++;
              });
              return n;
            }
            if (shownCount() !== 0) return "extras should start hidden";
            toggle.click();
            if (shownCount() !== 3) return "expand failed";
            if (!/outline-minus\\.svg$/.test(toggle.querySelector("img").src))
              return "expanded icon not minus";
            toggle.click();
            if (shownCount() !== 0) return "collapse failed";
            return true;
          })()
        `,
      },
      {
        name: "password eye toggle reveals/masks",
        expr: `
          (function () {
            var input = document.getElementById("apPwdInput");
            var eye = document.getElementById("apPwdEye");
            if (input.type !== "password") return "should start masked";
            eye.click();
            if (input.type !== "text") return "reveal failed";
            if (!/eye-open\\.svg$/.test(eye.querySelector("img").src))
              return "revealed icon not eye-open";
            eye.click();
            if (input.type !== "password") return "mask back failed";
            return true;
          })()
        `,
      },
      ...SHELL_CHECKS,
      ...SESSION_MODAL_CHECKS,
    ],
  },
  {
    file: "room-booking.html",
    readyExpr: `
      !document.querySelector("[data-partial]") &&
      !!document.getElementById("sidebar") &&
      !!document.getElementById("modalLogoutBackdrop") &&
      document.querySelectorAll("#calGrid .day").length >= 42
    `,
    checks: [
      APP_CSS_LOADED_CHECK,
      {
        name: "[A] calendar renders 42 day cells",
        expr: `document.querySelectorAll("#calGrid .day").length >= 42 || "calendar cells: " + document.querySelectorAll("#calGrid .day").length`,
      },
      {
        name: "page content mounted (#rbPageContent non-empty)",
        expr: `
          (function () {
            var el = document.getElementById("rbPageContent");
            return el && el.children.length > 0 ? true : "rbPageContent empty";
          })()
        `,
      },
      {
        name: "room modals partial mounted",
        expr: `
          (document.getElementById("modalPurchaseAddonBackdrop") &&
           document.getElementById("modalMemberDataBackdrop") &&
           document.getElementById("modalArrivalMethodBackdrop")) ? true : "modal ids missing"
        `,
      },
      ...SHELL_CHECKS,
      ...SESSION_MODAL_CHECKS,
    ],
  },
  {
    file: "lodging-info.html",
    readyExpr: `
      !document.querySelector("[data-partial]") &&
      !!document.getElementById("sidebar") &&
      !!document.getElementById("modalLogoutBackdrop") &&
      !!document.getElementById("modalPhotoGalleryBackdrop") &&
      document.querySelectorAll(".lodging-branch-row").length >= 2
    `,
    checks: [
      APP_CSS_LOADED_CHECK,
      {
        name: "branch rows and basic-info cards rendered",
        expr: `
          (function () {
            var rows = document.querySelectorAll(".lodging-branch-row");
            if (rows.length !== 2) return "branch row count: " + rows.length;
            var cards = document.querySelectorAll(".lodging-branch-card");
            if (cards.length !== 2) return "basic-info card count: " + cards.length;
            return true;
          })()
        `,
      },
      {
        name: "notice card category/language tabs rendered",
        expr: `
          (function () {
            var row1Tabs = document.querySelectorAll('#lodgingNoticeCard-row1 [data-notice-tab]');
            var row2LangTabs = document.querySelectorAll('#lodgingNoticeCard-row2 [data-notice-lang]');
            if (row1Tabs.length !== 4) return "row1 category tabs: " + row1Tabs.length;
            if (row2LangTabs.length !== 3) return "row2 language tabs: " + row2LangTabs.length;
            return true;
          })()
        `,
      },
      {
        name: "photo-gallery modal open/close + main-image pill always on slot 1",
        expr: `
          (function () {
            var res = __smoke.modalCheck("#lodgingRow1PhotoTrigger", "modalPhotoGalleryBackdrop");
            if (res !== true) return res;
            document.getElementById("lodgingRow2PhotoTrigger").click();
            var firstCard = document.querySelector('#lodgingPhotoCardGrid [data-slot="0"]');
            if (!firstCard || !firstCard.querySelector("span.rounded-full"))
              return "main-image pill missing on empty slot 1";
            document.querySelector("#modalPhotoGalleryBackdrop .modal-close-btn").click();
            return true;
          })()
        `,
      },
      {
        name: "branch-info modal open/close + header title swaps",
        expr: `
          (function () {
            var res = __smoke.modalCheck("#lodgingRow1EditBtn", "modalBranchInfoBackdrop");
            if (res !== true) return res;
            var title = document.getElementById("modalBranchInfoTitle");
            document.getElementById("lodgingRow1EditBtn").click();
            if (title.textContent !== "資料修改") return "row1 title: " + title.textContent;
            if (!document.getElementById("modalBranchInfoBackdrop").textContent.includes("聯絡電話"))
              return "branch info phone label missing";
            if (document.getElementById("modalBranchInfoBackdrop").textContent.includes("市話"))
              return "branch info old phone label still present";
            document.querySelector("#modalBranchInfoBackdrop .modal-close-btn").click();
            document.getElementById("lodgingRow2EditBtn").click();
            if (title.textContent !== "資料設定") return "row2 title: " + title.textContent;
            document.querySelector("#modalBranchInfoBackdrop .modal-close-btn").click();
            return true;
          })()
        `,
      },
      {
        name: "multilingual-status modal open/close + language tab toggle",
        expr: `
          (function () {
            var res = __smoke.modalCheck("#lodgingMultilingualStatusBtn", "modalMultilingualStatusBackdrop");
            if (res !== true) return res;
            document.getElementById("lodgingMultilingualStatusBtn").click();
            var koTab = document.querySelector('#lodgingMultilingualLangTabs [data-lang="ko"]');
            koTab.click();
            var active = document.querySelectorAll("#lodgingMultilingualLangTabs .is-active");
            if (active.length !== 1 || active[0].dataset.lang !== "ko")
              return "language tab toggle failed";
            document.querySelector("#modalMultilingualStatusBackdrop .modal-close-btn").click();
            return true;
          })()
        `,
      },
      {
        name: "notice card edit/save/cancel roundtrip",
        expr: `
          (function () {
            var root = "#lodgingNoticeCard-row1 ";
            document.querySelector(root + "[data-notice-edit]").click();
            var ta = document.querySelector(root + ".lodging-suneditor-textarea");
            if (!ta) return "textarea not found after edit click";
            ta.value = "smoke-test-content";
            ta.dispatchEvent(new Event("input", { bubbles: true }));
            document.querySelector(root + "[data-notice-save]").click();
            var savedP = document.querySelector(root + "p");
            if (!savedP || savedP.textContent !== "smoke-test-content")
              return "save did not persist content";
            document.querySelector(root + "[data-notice-edit]").click();
            var ta2 = document.querySelector(root + ".lodging-suneditor-textarea");
            ta2.value = "should-not-persist";
            ta2.dispatchEvent(new Event("input", { bubbles: true }));
            document.querySelector(root + "[data-notice-cancel]").click();
            var savedP2 = document.querySelector(root + "p");
            if (!savedP2 || savedP2.textContent !== "smoke-test-content")
              return "cancel did not revert correctly";
            return true;
          })()
        `,
      },
      {
        name: "branch-info modal caption cards stretch within grid row",
        expr: `
          (function () {
            document.getElementById("lodgingRow1EditBtn").click();
            var intro = document.querySelector('[data-branch-caption-card="intro"]');
            var facilities = document.querySelector('[data-branch-caption-card="facilities"]');
            if (!intro || !facilities) return "caption cards missing";
            var introRect = intro.getBoundingClientRect();
            var facilitiesRect = facilities.getBoundingClientRect();
            var sameRow = Math.abs(introRect.top - facilitiesRect.top) < 2;
            if (sameRow && Math.abs(introRect.height - facilitiesRect.height) > 1)
              return "same-row caption height mismatch: " + introRect.height + " / " + facilitiesRect.height;
            var facilitiesStyle = getComputedStyle(facilities);
            if (sameRow && facilitiesStyle.justifyContent !== "center")
              return "static caption card should center empty state vertically";
            document.querySelector("#modalBranchInfoBackdrop .modal-close-btn").click();
            return true;
          })()
        `,
      },
      {
        name: "branch-info modal new caption cards + facility card placement",
        expr: `
          (function () {
            document.getElementById("lodgingRow1EditBtn").click();
            var required = ["hotel-name", "contact-phone", "service-fax", "address", "check-in-time", "facility-items"];
            for (var i = 0; i < required.length; i += 1) {
              if (!document.querySelector('[data-branch-caption-card="' + required[i] + '"]'))
                return "caption card missing: " + required[i];
            }
            var checkIn = document.querySelector('[data-branch-caption-card="check-in-time"]');
            var facility = document.querySelector('[data-branch-caption-card="facility-items"]');
            var checkInRect = checkIn.getBoundingClientRect();
            var facilityRect = facility.getBoundingClientRect();
            if (Math.abs(checkInRect.top - facilityRect.top) < 2 && facilityRect.left <= checkInRect.left)
              return "facility card should be right column";
            var chips = Array.from(document.querySelectorAll("#lodgingBranchInfoFacilityChips .lodging-facility-chip"));
            var chipText = chips.map(function (chip) { return chip.textContent.trim(); }).join("|");
            if (chipText !== "設施一|設施二|設施三|設施五六七八九")
              return "facility chips changed: " + chipText;
            var states = chips.map(function (chip) { return chip.dataset.facilitySelected; }).join("|");
            if (states !== "true|true|true|false") return "facility chip states changed: " + states;
            document.querySelector("#modalBranchInfoBackdrop .modal-close-btn").click();
            return true;
          })()
        `,
      },
      {
        name: "branch-info modal intro-caption card (multi-lang, no source buttons)",
        expr: `
          (function () {
            document.getElementById("lodgingRow1EditBtn").click();
            var container = document.getElementById("lodgingBranchIntroCard");
            container.querySelector("[data-intro-edit]").click();
            if (container.querySelector("[data-intro-source]"))
              return "intro-caption card should not have source buttons";
            var langTabs = container.querySelectorAll("[data-intro-lang]");
            if (langTabs.length !== 3) return "intro-caption lang tabs: " + langTabs.length;
            var ta = container.querySelector(".lodging-suneditor-textarea");
            if (!ta) return "textarea not found after edit click";
            ta.value = "smoke-intro-content";
            ta.dispatchEvent(new Event("input", { bubbles: true }));
            container.querySelector("[data-intro-save]").click();
            var savedP = container.querySelector("p");
            if (!savedP || savedP.textContent !== "smoke-intro-content")
              return "intro-caption save did not persist content";
            document.querySelector("#modalBranchInfoBackdrop .modal-close-btn").click();
            return true;
          })()
        `,
      },
      ...SHELL_CHECKS,
      ...SESSION_MODAL_CHECKS,
    ],
  },
  {
    file: "purchase-addon.html",
    readyExpr: `
      !document.querySelector("[data-partial]") &&
      !!document.getElementById("sidebar") &&
      !!document.getElementById("modalLogoutBackdrop") &&
      !!document.getElementById("modalPurchaseAddonDataBackdrop") &&
      !!document.getElementById("modalPurchaseAddonProjectBackdrop") &&
      !!document.getElementById("modalPurchaseAddonPhotoGalleryBackdrop") &&
      document.querySelectorAll("[data-pa-table-body='product'] tr").length === 14 &&
      document.querySelectorAll("[data-pa-table-body='category'] tr").length === 14
    `,
    checks: [
      APP_CSS_LOADED_CHECK,
      {
        name: "purchase-addon sections, tabs, legends, and rows rendered",
        viewport: { width: 1440, height: 1000 },
        expr: `
          (function () {
            var sections = document.querySelectorAll("[data-pa-section]");
            if (sections.length !== 2) return "section count: " + sections.length;
            var activeTypeTabs = document.querySelectorAll("[data-pa-type-tabs] .pa-type-tab.is-active");
            if (activeTypeTabs.length !== 2) return "active type tab count: " + activeTypeTabs.length;
            var productRows = document.querySelectorAll("[data-pa-table-body='product'] tr");
            var categoryRows = document.querySelectorAll("[data-pa-table-body='category'] tr");
            if (productRows.length !== 14) return "product row count: " + productRows.length;
            if (categoryRows.length !== 14) return "category row count: " + categoryRows.length;
            var legends = document.querySelectorAll(".pa-legend-icon img");
            if (legends.length < 6) return "legend icon count: " + legends.length;
            if (!document.querySelector(".pa-icon-thumbtack-filled"))
              return "filled limited-project icon missing";
            if (productRows[1].querySelectorAll("[data-pa-row-action]").length < 3)
              return "product row 2 management buttons missing";
            if (productRows[2].querySelectorAll("[data-pa-row-action]").length < 3)
              return "product row 3 management buttons missing";
            if (categoryRows[0].querySelectorAll("[data-pa-row-action]").length < 3)
              return "category management buttons missing";
            if (document.querySelector("[data-pa-row-id='product-2'][data-pa-row-action='project']"))
              return "project button should not show without thumbtack state";
            if (!document.querySelector("[data-pa-row-id='product-4'][data-pa-row-action='project']"))
              return "limited project button missing";
            if (!document.querySelector("[data-pa-row-id='product-5'][data-pa-row-action='project']"))
              return "non-limited project button missing";
            var categoryShell = document.querySelector(".pa-category-table-shell");
            var categoryParent = categoryShell && categoryShell.parentElement;
            var productShell = document.querySelector(".pa-product-table").closest(".pa-table-shell");
            if (!categoryShell || !categoryParent || !productShell)
              return "table shell missing";
            var categoryShellWidth = categoryShell.getBoundingClientRect().width;
            var categoryParentWidth = categoryParent.getBoundingClientRect().width;
            if (!(categoryShellWidth < categoryParentWidth - 16))
              return "category outline should shrink: " + categoryShellWidth + "/" + categoryParentWidth;
            var productShellWidth = productShell.getBoundingClientRect().width;
            var productParentWidth = productShell.parentElement.getBoundingClientRect().width;
            if (Math.abs(productShellWidth - productParentWidth) > 2)
              return "product outline should remain full width";
            return true;
          })()
        `,
      },
      {
        name: "purchase-addon controls toggle active states and clear inputs",
        expr: `
          (function () {
            var firstTabs = document.querySelector("[data-pa-type-tabs]");
            var secondType = firstTabs.querySelectorAll(".pa-type-tab")[1];
            secondType.click();
            if (!secondType.classList.contains("is-active")) return "type tab did not activate";
            if (firstTabs.querySelectorAll(".pa-type-tab.is-active").length !== 1)
              return "type tab active count changed incorrectly";

            var quick = document.querySelector("[data-pa-quick-filters]");
            var backendOnly = quick.querySelectorAll(".pa-quick-chip")[2];
            backendOnly.click();
            if (!backendOnly.classList.contains("is-active")) return "quick chip did not activate";

            var category = document.getElementById("paProductCategoryText");
            var name = document.getElementById("paProductName");
            name.value = "abc";
            document.querySelector("[data-pa-clear]").click();
            if (category.value !== "" || name.value !== "")
              return "clear did not empty inputs: " + category.value + "/" + name.value;
            return true;
          })()
        `,
      },
      {
        name: "purchase-addon display toggle switches all rows to pagination",
        expr: `
          (function () {
            var button = document.querySelector("[data-pa-display-button='product']");
            var icon = document.querySelector("[data-pa-display-icon='product']");
            var label = document.querySelector("[data-pa-display-label='product']");
            if (button.getAttribute("aria-pressed") !== "true")
              return "product display should start all";
            if (!/all-pages\\.svg$/.test(icon.src)) return "initial icon: " + icon.src;
            if (label.textContent.trim() !== "全部顯示（14 筆）")
              return "initial display label: " + label.textContent.trim();
            button.click();
            var rows = document.querySelectorAll("[data-pa-table-body='product'] tr");
            if (label.textContent.trim() !== "分頁（3 頁 / 14 筆）")
              return "paged display label: " + label.textContent.trim();
            if (button.getAttribute("aria-pressed") !== "false")
              return "paged aria-pressed should be false";
            if (!/split-page\\.svg$/.test(icon.src)) return "paged icon: " + icon.src;
            if (rows.length !== 5) return "paged row count: " + rows.length;
            var pagination = document.querySelector("[data-pa-pagination='product']");
            var current = pagination.querySelector(".pa-page-current");
            var nav = pagination.querySelectorAll(".pa-page-nav");
            if (!current || current.textContent.trim() !== "1")
              return "initial current page missing";
            if (nav.length !== 2) return "pagination nav count: " + nav.length;
            if (!nav[0].disabled) return "prev should start disabled";
            if (nav[1].disabled) return "next should start enabled";
            if (parseFloat(getComputedStyle(nav[1]).borderTopLeftRadius) < 18)
              return "pagination nav should be fully rounded";
            if (getComputedStyle(nav[1]).backgroundColor === getComputedStyle(document.documentElement).getPropertyValue("--color-neutral-200").trim())
              return "pagination nav should not use neutral gray";
            nav[1].click();
            current = pagination.querySelector(".pa-page-current");
            nav = pagination.querySelectorAll(".pa-page-nav");
            if (!current || current.textContent.trim() !== "2")
              return "next page did not update current page";
            if (nav[0].disabled || nav[1].disabled)
              return "middle page nav should both be enabled";
            button.click();
            if (!/all-pages\\.svg$/.test(icon.src)) return "restored icon: " + icon.src;
            if (document.querySelectorAll("[data-pa-table-body='product'] tr").length !== 14)
              return "all rows did not restore";
            return true;
          })()
        `,
      },
      {
        name: "purchase-addon status counts update after disable/enable",
        expr: `
          (function () {
            var activeCount = document.querySelector("[data-pa-active-count='product']");
            var deletedCount = document.querySelector("[data-pa-deleted-count='product']");
            if (activeCount.textContent !== "（14）") return "initial active count: " + activeCount.textContent;
            if (deletedCount.textContent !== "（5）") return "initial deleted count: " + deletedCount.textContent;
            document.querySelector("[data-pa-row-action='disable'][data-pa-row-id='product-1']").click();
            if (activeCount.textContent !== "（13）") return "active after disable: " + activeCount.textContent;
            if (deletedCount.textContent !== "（6）") return "deleted after disable: " + deletedCount.textContent;
            document.querySelector("[data-pa-status-filter='deleted'][data-pa-kind='product'], [data-pa-status-tabs='product'] [data-pa-status-filter='deleted']").click();
            document.querySelector("[data-pa-row-action='enable'][data-pa-row-id='product-1']").click();
            document.querySelector("[data-pa-status-tabs='product'] [data-pa-status-filter='active']").click();
            if (activeCount.textContent !== "（14）") return "active after enable: " + activeCount.textContent;
            if (deletedCount.textContent !== "（5）") return "deleted after enable: " + deletedCount.textContent;
            return true;
          })()
        `,
      },
      {
        name: "purchase-addon data and photo modals open/close",
        expr: `
          (function () {
            var add = __smoke.modalCheck('[data-pa-modal-mode="new"][data-pa-kind="product"]', "modalPurchaseAddonDataBackdrop");
            if (add !== true) return "new: " + add;
            document.querySelector('[data-pa-modal-mode="new"][data-pa-kind="product"]').click();
            var modalText = document.getElementById("modalPurchaseAddonDataBackdrop").textContent;
            var required = ["產品新增", "類別", "[888]沖帳", "產品描述", "住宿加購", "線上隨單加購", "產品編號", "品名", "定價", "填0為免費", "數量限制", "訂購上限/筆", "產品介紹文案", "品名文案"];
            for (var i = 0; i < required.length; i += 1) {
              if (modalText.indexOf(required[i]) === -1) return "data modal missing: " + required[i];
            }
            if (document.querySelectorAll("#modalPurchaseAddonDataBackdrop .pa-data-modal-copy-card").length !== 2)
              return "data modal copy card count mismatch";
            var categoryField = document.querySelector("#modalPurchaseAddonDataBackdrop .pa-data-modal-field");
            var categoryLabel = categoryField && categoryField.children[0];
            var categoryControl = categoryField && categoryField.querySelector(".pa-data-modal-control");
            if (!categoryLabel || !categoryControl) return "data modal category field missing";
            var labelCenter = categoryLabel.getBoundingClientRect().top + categoryLabel.getBoundingClientRect().height / 2;
            var controlCenter = categoryControl.getBoundingClientRect().top + categoryControl.getBoundingClientRect().height / 2;
            if (Math.abs(labelCenter - controlCenter) > 2)
              return "data modal label/control vertical center mismatch";
            document.querySelector("#modalPurchaseAddonDataBackdrop .modal-close-btn").click();
            var edit = __smoke.modalCheck('[data-pa-modal-mode="edit"][data-pa-row-id="product-1"]', "modalPurchaseAddonDataBackdrop");
            if (edit !== true) return "edit: " + edit;
            document.querySelector('[data-pa-modal-mode="edit"][data-pa-row-id="product-1"]').click();
            var publishToggle = document.querySelector("#modalPurchaseAddonDataBackdrop [data-pa-publish-toggle]");
            publishToggle.click();
            var publishPanel = document.querySelector("#modalPurchaseAddonDataBackdrop [data-pa-publish-panel]");
            if (!publishPanel || publishPanel.classList.contains("hidden"))
              return "publish schedule panel did not open";
            if (getComputedStyle(publishPanel).position === "absolute")
              return "publish panel should be inline, not floating";
            if (!publishPanel.querySelector("[data-pa-publish-start-date]") || !publishPanel.querySelector("[data-pa-publish-end-date]"))
              return "publish panel range dates missing";
            if (!publishPanel.querySelector("[data-pa-publish-start-hour]") || !publishPanel.querySelector("[data-pa-publish-end-hour]"))
              return "publish panel range hours missing";
            if (publishPanel.textContent.indexOf("設定開放日期") === -1 || publishPanel.textContent.indexOf("設定開放時段") === -1)
              return "publish panel labels missing";
            if (publishPanel.textContent.indexOf("上架設定") !== -1 || publishPanel.textContent.indexOf("取消") !== -1 || publishPanel.textContent.indexOf("儲存") !== -1)
              return "publish panel contains old popup copy";
            document.querySelector("#modalPurchaseAddonDataBackdrop .modal-close-btn[data-modal='modalPurchaseAddonDataBackdrop']").click();

            document.querySelector('[data-pa-row-action="project"][data-pa-row-id="product-4"]').click();
            var projectModal = document.getElementById("modalPurchaseAddonProjectBackdrop");
            if (!projectModal.classList.contains("open"))
              return "project button did not open modal";
            if (document.getElementById("modalPurchaseAddonDataBackdrop").classList.contains("open"))
              return "project button should not open data modal";
            if (document.getElementById("paProjectModalTitle").textContent.trim() !== "專案設定")
              return "project modal title mismatch: " + document.getElementById("paProjectModalTitle").textContent.trim();
            if (projectModal.querySelector("[data-pa-project-code]").value !== "66")
              return "project code mismatch";
            if (projectModal.querySelector("[data-pa-project-name]").value !== "花瓶")
              return "project name mismatch";
            var projectMode = projectModal.querySelector("[data-pa-project-mode]");
            var projectCondition = projectModal.querySelector("[data-pa-project-condition]");
            if (projectMode.options.length !== 2)
              return "project mode option count: " + projectMode.options.length;
            if (projectCondition.options.length !== 2)
              return "project condition option count: " + projectCondition.options.length;
            if (projectMode.value !== "none")
              return "project mode should start unlimited";
            if (!projectModal.querySelector("[data-pa-project-condition-field]").classList.contains("hidden"))
              return "project condition should start hidden for unlimited mode";
            if (projectCondition.value !== "all")
              return "project condition should default all";
            if (projectModal.querySelectorAll("[data-pa-project-chip]").length !== 6)
              return "project chip count mismatch";
            if (projectModal.querySelectorAll("[data-pa-project-chip].is-selected").length !== 6)
              return "project chips should start all selected";
            var projectActions = projectModal.querySelectorAll(".pa-project-mini-action");
            if (!projectActions[0].classList.contains("is-filled") || projectActions[1].classList.contains("is-filled"))
              return "project all action should start active";
            var selectedProjectChip = projectModal.querySelector("[data-pa-project-chip].is-selected");
            var menuSample = document.createElement("span");
            menuSample.style.background = "var(--color-menuitem-default)";
            document.body.appendChild(menuSample);
            var expectedMenuBg = getComputedStyle(menuSample).backgroundColor;
            menuSample.remove();
            if (!selectedProjectChip || getComputedStyle(selectedProjectChip).backgroundColor !== expectedMenuBg)
              return "selected project chip should use menu blue";
            selectedProjectChip.click();
            projectActions = projectModal.querySelectorAll(".pa-project-mini-action");
            if (projectActions[0].classList.contains("is-filled") || projectActions[1].classList.contains("is-filled"))
              return "project chip click should clear all/none active after all state";
            if (projectModal.querySelectorAll("[data-pa-project-chip].is-selected").length !== 5)
              return "project chip click should toggle selected in unlimited mode";
            projectModal.querySelector("[data-pa-project-select-all]").click();
            projectMode.value = "limited";
            projectMode.dispatchEvent(new Event("change", { bubbles: true }));
            if (projectModal.querySelector("[data-pa-project-condition-field]").classList.contains("hidden"))
              return "project condition should show for limited mode";
            projectCondition.value = "flight";
            projectCondition.dispatchEvent(new Event("change", { bubbles: true }));
            var flightProjectChips = Array.from(projectModal.querySelectorAll("[data-pa-project-chip]"));
            var flightProjectLabels = flightProjectChips.map(function (chip) { return chip.textContent.trim(); }).join("|");
            if (flightProjectChips.length !== 3)
              return "flight project should show 3 chips";
            if (flightProjectLabels !== "[999] 飛天六人滿意網企|[89] 地勤很辛苦|[09] 空姐滿班")
              return "flight project chip labels mismatch: " + flightProjectLabels;
            projectActions = projectModal.querySelectorAll(".pa-project-mini-action");
            if (!projectActions[0].classList.contains("is-filled") || projectActions[1].classList.contains("is-filled"))
              return "project condition change should preserve all active state";
            if (projectModal.querySelectorAll("[data-pa-project-chip].is-selected").length !== 3)
              return "flight project condition should preserve visible selected chips";
            projectModal.querySelector("[data-pa-project-clear-all]").click();
            projectActions = projectModal.querySelectorAll(".pa-project-mini-action");
            if (projectActions[0].classList.contains("is-filled") || !projectActions[1].classList.contains("is-filled"))
              return "project clear action should become active";
            if (projectModal.querySelectorAll("[data-pa-project-chip].is-selected").length !== 0)
              return "project clear action should deselect chips";
            projectModal.querySelector("[data-pa-project-chip]").click();
            projectActions = projectModal.querySelectorAll(".pa-project-mini-action");
            if (projectActions[0].classList.contains("is-filled") || projectActions[1].classList.contains("is-filled"))
              return "project chip click should clear all/none active after none state";
            if (projectModal.querySelectorAll("[data-pa-project-chip].is-selected").length !== 1)
              return "project chip click should toggle selected after clear";
            ["89", "09"].forEach(function (id) {
              projectModal.querySelector('[data-pa-project-chip="' + id + '"]').click();
            });
            projectActions = projectModal.querySelectorAll(".pa-project-mini-action");
            if (!projectActions[0].classList.contains("is-filled") || projectActions[1].classList.contains("is-filled"))
              return "flight visible chips all selected should activate all action";
            if (projectModal.querySelectorAll("[data-pa-project-chip].is-selected").length !== 3)
              return "flight visible chips all selected count mismatch";
            projectMode.value = "none";
            projectMode.dispatchEvent(new Event("change", { bubbles: true }));
            if (projectModal.querySelectorAll("[data-pa-project-chip]").length !== 6)
              return "project mode unlimited should ignore hidden flight condition";
            projectMode.value = "limited";
            projectMode.dispatchEvent(new Event("change", { bubbles: true }));
            projectModal.querySelector("[data-pa-project-clear-all]").click();
            projectCondition.value = "all";
            projectCondition.dispatchEvent(new Event("change", { bubbles: true }));
            if (projectModal.querySelectorAll("[data-pa-project-chip]").length !== 6)
              return "project all condition should restore 6 chips";
            if (projectModal.querySelectorAll("[data-pa-project-chip].is-selected").length !== 0)
              return "project condition change should preserve cleared chips";
            projectModal.querySelector("[data-pa-project-select-all]").click();
            projectActions = projectModal.querySelectorAll(".pa-project-mini-action");
            if (!projectActions[0].classList.contains("is-filled") || projectActions[1].classList.contains("is-filled"))
              return "project all action should become active";
            if (projectModal.querySelectorAll("[data-pa-project-chip].is-selected").length !== 6)
              return "project all action should select chips";
            projectMode.value = "none";
            projectMode.dispatchEvent(new Event("change", { bubbles: true }));
            if (!projectModal.querySelector("[data-pa-project-condition-field]").classList.contains("hidden"))
              return "project condition should hide when project mode unlimited";
            projectActions = projectModal.querySelectorAll(".pa-project-mini-action");
            if (!projectActions[0].classList.contains("is-filled") || projectModal.querySelectorAll("[data-pa-project-chip].is-selected").length !== 6)
              return "project mode unlimited should preserve all selected";
            document.querySelector("#modalPurchaseAddonProjectBackdrop .modal-close-btn[data-modal='modalPurchaseAddonProjectBackdrop']").click();

            document.querySelector("[data-pa-status-tabs='product'] [data-pa-status-filter='deleted']").click();
            document.querySelector('[data-pa-modal-mode="view"][data-pa-row-id="product-15"]').click();
            var dataModal = document.getElementById("modalPurchaseAddonDataBackdrop");
            var readonlyFields = Array.from(dataModal.querySelectorAll("[data-pa-data-field]"));
            if (!readonlyFields.length || readonlyFields.some(function (field) { return !field.disabled; }))
              return "view modal fields should be disabled";
            if (!dataModal.querySelector("[data-pa-data-save]").classList.contains("hidden"))
              return "view modal save should be hidden";
            var viewCloseBtn = dataModal.querySelector("[data-pa-data-cancel]");
            if (viewCloseBtn.textContent.trim() !== "關閉")
              return "view modal footer should say close";
            var sample = document.createElement("span");
            sample.style.background = "var(--color-text-800)";
            document.body.appendChild(sample);
            var expectedCloseBg = getComputedStyle(sample).backgroundColor;
            sample.remove();
            if (getComputedStyle(viewCloseBtn).backgroundColor !== expectedCloseBg)
              return "view modal close button should use dark room-type color";
            document.querySelector("#modalPurchaseAddonDataBackdrop .modal-close-btn[data-modal='modalPurchaseAddonDataBackdrop']").click();
            document.querySelector("[data-pa-status-tabs='product'] [data-pa-status-filter='active']").click();

            var photo = __smoke.modalCheck('[data-pa-photo-trigger="product-1"]', "modalPurchaseAddonPhotoGalleryBackdrop");
            if (photo !== true) return "photo: " + photo;
            document.querySelector('[data-pa-photo-trigger="product-2"]').click();
            var grid = document.getElementById("purchaseAddonPhotoCardGrid");
            if (!grid || grid.children.length !== 5)
              return "photo grid slot count: " + (grid && grid.children.length);
            document.querySelector("#modalPurchaseAddonPhotoGalleryBackdrop .modal-close-btn").click();
            return true;
          })()
        `,
      },
      {
        name: "purchase-addon modals are fullscreen on mobile",
        viewport: { width: 375, height: 812, mobile: true },
        expr: `
          (function () {
            function checkModal(triggerSel, modalId) {
              var trigger = document.querySelector(triggerSel);
              var modal = document.getElementById(modalId);
              if (!trigger || !modal) return "missing mobile modal target: " + modalId;
              trigger.click();
              var box = modal.querySelector(".modal-box");
              var rect = box.getBoundingClientRect();
              if (Math.abs(rect.left) > 1 || Math.abs(rect.top) > 1)
                return modalId + " should start at viewport origin: " + rect.left + "/" + rect.top;
              if (Math.abs(rect.width - window.innerWidth) > 1)
                return modalId + " width not fullscreen: " + rect.width + "/" + window.innerWidth;
              if (Math.abs(rect.height - window.innerHeight) > 1)
                return modalId + " height not fullscreen: " + rect.height + "/" + window.innerHeight;
              if (getComputedStyle(box).borderRadius !== "0px")
                return modalId + " border radius should be 0";
              modal.querySelector(".modal-close-btn").click();
              return true;
            }
            var data = checkModal('[data-pa-modal-mode="new"][data-pa-kind="product"]', "modalPurchaseAddonDataBackdrop");
            if (data !== true) return data;
            document.querySelector('[data-pa-modal-mode="new"][data-pa-kind="product"]').click();
            var mobilePublishToggle = document.querySelector("#modalPurchaseAddonDataBackdrop [data-pa-publish-toggle]");
            var mobilePublishPanel = document.querySelector("#modalPurchaseAddonDataBackdrop [data-pa-publish-panel]");
            if (!mobilePublishToggle.checked) mobilePublishToggle.click();
            if (mobilePublishPanel.classList.contains("hidden")) mobilePublishToggle.click();
            if (mobilePublishPanel.classList.contains("hidden")) mobilePublishToggle.click();
            var dateControls = Array.from(document.querySelectorAll(
              "#modalPurchaseAddonDataBackdrop .pa-publish-date-control",
            ));
            if (dateControls.length !== 2) {
              document.querySelector("#modalPurchaseAddonDataBackdrop .modal-close-btn").click();
              return "mobile publish date controls count: " + dateControls.length;
            }
            var firstDateRect = dateControls[0].getBoundingClientRect();
            var secondDateRect = dateControls[1].getBoundingClientRect();
            if (Math.abs(firstDateRect.top - secondDateRect.top) < 2) {
              document.querySelector("#modalPurchaseAddonDataBackdrop .modal-close-btn").click();
              return "mobile publish date controls should stack vertically";
            }
            if (secondDateRect.top <= firstDateRect.bottom) {
              document.querySelector("#modalPurchaseAddonDataBackdrop .modal-close-btn").click();
              return "mobile publish second date should be below first date";
            }
            document.querySelector("#modalPurchaseAddonDataBackdrop .modal-close-btn").click();
            var project = checkModal('[data-pa-row-action="project"][data-pa-row-id="product-4"]', "modalPurchaseAddonProjectBackdrop");
            if (project !== true) return project;
            var photo = checkModal('[data-pa-photo-trigger="product-1"]', "modalPurchaseAddonPhotoGalleryBackdrop");
            if (photo !== true) return photo;
            return true;
          })()
        `,
      },
      {
        name: "purchase-addon section collapse toggles body",
        expr: `
          (function () {
            var section = document.querySelector("[data-pa-section]");
            var btn = section.querySelector("[data-pa-section-toggle]");
            var body = section.querySelector(".pa-section-body");
            var firstHeader = document.querySelector("[data-pa-table-body='product']")
              .closest("table")
              .querySelector("th:nth-child(2)");
            if (getComputedStyle(firstHeader).textAlign !== "center")
              return "table header should be centered";
            if (body.classList.contains("pa-hidden")) return "body should start open";
            btn.click();
            if (!body.classList.contains("pa-hidden")) return "body did not close";
            btn.click();
            if (body.classList.contains("pa-hidden")) return "body did not reopen";
            return true;
          })()
        `,
      },
      ...SHELL_CHECKS,
      ...SESSION_MODAL_CHECKS,
    ],
  },
  {
    file: "room-type.html",
    readyExpr: `
      !document.querySelector("[data-partial]") &&
      !!document.getElementById("sidebar") &&
      !!document.getElementById("modalLogoutBackdrop") &&
      !!document.getElementById("modalRoomTypeNewBackdrop") &&
      document.querySelectorAll("#roomTypeCardList .room-type-card").length === 2
    `,
    checks: [
      APP_CSS_LOADED_CHECK,
      {
        name: "啟用/停用 filter tab shows correct card subset (2 active + 4 deleted, 6 total)",
        expr: `
          (function () {
            var activeCards = document.querySelectorAll("#roomTypeCardList .room-type-card");
            if (activeCards.length !== 2) return "default (啟用 tab) card count: " + activeCards.length;
            var modify = document.querySelectorAll(".room-type-btn-modify").length;
            if (modify !== 2) return "啟用 tab modify-button count: " + modify;

            var deletedTab = document.querySelector('[data-status-filter="deleted"]');
            deletedTab.click();
            var deletedCards = document.querySelectorAll("#roomTypeCardList .room-type-card");
            if (deletedCards.length !== 4) return "停用 tab card count: " + deletedCards.length;
            var view = document.querySelectorAll(".room-type-btn-view").length;
            if (view !== 4) return "停用 tab view-button count: " + view;
            if (!deletedTab.classList.contains("is-active")) return "停用 tab did not get is-active";

            var activeTab = document.querySelector('[data-status-filter="active"]');
            activeTab.click();
            var backToActive = document.querySelectorAll("#roomTypeCardList .room-type-card");
            if (backToActive.length !== 2) return "switching back to 啟用 tab card count: " + backToActive.length;
            return true;
          })()
        `,
      },
      {
        name: "tab count suffix reflects live data (figma-go node 2140:106117)",
        expr: `
          (function () {
            var activeCount = document.getElementById("roomTypeActiveCount");
            var deletedCount = document.getElementById("roomTypeDeletedCount");
            if (activeCount.textContent !== "（2）") return "initial active count text: " + activeCount.textContent;
            if (deletedCount.textContent !== "（4）") return "initial deleted count text: " + deletedCount.textContent;

            document.querySelector('[data-card-action="disable"][data-card-id="room-1"]').click();
            if (activeCount.textContent !== "（1）") return "active count after disabling room-1: " + activeCount.textContent;
            if (deletedCount.textContent !== "（5）") return "deleted count after disabling room-1: " + deletedCount.textContent;

            document.querySelector('[data-status-filter="deleted"]').click();
            document.querySelector('[data-card-action="enable"][data-card-id="room-1"]').click();
            document.querySelector('[data-status-filter="active"]').click();
            if (activeCount.textContent !== "（2）") return "active count after restoring room-1: " + activeCount.textContent;
            if (deletedCount.textContent !== "（4）") return "deleted count after restoring room-1: " + deletedCount.textContent;
            return true;
          })()
        `,
      },
      {
        name: "empty filter shows correct placeholder message (figma-go node 2139:105859)",
        expr: `
          (function () {
            // 啟用 tab 淨空：把兩張啟用中的卡都停用
            document.querySelector('[data-card-action="disable"][data-card-id="room-1"]').click();
            document.querySelector('[data-card-action="disable"][data-card-id="room-2"]').click();
            var list = document.getElementById("roomTypeCardList");
            if (list.textContent.trim() !== "沒有任何啟用中的卡片")
              return "啟用 tab empty message: " + JSON.stringify(list.textContent.trim());

            // 停用 tab 淨空：把全部 6 張都啟用回去
            document.querySelector('[data-status-filter="deleted"]').click();
            ["room-1", "room-2", "room-3", "room-4", "room-5", "room-6"].forEach(function (id) {
              var btn = document.querySelector('[data-card-action="enable"][data-card-id="' + id + '"]');
              if (btn) btn.click();
            });
            if (list.textContent.trim() !== "沒有任何停用中的卡片")
              return "停用 tab empty message: " + JSON.stringify(list.textContent.trim());

            // 還原成原始 6 卡資料狀態（room-1/2 啟用中，其餘停用），
            // 不用 location.reload()（會打斷同一個 page session 後續 check）；
            // 這 4 張目前全是「啟用」狀態，要先切到啟用 tab 才找得到它們的
            // disable 按鈕（它們此刻不會出現在停用 tab 底下）
            document.querySelector('[data-status-filter="active"]').click();
            ["room-3", "room-4", "room-5", "room-6"].forEach(function (id) {
              var btn = document.querySelector('[data-card-action="disable"][data-card-id="' + id + '"]');
              if (btn) btn.click();
            });
            var restored = document.querySelectorAll("#roomTypeCardList .room-type-card");
            if (restored.length !== 2) return "restore after empty-state test, 啟用 tab count: " + restored.length;
            return true;
          })()
        `,
      },
      {
        name: "disable/enable toggle moves card between filter tabs (state + ribbon follow along)",
        expr: `
          (function () {
            // 這個 check 開始時預期在「啟用」tab（上一個 check 結束時切回去的狀態）
            var disableBtn = document.querySelector('[data-card-action="disable"][data-card-id="room-1"]');
            if (!disableBtn) return "room-1 disable button not found (啟用 tab)";
            disableBtn.click();
            // 啟用 tab 底下 room-1 停用後應該從目前篩選結果消失（不是原地換按鈕）
            if (document.querySelector('[data-card-id="room-1"]')) return "room-1 still visible under 啟用 tab after disable";
            if (document.querySelectorAll("#roomTypeCardList .room-type-card").length !== 1)
              return "啟用 tab count after disabling room-1: " + document.querySelectorAll("#roomTypeCardList .room-type-card").length;

            document.querySelector('[data-status-filter="deleted"]').click();
            var enableBtn = document.querySelector('[data-card-action="enable"][data-card-id="room-1"]');
            if (!enableBtn) return "room-1 not found under 停用 tab after disable";
            enableBtn.click();
            if (document.querySelector('[data-card-id="room-1"]')) return "room-1 still visible under 停用 tab after enable";

            document.querySelector('[data-status-filter="active"]').click();
            var restored = document.querySelectorAll("#roomTypeCardList .room-type-card");
            if (restored.length !== 2) return "啟用 tab count after restoring room-1: " + restored.length;
            if (!document.querySelector('[data-card-id="room-1"]')) return "room-1 did not come back under 啟用 tab";
            return true;
          })()
        `,
      },
      {
        name: "new/edit/view data modal open/close",
        expr: `
          (function () {
            // 修改 trigger 只在啟用 tab 出現，查看 trigger 只在停用 tab 出現，
            // 兩者互斥於同一個篩選結果，測試需要切換 tab 才能各自找到觸發器
            var a = __smoke.modalCheck('[data-modal-open="modalRoomTypeNewBackdrop"]', "modalRoomTypeNewBackdrop");
            if (a !== true) return "new: " + a;
            var b = __smoke.modalCheck('[data-modal-open="modalRoomTypeEditBackdrop"]', "modalRoomTypeEditBackdrop");
            if (b !== true) return "edit: " + b;
            document.querySelector('[data-status-filter="deleted"]').click();
            var c = __smoke.modalCheck('[data-modal-open="modalRoomTypeViewBackdrop"]', "modalRoomTypeViewBackdrop");
            if (c !== true) return "view: " + c;
            document.querySelector('[data-status-filter="active"]').click();
            return true;
          })()
        `,
      },
      {
        name: "room count change reveals inventory toggle (new/edit)",
        expr: `
          (function () {
            function check(triggerSel, modalId) {
              document.querySelector(triggerSel).click();
              var modal = document.getElementById(modalId);
              var input = modal.querySelector("[data-room-count-input]");
              var delta = modal.querySelector("[data-room-count-delta]");
              var inventoryRow = modal.querySelector("[data-room-inventory-row]");
              var inventoryToggle = modal.querySelector("[data-room-inventory-toggle]");
              var inventoryHint = modal.querySelector("[data-room-inventory-hint]");
              var networkRow = modal.querySelector("[data-room-network-row]");
              if (!input || input.type !== "number") return modalId + " room count input type";
              if (input.value !== "14") return modalId + " initial room count: " + input.value;
              if (!delta.classList.contains("hidden")) return modalId + " delta should start hidden";
              if (!inventoryRow.classList.contains("hidden"))
                return modalId + " inventory row should start hidden";

              input.value = "15";
              input.dispatchEvent(new Event("input", { bubbles: true }));
              if (delta.textContent.trim() !== "增加 1 間")
                return modalId + " increase delta: " + delta.textContent.trim();
              if (inventoryRow.classList.contains("hidden"))
                return modalId + " inventory row did not show";
              if (!networkRow.classList.contains("is-room-count-changed"))
                return modalId + " network row did not span";
              if (!input.classList.contains("is-room-count-changed"))
                return modalId + " input did not get changed state";
              if (inventoryHint.textContent.trim() !== "不更新房型庫存")
                return modalId + " closure hint: " + inventoryHint.textContent.trim();

              inventoryToggle.click();
              if (inventoryHint.textContent.trim() !== "同步更新房型庫存，至 2027-09-11")
                return modalId + " active hint: " + inventoryHint.textContent.trim();
              if (!inventoryHint.classList.contains("text-brand-500"))
                return modalId + " active hint color class missing";

              input.value = "11";
              input.dispatchEvent(new Event("input", { bubbles: true }));
              if (delta.textContent.trim() !== "減少 3 間")
                return modalId + " decrease delta: " + delta.textContent.trim();

              input.value = "14";
              input.dispatchEvent(new Event("input", { bubbles: true }));
              if (!delta.classList.contains("hidden")) return modalId + " delta did not hide";
              if (!inventoryRow.classList.contains("hidden"))
                return modalId + " inventory row did not hide";
              if (inventoryToggle.checked) return modalId + " inventory toggle did not reset";
              modal.querySelector(".modal-close-btn").click();
              return true;
            }

            var newResult = check(
              '[data-modal-open="modalRoomTypeNewBackdrop"]',
              "modalRoomTypeNewBackdrop",
            );
            if (newResult !== true) return newResult;
            var editResult = check(
              '[data-modal-open="modalRoomTypeEditBackdrop"]',
              "modalRoomTypeEditBackdrop",
            );
            if (editResult !== true) return editResult;
            return true;
          })()
        `,
      },
      {
        name: "view modal uses disabled room inventory active state",
        expr: `
          (function () {
            document.querySelector('[data-status-filter="deleted"]').click();
            document.querySelector('[data-modal-open="modalRoomTypeViewBackdrop"]').click();
            var modal = document.getElementById("modalRoomTypeViewBackdrop");
            var input = modal.querySelector("[data-room-count-input]");
            var delta = modal.querySelector("[data-room-count-delta]");
            var inventoryRow = modal.querySelector("[data-room-inventory-row]");
            var inventoryToggle = modal.querySelector("[data-room-inventory-toggle]");
            var inventoryHint = modal.querySelector("[data-room-inventory-hint]");
            var networkRow = modal.querySelector("[data-room-network-row]");
            var disabledSwitch = inventoryToggle && inventoryToggle.closest(".member-data-switch");
            var track = disabledSwitch && disabledSwitch.querySelector(".member-data-switch-track");
            if (!input || input.type !== "number" || !input.disabled)
              return "view room count input disabled/type mismatch";
            if (input.value !== "15") return "view room count value: " + input.value;
            if (delta.textContent.trim() !== "增加 1 間")
              return "view delta: " + delta.textContent.trim();
            if (inventoryRow.classList.contains("hidden")) return "view inventory row hidden";
            if (!inventoryToggle.checked || !inventoryToggle.disabled)
              return "view inventory toggle checked/disabled mismatch";
            if (inventoryHint.textContent.trim() !== "同步更新房型庫存，至 2027-09-11")
              return "view inventory hint: " + inventoryHint.textContent.trim();
            if (inventoryHint.classList.contains("text-brand-500"))
              return "view inventory hint should not use active brand class";
            if (!networkRow.classList.contains("is-room-count-changed"))
              return "view network row did not span";
            var trackColor = getComputedStyle(track).backgroundColor;
            if (trackColor === "rgb(52, 199, 89)")
              return "view disabled checked toggle should not be green";
            modal.querySelector(".modal-close-btn").click();
            document.querySelector('[data-status-filter="active"]').click();
            return true;
          })()
        `,
      },
      {
        name: "facility chip toggle (new modal)",
        expr: `
          (function () {
            document.querySelector('[data-modal-open="modalRoomTypeNewBackdrop"]').click();
            var chip = document.querySelector("#roomTypeNewFacilityChips .room-type-facility-chip");
            var before = chip.dataset.facilitySelected;
            chip.click();
            if (chip.dataset.facilitySelected === before) return "chip state did not toggle";
            document.querySelector("#modalRoomTypeNewBackdrop .modal-close-btn").click();
            return true;
          })()
        `,
      },
      {
        name: "photo-gallery modal open/close (independent per card)",
        expr: `
          (function () {
            var res = __smoke.modalCheck('[data-room-type-photo-trigger="room-1"]', "modalRoomTypePhotoGalleryBackdrop");
            if (res !== true) return res;
            document.querySelector('[data-room-type-photo-trigger="room-2"]').click();
            var grid = document.getElementById("roomTypePhotoCardGrid");
            if (!grid || grid.children.length !== 5) return "photo grid slot count: " + (grid && grid.children.length);
            document.querySelector("#modalRoomTypePhotoGalleryBackdrop .modal-close-btn").click();
            return true;
          })()
        `,
      },
      ...SHELL_CHECKS,
      ...SESSION_MODAL_CHECKS,
    ],
  },
];

// 忽略与頁面品質無關的訊息（favicon 未提供是已知狀態）
function ignorable(text) {
  return /favicon/i.test(text);
}

async function evaluate(cdp, sessionId, expression) {
  const res = await cdp.send(
    "Runtime.evaluate",
    { expression, returnByValue: true, awaitPromise: true },
    sessionId,
  );
  if (res.exceptionDetails) {
    const d = res.exceptionDetails;
    throw new Error(
      "evaluate threw: " + (d.exception && d.exception.description || d.text),
    );
  }
  return res.result.value;
}

async function pollReady(cdp, sessionId, expr) {
  const deadline = Date.now() + READY_TIMEOUT_MS;
  while (Date.now() < deadline) {
    try {
      if (await evaluate(cdp, sessionId, "!!(" + expr + ")")) return;
    } catch {
      /* page mid-navigation; retry */
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("page ready condition timed out");
}

async function testPage(cdp, baseUrl, page, consoleErrors) {
  const failures = [];
  const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await cdp.send("Target.attachToTarget", {
    targetId,
    flatten: true,
  });
  consoleErrors.set(sessionId, []);
  await cdp.send("Page.enable", {}, sessionId);
  await cdp.send("Runtime.enable", {}, sessionId);
  await cdp.send("Log.enable", {}, sessionId);

  const loaded = new Promise((resolve) => {
    cdp.onEvent((msg) => {
      if (msg.method === "Page.loadEventFired" && msg.sessionId === sessionId)
        resolve();
    });
  });
  await cdp.send("Page.navigate", { url: baseUrl + "/" + page.file }, sessionId);
  await loaded;

  try {
    await pollReady(cdp, sessionId, page.readyExpr);
  } catch (err) {
    failures.push("READY: " + err.message);
    await cdp.send("Target.closeTarget", { targetId });
    return failures;
  }

  await evaluate(cdp, sessionId, PAGE_HELPERS);

  for (const check of page.checks) {
    try {
      if (check.viewport) {
        await cdp.send(
          "Emulation.setDeviceMetricsOverride",
          {
            width: check.viewport.width,
            height: check.viewport.height,
            deviceScaleFactor: 1,
            mobile: !!check.viewport.mobile,
          },
          sessionId,
        );
      }
      const result = await evaluate(cdp, sessionId, check.expr);
      if (result !== true) failures.push(check.name + ": " + result);
    } catch (err) {
      failures.push(check.name + ": " + err.message);
    } finally {
      if (check.viewport) {
        await cdp.send("Emulation.clearDeviceMetricsOverride", {}, sessionId);
      }
    }
  }

  const errors = consoleErrors.get(sessionId).filter((t) => !ignorable(t));
  if (errors.length) {
    failures.push("console errors: " + errors.join(" | "));
  }

  await cdp.send("Target.closeTarget", { targetId });
  return failures;
}

async function main() {
  const httpPort = await freePort();
  const server = spawn("python3", [
    "-m",
    "http.server",
    String(httpPort),
    "--directory",
    PREVIEW_DIR,
    "--bind",
    "127.0.0.1",
  ]);
  const userDataDir = mkdtempSync(join(tmpdir(), "swift-smoke-"));
  let chrome = null;
  let failed = false;

  try {
    const baseUrl = "http://127.0.0.1:" + httpPort;
    await waitHttp(baseUrl + "/landing.html", 8000);

    const launched = await launchChrome(userDataDir);
    chrome = launched.proc;
    const ws = await connectWs(launched.wsUrl);
    const cdp = new CDP(ws);

    // console error 收集（跨 session，依 sessionId 分流）
    const consoleErrors = new Map();
    cdp.onEvent((msg) => {
      const bucket = consoleErrors.get(msg.sessionId);
      if (!bucket) return;
      if (msg.method === "Runtime.exceptionThrown") {
        const d = msg.params.exceptionDetails;
        bucket.push(
          "exception: " + ((d.exception && d.exception.description) || d.text),
        );
      } else if (
        msg.method === "Runtime.consoleAPICalled" &&
        msg.params.type === "error"
      ) {
        bucket.push(
          "console.error: " +
            msg.params.args.map((a) => a.value ?? a.description ?? "").join(" "),
        );
      } else if (
        msg.method === "Log.entryAdded" &&
        msg.params.entry.level === "error"
      ) {
        bucket.push(
          "log: " + msg.params.entry.text + " (" + (msg.params.entry.url || "") + ")",
        );
      }
    });

    for (const page of PAGES) {
      const failures = await testPage(cdp, baseUrl, page, consoleErrors);
      if (failures.length === 0) {
        console.log("PASS " + page.file + " (" + page.checks.length + " checks)");
      } else {
        failed = true;
        console.log("FAIL " + page.file);
        for (const f of failures) console.log("  - " + f);
      }
    }
    ws.close();
  } finally {
    if (chrome) {
      const exited = new Promise((r) => chrome.on("exit", r));
      chrome.kill();
      await exited;
    }
    server.kill();
    rmSync(userDataDir, { recursive: true, force: true, maxRetries: 3 });
  }

  if (failed) {
    console.log("smoke test FAILED");
    process.exit(1);
  }
  console.log("smoke test passed (" + PAGES.length + " pages)");
}

main().catch((err) => {
  console.error("smoke test error: " + err.message);
  process.exit(1);
});
