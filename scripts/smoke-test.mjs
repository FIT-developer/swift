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
        "purchase-addon.css",
        "project-content.css",
        "project-content-wizard.css",
        "quantity-price-table.css"
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
      {
        name: "room-edit entries preserve current and legacy contracts",
        expr: `
          (function () {
            var modal = document.getElementById("modalRoomEditBackdrop");
            var triggers = document.querySelectorAll('[data-modal-open="modalRoomEditBackdrop"]');
            if (!modal) return "room-edit modal missing";
            if (triggers.length !== 3) return "room-edit trigger count: " + triggers.length;
            if (triggers[0].dataset.roomEditVariant !== "current")
              return "first edit variant should be current";
            if (triggers[1].dataset.roomEditVariant !== "legacy" ||
                triggers[2].dataset.roomEditVariant !== "legacy")
              return "second and third edit variants should be legacy";
            triggers[0].click();
            if (!modal.classList.contains("open")) return "first edit did not open modal";
            if (modal.dataset.roomEditActiveVariant !== "current")
              return "first edit did not activate current variant";
            var icon = modal.querySelector('img[src$="adding-people.svg"]');
            if (!icon) return "adding-people icon missing";
            if (icon.closest("[data-room-edit-current-only]").classList.contains("hidden"))
              return "current add-person chip hidden";
            var currentHeaders = Array.from(
              modal.querySelectorAll("[data-room-edit-price-current] th")
            );
            var headerTexts = currentHeaders.map(function (th) {
              return th.textContent.replace(/\\s+/g, " ").trim();
            });
            if (!headerTexts.some(function (text) { return text.includes("多加成人 / +1,000"); }))
              return "adult column missing";
            if (!headerTexts.some(function (text) { return text.includes("多加孩童 / +800"); }))
              return "child column missing";
            var headerAlignments = currentHeaders.map(function (th) {
              return getComputedStyle(th).textAlign;
            });
            if (headerAlignments[0] !== "left")
              return "date header alignment: " + headerAlignments[0];
            if (headerAlignments.slice(1).some(function (alignment) { return alignment !== "center"; }))
              return "non-date header alignments: " + headerAlignments.join(",");
            var steppers = modal.querySelectorAll(".room-edit-addon-stepper");
            if (steppers.length !== 4) return "addon stepper count: " + steppers.length;
            var firstInput = steppers[0].querySelector("input");
            steppers[0].querySelector("button:last-child").click();
            if (firstInput.value !== "5") return "visual-only stepper changed value";
            modal.querySelector('.modal-close-btn[data-modal="modalRoomEditBackdrop"]').click();

            triggers[1].click();
            if (modal.dataset.roomEditActiveVariant !== "legacy")
              return "second edit did not activate legacy variant";
            if (!icon.closest("[data-room-edit-current-only]").classList.contains("hidden"))
              return "legacy variant exposed add-person chip";
            var legacyPrice = modal.querySelector("[data-room-edit-price-legacy]");
            if (legacyPrice.classList.contains("hidden")) return "legacy price table hidden";
            var legacyHeaders = Array.from(legacyPrice.querySelectorAll("th")).map(function (th) {
              return th.textContent.replace(/\\s+/g, " ").trim();
            });
            if (legacyHeaders.join("|") !== "日期|定價調整|定價")
              return "legacy headers: " + legacyHeaders.join("|");
            if (legacyPrice.querySelector(".room-edit-addon-stepper"))
              return "legacy variant exposed add-person stepper";
            modal.querySelector('.modal-close-btn[data-modal="modalRoomEditBackdrop"]').click();

            triggers[2].click();
            if (modal.dataset.roomEditActiveVariant !== "legacy")
              return "third edit did not activate legacy variant";
            modal.querySelector('.modal-close-btn[data-modal="modalRoomEditBackdrop"]').click();
            return true;
          })()
        `,
      },
      {
        name: "room-edit modal uses 800px desktop contract",
        viewport: { width: 1440, height: 1000 },
        expr: `
          (function () {
            var modal = document.getElementById("modalRoomEditBackdrop");
            document.querySelector('[data-modal-open="modalRoomEditBackdrop"]').click();
            var box = modal.querySelector(".modal-box").getBoundingClientRect();
            var table = modal.querySelector("[data-room-edit-price-current] .room-edit-price-table").getBoundingClientRect();
            if (Math.abs(box.width - 800) > 1) return "desktop modal width: " + box.width;
            if (Math.abs(table.width - 768) > 1) return "desktop price table width: " + table.width;
            modal.querySelector('.modal-close-btn[data-modal="modalRoomEditBackdrop"]').click();
            return true;
          })()
        `,
      },
      {
        name: "room-edit legacy modal uses 646px desktop contract",
        viewport: { width: 1440, height: 1000 },
        expr: `
          (function () {
            var modal = document.getElementById("modalRoomEditBackdrop");
            var triggers = document.querySelectorAll('[data-modal-open="modalRoomEditBackdrop"]');
            triggers[1].click();
            var box = modal.querySelector(".modal-box").getBoundingClientRect();
            if (Math.abs(box.width - 646) > 1) return "legacy modal width: " + box.width;
            modal.querySelector('.modal-close-btn[data-modal="modalRoomEditBackdrop"]').click();
            return true;
          })()
        `,
      },
      {
        name: "room-edit modal table scroll stays local on mobile",
        viewport: { width: 375, height: 812, mobile: true },
        expr: `
          (function () {
            var modal = document.getElementById("modalRoomEditBackdrop");
            document.querySelector('[data-modal-open="modalRoomEditBackdrop"]').click();
            var box = modal.querySelector(".modal-box").getBoundingClientRect();
            var scroller = modal.querySelector("[data-room-edit-price-current] .room-edit-price-table").parentElement;
            if (Math.abs(box.width - 375) > 1) return "mobile modal width: " + box.width;
            if (scroller.scrollWidth <= scroller.clientWidth)
              return "price table should overflow its local scroller";
            if (document.documentElement.scrollWidth > 375)
              return "page-level horizontal overflow: " + document.documentElement.scrollWidth;
            modal.querySelector('.modal-close-btn[data-modal="modalRoomEditBackdrop"]').click();
            return true;
          })()
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
        name: "purchase-addon sections, multilingual states, actions, and rows rendered",
        viewport: { width: 1440, height: 1000 },
        expr: `
          (function () {
            var sections = document.querySelectorAll("[data-pa-section]");
            if (sections.length !== 2) return "section count: " + sections.length;
            if (document.querySelector("[data-pa-type-tabs], .pa-type-tab"))
              return "removed product type tabs still rendered";
            var productRows = document.querySelectorAll("[data-pa-table-body='product'] tr");
            var categoryRows = document.querySelectorAll("[data-pa-table-body='category'] tr");
            if (productRows.length !== 14) return "product row count: " + productRows.length;
            if (categoryRows.length !== 14) return "category row count: " + categoryRows.length;
            if (document.querySelector(".pa-legend-icon, .pa-icon-thumbtack-filled"))
              return "removed legend or row icon still rendered";
            var productHeader = document.querySelector(".pa-product-table thead");
            if (!productHeader || productHeader.textContent.indexOf("多語系") === -1)
              return "multilingual column missing";
            var languageBadges = productRows[0].querySelectorAll("[data-pa-language]");
            if (languageBadges.length !== 2)
              return "language badge count: " + languageBadges.length;
            if (!languageBadges[0].classList.contains("is-selected") || languageBadges[1].classList.contains("is-selected"))
              return "initial language selected state mismatch";
            if (productRows[1].querySelectorAll("[data-pa-row-action]").length < 3)
              return "product row 2 management buttons missing";
            if (productRows[2].querySelectorAll("[data-pa-row-action]").length < 3)
              return "product row 3 management buttons missing";
            if (categoryRows[0].querySelectorAll("[data-pa-row-action]").length < 3)
              return "category management buttons missing";
            if (!categoryRows[0].querySelector("[data-pa-row-action='duplicate']"))
              return "category duplicate action missing";
            var firstCategoryCells = categoryRows[0].children;
            if (firstCategoryCells[3].querySelector('img[src$="home.svg"]'))
              return "category lodging home icon should not be in name cell";
            if (firstCategoryCells[4].querySelector("img"))
              return "category row icon should be removed from type cell";
            if (document.querySelector("[data-pa-row-id='product-2'][data-pa-row-action='project']"))
              return "project button should not show without thumbtack state";
            if (!document.querySelector("[data-pa-row-id='product-4'][data-pa-row-action='project']"))
              return "limited project button missing";
            if (!document.querySelector("[data-pa-row-id='product-5'][data-pa-row-action='project']"))
              return "non-limited project button missing";
            if (!document.querySelector("[data-pa-row-id='product-4'][data-pa-row-action='project'].is-limited"))
              return "limited project button should be filled";
            if (document.querySelector("[data-pa-row-id='product-5'][data-pa-row-action='project'].is-limited"))
              return "all-project button should remain unfilled";
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
            var quick = document.querySelector("[data-pa-quick-filters]");
            var quickLabels = Array.from(quick.querySelectorAll(".pa-quick-chip"), function (item) {
              return item.textContent.trim();
            });
            if (quickLabels.join("/") !== "全部/網路可訂/只限現場")
              return "quick filter labels: " + quickLabels.join("/");
            var backendOnly = quick.querySelectorAll(".pa-quick-chip")[2];
            backendOnly.click();
            if (!backendOnly.classList.contains("is-active")) return "quick chip did not activate";

            var language = document.querySelector("[data-pa-language='en'][data-pa-row-id='product-1']");
            language.click();
            language = document.querySelector("[data-pa-language='en'][data-pa-row-id='product-1']");
            if (!language.classList.contains("is-selected") || language.getAttribute("aria-pressed") !== "true")
              return "language badge did not select";
            var zh = document.querySelector("[data-pa-language='zh-TW'][data-pa-row-id='product-1']");
            if (!zh.classList.contains("is-selected"))
              return "language badges should support multi-select";

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
        viewport: { width: 1080, height: 900 },
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
            if (document.querySelectorAll("#modalPurchaseAddonDataBackdrop [data-pa-product-body] .pa-data-modal-copy-card").length !== 2)
              return "visible product data modal copy card count mismatch";
            var dataModalBox = document.querySelector("#modalPurchaseAddonDataBackdrop .modal-box");
            if (Math.abs(dataModalBox.getBoundingClientRect().width - 800) > 1)
              return "desktop data modal width: " + dataModalBox.getBoundingClientRect().width;
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
            if (Math.abs(publishPanel.getBoundingClientRect().width - 378) > 1)
              return "publish panel should use full half-column width: " + publishPanel.getBoundingClientRect().width;
            var publishDateInputs = publishPanel.querySelectorAll("input");
            for (var d = 0; d < publishDateInputs.length; d += 1) {
              if (publishDateInputs[d].scrollWidth > publishDateInputs[d].clientWidth)
                return "publish date text should not be truncated";
            }
            if (publishPanel.querySelector("[data-pa-publish-start-hour], [data-pa-publish-end-hour], [data-pa-publish-time-toggle]"))
              return "removed publish time controls still rendered";
            if (publishPanel.textContent.indexOf("設定開放日期") === -1)
              return "publish date label missing";
            if (publishPanel.textContent.indexOf("設定開放時段") !== -1 || publishPanel.textContent.indexOf("時間範圍") !== -1)
              return "removed publish time copy still rendered";
            if (publishPanel.textContent.indexOf("上架設定") !== -1 || publishPanel.textContent.indexOf("取消") !== -1 || publishPanel.textContent.indexOf("儲存") !== -1)
              return "publish panel contains old popup copy";
            document.querySelector("#modalPurchaseAddonDataBackdrop .modal-close-btn[data-modal='modalPurchaseAddonDataBackdrop']").click();

            document.querySelector('[data-pa-modal-mode="new"][data-pa-kind="category"]').click();
            var categoryModal = document.getElementById("modalPurchaseAddonDataBackdrop");
            var categoryBody = categoryModal.querySelector("[data-pa-category-body]");
            var productBody = categoryModal.querySelector("[data-pa-product-body]");
            if (document.getElementById("paDataModalTitle").textContent.trim() !== "類別新增設定")
              return "category new modal title mismatch";
            if (categoryBody.classList.contains("hidden") || !productBody.classList.contains("hidden"))
              return "category modal body visibility mismatch";
            var categoryText = categoryBody.textContent;
            var categoryRequired = ["排序", "型態", "商品", "品名", "品名文案", "備註文案"];
            for (var c = 0; c < categoryRequired.length; c += 1) {
              if (categoryText.indexOf(categoryRequired[c]) === -1)
                return "category modal missing: " + categoryRequired[c];
            }
            if (categoryText.indexOf("住宿加購") !== -1)
              return "category modal lodging toggle/copy should be removed";
            if (categoryBody.querySelectorAll(".pa-data-modal-copy-card").length !== 2)
              return "category modal copy card count mismatch";
            var categoryType = categoryBody.querySelector("select.pa-data-modal-control");
            if (!categoryType || !categoryType.disabled)
              return "category type should remain disabled";
            var neutralSample = document.createElement("span");
            neutralSample.style.background = "var(--color-neutral-200)";
            document.body.appendChild(neutralSample);
            var neutral200 = getComputedStyle(neutralSample).backgroundColor;
            neutralSample.remove();
            if (getComputedStyle(categoryType).backgroundColor !== neutral200)
              return "category disabled select should use neutral-200";
            categoryModal.querySelector(".modal-close-btn[data-modal='modalPurchaseAddonDataBackdrop']").click();

            document.querySelector('[data-pa-modal-mode="edit"][data-pa-kind="category"]').click();
            if (document.getElementById("paDataModalTitle").textContent.trim() !== "類別修改設定")
              return "category edit modal title mismatch";
            categoryModal.querySelector(".modal-close-btn[data-modal='modalPurchaseAddonDataBackdrop']").click();

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
            if (!document.querySelector("[data-pa-row-id='product-15'][data-pa-row-action='project']"))
              return "deleted limited product should show project button";
            if (document.querySelector("[data-pa-row-id='product-16'][data-pa-row-action='project']"))
              return "deleted product without project state should not show project button";
            document.querySelector("[data-pa-row-id='product-15'][data-pa-row-action='project']").click();
            if (!projectModal.classList.contains("open"))
              return "deleted product project button should open modal";
            if (projectModal.querySelector("[data-pa-project-code]").value !== "3001")
              return "deleted project code mismatch";
            if (projectModal.querySelector("[data-pa-project-name]").value !== "舊版餐券")
              return "deleted project name mismatch";
            if (!projectMode.disabled || !projectCondition.disabled)
              return "deleted project selects should be disabled";
            if (!projectModal.querySelector("[data-pa-project-select-all]").disabled)
              return "deleted project all action should be disabled";
            if (!projectModal.querySelector("[data-pa-project-clear-all]").disabled)
              return "deleted project clear action should be disabled";
            if (Array.from(projectModal.querySelectorAll("[data-pa-project-chip]")).some(function (chip) { return !chip.disabled; }))
              return "deleted project chips should be disabled";
            if (projectModal.querySelector("[data-pa-project-cancel]").textContent.trim() !== "關閉")
              return "deleted project footer should say close";
            if (!projectModal.querySelector("[data-pa-project-save]").classList.contains("hidden"))
              return "deleted project save should be hidden";
            projectModal.querySelector("[data-pa-project-chip]").click();
            if (projectModal.querySelectorAll("[data-pa-project-chip].is-selected").length !== 6)
              return "deleted project chip click should not change selection";
            document.querySelector("#modalPurchaseAddonProjectBackdrop .modal-close-btn[data-modal='modalPurchaseAddonProjectBackdrop']").click();
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
        name: "room-type add-person select contract (0827)",
        expr: `
          (function () {
            var editableModalIds = ["modalRoomTypeNewBackdrop", "modalRoomTypeEditBackdrop"];
            for (var i = 0; i < editableModalIds.length; i += 1) {
              var editable = document.querySelector("#" + editableModalIds[i] + " [data-room-extra-people]");
              if (!editable) return editableModalIds[i] + " add-person select missing";
              if (editable.disabled) return editableModalIds[i] + " add-person select disabled";
              var labels = Array.from(editable.options).map(function (option) {
                return option.textContent.trim();
              });
              if (labels.join("|") !== "不可加人|1|2")
                return editableModalIds[i] + " options: " + labels.join("|");
              editable.value = "2";
              if (editable.value !== "2") return editableModalIds[i] + " cannot select 2";
            }

            var view = document.querySelector("#modalRoomTypeViewBackdrop [data-room-extra-people]");
            if (!view) return "view add-person select missing";
            if (!view.disabled) return "view add-person select should be disabled";
            if (view.value !== "2") return "view add-person value: " + view.value;
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
  {
    file: "project-content.html",
    readyExpr: `!document.querySelector("[data-partial]") && document.querySelectorAll("[data-pc-card]").length === 4 && !!document.getElementById("pcProjectForm")`,
    checks: [
      APP_CSS_LOADED_CHECK,
      {
        name: "project-content current cards, menu and defaults",
        viewport: { width: 1440, height: 1000 },
        expr: `(function () {
          window.__pcQa = {
            q: function (s) { return document.querySelector(s); },
            close: function () {
              var sheet = document.getElementById('pcwDateSheet');
              if (sheet.classList.contains('open')) sheet.querySelector('[data-pcw-sheet-close]').click();
              document.querySelectorAll('.modal-backdrop.open .modal-close-btn').forEach(function (b) { if (b.getClientRects().length) b.click(); });
            },
            open: function () { this.close(); this.q('[data-pc-modal-mode="new"]').click(); },
            go: function (step) {
              var form = this.q('#pcProjectForm');
              while (Number(form.dataset.pcwCurrentStep) < step) this.q('[data-pcw-footer="' + form.dataset.pcwCurrentStep + '"] [data-pcw-next]').click();
              while (Number(form.dataset.pcwCurrentStep) > step) this.q('[data-pcw-footer="' + form.dataset.pcwCurrentStep + '"] [data-pcw-previous]').click();
            }
          };
          var cards = document.querySelectorAll('[data-pc-card]');
          if (cards.length !== 4 || document.querySelectorAll('[data-pc-status]').length !== 3) return 'card/status count';
          if(Array.from(document.querySelectorAll('[data-pc-status-count]')).map(function(n){return n.textContent;}).join('|')!=='4|2|2')return 'initial tab totals';
          if (document.querySelector('[data-pc-kind="gha"]')) return 'obsolete GHA tab';
          if (document.querySelectorAll('.pc-card-mobile-media .pc-badge--template').length !== 1) return 'template hint count';
          if (getComputedStyle(cards[0].querySelector('.pc-card-mobile-media')).display === 'none') return '522px card must use mobile structure';
          if (cards[0].getBoundingClientRect().height !== cards[1].getBoundingClientRect().height) return 'same row unequal height';
          var product = Array.from(document.querySelectorAll('.accordion-trigger')).find(function(b){return b.textContent.includes('產品設定');});
          var labels = Array.from(product.nextElementSibling.children).map(function(n){return n.textContent.trim();});
          if (labels.join('|') !== 'ota|專案內容|數量價格表') return 'product menu: ' + labels.join('|');
          return true;
        })()`,
      },
      {
        name: "project status transitions, independent accordions and sort scope",
        expr: `(function () {
          var q=__pcQa.q;
          function totals(){return Array.from(document.querySelectorAll('[data-pc-status-count]')).map(function(n){return n.textContent;}).join('|');}
          q('[data-pc-status="online"]').click();
          if(document.querySelectorAll('[data-pc-card]').length!==2 || totals()!=='4|2|2') return 'online filter/totals';
          q('[data-pc-action="offline"]').click();
          if(document.querySelectorAll('[data-pc-card]').length!==1 || totals()!=='4|1|3') return 'disabled card/totals not updated immediately';
          q('[data-pc-status="offline"]').click();
          if(document.querySelectorAll('[data-pc-card]').length!==3 || totals()!=='4|1|3' || !q('[data-pc-sort-actions]').hidden) return 'offline filter/totals/sort visibility';
          q('[data-pc-action="online"][data-pc-card-id="project-199-a"]').click();
          if(document.querySelectorAll('[data-pc-card]').length!==2 || totals()!=='4|2|2')return 'enabled card/totals not updated immediately';
          q('[data-pc-status="all"]').click();
          if(document.querySelectorAll('[data-pc-card]').length!==4 || totals()!=='4|2|2')return 'all totals depend on active tab';
          if(document.querySelectorAll('[data-pc-sort]:disabled').length!==2) return 'all filter disabled sorts';
          q('[data-pc-save-sort]').click();
          if(q('[data-pc-save-sort]').dataset.pcSavedCount!=='2') return 'save sort included inactive cards';
          var detail=q('[data-pc-accordion-toggle="details"]'), setting=q('[data-pc-accordion-toggle="settings"]');
          detail.click();
          if(detail.getAttribute('aria-expanded')!=='false' || setting.getAttribute('aria-expanded')!=='true') return 'accordions coupled';
          detail.click();
          var shell=q('[data-pc-table-scroll]');
          if(shell.scrollWidth<=shell.clientWidth) return 'settings table should retain width';
          return true;
        })()`,
      },
      {
        name: "project status totals include zero-count groups and preserve the full total",
        expr: `(function () {
          var q=__pcQa.q;
          function totals(){return Array.from(document.querySelectorAll('[data-pc-status-count]')).map(function(n){return n.textContent;}).join('|');}
          q('[data-pc-status="online"]').click();
          Array.from(document.querySelectorAll('[data-pc-action="offline"]')).map(function(b){return b.dataset.pcCardId;}).forEach(function(id){q('[data-pc-action="offline"][data-pc-card-id="'+id+'"]').click();});
          if(totals()!=='4|0|4' || document.querySelectorAll('[data-pc-card]').length!==0)return 'zero online count or full total';
          q('[data-pc-status="offline"]').click();
          Array.from(document.querySelectorAll('[data-pc-action="online"]')).map(function(b){return b.dataset.pcCardId;}).forEach(function(id){q('[data-pc-action="online"][data-pc-card-id="'+id+'"]').click();});
          if(totals()!=='4|4|0' || document.querySelectorAll('[data-pc-card]').length!==0)return 'zero offline count or full total';
          q('[data-pc-status="all"]').click();
          ['project-155-a','project-155-b'].forEach(function(id){q('[data-pc-action="offline"][data-pc-card-id="'+id+'"]').click();});
          return totals()==='4|2|2' && document.querySelectorAll('[data-pc-card]').length===4;
        })()`,
      },
      {
        name: "GHA modal retains cards, toggle ribbon and all close paths",
        expr: `(function () {
          var result=__smoke.modalCheck('[data-pc-open-gha]','modalProjectGhaBackdrop'); if(result!==true)return result;
          result=__smoke.escCheck('[data-pc-open-gha]','modalProjectGhaBackdrop'); if(result!==true)return result;
          __pcQa.q('[data-pc-open-gha]').click();
          if(document.querySelectorAll('[data-pc-gha-card]').length!==4) return 'GHA card count';
          var toggle=__pcQa.q('[data-pc-gha-toggle]'), ribbon=toggle.closest('[data-pc-gha-card]').querySelector('[data-pc-gha-ribbon]');
          toggle.click(); if(ribbon.dataset.pcGhaEnabled!=='true')return 'GHA yellow ribbon missing';
          toggle.click(); if(ribbon.dataset.pcGhaEnabled!=='false')return 'GHA gray ribbon missing';
          __pcQa.q('[data-pc-gha-close]').click();
          return !__pcQa.q('#modalProjectGhaBackdrop').classList.contains('open') && document.body.style.overflow!== 'hidden';
        })()`,
      },
      {
        name: "wizard step1 contract, state preservation and per-step clear",
        expr: `(function () {
          __pcQa.open(); var q=__pcQa.q, form=q('#pcProjectForm');
          if(q('[data-pcw-title]').textContent!=='新增' || q('[data-pcw-subtitle]').textContent!=='專案')return 'wizard heading';
          if(form.querySelectorAll('[name="sortOrder"]').length!==1 || form.querySelectorAll('[name="refund"][role="switch"]').length!==1)return 'duplicate sort/old refund';
          var meal=q('#pcwMealPlan').getBoundingClientRect(), info=q('.pcw-info-button').getBoundingClientRect();
          if(Math.abs(info.left-meal.right-12)>0.5 || info.width!==24 || info.height!==24 || Math.abs(info.top+info.height/2-meal.top-meal.height/2)>0.5)return 'meal info icon must sit outside field with 12px gap';
          var name=form.elements.projectName; name.value='session value';
          __pcQa.go(2); __pcQa.go(1); if(name.value!=='session value')return 'step navigation lost input';
          q('[data-pcw-footer="1"] [data-pcw-clear]').click(); if(name.value!=='')return 'step1 clear';
          name.value='keep step1'; __pcQa.go(2); q('[data-pcw-footer="2"] [data-pcw-clear]').click();
          if(q('[data-pcw-joined-count]').textContent!=='0' || q('[data-pcw-source-count]').textContent!=='15')return 'step2 clear scope';
          __pcQa.go(1); if(name.value!=='keep step1')return 'step2 clear erased step1';
          __pcQa.close(); return true;
        })()`,
      },
      {
        name: "definition pool membership, source total and single-day assignment",
        viewport: {width:1440,height:1000},
        expr: `(function () {
          __pcQa.open(); __pcQa.go(2); var q=__pcQa.q;
          if(q('[data-pcw-joined-count]').textContent!=='3' || q('[data-pcw-source-count]').textContent!=='15')return 'initial counts';
          if(q('[data-pcw-template]').options[0].text!=='avcd001')return 'template select';
          q('[data-pcw-source="d2"]').click(); if(q('[data-pcw-joined-count]').textContent!=='4')return 'source add';
          var toggle=q('[data-pcw-remove="d2"]'); if(!toggle.checked)return 'added definition not true';
          toggle.click(); if(q('[data-pcw-remove="d2"]') || q('[data-pcw-joined-count]').textContent!=='3')return 'false must remove';
          q('[data-pcw-date="2026-03-03"]').click();
          var popover=q('.pcw-day-popover'); if(popover.hidden || popover.querySelectorAll('[data-pcw-choose]').length!==3 || popover.querySelector('[data-pcw-choose="d2"]'))return 'day pool options';
          popover.querySelector('[data-pcw-choose="d3"]').click();
          if(q('[data-pcw-date="2026-03-03"]').dataset.pcwApplied!=='d3')return 'calendar did not update';
          popover.querySelector('[data-pcw-choose="d3"]').click();
          if(popover.querySelector('[data-pcw-choose="d3"]').getAttribute('aria-pressed')!=='true')return 'active choice deselected';
          var bounds=popover.getBoundingClientRect(); if(bounds.left<12 || bounds.right>document.documentElement.clientWidth-12)return 'popover outside viewport';
          document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));
          if(!popover.hidden || !q('#modalProjectContentBackdrop').classList.contains('open'))return 'popover Escape closed parent';
          q('[data-pcw-remove="d3"]').click();
          if(q('[data-pcw-date="2026-03-03"]').dataset.pcwApplied==='d3')return 'dangling assignment';
          if(q('[data-pcw-source-count]').textContent!=='15')return 'source total changed';
          __pcQa.close(); return true;
        })()`,
      },
      {
        name: "long press sorting, bounded scrollers, cancel and save",
        viewport: {width:1440,height:1000},
        expr: `(async function () {
          __pcQa.open(); __pcQa.go(2); var q=__pcQa.q;
          Array.from(document.querySelectorAll('[data-pcw-source][aria-pressed="false"]')).map(function(b){return b.dataset.pcwSource;}).forEach(function(id){q('[data-pcw-source="'+id+'"]').click();});
          var list=q('[data-pcw-joined-list]'), source=q('[data-pcw-source-list]');
          if(list.children.length!==15 || list.clientHeight!==264 || source.clientHeight!==330 || list.scrollHeight<=list.clientHeight || source.scrollHeight<=source.clientHeight)return 'capped independent scrollers';
          var original=Array.from(list.children).map(function(n){return n.dataset.pcwDefinition;}).join('|');
          var first=list.firstElementChild, box=first.getBoundingClientRect();
          first.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:42,button:0,clientX:box.left+45,clientY:box.top+20}));
          await new Promise(function(r){setTimeout(r,500);});
          list.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:42}));
          if(!list.classList.contains('is-reordering') || list.clientHeight!==272)return 'long press did not enter sort mode';
          if(!Array.from(source.querySelectorAll('button')).every(function(b){return b.disabled;}))return 'source active during reorder';
          first.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));
          q('[data-pcw-cancel-order]').click();
          if(Array.from(list.children).map(function(n){return n.dataset.pcwDefinition;}).join('|')!==original)return 'cancel did not restore';
          first=list.firstElementChild; box=first.getBoundingClientRect();
          first.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:43,button:0,clientX:box.left+45,clientY:box.top+20}));
          await new Promise(function(r){setTimeout(r,500);});
          list.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:43}));
          first.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));
          q('[data-pcw-save-order]').click();
          if(Array.from(list.children).map(function(n){return n.dataset.pcwDefinition;}).join('|')===original)return 'save did not apply';
          if(q('[data-pcw-date="2026-03-06"]').dataset.pcwApplied!=='d3')return 'saved priority did not update calendar';
          __pcQa.close();return true;
        })()`,
      },
      {
        name: "definition ranks use Figma digit icons and follow order, membership and prices",
        viewport: {width:1440,height:1000},
        expr: `(function () {
          __pcQa.open(); __pcQa.go(2); var q=__pcQa.q, list=q('[data-pcw-joined-list]');
          function order(){return Array.from(list.children).map(function(row){return row.dataset.pcwDefinition;}).join('|');}
          function iconsMatch(rows){return rows.every(function(row,index){
            var icon=row.querySelector('[data-pcw-rank]'), rank=String(index+1);
            return icon && icon.getAttribute('aria-label')===rank && icon.textContent==='' &&
              Array.from(icon.querySelectorAll('img')).every(function(img){var box=img.getBoundingClientRect();return box.width===24 && box.height===24;}) &&
              Array.from(icon.querySelectorAll('img')).map(function(img){return img.getAttribute('src');}).join('|')===
              rank.split('').map(function(digit){return './assets/icons/number-'+digit+'.svg';}).join('|');
          });}
          if(order()!=='d1|d3|d4' || !iconsMatch(Array.from(list.children)))return 'initial ranks must be 1,2,3';
          __pcQa.go(3);
          var price=q('[data-pcw-price="room-a-d3"]'); price.value='2345'; price.dispatchEvent(new Event('input',{bubbles:true}));
          __pcQa.go(2);
          q('[data-pcw-date="2026-03-03"]').click(); q('.pcw-day-popover [data-pcw-choose="d3"]').click();
          document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));
          function swap(){var row=q('[data-pcw-definition="d3"]');
            row.dispatchEvent(new KeyboardEvent('keydown',{key:' ',bubbles:true}));
            row.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));}
          swap();
          if(order()!=='d1|d4|d3' || !iconsMatch(Array.from(list.children)))return '2/3 exchange did not renumber immediately';
          q('[data-pcw-cancel-order]').click();
          if(order()!=='d1|d3|d4' || !iconsMatch(Array.from(list.children)))return 'cancel did not restore ranks';
          swap(); q('[data-pcw-save-order]').click();
          if(order()!=='d1|d4|d3' || !iconsMatch(Array.from(list.children)))return 'saved rank order';
          if(q('[data-pcw-date="2026-03-03"]').dataset.pcwApplied!=='d3')return 'rank changed assigned definition identity';
          __pcQa.go(3);
          var groups=Array.from(document.querySelectorAll('[data-pcw-room],[data-pcw-extra]'));
          if(groups.length!==4 || groups.some(function(group){
            var rows=Array.from(group.querySelectorAll('.pcw-price-row'));
            return !iconsMatch(rows) || rows.map(function(row){return row.querySelector('input').dataset.pcwPrice.slice(-2);}).join('|')!=='d1|d4|d3';
          }))return 'price groups do not follow saved ranks';
          if(q('[data-pcw-price="room-a-d3"]').value!=='2345')return 'price moved to another definition';
          __pcQa.go(2); q('[data-pcw-remove="d1"]').click();
          if(order()!=='d4|d3' || !iconsMatch(Array.from(list.children)))return 'remove did not close rank gap';
          q('[data-pcw-source="d2"]').click();
          if(order()!=='d4|d3|d2' || !iconsMatch(Array.from(list.children)))return 'add did not assign last rank';
          Array.from(document.querySelectorAll('[data-pcw-source][aria-pressed="false"]')).map(function(b){return b.dataset.pcwSource;}).forEach(function(id){q('[data-pcw-source="'+id+'"]').click();});
          if(list.children.length!==15 || !iconsMatch(Array.from(list.children)))return 'multi-digit ranks must use number SVGs';
          __pcQa.close(); return true;
        })()`,
      },
      {
        name: "calendar month step and per-room editable prices without toggles",
        expr: `(function () {
          __pcQa.open(); __pcQa.go(2); var q=__pcQa.q;
          q('[data-pcw-month="1"]').click(); if(!q('[data-pcw-month-title]').textContent.includes('04 月'))return 'month did not move one';
          q('[data-pcw-month="-1"]').click(); if(!q('[data-pcw-month-title]').textContent.includes('03 月'))return 'previous month';
          if(document.querySelectorAll('.pcw-calendar-card').length!==4)return 'four calendars missing';
          __pcQa.go(3);
          if(Math.abs(q('.pcw-price-summary').children[1].getBoundingClientRect().left-q('.pcw-price-project input').getBoundingClientRect().left)>0.5)return 'room count does not align with project input';
          if(document.querySelectorAll('[data-pcw-room]').length!==2 || document.querySelectorAll('[data-pcw-price]').length!==12 || q('[data-pcw-step="3"]').querySelector('[role="switch"]'))return 'room cards/prices/toggles';
          if(Array.from(document.querySelectorAll('[data-pcw-price]')).some(function(input){return input.disabled;}))return 'prices should all be editable';
          var input=q('[data-pcw-price="room-a-d1"]'); input.value='7777'; input.dispatchEvent(new Event('input',{bubbles:true}));
          __pcQa.go(2); __pcQa.go(3); if(q('[data-pcw-price="room-a-d1"]').value!=='7777')return 'price navigation lost data';
          q('[data-pcw-footer="3"] [data-pcw-clear]').click(); if(Array.from(document.querySelectorAll('[data-pcw-price]')).some(function(i){return i.value!=='';}))return 'price clear';
          q('[data-pcw-save]').click(); if(q('#modalProjectContentBackdrop').classList.contains('open'))return 'save did not close';
          return true;
        })()`,
      },
      {
        name: "wizard header/backdrop/Escape close and read-only view",
        expr: `(function () {
          var r=__smoke.modalCheck('[data-pc-modal-mode="new"]','modalProjectContentBackdrop');if(r!==true)return r;
          r=__smoke.escCheck('[data-pc-modal-mode="new"]','modalProjectContentBackdrop');if(r!==true)return r;
          __pcQa.q('[data-pc-modal-mode="view"]').click();
          if(__pcQa.q('[data-pcw-title]').textContent!=='查看' || !__pcQa.q('[name="projectName"]').disabled)return 'view mode editable';
          __pcQa.go(3);if(Array.from(document.querySelectorAll('[data-pcw-price]')).some(function(i){return !i.disabled;}))return 'view prices editable';
          __pcQa.close();return true;
        })()`,
      },
      {
        name: "project switches preserve the shared component geometry and disabled state",
        viewport: {width:375,height:1000,mobile:true},
        expr: `(async function () {
          var q=__pcQa.q;
          function correctSwitches(root){return Array.from(root.querySelectorAll('.member-data-switch')).every(function(toggle){
            var box=toggle.getBoundingClientRect(),knob=toggle.querySelector('.member-data-switch-knob').getBoundingClientRect();
            return box.width===64 && box.height===28 && knob.width===24 && knob.height===24 && knob.left>=box.left && knob.right<=box.right && knob.top>=box.top && knob.bottom<=box.bottom;
          });}
          __pcQa.open();
          var offTrack=getComputedStyle(q('[name="refund"]').parentElement.querySelector('.member-data-switch-track')).backgroundColor;
          if(!correctSwitches(q('[data-pcw-step="1"]')))return 'step1 switch distorted';
          q('[name="refund"]').click();await new Promise(function(r){setTimeout(r,230);});
          if(!correctSwitches(q('[data-pcw-step="1"]')))return 'checked switch distorted';
          __pcQa.go(2);if(!correctSwitches(q('[data-pcw-joined-list]')))return 'definition switch distorted';
          var row=q('[data-pcw-definition]');row.dispatchEvent(new KeyboardEvent('keydown',{key:' ',bubbles:true}));
          await new Promise(function(r){setTimeout(r,230);});
          var toggle=q('[data-pcw-remove]'),track=toggle.parentElement.querySelector('.member-data-switch-track');
          if(!toggle.disabled || getComputedStyle(toggle.parentElement).opacity!=='1' || getComputedStyle(track).backgroundColor!==offTrack)return 'disabled switch did not use shared gray-track state';
          __pcQa.close();q('[data-pc-open-gha]').click();
          if(!correctSwitches(q('#modalProjectGhaBackdrop')))return 'GHA switch distorted';
          q('[data-pc-gha-close]').click();return true;
        })()`,
      },
      {
        name: "project photo sessions independent and footer close paths",
        expr: `(function () {
          var q=__pcQa.q;
          q('[data-pc-card-id="project-199-a"] [data-pc-photo-trigger]').click();
          if(document.querySelectorAll('#pcProjectPhotoCardGrid [data-slot]').length!==5)return 'photo slots';
          q('#pcProjectPhotoCardGrid [data-slot="0"] [data-action="delete"]').click();
          q('[data-pc-photo-cancel]').click();
          q('[data-pc-card-id="project-199-a"] [data-pc-photo-trigger]').click();
          if(!q('#pcProjectPhotoCardGrid [data-slot="0"] img[src*="project-content-hotel"]'))return 'cancel mutated saved photo';
          q('#pcProjectPhotoUploadBtn').click();
          if(q('#modalProjectPhotoBackdrop').classList.contains('open') || document.body.style.overflow==='hidden')return 'photo upload close/lock';
          q('[data-pc-card-id="project-199-b"] [data-pc-photo-trigger]').click();
          if(q('#pcProjectPhotoCardGrid [data-action="delete"]'))return 'photo data leaked between cards';
          q('[data-pc-photo-cancel]').click();return true;
        })()`,
      },
      ...[768,375].map(function(width){return {
        name: "project responsive cards and wizard at " + width,
        viewport: {width:width,height:900,mobile:width<768},
        expr: `(function () {
          __pcQa.open(); var q=__pcQa.q;
          if(document.documentElement.scrollWidth>document.documentElement.clientWidth)return 'page horizontal overflow';
          var meal=q('#pcwMealPlan').getBoundingClientRect(), info=q('.pcw-info-button').getBoundingClientRect();
          if(Math.abs(info.left-meal.right-12)>0.5 || info.width!==24 || info.right>document.documentElement.clientWidth)return 'responsive meal/info spacing or overflow';
          if(document.documentElement.clientWidth<768 && (getComputedStyle(q('#rootWrap')).paddingLeft!=='0px' || getComputedStyle(q('#rootWrap')).paddingRight!=='0px'))return 'mobile page outer padding';
          __pcQa.go(2);
          if(q('[data-pcw-joined-list]').clientHeight!==264 || q('[data-pcw-source-list]').clientHeight!==330)return 'limits changed at narrow width';
          if(q('.pcw-body').scrollWidth>q('.pcw-body').clientWidth)return 'date body horizontal overflow';
          if(document.documentElement.clientWidth<768){
            q('[data-pcw-date="2026-03-03"]').click();var sheet=q('#pcwDateSheet');
            if(!sheet.classList.contains('open'))return 'mobile offcanvas missing';
            var bounds=sheet.querySelector('.pcw-day-sheet').getBoundingClientRect();
            if(bounds.left!==0 || Math.round(bounds.right)!==document.documentElement.clientWidth)return 'offcanvas not full width';
            document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));sheet.click();
            if(!sheet.classList.contains('open'))return 'offcanvas unexpectedly dismissed';
            sheet.querySelector('[data-pcw-sheet-close]').click();
            if(document.body.style.overflow!=='hidden' || !q('#modalProjectContentBackdrop').classList.contains('open'))return 'child close unlocked parent';
          }
          __pcQa.go(3);if(q('.pcw-body').scrollWidth>q('.pcw-body').clientWidth)return 'price body overflow';
          var amountLeft=q('.pcw-price-summary').children[1].getBoundingClientRect().left;
          if(Math.abs(amountLeft-q('.pcw-price-project input').getBoundingClientRect().left)>0.5)return 'responsive room count does not align with project input';
          if(document.documentElement.clientWidth<640 && Array.from(q('.pcw-price-summary').querySelectorAll('input')).some(function(input){return Math.abs(input.getBoundingClientRect().left-amountLeft)>0.5;}))return 'mobile room count does not align with pricing inputs';
          __pcQa.close();return true;
        })()`,
      };}),
      { name: "real mouse drag scrolls only joined list, both edges and first-to-last", viewport: { width: 1440, height: 1000 }, pointer: "mouse" },
      { name: "real touch scroll and long press reorder preserve parent lock", viewport: { width: 375, height: 1000, mobile: true }, pointer: "touch" },
      ...SHELL_CHECKS,
      ...SESSION_MODAL_CHECKS,
    ],
  },
  {
    file: "quantity-price-table.html",
    readyExpr: `
      !document.querySelector("[data-partial]") &&
      !!document.getElementById("sidebar") &&
      !!document.getElementById("modalLogoutBackdrop") &&
      !!document.getElementById("modalQuantityGroupBackdrop") &&
      document.documentElement.dataset.qpReady === "true" &&
      document.querySelectorAll(".qp-date-row th:not(:first-child)").length === 14 &&
      document.querySelectorAll(".qp-rate-cell").length === 42
    `,
    checks: [
      APP_CSS_LOADED_CHECK,
      {
        name: "quantity-price 14-day table keeps complete grid",
        viewport: { width: 1440, height: 1000 },
        expr: `
          (function () {
            var dates = document.querySelectorAll(".qp-date-row th:not(:first-child)");
            if (dates.length !== 14) return "date column count: " + dates.length;
            var table = document.querySelector(".qp-rate-table");
            var last = document.querySelector(".qp-rate-row:last-child .qp-rate-cell:last-child");
            if (Math.abs(last.getBoundingClientRect().right - table.getBoundingClientRect().right) > 1)
              return "last price cell does not reach table border";
            var closedStatus = document.querySelector(".qp-status--closed");
            var closedCell = closedStatus.closest("td");
            var cellBelow = document.querySelectorAll(".qp-rate-table tbody tr:nth-child(2) td")[2];
            if (closedStatus.getBoundingClientRect().right > closedCell.getBoundingClientRect().right + 1)
              return "closed status exceeds its table cell";
            var statusCenter = (closedStatus.getBoundingClientRect().left + closedStatus.getBoundingClientRect().right) / 2;
            var cellCenter = (closedCell.getBoundingClientRect().left + closedCell.getBoundingClientRect().right) / 2;
            if (Math.abs(statusCenter - cellCenter) > 0.5)
              return "closed status is not centered in its table cell";
            if (Math.abs(closedCell.getBoundingClientRect().width - cellBelow.getBoundingClientRect().width) > 1)
              return "closed status column width does not match cells below";
            var openStatuses = Array.from(document.querySelectorAll(".qp-status--open"));
            if (openStatuses.some(function (status) {
              return Math.abs(status.getBoundingClientRect().width - status.closest("td").clientWidth) > 1;
            })) return "open status does not fill its merged table cell";
            if (document.querySelectorAll(".qp-rate-row").length !== 3)
              return "rate row count mismatch";
            var rateRows = document.querySelectorAll(".qp-rate-row");
            if (Array.from(rateRows).some(function (row) {
              return row.querySelector(".qp-xml-badge, img, .qp-text-button");
            })) return "rate rows should only contain their project names and price cells";
            var neutralSample = document.createElement("span");
            neutralSample.style.background = "var(--color-neutral-100)";
            document.body.appendChild(neutralSample);
            var neutralBackground = getComputedStyle(neutralSample).backgroundColor;
            neutralSample.style.background = "var(--color-neutral-75)";
            var standardBackground = getComputedStyle(neutralSample).backgroundColor;
            neutralSample.remove();
            var rateLabels = Array.from(rateRows, function (row) { return row.querySelector("th"); });
            if (getComputedStyle(rateLabels[0]).backgroundColor !== standardBackground)
              return "standard rate label should use Neutral/75";
            if (rateLabels.slice(1).some(function (label) {
              return getComputedStyle(label).backgroundColor !== neutralBackground;
            })) return "non-refundable rate labels should use the neutral muted background";
            return true;
          })()
        `,
      },
      {
        name: "quantity-price double calendar range states and month navigation",
        viewport: { width: 1440, height: 1000 },
        expr: `
          (function () {
            var trigger = document.getElementById("qpDateRangeButton");
            var dateLabel = document.querySelector("[data-qp-date-range-label]");
            if (dateLabel.textContent.trim() !== "0000-00-00 ~ 0000-00-00")
              return "date range should start empty before calendar interaction";
            trigger.click();
            var popover = document.getElementById("qpDateRangePopover");
            if (popover.hidden) return "calendar did not open";
            var today = popover.querySelector('[data-date="2026-02-03"]');
            if (!today || !today.classList.contains("is-today")) return "demo today missing";
            today.click();
            today = popover.querySelector('[data-date="2026-02-03"]');
            if (!today.classList.contains("is-range-endpoint")) return "today did not become endpoint";
            popover.querySelector('[data-date="2026-02-07"]').click();
            if (popover.hidden) return "calendar closed after second date";
            if (popover.querySelectorAll(".is-range-endpoint").length !== 2)
              return "range endpoint count mismatch";
            if (popover.querySelectorAll(".is-range-middle").length !== 3)
              return "range middle count mismatch";
            popover.querySelector('[data-date="2026-02-08"]').click();
            if (popover.querySelectorAll(".is-range-endpoint").length !== 1)
              return "third click did not start new range";
            var before = Array.from(popover.querySelectorAll("[data-qp-calendar-title]"), function (node) {
              return node.textContent.trim();
            }).join("|");
            popover.querySelector("[data-qp-calendar-next]").click();
            var after = Array.from(popover.querySelectorAll("[data-qp-calendar-title]"), function (node) {
              return node.textContent.trim();
            }).join("|");
            if (before === after || after !== "2026 年 2 月|2026 年 3 月")
              return "month navigation mismatch: " + after;
            trigger.click();
            document.querySelector("[data-qp-filter-clear]").click();
            if (dateLabel.textContent.trim() !== "0000-00-00 ~ 0000-00-00")
              return "filter clear did not restore the empty date range after calendar interaction";
            return true;
          })()
        `,
      },
      {
        name: "quantity-price inline number and detail modal contract",
        expr: `
          (function () {
            var cell = document.querySelector(".qp-rate-cell");
            var display = cell.querySelector("[data-qp-rate-display]");
            display.click();
            var editor = cell.querySelector("[data-qp-rate-editor]");
            var input = editor.querySelector("input");
            if (editor.hidden || input.value !== "8000") return "number input state mismatch";
            if (input.getBoundingClientRect().width < 64) return "number input is too narrow";
            editor.querySelector("[data-qp-detail-open]").click();
            var modal = document.getElementById("modalQuantityPriceDetailBackdrop");
            if (!modal.classList.contains("open")) return "detail modal did not open";
            if (document.getElementById("qpDetailDate").textContent.trim() !== "2026-08-24")
              return "detail date mismatch";
            modal.querySelector(".modal-close-btn[data-modal]").click();
            input.value = "8250";
            input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
            if (!editor.hidden || display.hidden) return "Enter did not restore display";
            if (display.querySelector("strong").textContent.trim() !== "8250")
              return "updated amount mismatch";
            return true;
          })()
        `,
      },
      {
        name: "quantity-price main filter defaults and clear restore the full default state",
        expr: `
          (function () {
            var form = document.getElementById("qpFilterForm");
            var selects = Array.from(form.querySelectorAll("select[data-qp-filter]"));
            if (selects.length !== 3) return "filter select count: " + selects.length;
            var defaults = selects.map(function (select) {
              return select.options[select.selectedIndex].textContent.trim();
            });
            if (defaults.some(function (value) { return value !== "content"; }))
              return "filter defaults should show content: " + defaults.join("|");
            var dateButton = document.getElementById("qpDateRangeButton");
            var dateLabel = document.querySelector("[data-qp-date-range-label]");
            var placeholder = "0000-00-00 ~ 0000-00-00";
            if (!dateLabel || dateLabel.textContent.trim() !== placeholder)
              return "date range should start empty";
            selects.forEach(function (select) {
              select.value = "";
              select.dispatchEvent(new Event("change", { bubbles: true }));
            });
            dateButton.click();
            var calendar = document.getElementById("qpDateRangePopover");
            if (dateButton.getAttribute("aria-expanded") !== "true" || calendar.hidden)
              return "date range did not open for clear test";
            calendar.querySelector('[data-date="2026-02-03"]').click();
            calendar.querySelector('[data-date="2026-02-07"]').click();
            if (dateLabel.textContent.trim() === placeholder)
              return "date range selection did not change the visible value";
            var noDefault = document.createElement("select");
            noDefault.dataset.qpFilter = "smoke-no-default";
            noDefault.appendChild(new Option("Temporary", "temporary"));
            form.appendChild(noDefault);
            noDefault.value = "temporary";
            var clear = form.querySelector("[data-qp-filter-clear]");
            if (!clear || clear.type !== "reset") {
              noDefault.remove();
              return "filter clear should use the form reset control";
            }
            clear.click();
            var emptyDefault = noDefault.selectedIndex === -1;
            noDefault.remove();
            if (selects.some(function (select, index) {
              return select.options[select.selectedIndex].textContent.trim() !== defaults[index];
            })) return "clear did not restore the three content defaults";
            if (!emptyDefault) return "clear did not empty a filter without a declared default";
            if (dateLabel.textContent.trim() !== placeholder || dateButton.getAttribute("aria-expanded") !== "false")
              return "clear did not empty and close the date range";
            return true;
          })()
        `,
      },
      {
        name: "quantity-price group defaults and select-all stays within its own list",
        expr: `
          (function () {
            var opener = Array.from(document.querySelectorAll('[data-modal-open="modalQuantityGroupBackdrop"]'))
              .find(function (button) { return !button.closest("#modalQuantityPriceDetailBackdrop"); });
            if (!opener) return "main group opener missing";
            opener.click();
            var group = document.getElementById("modalQuantityGroupBackdrop");
            if (!group.classList.contains("open")) return "group modal did not open";
            var set = group.querySelector("#qpGroupSet");
            var to = group.querySelector("#qpGroupTo");
            var start = group.querySelector("#qpGroupStartDate");
            var end = group.querySelector("#qpGroupEndDate");
            var weekdays = Array.from(group.querySelectorAll('#qpGroupForm input[name="weekday"]'));
            var lists = Array.from(group.querySelectorAll("#qpGroupLists [data-qp-group-list]"));
            function optionText() { return set.selectedOptions[0].textContent.trim(); }
            function verifyReset(expectedOption) {
              if (optionText() !== expectedOption) return "Set changed: " + optionText();
              if (to.value !== "0" || start.value !== "" || end.value !== "") return "To/date reset mismatch";
              if (weekdays.some(function (input) { return input.checked; })) return "weekday reset mismatch";
              if (group.querySelectorAll("#qpGroupLists [data-qp-group-item]:checked, #qpGroupLists [data-qp-group-select-all]:checked").length)
                return "list selection reset mismatch";
              return true;
            }
            if (lists.length !== 2) return "group list count: " + lists.length;
            var reset = verifyReset("option 1");
            if (reset !== true) return "option 1 " + reset;
            var expected = [
              ["ABC", "XYZ"],
              ["頻道 1", "頻道 2"],
            ];
            if (lists.some(function (list, index) {
              var text = list.textContent;
              var all = list.querySelector("[data-qp-group-select-all]");
              var items = Array.from(list.querySelectorAll("[data-qp-group-item]"));
              return !all || !items.length || all.dataset.qpGroupKey !== list.dataset.qpGroupKey ||
                items.some(function (item) { return item.dataset.qpGroupKey !== list.dataset.qpGroupKey; }) ||
                items.some(function (item) { return item.checked; }) || all.checked ||
                expected[index].some(function (value) { return !text.includes(value); });
            })) return "option 1 content, list association, or unchecked defaults mismatch";
            var firstAll = lists[0].querySelector("[data-qp-group-select-all]");
            var firstItems = Array.from(lists[0].querySelectorAll("[data-qp-group-item]"));
            firstAll.click();
            if (firstItems.some(function (item) { return !item.checked; }) ||
                Array.from(lists.slice(1)).some(function (list) {
                  return list.querySelectorAll("[data-qp-group-item]:checked").length > 0 ||
                    list.querySelector("[data-qp-group-select-all]").checked;
                })) return "select-all changed a different list or missed an item";
            firstItems[0].click();
            if (firstItems[0].checked || firstAll.checked) return "one item removal did not clear its select-all";
            firstItems[0].click();
            if (!firstAll.checked || firstItems.some(function (item) { return !item.checked; }))
              return "all selected items did not synchronize select-all";
            firstAll.click();
            if (firstAll.checked || firstItems.some(function (item) { return item.checked; }))
              return "select-all did not clear only its own list";
            group.querySelector("[data-qp-group-clear]").click();
            reset = verifyReset("option 1");
            if (reset !== true || !group.classList.contains("open")) return "group clear should reset in place: " + reset;
            group.querySelector('.modal-close-btn[data-modal="modalQuantityGroupBackdrop"]').click();
            if (group.classList.contains("open") || document.body.style.overflow === "hidden")
              return "group close did not unlock the page";
            return true;
          })()
        `,
      },
      {
        name: "quantity-price Set 2 and Set 3 retain their content while switching resets fields",
        expr: `
          (function () {
            var opener = Array.from(document.querySelectorAll('[data-modal-open="modalQuantityGroupBackdrop"]'))
              .find(function (button) { return !button.closest("#modalQuantityPriceDetailBackdrop"); });
            opener.click();
            var group = document.getElementById("modalQuantityGroupBackdrop");
            var set = group.querySelector("#qpGroupSet");
            var to = group.querySelector("#qpGroupTo");
            var start = group.querySelector("#qpGroupStartDate");
            var end = group.querySelector("#qpGroupEndDate");
            function choose(text) {
              var option = Array.from(set.options).find(function (item) { return item.textContent.trim() === text; });
              if (!option) return false;
              set.value = option.value;
              set.dispatchEvent(new Event("change", { bubbles: true }));
              return true;
            }
            function populate() {
              to.value = "7";
              to.dispatchEvent(new Event("input", { bubbles: true }));
              start.value = "2026-08-01";
              end.value = "2026-08-02";
              start.dispatchEvent(new Event("change", { bubbles: true }));
              end.dispatchEvent(new Event("change", { bubbles: true }));
              var weekday = group.querySelector('#qpGroupForm input[name="weekday"]');
              var item = group.querySelector("[data-qp-group-item]");
              weekday.click();
              item.click();
            }
            function verifyReset(text) {
              if (set.selectedOptions[0].textContent.trim() !== text) return "selected Set mismatch";
              if (to.value !== "0" || start.value !== "" || end.value !== "") return "To/date values were retained";
              if (group.querySelectorAll('#qpGroupForm input[name="weekday"]:checked').length ||
                  group.querySelectorAll("[data-qp-group-item]:checked, [data-qp-group-select-all]:checked").length)
                return "weekday/list values were retained";
              return true;
            }
            populate();
            if (!choose("option 2")) return "option 2 missing";
            var reset = verifyReset("option 2");
            if (reset !== true) return "switch to option 2: " + reset;
            var option2 = Array.from(group.querySelectorAll("#qpGroupLists [data-qp-group-list]"));
            if (!option2[0].textContent.includes("Title") || !option2[0].textContent.includes("ABC") || !option2[0].textContent.includes("FCG") ||
                !option2[1].textContent.includes("XZZ") || !option2[1].textContent.includes("FOG"))
              return "option 2 content mismatch";
            populate();
            if (!choose("option 3")) return "option 3 missing";
            reset = verifyReset("option 3");
            if (reset !== true) return "switch to option 3: " + reset;
            var option3 = Array.from(group.querySelectorAll("#qpGroupLists [data-qp-group-list]"));
            if (!option3[0].textContent.includes("IOP") || !option3[0].textContent.includes("ZOQ") ||
                !option3[1].textContent.includes("BBQ") || !option3[1].textContent.includes("FUC"))
              return "option 3 content mismatch";
            group.querySelector('.modal-close-btn[data-modal="modalQuantityGroupBackdrop"]').click();
            return true;
          })()
        `,
      },
      {
        name: "quantity-price group clear preserves Set 2 and 3; save and reopen return to option 1",
        expr: `
          (function () {
            var opener = Array.from(document.querySelectorAll('[data-modal-open="modalQuantityGroupBackdrop"]'))
              .find(function (button) { return !button.closest("#modalQuantityPriceDetailBackdrop"); });
            var group = document.getElementById("modalQuantityGroupBackdrop");
            function openGroup() { opener.click(); return group.classList.contains("open"); }
            function choose(text) {
              var set = group.querySelector("#qpGroupSet");
              var option = Array.from(set.options).find(function (item) { return item.textContent.trim() === text; });
              set.value = option.value;
              set.dispatchEvent(new Event("change", { bubbles: true }));
            }
            function populate() {
              group.querySelector("#qpGroupTo").value = "4";
              group.querySelector("#qpGroupStartDate").value = "2026-09-01";
              group.querySelector("#qpGroupEndDate").value = "2026-09-02";
              group.querySelector('#qpGroupForm input[name="weekday"]').click();
              group.querySelector("[data-qp-group-item]").click();
            }
            function verifyClear(expected) {
              var set = group.querySelector("#qpGroupSet");
              if (set.selectedOptions[0].textContent.trim() !== expected) return "Set did not stay " + expected;
              if (group.querySelector("#qpGroupTo").value !== "0" ||
                  group.querySelector("#qpGroupStartDate").value !== "" ||
                  group.querySelector("#qpGroupEndDate").value !== "") return "To/date did not clear";
              if (group.querySelectorAll('#qpGroupForm input[name="weekday"]:checked, [data-qp-group-item]:checked, [data-qp-group-select-all]:checked').length)
                return "weekday/list controls did not clear";
              if (!group.classList.contains("open") || document.body.style.overflow !== "hidden")
                return "clear closed or unlocked the modal";
              return true;
            }
            if (!openGroup()) return "group modal did not open";
            choose("option 2");
            populate();
            group.querySelector("[data-qp-group-clear]").click();
            var result = verifyClear("option 2");
            if (result !== true) return "clear on option 2: " + result;
            populate();
            choose("option 3");
            populate();
            group.querySelector("[data-qp-group-clear]").click();
            result = verifyClear("option 3");
            if (result !== true) return "clear on option 3: " + result;
            var save = Array.from(group.querySelectorAll("#qpGroupForm [data-modal]"))
              .find(function (button) { return button.textContent.includes("儲存變更"); });
            if (!save) return "group save button missing";
            save.click();
            if (group.classList.contains("open") || document.body.style.overflow === "hidden")
              return "save did not close and unlock the group modal";
            if (!openGroup()) return "group modal did not reopen";
            if (group.querySelector("#qpGroupSet").selectedOptions[0].textContent.trim() !== "option 1")
              return "main opener did not start at option 1";
            group.querySelector('.modal-close-btn[data-modal="modalQuantityGroupBackdrop"]').click();
            return true;
          })()
        `,
      },
      {
        name: "quantity-price nested detail group opens at option 1 and closes back to locked parent",
        expr: `
          (function () {
            var cell = document.querySelector(".qp-rate-cell");
            cell.querySelector("[data-qp-rate-display]").click();
            cell.querySelector("[data-qp-detail-open]").click();
            var detail = document.getElementById("modalQuantityPriceDetailBackdrop");
            if (!detail.classList.contains("open") || document.body.style.overflow !== "hidden")
              return "detail parent did not open and lock the page";
            detail.querySelector('[data-modal-open="modalQuantityGroupBackdrop"]').click();
            var group = document.getElementById("modalQuantityGroupBackdrop");
            if (!group.classList.contains("open")) return "nested group did not open";
            if (group.querySelector("#qpGroupSet").selectedOptions[0].textContent.trim() !== "option 1")
              return "detail opener did not start at option 1";
            var parentZ = Number.parseInt(getComputedStyle(detail).zIndex, 10);
            var childZ = Number.parseInt(getComputedStyle(group).zIndex, 10);
            if (!(childZ > parentZ)) return "nested group is not above its detail parent";
            group.querySelector('.modal-close-btn[data-modal="modalQuantityGroupBackdrop"]').click();
            if (group.classList.contains("open") || !detail.classList.contains("open") || document.body.style.overflow !== "hidden")
              return "closing nested group did not preserve and lock its parent";
            detail.querySelector('.modal-close-btn[data-modal="modalQuantityPriceDetailBackdrop"]').click();
            if (detail.classList.contains("open") || document.body.style.overflow === "hidden")
              return "closing the detail parent did not unlock the page";
            return true;
          })()
        `,
      },
      {
        name: "quantity-price inventory month span, sample state, and availability boundaries",
        viewport: { width: 1440, height: 1000 },
        expr: `
          (function () {
            document.querySelector('[data-modal-open="modalQuantityInventoryBackdrop"]').click();
            var modal = document.getElementById("modalQuantityInventoryBackdrop");
            var table = modal.querySelector(".qp-inventory-table");
            if (!modal.classList.contains("open") || !table) return "inventory modal/table did not open";
            if (modal.querySelectorAll("table").length !== 1) return "inventory should use one semantic table";
            var headers = Array.from(table.querySelectorAll("[data-qp-inventory-month-header]"));
            var expectedMonths = [
              "2026-08", "2026-09", "2026-10", "2026-11", "2026-12",
              "2027-01", "2027-02", "2027-03", "2027-04", "2027-05",
              "2027-06", "2027-07", "2027-08", "2027-09",
            ];
            if (headers.length !== 14 || headers.map(function (header) { return header.dataset.monthKey; }).join("|") !== expectedMonths.join("|"))
              return "inventory month range mismatch";
            var yearHeads = Array.from(table.querySelectorAll("thead tr:first-child th"))
              .filter(function (heading) { return heading.textContent.includes("2026") || heading.textContent.includes("2027"); });
            if (yearHeads.length !== 2 || yearHeads[0].colSpan !== 5 || yearHeads[1].colSpan !== 9)
              return "inventory year spans should be 5 and 9";
            if (yearHeads[0].textContent.trim() !== "2026 年" || yearHeads[1].textContent.trim() !== "2027 年")
              return "inventory year labels mismatch";
            var extras = Array.from(table.querySelectorAll("[data-qp-inventory-extra-month]"));
            if (extras.length !== 2 || extras.map(function (header) { return header.dataset.monthKey; }).join("|") !== "2027-08|2027-09")
              return "only August and September 2027 should be beyond the original 12 months";
            var sample = document.createElement("span");
            sample.style.background = "var(--color-brand-100)";
            document.body.appendChild(sample);
            var extraBackground = getComputedStyle(sample).backgroundColor;
            sample.remove();
            if (extras.some(function (header) { return getComputedStyle(header).backgroundColor !== extraBackground; }))
              return "extra-month headers should use Brand/100";
            var batch = function (month) {
              return table.querySelector('input[data-qp-inventory-batch][data-month-key="' + month + '"]');
            };
            var bodyRows = Array.from(table.querySelectorAll("tbody tr"));
            var roomRows = bodyRows.filter(function (row) { return row.querySelector("input[data-qp-inventory-room]"); });
            var room = function (code, month) {
              var roomCode = code.toLowerCase();
              var row = roomRows.find(function (item) {
                return item.querySelector('input[data-qp-inventory-room="' + roomCode + '"]');
              });
              return row && row.querySelector('input[data-qp-inventory-room][data-month-key="' + month + '"]');
            };
            var cellDisabled = function (input) {
              return input.closest(".qp-inventory-cell").classList.contains("is-disabled");
            };
            if (bodyRows.length !== 4 || roomRows.length !== 3 || roomRows.some(function (row) {
              return row.querySelectorAll("input[data-qp-inventory-room]").length !== 14;
            })) return "inventory should have one batch row and three 14-month room rows";
            if (!batch("2027-03").checked || roomRows.some(function (row) {
              return !row.querySelector('input[data-qp-inventory-room][data-month-key="2027-03"]').checked;
            }) || !room("AAC", "2026-12").checked || batch("2026-12").checked)
              return "inventory preview sample selections mismatch";
            ["2027-08", "2027-09"].forEach(function (month) {
              var input = batch(month);
              if (!input || !input.disabled || !input.closest(".qp-inventory-cell").classList.contains("is-disabled"))
                throw new Error("disabled batch cell mismatch: " + month);
            });
            if (room("AAC", "2027-08").disabled || cellDisabled(room("AAC", "2027-08")) ||
                !room("AAC", "2027-09").disabled || !cellDisabled(room("AAC", "2027-09")) ||
                room("AZC", "2027-08").disabled || cellDisabled(room("AZC", "2027-08")) ||
                room("AZC", "2027-09").disabled || cellDisabled(room("AZC", "2027-09")) ||
                !room("ZZO", "2027-08").disabled || !cellDisabled(room("ZZO", "2027-08")) ||
                !room("ZZO", "2027-09").disabled || !cellDisabled(room("ZZO", "2027-09")))
              return "room availability boundary mismatch";
            var clearable = table.querySelector('input[data-qp-inventory-batch][data-month-key="2026-12"]');
            if (!clearable) return "December batch input missing";
            modal.querySelector('.modal-close-btn[data-modal="modalQuantityInventoryBackdrop"]').click();
            return true;
          })()
        `,
      },
      {
        name: "quantity-price inventory batch and room selections synchronize without partial batch state",
        expr: `
          (function () {
            document.querySelector('[data-modal-open="modalQuantityInventoryBackdrop"]').click();
            var modal = document.getElementById("modalQuantityInventoryBackdrop");
            var table = modal.querySelector(".qp-inventory-table");
            var month = "2026-12";
            var batch = table.querySelector('input[data-qp-inventory-batch][data-month-key="' + month + '"]');
            var rows = Array.from(table.querySelectorAll("tbody tr"));
            var roomRows = rows.filter(function (row) { return row.querySelector("input[data-qp-inventory-room]"); });
            var rooms = roomRows.map(function (row) {
              return row.querySelector('input[data-qp-inventory-room][data-month-key="' + month + '"]');
            });
            if (batch.checked || rooms.filter(function (input) { return input.checked; }).length !== 1)
              return "December should begin with only AAC checked";
            batch.closest(".qp-inventory-cell-label").click();
            if (!batch.checked || rooms.some(function (input) { return !input.checked; }))
              return "batch label did not select every room exactly once";
            var azcRow = roomRows.find(function (row) { return row.querySelector('input[data-qp-inventory-room="azc"]'); });
            var azc = azcRow.querySelector('input[data-qp-inventory-room][data-month-key="' + month + '"]');
            azc.closest(".qp-inventory-cell-label").click();
            if (azc.checked || batch.checked || rooms.some(function (input) { return input !== azc && !input.checked; }))
              return "one room removal did not clear the batch state";
            azc.closest(".qp-inventory-cell-label").click();
            if (!azc.checked || !batch.checked || rooms.some(function (input) { return !input.checked; }))
              return "all selected rooms did not restore batch checked state";
            ["2027-08", "2027-09"].forEach(function (key) {
              var input = table.querySelector('input[data-qp-inventory-batch][data-month-key="' + key + '"]');
              var before = input.checked;
              input.focus();
              input.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
              input.dispatchEvent(new KeyboardEvent("keyup", { key: " ", bubbles: true }));
              input.click();
              input.closest(".qp-inventory-cell-label").click();
              if (!input.disabled || input.checked !== before || document.activeElement === input)
                throw new Error("disabled batch accepted focus or interaction: " + key);
            });
            var aacSeptember = table.querySelector('input[data-qp-inventory-room][data-month-key="2027-09"]');
            var before = aacSeptember.checked;
            aacSeptember.focus();
            aacSeptember.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
            aacSeptember.click();
            aacSeptember.closest(".qp-inventory-cell-label").click();
            if (!aacSeptember.disabled || aacSeptember.checked !== before || document.activeElement === aacSeptember)
              return "disabled AAC September cell accepted focus or interaction";
            modal.querySelector('.modal-close-btn[data-modal="modalQuantityInventoryBackdrop"]').click();
            return true;
          })()
        `,
      },
      {
        name: "quantity-price mobile inventory blank-cell pointer and disabled keyboard behavior",
        viewport: { width: 375, height: 812, mobile: true },
        quantityInventoryPointer: true,
      },
      {
        name: "quantity-price tablet reflows filters without page overflow",
        viewport: { width: 768, height: 1024 },
        expr: `
          (function () {
            if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)
              return "tablet page-level horizontal overflow";
            var fields = document.querySelectorAll(".qp-filter-row--fields .qp-filter-field");
            var fieldGrid = document.querySelector(".qp-filter-row--fields");
            if (fields.length !== 3 || fieldGrid.querySelectorAll("select[data-qp-filter]").length !== 3)
              return "tablet should retain three native filter controls";
            var gridBounds = fieldGrid.getBoundingClientRect();
            if (Array.from(fields).some(function (field) {
              var bounds = field.getBoundingClientRect();
              var select = field.querySelector("select[data-qp-filter]");
              return !select || select.getBoundingClientRect().width < 120 ||
                bounds.left < gridBounds.left - 1 || bounds.right > gridBounds.right + 1;
            })) return "tablet filter fields should remain usable within the page panel";
            var shell = document.querySelector(".qp-table-shell");
            if (!(shell.scrollWidth > shell.clientWidth)) return "tablet rate table should scroll";
            return true;
          })()
        `,
      },
      {
        name: "quantity-price mobile contains wide content in local scrollers",
        viewport: { width: 375, height: 812, mobile: true },
        expr: `
          (function () {
            if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)
              return "mobile page-level horizontal overflow";
            var shell = document.querySelector(".qp-table-shell");
            if (!(shell.scrollWidth > shell.clientWidth)) return "mobile rate table should scroll";
            document.querySelector('[data-modal-open="modalQuantityInventoryBackdrop"]').click();
            var modal = document.getElementById("modalQuantityInventoryBackdrop");
            var modalBox = modal.querySelector(".modal-box");
            var modalBounds = modalBox.getBoundingClientRect();
            if (Math.abs(modalBounds.left) > 1 || Math.abs(modalBounds.top) > 1 ||
                Math.abs(modalBounds.width - innerWidth) > 1 ||
                Math.abs(modalBounds.height - innerHeight) > 1)
              return "inventory modal should fill the mobile viewport";
            var inventoryShell = modal.querySelector(".qp-inventory-scroll");
            if (!(inventoryShell.scrollWidth > inventoryShell.clientWidth))
              return "mobile inventory table should scroll";
            var inventoryTable = inventoryShell.querySelector(".qp-inventory-table");
            var total = inventoryTable.querySelector("[data-qp-inventory-total]") ||
              inventoryTable.querySelector("[data-qp-inventory-total-mark]");
            if (!total) return "inventory total column marker missing";
            var totalCell = total.matches("th, td") ? total : total.closest("th, td");
            if (!totalCell) return "inventory total column cell missing";
            inventoryShell.scrollLeft = 0;
            var firstMonth = inventoryTable.querySelector('[data-qp-inventory-month-header][data-month-key="2026-08"]');
            if (!firstMonth || firstMonth.getBoundingClientRect().left < inventoryShell.getBoundingClientRect().left - 1)
              return "inventory left edge is not reachable at scroll start";
            inventoryShell.scrollLeft = inventoryShell.scrollWidth;
            var shellRect = inventoryShell.getBoundingClientRect();
            if (totalCell.getBoundingClientRect().right > shellRect.right + 1)
              return "rightmost total column is not reachable inside inventory scroller";
            if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)
              return "inventory horizontal scrolling overflowed the page";
            document.querySelector("#modalQuantityInventoryBackdrop .qp-modal-close").click();
            document.getElementById("qpDateRangeButton").click();
            var calendar = document.getElementById("qpDateRangePopover").getBoundingClientRect();
            if (calendar.right > innerWidth + 1) return "mobile calendar exceeds viewport";
            document.getElementById("qpDateRangeButton").click();
            return true;
          })()
        `,
      },
      {
        name: "quantity-price mobile group and detail modals fill viewport and preserve nested lock",
        viewport: { width: 375, height: 812, mobile: true },
        expr: `
          (function () {
            function fitsViewport(modal) {
              if (!modal || !modal.classList.contains("open")) return false;
              var box = modal.querySelector(".modal-box");
              if (!box) return false;
              var rect = box.getBoundingClientRect();
              return Math.abs(rect.left) <= 1 && Math.abs(rect.top) <= 1 &&
                Math.abs(rect.width - innerWidth) <= 1 &&
                Math.abs(rect.height - innerHeight) <= 1;
            }
            var group = document.getElementById("modalQuantityGroupBackdrop");
            var groupOpener = Array.from(document.querySelectorAll('[data-modal-open="modalQuantityGroupBackdrop"]'))
              .find(function (button) { return !button.closest("#modalQuantityPriceDetailBackdrop"); });
            if (!groupOpener) return "main group opener missing";
            groupOpener.click();
            if (!fitsViewport(group)) return "option 1 group modal should fill the mobile viewport";
            var set = group.querySelector("#qpGroupSet");
            var variants = ["option 1", "option 2", "option 3"];
            for (var index = 0; index < variants.length; index += 1) {
              var value = variants[index];
              set.value = value;
              set.dispatchEvent(new Event("change", { bubbles: true }));
              if (!fitsViewport(group)) return value + " group modal should fill the mobile viewport";
            }
            group.querySelector('.modal-close-btn[data-modal="modalQuantityGroupBackdrop"]').click();
            if (group.classList.contains("open")) return "group modal did not close";

            var cell = document.querySelector(".qp-rate-cell");
            cell.querySelector("[data-qp-rate-display]").click();
            cell.querySelector("[data-qp-detail-open]").click();
            var detail = document.getElementById("modalQuantityPriceDetailBackdrop");
            if (!fitsViewport(detail) || document.body.style.overflow !== "hidden")
              return "detail modal should fill viewport and lock the page";
            detail.querySelector('[data-modal-open="modalQuantityGroupBackdrop"]').click();
            if (!fitsViewport(group) || !fitsViewport(detail) || document.body.style.overflow !== "hidden")
              return "nested group and detail modals should both fill viewport while locked";
            group.querySelector('.modal-close-btn[data-modal="modalQuantityGroupBackdrop"]').click();
            if (group.classList.contains("open") || !detail.classList.contains("open") || document.body.style.overflow !== "hidden")
              return "closing nested group should retain the fullscreen detail lock";
            detail.querySelector('.modal-close-btn[data-modal="modalQuantityPriceDetailBackdrop"]').click();
            if (detail.classList.contains("open") || document.body.style.overflow === "hidden")
              return "closing detail should release the page lock";
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

const PHOTO_TOUCH_CHECKS = [{"page": "project-content.html", "trigger": "[data-pc-photo-trigger]", "modal": "modalProjectPhotoBackdrop", "grid": "pcProjectPhotoCardGrid", "file": "pcProjectPhotoFileInput", "upload": "pcProjectPhotoUploadBtn"}, {"page": "lodging-info.html", "trigger": "#lodgingRow1PhotoTrigger", "modal": "modalPhotoGalleryBackdrop", "grid": "lodgingPhotoCardGrid", "file": "lodgingPhotoFileInput", "upload": "lodgingPhotoUploadBtn"}, {"page": "room-type.html", "trigger": "[data-room-type-photo-trigger]", "modal": "modalRoomTypePhotoGalleryBackdrop", "grid": "roomTypePhotoCardGrid", "file": "roomTypePhotoFileInput", "upload": "roomTypePhotoUploadBtn"}, {"page": "purchase-addon.html", "trigger": "[data-pa-photo-trigger]", "modal": "modalPurchaseAddonPhotoGalleryBackdrop", "grid": "purchaseAddonPhotoCardGrid", "file": "purchaseAddonPhotoFileInput", "upload": "purchaseAddonPhotoUploadBtn"}];
for (const config of PHOTO_TOUCH_CHECKS) {
  PAGES.find((page) => page.file === config.page).checks.push({
    name: "photo mouse/touch sorting, native drop, scroll, cancellation and saved order",
    viewport: { width: 375, height: 1000, mobile: true },
    photoTouch: config,
  });
}

async function testPhotoTouch(cdp, sessionId, config) {
  const ev = (expression) => evaluate(cdp, sessionId, expression);
  const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const state = () => ev(`(function(){
    var grid=document.getElementById(${JSON.stringify(config.grid)}), modal=grid.closest('.modal-backdrop'), body=grid.closest('.lodging-photo-modal-body');
    var rows=Array.from(grid.children),marker=window.__photoTouchMarker;
    return {index:rows.findIndex(function(row){return Array.from(row.querySelectorAll('.lodging-photo-preview img')).some(function(img){return img.src===marker;});}),
      titles:rows.map(function(row){return row.firstElementChild.textContent.trim();}),
      main:rows.map(function(row){return row.firstElementChild.textContent.includes('主圖');}),
      scroll:body.scrollTop,max:body.scrollHeight-body.clientHeight,
      ghost:!!document.querySelector('.photo-sort-ghost'),open:modal.classList.contains('open'),locked:document.body.style.overflow==='hidden'};
  })()`);
  const open = () => ev(`document.querySelector(${JSON.stringify(config.trigger)}).click(); document.getElementById(${JSON.stringify(config.grid)}).closest('.lodging-photo-modal-body').scrollTop=0;`);
  const close = () => ev(`(function(){var modal=document.getElementById(${JSON.stringify(config.modal)});Array.from(modal.querySelectorAll('.modal-close-btn')).find(function(btn){return btn.textContent.trim()==='取消';}).click();})()`);
  const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', {
    type, touchPoints: ['touchEnd','touchCancel'].includes(type) ? [] : [{x,y,id:1}],
  }, sessionId);
  const seed = () => ev(`(async function(){
    var canvas=document.createElement('canvas');canvas.width=16;canvas.height=16;
    canvas.getContext('2d').fillRect(0,0,16,16);
    var blob=await new Promise(function(resolve){canvas.toBlob(resolve,'image/jpeg');});
    var grid=document.getElementById(${JSON.stringify(config.grid)});
    grid.querySelector('[data-slot="0"] [data-action="replace"], [data-slot="0"] [data-pa-photo-action="replace"]').click();
    var data=new DataTransfer();data.items.add(new File([blob],'touch-sort.jpg',{type:'image/jpeg'}));
    var input=document.getElementById(${JSON.stringify(config.file)});input.files=data.files;input.dispatchEvent(new Event('change',{bubbles:true}));
    window.__photoTouchMarker=grid.querySelector('[data-slot="0"] .lodging-photo-preview img').src;
  })()`);
  try {
    await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1},sessionId);
    await open(); await seed(); await pause(150);
    // Native scrolling outside the handle must remain usable.
    const ordinary = await ev(`(function(){var box=document.querySelector('#${config.grid} [data-slot="0"] .lodging-photo-preview').getBoundingClientRect();return {x:box.left+80,y:Math.min(box.top+80,850)};})()`);
    await touch('touchStart',ordinary.x,ordinary.y);
    for(let step=1;step<=4;step++){await touch('touchMove',ordinary.x,ordinary.y-step*20);await pause(20);}
    await touch('touchEnd');await pause(250);
    if ((await state()).scroll<=0 || (await state()).ghost) return 'ordinary photo swipe did not scroll independently';
    await ev(`document.getElementById('${config.grid}').closest('.lodging-photo-modal-body').scrollTop=0`);
    async function dragToSecond(cancel=false) {
      const p = await ev(`(function(){var grid=document.getElementById('${config.grid}'),handle=grid.querySelector('[data-slot="0"] [data-photo-sort-handle]').getBoundingClientRect(),target=grid.querySelector('[data-slot="1"]').getBoundingClientRect();return {x:handle.left+12,y:handle.top+12,to:Math.min(target.top+40,880)};})()`);
      await touch('touchStart',p.x,p.y);
      for(let step=1;step<=5;step++){await touch('touchMove',p.x,p.y+(p.to-p.y)*step/5);await pause(20);}
      if (!(await state()).ghost) throw new Error('touch did not start photo sorting');
      await touch(cancel?'touchCancel':'touchEnd');await pause(100);
    }
    await dragToSecond(true);
    if ((await state()).index!==0 || (await state()).ghost) return 'pointer cancel changed photo order';
    await dragToSecond();
    let result=await state();
    if(result.index!==1 || !result.open || !result.locked || result.ghost || result.main.join('|')!=='true|false|false|false|false') return 'touch reorder failed or modal closed: '+JSON.stringify(result);
    if(result.titles.some(function(title,index){return !title.startsWith('圖片 '+(index+1));}))return 'photo headings lost positional numbering';
    await close(); await open();
    if((await state()).index!==-1)return 'cancel persisted pending photo/reorder';
    await seed(); await dragToSecond();
    await ev(`document.getElementById('${config.upload}').click()`);
    if((await state()).open || (await state()).locked)return 'upload did not close cleanly: '+JSON.stringify(await state());
    await open();
    if((await state()).index!==1)return 'upload did not save touch order';
    // Desktop native drag event bindings still operate on the same working slots.
    const nativeResult = await ev(`(function(){var grid=document.getElementById('${config.grid}'),from=grid.children[1],to=grid.children[0],data=new DataTransfer();from.dispatchEvent(new DragEvent('dragstart',{bubbles:true,dataTransfer:data}));to.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer:data}));to.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:data}));return true;})()`);
    if(nativeResult!==true || (await state()).index!==0)return 'desktop native drop stopped working';
    await close(); await open();
    if((await state()).index!==1)return 'native drop cancel mutated saved order';
    // Touch can reach the final card using only the photo body scroller.
    await ev(`document.getElementById('${config.grid}').querySelector('[data-slot="1"] [data-photo-sort-handle]').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowUp',bubbles:true}));`);
    const p=await ev(`(function(){var grid=document.getElementById('${config.grid}'),handle=grid.querySelector('[data-slot="0"] [data-photo-sort-handle]').getBoundingClientRect(),body=grid.closest('.lodging-photo-modal-body').getBoundingClientRect();return {x:handle.left+12,y:handle.top+12,bottom:body.bottom-3};})()`);
    await touch('touchStart',p.x,p.y);await touch('touchMove',p.x,p.bottom);
    for(let attempt=0;attempt<70;attempt++){await pause(100);const now=await state();if(now.scroll>=now.max-1)break;}
    const bottom=await state();
    if(bottom.scroll<bottom.max-1)return 'photo edge auto scroll did not reach last item';
    await touch('touchEnd');await pause(100);
    if((await state()).index!==4 || !(await state()).open)return 'first photo did not reach last item';
    await close();
    await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:false},sessionId);
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false},sessionId);
    await open();
    const mouse=await ev(`(function(){var grid=document.getElementById('${config.grid}'),from=grid.querySelector('[data-slot="1"] [data-photo-sort-handle]').getBoundingClientRect(),to=grid.querySelector('[data-slot="0"]').getBoundingClientRect();return {x:from.left+12,y:from.top+12,tx:to.left+80,ty:to.top+70};})()`);
    await cdp.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:mouse.x,y:mouse.y},sessionId);
    await cdp.send('Input.dispatchMouseEvent',{type:'mousePressed',x:mouse.x,y:mouse.y,button:'left',buttons:1,clickCount:1},sessionId);
    for(let step=1;step<=8;step++){
      await cdp.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:mouse.x+(mouse.tx-mouse.x)*step/8,y:mouse.y+(mouse.ty-mouse.y)*step/8,button:'left',buttons:1},sessionId);
      await pause(20);
    }
    await cdp.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:mouse.tx,y:mouse.ty,button:'left',buttons:0,clickCount:1},sessionId);
    if((await state()).index!==0 || !(await state()).open)return 'real mouse handle drag failed';
    await close(); await open();
    if((await state()).index!==1)return 'mouse cancellation changed saved order';
    await close();
    return true;
  } finally {
    await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:false},sessionId);
    await ev(`(function(){var modal=document.getElementById('${config.modal}');if(modal.classList.contains('open'))modal.querySelector('.modal-close-btn').click();})()`);
  }
}

async function testProjectPointer(cdp, sessionId, kind) {
  const ev = (expression) => evaluate(cdp, sessionId, expression);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const state = () => ev(`(function(){
    var list=document.querySelector('[data-pcw-joined-list]');
    var first=list.firstElementChild.getBoundingClientRect(),bounds=list.getBoundingClientRect();
    var ghost=document.querySelector('.pcw-drag-ghost [data-pcw-rank]');
    return {x:first.left+60,y:first.top+20,top:bounds.top+3,bottom:bounds.bottom-3,
      ranks:Array.from(list.querySelectorAll('[data-pcw-rank]')).map(function(icon){return icon.getAttribute('aria-label');}).join('|'),
      ghostRank:ghost && ghost.getAttribute('aria-label'),
      ghostDigits:ghost && Array.from(ghost.querySelectorAll('img')).map(function(img){return img.getAttribute('src').split('number-')[1].slice(0,1);}).join(''),
      scroll:list.scrollTop,max:list.scrollHeight-list.clientHeight,sorting:list.classList.contains('is-reordering'),
      parent:document.querySelector('.pcw-body').scrollTop,source:document.querySelector('[data-pcw-source-list]').scrollTop,
      open:document.getElementById('modalProjectContentBackdrop').classList.contains('open')};
  })()`);
  const move = async (type, x, y) => {
    if (kind === "touch") {
      await cdp.send("Input.dispatchTouchEvent", {
        type: type === "down" ? "touchStart" : type === "up" ? "touchEnd" : "touchMove",
        touchPoints: type === "up" ? [] : [{ x, y, id: 1 }],
      }, sessionId);
    } else {
      await cdp.send("Input.dispatchMouseEvent", {
        type: type === "down" ? "mousePressed" : type === "up" ? "mouseReleased" : "mouseMoved",
        x, y, button: "left", buttons: type === "up" ? 0 : 1,
        ...(type === "move" ? {} : { clickCount: 1 }),
      }, sessionId);
    }
  };
  await ev(`__pcQa.open();__pcQa.go(2);
    Array.from(document.querySelectorAll('[data-pcw-source][aria-pressed="false"]')).map(function(b){return b.dataset.pcwSource;}).forEach(function(id){document.querySelector('[data-pcw-source="'+id+'"]').click();});`);
  await delay(220);
  if (kind === "touch") await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 1 }, sessionId);
  const stationary = await state();
  if (kind === "mouse") await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: stationary.x, y: stationary.y }, sessionId);
  await move("down", stationary.x, stationary.y);
  await delay(520);
  await move("up", stationary.x, stationary.y);
  await delay(100);
  const afterHold = await state();
  if (!afterHold.open || !afterHold.sorting) return "stationary long press closed modal or lost sorting mode";
  await ev(`document.querySelector('[data-pcw-cancel-order]').click()`);
  if (kind === "touch") {
    const ordinary = await state();
    await move("down", ordinary.x, ordinary.y + 80);
    await move("move", ordinary.x, ordinary.y + 20);
    await delay(80);
    await move("up", ordinary.x, ordinary.y + 20);
    await delay(500);
    const scrolled = await state();
    if (scrolled.sorting || scrolled.scroll <= 0) return "ordinary touch must scroll without entering reorder";
    await ev(`document.querySelector('[data-pcw-joined-list]').scrollTop=0`);
  }
  const initial = await state();
  if (kind === "mouse") await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: initial.x, y: initial.y }, sessionId);
  await move("down", initial.x, initial.y);
  await delay(520);
  const held = await state();
  if (!held.sorting) return "real long press did not enter reorder";
  await move("move", initial.x, held.bottom);
  await delay(450);
  const scrolling = await state();
  if (scrolling.scroll <= 0 || scrolling.parent !== initial.parent || scrolling.source !== initial.source) return "edge scroll moved wrong container or did not move";
  await move("move", initial.x, (held.top + held.bottom) / 2);
  const away = await state(); await delay(200);
  if (Math.abs((await state()).scroll - away.scroll) > 1) return "leaving edge did not stop";
  await move("move", initial.x, held.bottom);
  for (let attempt=0;attempt<50;attempt++) {
    await delay(100);const now=await state();if(now.scroll>=now.max-1)break;
  }
  const bottom = await state();
  if (bottom.scroll < bottom.max - 1) return "could not drag to last item";
  if (bottom.ghostRank !== "15" || bottom.ghostDigits !== "15" || bottom.ranks !== Array.from({length:15},(_,index)=>index+1).join('|')) return "drag to bottom did not renumber list and ghost";
  await move("move", initial.x, held.top);
  for (let attempt=0;attempt<50;attempt++) { await delay(100);if((await state()).scroll===0)break; }
  const top = await state();
  if (top.scroll !== 0) return "upper edge could not return to first item";
  if (top.ghostRank !== "1" || top.ghostDigits !== "1") return "drag to top did not renumber ghost";
  await move("move", initial.x, held.bottom);
  for (let attempt=0;attempt<50;attempt++) { await delay(100);const now=await state();if(now.scroll>=now.max-1)break; }
  await move("up", initial.x, held.bottom);
  const released = await state(); await delay(200);
  const stopped = await state();
  if (!stopped.open || Math.abs(stopped.scroll-released.scroll)>1 || stopped.parent!==initial.parent || stopped.source!==initial.source) return "release did not stop cleanly or closed parent";
  await ev(`document.querySelector('[data-pcw-save-order]').click()`);
  const last = await ev(`document.querySelector('[data-pcw-joined-list]').lastElementChild.dataset.pcwDefinition`);
  await ev("__pcQa.close()");
  if (kind === "touch") await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: false }, sessionId);
  return last === "d1" ? true : "first item did not move to last";
}

async function testQuantityInventoryPointer(cdp, sessionId) {
  const ev = (expression) => evaluate(cdp, sessionId, expression);
  const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const clickAt = async (x, y) => {
    await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y }, sessionId);
    await cdp.send("Input.dispatchMouseEvent", {
      type: "mousePressed", x, y, button: "left", buttons: 1, clickCount: 1,
    }, sessionId);
    await cdp.send("Input.dispatchMouseEvent", {
      type: "mouseReleased", x, y, button: "left", buttons: 0, clickCount: 1,
    }, sessionId);
  };
  await ev(`document.querySelector('[data-modal-open="modalQuantityInventoryBackdrop"]').click()`);
  try {
  await pause(80);
  const enabled = await ev(`(function(){
    var modal=document.getElementById('modalQuantityInventoryBackdrop');
    var table=modal.querySelector('.qp-inventory-table');
    var shell=modal.querySelector('.qp-inventory-scroll');
    var row=Array.from(table.querySelectorAll('tbody tr')).find(function(item){return item.querySelector('input[data-qp-inventory-room="azc"]');});
    var input=row.querySelector('input[data-qp-inventory-room][data-month-key="2026-08"]');
    var cell=input.closest('.qp-inventory-cell');
    var bounds=cell.getBoundingClientRect();
    var target={x:Math.max(bounds.left+4,shell.getBoundingClientRect().left+4),y:bounds.top+bounds.height/2};
    return {target:target, checked:input.checked, disabled:input.disabled,
      label:!!input.closest('.qp-inventory-cell-label'), open:modal.classList.contains('open'),
      overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+1};
  })()`);
  if (!enabled.open || enabled.disabled || enabled.checked || !enabled.label || enabled.overflow)
    return "mobile AZC August cell is not an available blank target: " + JSON.stringify(enabled);
  await clickAt(enabled.target.x, enabled.target.y);
  await pause(40);
  const selected = await ev(`(function(){var input=document.querySelector('#modalQuantityInventoryBackdrop input[data-qp-inventory-room="azc"][data-month-key="2026-08"]');return input.checked;})()`);
  if (!selected) return "clicking blank space in an enabled cell did not select it exactly once";
  await clickAt(enabled.target.x, enabled.target.y);
  await pause(40);
  const cleared = await ev(`(function(){var input=document.querySelector('#modalQuantityInventoryBackdrop input[data-qp-inventory-room="azc"][data-month-key="2026-08"]');return !input.checked;})()`);
  if (!cleared) return "clicking the enabled cell twice did not restore its original state";
  const disabled = await ev(`(function(){
    var modal=document.getElementById('modalQuantityInventoryBackdrop');
    var table=modal.querySelector('.qp-inventory-table');
    var shell=modal.querySelector('.qp-inventory-scroll');
    shell.scrollLeft=shell.scrollWidth;
    var row=Array.from(table.querySelectorAll('tbody tr')).find(function(item){return item.querySelector('input[data-qp-inventory-room="aac"]');});
    var input=row.querySelector('input[data-qp-inventory-room][data-month-key="2027-09"]');
    var cell=input.closest('.qp-inventory-cell');
    var bounds=cell.getBoundingClientRect();
    return {target:{x:bounds.left+4,y:bounds.top+bounds.height/2},disabled:input.disabled,
      checked:input.checked,cellDisabled:cell.classList.contains('is-disabled'),
      shell:shell.getBoundingClientRect().toJSON()};
  })()`);
  if (!disabled.disabled || !disabled.cellDisabled || disabled.checked)
    return "AAC September disabled cell state mismatch: " + JSON.stringify(disabled);
  await clickAt(disabled.target.x, disabled.target.y);
  const afterClick = await ev(`(function(){var input=document.querySelector('#modalQuantityInventoryBackdrop input[data-qp-inventory-room="aac"][data-month-key="2027-09"]');return input.checked;})()`);
  if (afterClick) return "clicking blank space in disabled AAC September changed it";
  const focusResult = await ev(`(function(){
    var input=document.querySelector('#modalQuantityInventoryBackdrop input[data-qp-inventory-room="aac"][data-month-key="2027-09"]');
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown',{key:' ',bubbles:true}));
    input.dispatchEvent(new KeyboardEvent('keyup',{key:' ',bubbles:true}));
    return {focused:document.activeElement===input,checked:input.checked};
  })()`);
  if (focusResult.focused || focusResult.checked)
    return "disabled AAC September accepted keyboard focus or changed state";
  await ev(`document.querySelector('#modalQuantityInventoryBackdrop .modal-close-btn[data-modal="modalQuantityInventoryBackdrop"]').click()`);
  return true;
  } finally {
    await ev(`(function(){var modal=document.getElementById('modalQuantityInventoryBackdrop');var close=modal&&modal.querySelector('.modal-close-btn[data-modal="modalQuantityInventoryBackdrop"]');if(modal&&modal.classList.contains('open')&&close)close.click();})()`)
      .catch(() => {});
  }
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
      const result = check.pointer
        ? await testProjectPointer(cdp, sessionId, check.pointer)
        : check.quantityInventoryPointer
          ? await testQuantityInventoryPointer(cdp, sessionId)
        : check.photoTouch
          ? await testPhotoTouch(cdp, sessionId, check.photoTouch)
          : await evaluate(cdp, sessionId, check.expr);
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
