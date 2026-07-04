// 房間預定 [A]-[E] 區塊行為 module（Stage 1d，specs/page-architecture.md）
// 內容自 landing.html 的 initSubPageBehaviors / initCalendar 原樣搬出（root-scoped），
// 給 order-processing.html 訂單修改 modal body 使用。
// landing 已於 Stage 3 清為 dashboard；此 module 是 [A]-[E] 行為單一來源。
// 依賴：dayjs + isoWeek plugin（頁面 CDN 載入）。
export function initRoomBookingBehaviors(root) {
  initSubPageBehaviors(root);
}

function initSubPageBehaviors(root) {
  // Accordion toggles
  root
    .querySelectorAll(".rb-accordion-header")
    .forEach(function (header) {
      header.addEventListener("click", function () {
        var content = header
          .closest(".rb-accordion")
          .querySelector(".rb-accordion-content");
        var icon = header.querySelector(".rb-accordion-icon");
        var opening = content.classList.contains("rb-hidden");
        content.classList.toggle("rb-hidden");
        var base = icon.src.replace(/[^/]*\.svg$/, "");
        // 展開 -> down（箭頭朝下）；收起 -> up（箭頭朝上）
        icon.src = opening ? base + "down.svg" : base + "up.svg";
      });
    });
  // Toggle button pairs (空房查詢 / 庫存表)
  root.querySelectorAll(".rb-toggle-group").forEach(function (group) {
    group.querySelectorAll(".rb-toggle-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        group.querySelectorAll(".rb-toggle-btn").forEach(function (b) {
          b.classList.remove("rb-active");
        });
        btn.classList.add("rb-active");
      });
    });
  });
  // Filter tabs
  root.querySelectorAll(".rb-filter-tabs").forEach(function (tabs) {
    tabs.querySelectorAll(".rb-filter-tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        tabs.querySelectorAll(".rb-filter-tab").forEach(function (b) {
          b.classList.remove("rb-active");
        });
        btn.classList.add("rb-active");
      });
    });
  });
  // 訂單處理：快篩 button 單選切換（黃底 circle-selected-yellow，沿用 .rb-filter-tab）
  // 預設不選中；點擊已選中的項目會取消選取（回到無選取），跟 .rb-filter-tabs 不同（那組恆有一個 active）
  root
    .querySelectorAll("[data-op-quick-filter-group]")
    .forEach(function (group) {
      group.querySelectorAll(".rb-filter-tab").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var wasActive = btn.classList.contains("rb-active");
          group.querySelectorAll(".rb-filter-tab").forEach(function (b) {
            b.classList.remove("rb-active");
          });
          if (!wasActive) {
            btn.classList.add("rb-active");
          }
        });
      });
    });
  // 訂單處理：訂單編號 pill -> 下拉選單（desktop 定位在 pill 下方 / mobile 底部 offcanvas，
  // 同一份 DOM，容器樣式靠 CSS breakpoint 切換，見 .op-row-menu）
  (function () {
    var menu = root.querySelector("[data-op-row-menu]");
    if (!menu) return;
    function closeMenu() {
      menu.classList.add("hidden");
    }
    function openMenuFor(trigger) {
      var rect = trigger.getBoundingClientRect();
      menu.style.setProperty("--op-menu-x", rect.left + window.scrollX + "px");
      menu.style.setProperty(
        "--op-menu-y",
        rect.bottom + window.scrollY + 4 + "px",
      );
      menu.classList.remove("hidden");
    }
    root.querySelectorAll("[data-op-pill-trigger]").forEach(function (pill) {
      pill.addEventListener("click", function (e) {
        e.stopPropagation();
        var willOpen = menu.classList.contains("hidden");
        closeMenu();
        if (willOpen) openMenuFor(pill);
      });
    });
    var closeBtn = menu.querySelector("[data-op-row-menu-close]");
    if (closeBtn) {
      closeBtn.addEventListener("click", closeMenu);
    }
    // 注意：選單內不可 stopPropagation -- 選單項目的 modal 接線靠
    // document 層 delegated handler（[data-op-menu-action] 分支），
    // outside-close 改用 closest 檢查排除選單內點擊
    menu.querySelectorAll("[data-op-menu-action]").forEach(function (item) {
      item.addEventListener("click", function () {
        // 選單收合在此；訂單/修改/簡訊 的 modal 開啟在 document 層
        // delegated handler，連結/複製/取消 留給後端
        closeMenu();
      });
    });
    if (!window.__opRowMenuOutsideBound) {
      window.__opRowMenuOutsideBound = true;
      document.addEventListener("click", function (e) {
        if (e.target.closest("[data-op-row-menu]")) return;
        document
          .querySelectorAll("[data-op-row-menu]")
          .forEach(function (m) {
            m.classList.add("hidden");
          });
      });
    }
  })();
  // 訂單處理：狀態 tabs 單選切換（底線+semibold，沿用 .member-data-filter-tab）
  root.querySelectorAll("[data-op-filter-group]").forEach(function (group) {
    group.querySelectorAll(".member-data-filter-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        group
          .querySelectorAll(".member-data-filter-tab")
          .forEach(function (t) {
            t.classList.toggle("is-active", t === tab);
          });
      });
    });
  });
  // 訂單處理：tooltip 觸發（click 開，click 外部關）- 無 hover 版本
  root.querySelectorAll(".op-tooltip-panel").forEach(function (panel) {
    panel.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  });
  root.querySelectorAll(".op-tooltip-trigger").forEach(function (trigger) {
    var key = trigger.dataset.opTooltip;
    var panel = root.querySelector(
      '[data-op-tooltip-panel="' + key + '"]',
    );
    if (!panel) return;
    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var willOpen = panel.classList.contains("hidden");
      root.querySelectorAll(".op-tooltip-panel").forEach(function (p) {
        p.classList.add("hidden");
      });
      root
        .querySelectorAll(".op-tooltip-trigger")
        .forEach(function (t) {
          t.setAttribute("aria-expanded", "false");
        });
      if (willOpen) {
        panel.classList.remove("hidden");
        trigger.setAttribute("aria-expanded", "true");
        // 水平夾取：panel 錨在 trigger 左緣（left-0）、固定寬，
        // trigger 靠右時會超出視窗（手機版必現），量測後平移回可視範圍。
        // 基準用 documentElement.clientWidth：mobile 下 innerWidth
        // 會跟著 content overflow 浮動（633 vs 真實 390），不可靠
        panel.style.marginLeft = "";
        var rect = panel.getBoundingClientRect();
        var viewportW = document.documentElement.clientWidth;
        var margin = 12;
        var shift = 0;
        if (rect.right > viewportW - margin) {
          shift = viewportW - margin - rect.right;
        }
        if (rect.left + shift < margin) {
          shift = margin - rect.left;
        }
        if (shift) panel.style.marginLeft = shift + "px";
      }
    });
  });
  if (!window.__opTooltipOutsideBound) {
    window.__opTooltipOutsideBound = true;
    document.addEventListener("click", function () {
      document
        .querySelectorAll(".op-tooltip-panel")
        .forEach(function (p) {
          p.classList.add("hidden");
        });
      document
        .querySelectorAll(".op-tooltip-trigger")
        .forEach(function (t) {
          t.setAttribute("aria-expanded", "false");
        });
    });
  }
  // 訂單處理：專案 toggle -> 所有專案 / 僅有效專案 標籤文字
  root.querySelectorAll("[data-op-project-toggle]").forEach(function (toggle) {
    var checkbox = toggle.querySelector("input[type=checkbox]");
    var row = toggle.closest(".flex.items-center.gap-3");
    var label = row
      ? row.querySelector("[data-op-project-state]")
      : null;
    if (!checkbox || !label) return;
    checkbox.addEventListener("change", function () {
      label.textContent = checkbox.checked ? "僅有效專案" : "所有專案";
    });
  });
  // 可用庫存數 總計 = sum of data rows' [data-inv-cap]
  (function () {
    var total = root.querySelector(
      "#tableInventory [data-inv-cap-total]",
    );
    if (!total) return;
    var sum = 0;
    root
      .querySelectorAll("#tableInventory [data-inv-cap]")
      .forEach(function (cell) {
        sum += parseInt(cell.textContent, 10) || 0;
      });
    total.textContent = sum;
  })();
  // 空房查詢 (Allocate) 總計 = column-wise sum of data rows
  (function () {
    var allocTable = root.querySelector("#tableAllocate");
    if (!allocTable) return;
    function recalc() {
      ["cap", "stock", "rsv"].forEach(function (col) {
        var sum = 0;
        allocTable
          .querySelectorAll('[data-alloc-col="' + col + '"]')
          .forEach(function (cell) {
            sum += parseInt(cell.textContent, 10) || 0;
          });
        var t = allocTable.querySelector(
          '[data-alloc-total="' + col + '"]',
        );
        if (t) t.textContent = sum;
      });
      var allocSum = 0;
      allocTable
        .querySelectorAll(".rb-alloc-input")
        .forEach(function (inp) {
          allocSum += parseInt(inp.value, 10) || 0;
        });
      var allocT = allocTable.querySelector(
        '[data-alloc-total="alloc"]',
      );
      if (allocT) allocT.textContent = allocSum;
    }
    allocTable
      .querySelectorAll(".rb-alloc-input")
      .forEach(function (inp) {
        inp.addEventListener("input", recalc);
      });
    // 清除按鈕：清空所有 分配數 input + 重算總計
    var clearBtn = root.querySelector("#rbAllocClear");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        allocTable
          .querySelectorAll(".rb-alloc-input")
          .forEach(function (inp) {
            inp.value = "";
          });
        recalc();
      });
    }
    recalc();
  })();
  // Inventory metric toggle (訂/餘/保) -> 顯示/隱藏 cell 內對應 chip
  root.querySelectorAll(".inv-metric-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      btn.classList.toggle("rb-active");
      var on = btn.classList.contains("rb-active");
      var metric = btn.dataset.metric;
      root
        .querySelectorAll(
          '#tableInventory [data-metric="' + metric + '"]',
        )
        .forEach(function (chip) {
          chip.style.display = on ? "" : "none";
        });
    });
  });
  // Inventory Excel export + date-details modal
  (function () {
    var tableInventory = root.querySelector("#tableInventory");
    var excelBtn = root.querySelector("[data-inventory-excel]");
    var dateModal = root.querySelector("[data-inventory-date-modal]");
    var dateModalTitle = root.querySelector(
      "[data-inventory-date-modal-title]",
    );
    var dateModalBody = root.querySelector(
      "[data-inventory-date-modal-body]",
    );
    var dateModalClose = root.querySelector(
      "[data-inventory-date-modal-close]",
    );
    var dateDetailRows = [
      {
        roomType: "義大利麵房",
        official: 0,
        unpaid: 0,
        expired: 0,
        waitlist: 0,
      },
      {
        roomType: "香蕉船房",
        official: 1,
        unpaid: 1,
        expired: 1,
        waitlist: 1,
      },
    ];

    function csvEscape(value) {
      var text = String(value || "").replace(/\s+/g, " ").trim();
      return '"' + text.replace(/"/g, '""') + '"';
    }

    function exportInventoryCsv() {
      if (!tableInventory) return;
      var rows = Array.prototype.slice.call(
        tableInventory.querySelectorAll("table tr"),
      );
      if (!rows.length) return;
      var csv = rows
        .map(function (row) {
          return Array.prototype.slice
            .call(row.children)
            .map(function (cell) {
              return csvEscape(cell.innerText);
            })
            .join(",");
        })
        .join("\n");
      var blob = new Blob(["\ufeff" + csv], {
        type: "text/csv;charset=utf-8;",
      });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = "庫存表.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }

    function renderDateDetails(dateText) {
      if (dateModalTitle) dateModalTitle.textContent = dateText;
      if (!dateModalBody) return;
      dateModalBody.innerHTML = "";
      dateDetailRows.forEach(function (row) {
        var tr = document.createElement("tr");
        [
          row.roomType,
          row.official,
          row.unpaid,
          row.expired,
          row.waitlist,
        ].forEach(function (value) {
          var td = document.createElement("td");
          td.textContent = value;
          tr.appendChild(td);
        });
        dateModalBody.appendChild(tr);
      });
    }

    function positionDateModal(trigger) {
      if (!dateModal || !trigger) return;
      var r = trigger.getBoundingClientRect();
      var gutter = 8;
      var modalWidth = dateModal.offsetWidth || 384;
      var modalHeight = dateModal.offsetHeight || 189;
      var left = r.left + r.width / 2 - modalWidth / 2;
      var top = r.bottom + gutter;
      if (left + modalWidth + gutter > window.innerWidth) {
        left = window.innerWidth - modalWidth - gutter;
      }
      if (left < gutter) left = gutter;
      if (top + modalHeight + gutter > window.innerHeight) {
        top = Math.max(gutter, r.top - modalHeight - gutter);
      }
      dateModal.style.left = left + "px";
      dateModal.style.top = top + "px";
    }

    function closeDateModal() {
      if (!dateModal) return;
      dateModal.classList.add("hidden");
    }

    function openDateModal(trigger) {
      if (!dateModal || !trigger) return;
      var dateText = trigger.dataset.invDate || "";
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateText)) return;
      renderDateDetails(dateText);
      dateModal.classList.remove("hidden");
      positionDateModal(trigger);
    }

    if (excelBtn) {
      excelBtn.addEventListener("click", function (e) {
        e.preventDefault();
        exportInventoryCsv();
      });
    }

    root
      .querySelectorAll("[data-inv-date-trigger]")
      .forEach(function (trigger) {
        trigger.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          openDateModal(trigger);
        });
      });

    if (dateModalClose) {
      dateModalClose.addEventListener("click", closeDateModal);
    }
  })();
  // Allocate row checkbox -> toggle 分配數 input enabled/disabled
  root.querySelectorAll(".rb-alloc-cb").forEach(function (cb) {
    cb.addEventListener("change", function () {
      var row = cb.closest("tr");
      if (!row) return;
      var input = row.querySelector(".rb-alloc-input");
      if (!input) return;
      input.disabled = !cb.checked;
      input.classList.toggle("bg-white", cb.checked);
      input.classList.toggle("bg-border-default", !cb.checked);
    });
  });
  // 訂房明細表 入住日 / 退房日 cell：simple calendar dropdown (variant 2)
  (function () {
    if (typeof window.activeSimpleCalendar === "undefined") {
      window.activeSimpleCalendar = null;
      document.addEventListener("click", function () {
        if (window.activeSimpleCalendar) {
          window.activeSimpleCalendar.classList.remove("active");
          window.activeSimpleCalendar = null;
        }
      });
    }
    // Reusable cell init - exposed to window so other modules
    // (eg. arrival method modal 生效日 cell) can init lazy-mounted cells
    function initCell(cell) {
        if (cell.dataset.calInit) return;
        cell.dataset.calInit = "1";
        var btn = cell.querySelector(".rb-cal-btn");
        var displayEl = cell.querySelector(".rb-cal-date");
        if (!btn || !displayEl) return;
        var variant = cell.dataset.calVariant; // undefined | 'birthday'
        var allowPast = variant === "birthday"; // birthday 允許過去
        var blockFuture = variant === "birthday"; // birthday 禁止未來（生日不可能未來）
        var hasYMSelects = variant === "birthday"; // 生日：header 用 year/month select
        var dropdown = document.createElement("div");
        dropdown.className = "calendar-dropdown p-4";
        var headerCenter = hasYMSelects
          ? '<div class="flex gap-1">' +
            '<select class="year-select calendar-header-select"></select>' +
            '<select class="month-select calendar-header-select"></select>' +
            "</div>"
          : '<span class="month-label font-bold text-text-emphasis text-sm"></span>';
        dropdown.innerHTML =
          '<div class="flex justify-between items-center mb-4">' +
          '<button type="button" class="prev-month p-1 hover:bg-surface-hover rounded text-text-secondary">&lt;</button>' +
          headerCenter +
          '<button type="button" class="next-month p-1 hover:bg-surface-hover rounded text-text-secondary">&gt;</button>' +
          "</div>" +
          '<div class="grid grid-cols-7 gap-1 text-center text-xs font-bold text-text-secondary mb-2">' +
          '<div class="title-highlight py-1">日</div>' +
          '<div class="py-1">一</div>' +
          '<div class="py-1">二</div>' +
          '<div class="py-1">三</div>' +
          '<div class="py-1">四</div>' +
          '<div class="py-1">五</div>' +
          '<div class="title-highlight py-1">六</div>' +
          "</div>" +
          '<div class="days-grid grid grid-cols-7 gap-1"></div>';
        /* portal 到 document.body，避免被祖先 overflow:hidden 裁切 */
        document.body.appendChild(dropdown);
        dropdown.addEventListener("click", function (e) {
          e.stopPropagation();
        });
        var daysGrid = dropdown.querySelector(".days-grid");
        var monthLabel = dropdown.querySelector(".month-label");
        var yearSelect = dropdown.querySelector(".year-select");
        var monthSelect = dropdown.querySelector(".month-select");
      // Birthday variant：填年份（今年 -> 1920，遞減）+ 月份（1-12）
      if (hasYMSelects) {
        var thisYear = dayjs().year();
        for (var y = thisYear; y >= 1920; y--) {
          yearSelect.add(new Option(y + " 年", y));
        }
        for (var m = 1; m <= 12; m++) {
          monthSelect.add(new Option(m + " 月", m - 1));
        }
        yearSelect.onclick = function (e) {
          e.stopPropagation();
        };
        monthSelect.onclick = function (e) {
          e.stopPropagation();
        };
        yearSelect.addEventListener("change", function (e) {
          e.stopPropagation();
          viewingDate = viewingDate
            .year(parseInt(yearSelect.value, 10))
            .month(parseInt(monthSelect.value, 10));
          render();
        });
        monthSelect.addEventListener("change", function (e) {
          e.stopPropagation();
          viewingDate = viewingDate
            .year(parseInt(yearSelect.value, 10))
            .month(parseInt(monthSelect.value, 10));
          render();
        });
      }
      // 預設日期：使用 markup 既有日期；若空則填今日
      var existing = displayEl.textContent.trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(existing)) {
        displayEl.textContent = dayjs().format("YYYY-MM-DD");
      }
      var viewingDate = dayjs(displayEl.textContent.trim());
      function render() {
        daysGrid.innerHTML = "";
        if (monthLabel)
          monthLabel.textContent = viewingDate.format("YYYY年 MM月");
        if (hasYMSelects) {
          yearSelect.value = viewingDate.year();
          monthSelect.value = viewingDate.month();
        }
        var today = dayjs().startOf("day");
        var startDay = viewingDate.startOf("month").day();
        var daysInMonth = viewingDate.daysInMonth();
        var selectedStr = displayEl.textContent.trim();
        for (var i = 0; i < startDay; i++) {
          daysGrid.appendChild(document.createElement("div"));
        }
        for (var d = 1; d <= daysInMonth; d++) {
          var current = viewingDate.date(d);
          var dateStr = current.format("YYYY-MM-DD");
          var dayBtn = document.createElement("button");
          dayBtn.type = "button";
          dayBtn.textContent = d;
          dayBtn.className =
            "calendar-day w-8 h-8 flex items-center justify-center text-xs rounded-full transition-all";
          if (dateStr === today.format("YYYY-MM-DD"))
            dayBtn.classList.add("today");
          var isPast = current.isBefore(today);
          var isFuture = current.isAfter(today);
          if ((!allowPast && isPast) || (blockFuture && isFuture)) {
            dayBtn.disabled = true;
          } else {
            (function (ds) {
              dayBtn.onclick = function (ev) {
                ev.stopPropagation();
                displayEl.textContent = ds;
                dropdown.classList.remove("active");
                window.activeSimpleCalendar = null;
              };
            })(dateStr);
            if (dateStr === selectedStr)
              dayBtn.classList.add("selected");
          }
          daysGrid.appendChild(dayBtn);
        }
      }
      function positionDropdown() {
        var r = btn.getBoundingClientRect();
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var dw = dropdown.offsetWidth || 280;
        var dh = dropdown.offsetHeight || 340;
        var gutter = 8;
        // Horizontal: anchor under button, clamp inside viewport
        var left = r.left;
        if (left + dw + gutter > vw) left = vw - dw - gutter;
        if (left < gutter) left = gutter;
        // Vertical: prefer below; flip above if it would overflow
        var top = r.bottom + gutter;
        if (top + dh + gutter > vh) {
          var above = r.top - dh - gutter;
          top =
            above > gutter ? above : Math.max(gutter, vh - dh - gutter);
        }
        // viewport 絕對座標（dropdown 已 portal 到 body, position: fixed）
        dropdown.style.top = top + "px";
        dropdown.style.left = left + "px";
      }
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (
          window.activeSimpleCalendar &&
          window.activeSimpleCalendar !== dropdown
        ) {
          window.activeSimpleCalendar.classList.remove("active");
        }
        dropdown.classList.toggle("active");
        window.activeSimpleCalendar = dropdown.classList.contains(
          "active",
        )
          ? dropdown
          : null;
        if (window.activeSimpleCalendar) {
          // Reset viewingDate to selected date each open
          var cur = displayEl.textContent.trim();
          if (/^\d{4}-\d{2}-\d{2}$/.test(cur)) viewingDate = dayjs(cur);
          positionDropdown();
          render();
        }
      });
      window.addEventListener(
        "scroll",
        function () {
          if (dropdown.classList.contains("active")) positionDropdown();
        },
        true,
      );
      window.addEventListener("resize", function () {
        if (dropdown.classList.contains("active")) positionDropdown();
      });
      dropdown.querySelector(".prev-month").onclick = function (e) {
        e.stopPropagation();
        viewingDate = viewingDate.subtract(1, "month");
        render();
      };
      dropdown.querySelector(".next-month").onclick = function (e) {
        e.stopPropagation();
        viewingDate = viewingDate.add(1, "month");
        render();
      };
    }
    // Expose for lazy-mounted cells (arrival method modal 等)
    window.initSimpleCalendarCell =
      window.initSimpleCalendarCell || initCell;
    // Init existing cells
    root.querySelectorAll(".rb-cal-cell").forEach(initCell);
  })();
  // 訂房明細表 stepper（-/+ 按鈕調整訂房間數）
  root.querySelectorAll(".stepper").forEach(function (s) {
    var input = s.querySelector(".rb-step-val");
    if (!input) return;
    s.querySelector(".rb-step-minus").addEventListener(
      "click",
      function () {
        var v = parseInt(input.value, 10) || 0;
        input.value = Math.max(1, v - 1);
      },
    );
    s.querySelector(".rb-step-plus").addEventListener(
      "click",
      function () {
        var v = parseInt(input.value, 10) || 0;
        input.value = v + 1;
      },
    );
  });
  // 正式單/候補單 訂單類型 radio -> 切換對應 content panel
  (function () {
    var radios = root.querySelectorAll('input[name="rb-order-type"]');
    var contentArea = root.querySelector("#orderTypeContent");
    if (!radios.length || !contentArea) return;
    function apply() {
      var checked = root.querySelector(
        'input[name="rb-order-type"]:checked',
      );
      var key = checked ? checked.value : "";
      contentArea
        .querySelectorAll("[data-order-type-panel]")
        .forEach(function (p) {
          p.classList.toggle(
            "hidden",
            p.dataset.orderTypePanel !== key,
          );
        });
    }
    radios.forEach(function (r) {
      r.addEventListener("change", apply);
    });
    apply();
  })();
  // 正式單 panel：付款方式 chip -> 切換對應欄位組
  (function () {
    var chips = root.querySelectorAll("#paymentChips .rb-pay-chip");
    var fieldsRoot = root.querySelector("#paymentFields");
    if (!chips.length || !fieldsRoot) return;
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        chips.forEach(function (x) {
          x.classList.toggle("rb-pay-active", x === c);
        });
        var key = c.dataset.pay;
        fieldsRoot
          .querySelectorAll("[data-pay-fields]")
          .forEach(function (f) {
            f.classList.toggle("hidden", f.dataset.payFields !== key);
          });
      });
    });
  })();
  // 訂房資料 國籍 radio -> toggle 地址結構 (taiwan vs foreign) + 國家 select
  // data-nation-init guard：與 order-processing.js / order-modals.js 同一
  // guard 慣例，防止同一 group 被多 module 重複綁定
  (function () {
    root.querySelectorAll(".nation-group").forEach(function (group) {
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
  })();
  // 訂房資料 lock toggle：紅 = inputs disabled / 綠 = active
  // 只影響 訂房 / 入住 panels；合約 panel 是 read-only 文字顯示，鎖頭不作用
  (function () {
    var lock = root.querySelector("#orderDataLock");
    if (!lock) return;
    var lockable = root.querySelectorAll(
      '.order-panel[data-panel="booking"], .order-panel[data-panel="checkin"]',
    );
    var clearBtn = root.querySelector("#orderDataClear");
    function apply() {
      var locked = lock.dataset.locked === "true";
      lock.setAttribute("aria-pressed", locked ? "true" : "false");
      lockable.forEach(function (p) {
        p.classList.toggle("is-locked", locked);
        // radios + checkboxes：用 disabled 屬性（label click 也會被 disabled 阻擋）
        p.querySelectorAll(
          'input[type="radio"], input[type="checkbox"]',
        ).forEach(function (el) {
          el.disabled = locked;
        });
      });
      // 清除 button 連動：locked 時 disabled、解鎖時可用
      if (clearBtn) {
        clearBtn.disabled = locked;
        clearBtn.classList.toggle("opacity-40", locked);
        clearBtn.classList.toggle("cursor-not-allowed", locked);
        clearBtn.classList.toggle("cursor-pointer", !locked);
      }
    }
    lock.addEventListener("click", function () {
      lock.dataset.locked =
        lock.dataset.locked === "true" ? "false" : "true";
      apply();
    });
    apply();
  })();
  // 訂房資料 honorific (先生/小姐) 跟性別 radio 連動 (booking + checkin 各自獨立)
  (function () {
    var radios = root.querySelectorAll("[data-gender-panel]");
    if (!radios.length) return;
    function applyHonorific(panel) {
      var checked = root.querySelector(
        '[data-gender-panel="' + panel + '"]:checked',
      );
      var label = root.querySelector(
        '[data-honorific-panel="' + panel + '"]',
      );
      if (!label) return;
      label.textContent = checked && checked.value === "female" ? "小姐" : "先生";
    }
    radios.forEach(function (r) {
      r.addEventListener("change", function () {
        applyHonorific(r.dataset.genderPanel);
      });
    });
    applyHonorific("booking");
    applyHonorific("checkin");
  })();
  // 訂房資料 tab switching (訂房 / 入住 / 合約)
  (function () {
    var tabs = root.querySelectorAll("#orderDataTabs .order-tab");
    if (!tabs.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var key = tab.dataset.tab;
        tabs.forEach(function (t) {
          t.classList.toggle("order-tab-active", t === tab);
        });
        root.querySelectorAll(".order-panel").forEach(function (p) {
          p.classList.toggle("hidden", p.dataset.panel !== key);
        });
      });
    });
  })();
  // 訂房資料 清除 button -> reset inputs in active panel
  // 只在 lock 為解鎖（綠）時生效；上鎖（紅）時 disabled 不作用
  (function () {
    var btn = root.querySelector("#orderDataClear");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var lock = root.querySelector("#orderDataLock");
      if (lock && lock.dataset.locked === "true") return;
      var active = root.querySelector(".order-panel:not(.hidden)");
      if (!active) return;
      active
        .querySelectorAll('input[type="text"], textarea')
        .forEach(function (el) {
          el.value = "";
        });
      active
        .querySelectorAll('input[type="checkbox"]')
        .forEach(function (el) {
          el.checked = false;
        });
    });
  })();
  // 客戶類型 toggle (一般客戶 / 合約客戶) -> 顯示/隱藏合約專屬欄位 + 顯示/隱藏合約 tab
  (function () {
    var btns = root.querySelectorAll(".customer-btn");
    var contractFields = root.querySelector("#contractFields");
    if (!btns.length || !contractFields) return;
    var contractTab = root.querySelector(
      '#orderDataTabs .order-tab[data-tab="contract"]',
    );
    function switchOrderTab(key) {
      var tabs = root.querySelectorAll("#orderDataTabs .order-tab");
      if (!tabs.length) return;
      tabs.forEach(function (t) {
        t.classList.toggle("order-tab-active", t.dataset.tab === key);
      });
      root.querySelectorAll(".order-panel").forEach(function (p) {
        p.classList.toggle("hidden", p.dataset.panel !== key);
      });
    }
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        btns.forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        var isContract = btn.dataset.customer === "contract";
        contractFields.classList.toggle("hidden", !isContract);
        if (contractTab)
          contractTab.classList.toggle("hidden", !isContract);
        switchOrderTab(isContract ? "contract" : "booking");
      });
    });
  })();
  // 發票 select -> 統編 / 抬頭 enable/disable
  (function () {
    var invoice = root.querySelector("#invoiceSelect");
    var inputs = root.querySelectorAll(".rb-invoice-input");
    if (!invoice || !inputs.length) return;
    function applyInvoice() {
      var enabled = invoice.value === "issue";
      inputs.forEach(function (input) {
        input.disabled = !enabled;
        input.classList.toggle("bg-white", enabled);
        input.classList.toggle("bg-border-default", !enabled);
      });
    }
    invoice.addEventListener("change", applyInvoice);
    applyInvoice();
  })();
  // Room count +/- buttons
  root
    .querySelectorAll(".rb-count-minus, .rb-count-plus")
    .forEach(function (btn) {
      btn.addEventListener("click", function () {
        var display = btn
          .closest(".rb-count-group")
          .querySelector(".rb-count-val");
        var val = parseInt(display.textContent, 10) || 0;
        display.textContent = btn.classList.contains("rb-count-minus")
          ? Math.max(1, val - 1)
          : val + 1;
      });
    });
  // Range -> display value
  root.querySelectorAll(".rb-range").forEach(function (input) {
    var display = input
      .closest(".rb-range-row")
      .querySelector(".rb-range-val");
    input.addEventListener("input", function () {
      if (display) display.textContent = input.value;
    });
  });
  // Allocate: range max = sum of 可用庫存數, button distributes value to checked rows
  (function () {
    var rows = root.querySelectorAll(".rb-alloc-row");
    if (!rows.length) return;
    var stockSum = 0;
    rows.forEach(function (tr) {
      var cell = tr.querySelector(".rb-alloc-stock");
      var n = cell ? parseInt(cell.textContent.trim(), 10) || 0 : 0;
      tr.dataset.stock = n;
      stockSum += n;
    });
    var rangeRow = root.querySelector(".rb-range-row");
    if (!rangeRow) return;
    var range = rangeRow.querySelector(".rb-range");
    var rangeVal = rangeRow.querySelector(".rb-range-val");
    if (range && stockSum > 0) {
      range.max = stockSum;
      if (parseInt(range.value, 10) > stockSum) range.value = stockSum;
      if (rangeVal) rangeVal.textContent = range.value;
    }
    var btn = rangeRow.querySelector(".rb-alloc-btn");
    if (btn) {
      btn.addEventListener("click", function () {
        var qty = parseInt(range.value, 10) || 0;
        var checked = [];
        rows.forEach(function (tr) {
          var cb = tr.querySelector(".rb-alloc-cb");
          if (cb && cb.checked) checked.push(tr);
        });
        if (!checked.length) return;
        // Even split with remainder, capped per-row by stock; spillover cascades
        var allocs = checked.map(function () {
          return 0;
        });
        var caps = checked.map(function (tr) {
          return parseInt(tr.dataset.stock, 10) || 0;
        });
        var remaining = qty;
        while (remaining > 0) {
          var openIdx = [];
          checked.forEach(function (_, i) {
            if (allocs[i] < caps[i]) openIdx.push(i);
          });
          if (!openIdx.length) break;
          var share = Math.floor(remaining / openIdx.length);
          if (share === 0) {
            for (var k = 0; k < openIdx.length && remaining > 0; k++) {
              var i2 = openIdx[k];
              allocs[i2]++;
              remaining--;
            }
            break;
          }
          openIdx.forEach(function (i) {
            var add = Math.min(share, caps[i] - allocs[i]);
            allocs[i] += add;
            remaining -= add;
          });
        }
        checked.forEach(function (tr, i) {
          var input = tr.querySelector(".rb-alloc-input");
          if (input) input.value = allocs[i];
        });
      });
    }
  })();
  // Calendar (room-booking page only) - root scope：
  // 訂單處理等無 calendar 頁面直接 skip，不會誤綁 hidden template
  // 或已建立的訂單修改 modal 副本（重複疊加綁定）
  initCalendar(root);
}

function initCalendar(root) {
  if (!root.querySelector("#calGrid")) return;

  dayjs.extend(window.dayjs_plugin_isoWeek);

  var mode = "room";
  var currentMonth = dayjs();
  var selStart = null;
  var selEnd = null;
  var isDragging = false;
  var extraWeeks = 0;
  var MAX_EXTRA_ROOM = 3;

  var grid = root.querySelector("#calGrid");
  var titleEl = root.querySelector("#calTitle");
  var countEl = root.querySelector("#count");
  var intervalSelect = root.querySelector("#intervalSelect");
  var btnRoom = root.querySelector("#btnRoom");
  var btnInventory = root.querySelector("#btnInventory");
  var tableAllocate = root.querySelector("#tableAllocate");
  var tableInventory = root.querySelector("#tableInventory");
  var inventoryExcel = root.querySelector("[data-inventory-excel]");
  var invMetricToggle = root.querySelector("#invMetricToggle");
  var rangeRow = root.querySelector("#rangeRow");
  var allocActions = root.querySelector("#rbAllocActions");
  var invCalendarLeft = root.querySelector("#invCalendarLeft");
  var invCalendarBtn = root.querySelector("#invCalendarBtn");

  // Populate intervalSelect options 1..31 (Figma 0527; before: 1/7/12/14/16/30)
  (function () {
    var opts = "";
    for (var i = 1; i <= 31; i += 1) {
      opts += '<option value="' + i + '">' + i + "</option>";
    }
    intervalSelect.innerHTML = opts;
    intervalSelect.value = "1"; // default for 空房查詢 mode (initial)
  })();

  // Equalize mode-toggle button widths - both set to the wider one's rendered width
  (function () {
    var w = Math.max(
      btnRoom.getBoundingClientRect().width,
      btnInventory.getBoundingClientRect().width,
    );
    btnRoom.style.width = w + "px";
    btnInventory.style.width = w + "px";
  })();

  function today() {
    return dayjs().startOf("day");
  }
  function getInterval() {
    return parseInt(intervalSelect.value);
  }

  function getAbsoluteLimit() {
    var monthEnd = currentMonth.endOf("month").startOf("day");
    var monthEndWeekEnd = monthEnd.endOf("isoWeek").startOf("day");
    return monthEndWeekEnd.add(4, "week");
  }

  function calcSelEnd(start) {
    var rawEnd = start.add(getInterval() - 1, "day");
    var limit = getAbsoluteLimit();
    return rawEnd.isAfter(limit) ? limit : rawEnd;
  }

  function getLastRenderedDate() {
    var cells = grid.querySelectorAll(".day");
    if (!cells.length) return null;
    return dayjs(cells[cells.length - 1].dataset.date);
  }

  function getDayElFromPoint(x, y) {
    var el = document.elementFromPoint(x, y);
    if (!el) return null;
    return el.closest(".day");
  }

  function ensureSelEndVisible() {
    if (mode !== "inventory" || !selEnd) return;
    var limit = getAbsoluteLimit();
    var last = getLastRenderedDate();
    while (
      last &&
      selEnd.isAfter(last, "day") &&
      last.isBefore(limit, "day")
    ) {
      for (var i = 0; i < 7; i++) {
        last = last.add(1, "day");
        appendCell(last);
      }
      last = getLastRenderedDate();
    }
  }

  function buildGrid() {
    grid.innerHTML = "";
    extraWeeks = 0;
    titleEl.textContent = currentMonth.format("YYYY 年 MM 月");
    var start = currentMonth.startOf("month").startOf("isoWeek");
    var d = start;
    for (var i = 0; i < 42; i++) {
      appendCell(d);
      d = d.add(1, "day");
    }
    if (mode === "inventory") ensureSelEndVisible();
    applyStyles();
  }

  function handleDragMove(dateStr) {
    if (!isDragging) return;
    selEnd = dayjs(dateStr);
    var last = getLastRenderedDate();
    if (
      last &&
      selEnd.isSame(last, "day") &&
      extraWeeks < MAX_EXTRA_ROOM
    ) {
      var ld = last;
      for (var i = 0; i < 7; i++) {
        ld = ld.add(1, "day");
        appendCell(ld);
      }
      extraWeeks++;
    }
    applyStyles();
    updateCount();
  }

  function appendCell(d) {
    var t = today();
    var isPast = d.isBefore(t, "day");
    var isToday = d.isSame(t, "day");
    var isOutside = !d.isSame(currentMonth, "month");
    var el = document.createElement("div");
    el.className = "day";
    el.dataset.date = d.format("YYYY-MM-DD");
    el.innerHTML =
      '<div class="day-wday">' +
      d.format("ddd") +
      '</div><div class="day-num">' +
      d.format("DD") +
      "</div>";
    if (isPast) {
      el.classList.add("disabled");
    } else {
      if (mode === "room") {
        el.addEventListener("mousedown", function (e) {
          e.preventDefault();
          isDragging = true;
          selStart = dayjs(el.dataset.date);
          selEnd = selStart;
          applyStyles();
          updateCount();
        });
        el.addEventListener("mouseover", function () {
          handleDragMove(el.dataset.date);
        });
        el.addEventListener(
          "touchstart",
          function (e) {
            e.preventDefault();
            isDragging = true;
            selStart = dayjs(el.dataset.date);
            selEnd = selStart;
            applyStyles();
            updateCount();
          },
          { passive: false },
        );
      } else {
        el.addEventListener("click", function () {
          selStart = dayjs(el.dataset.date);
          selEnd = calcSelEnd(selStart);
          ensureSelEndVisible();
          applyStyles();
          updateCount();
        });
      }
    }
    if (isOutside) el.classList.add("outside");
    if (isToday) el.classList.add("today");
    grid.appendChild(el);
  }

  grid.addEventListener(
    "touchmove",
    function (e) {
      if (!isDragging || mode !== "room") return;
      e.preventDefault();
      var touch = e.touches[0];
      var target = getDayElFromPoint(touch.clientX, touch.clientY);
      if (
        target &&
        target.dataset.date &&
        !target.classList.contains("disabled")
      ) {
        handleDragMove(target.dataset.date);
      }
    },
    { passive: false },
  );

  grid.addEventListener("touchend", function () {
    isDragging = false;
  });
  document.addEventListener("mouseup", function () {
    isDragging = false;
  });

  function applyStyles() {
    var cells = grid.querySelectorAll(".day");
    cells.forEach(function (el) {
      el.classList.remove("sel-start", "sel-end", "sel-mid");
    });
    if (!selStart) return;
    var s = selStart.startOf("day");
    var e = (selEnd || selStart).startOf("day");
    if (s.isAfter(e)) {
      var tmp = s;
      s = e;
      e = tmp;
    }
    cells.forEach(function (el) {
      var d = dayjs(el.dataset.date).startOf("day");
      if (d.isSame(s) && d.isSame(e)) el.classList.add("sel-start");
      else if (d.isSame(s)) el.classList.add("sel-start");
      else if (d.isSame(e)) el.classList.add("sel-end");
      else if (d.isAfter(s) && d.isBefore(e))
        el.classList.add("sel-mid");
    });
  }

  function updateCount() {
    if (!selStart) {
      countEl.textContent = "已選 0 天";
      return;
    }
    var s = selStart.startOf("day");
    var e = (selEnd || selStart).startOf("day");
    if (s.isAfter(e)) {
      var tmp = s;
      s = e;
      e = tmp;
    }
    countEl.textContent = "已選 " + (e.diff(s, "day") + 1) + " 天";
  }

  function setMode(m) {
    var prevSelStart = selStart;
    mode = m;
    // intervalSelect 永遠 enabled（0527 規格：disabled 狀態移除）
    // mode-specific default：空房查詢 1、庫存表 12，作為視覺差異
    intervalSelect.value = mode === "inventory" ? "12" : "1";
    btnRoom.classList.toggle("active", mode === "room");
    btnInventory.classList.toggle("active", mode === "inventory");
    if (tableAllocate)
      tableAllocate.classList.toggle("hidden", mode === "inventory");
    if (tableInventory)
      tableInventory.classList.toggle("hidden", mode === "room");
    if (inventoryExcel)
      inventoryExcel.classList.toggle("hidden", mode === "room");
    if (invMetricToggle)
      invMetricToggle.classList.toggle("hidden", mode === "room");
    if (rangeRow)
      rangeRow.classList.toggle("hidden", mode === "inventory");
    if (allocActions)
      allocActions.classList.toggle("hidden", mode === "inventory");
    // 0527: 庫存表 mode 隱藏 inline calendar、顯示 月曆 button；空房查詢相反
    if (invCalendarLeft)
      invCalendarLeft.classList.toggle("hidden", mode === "inventory");
    if (invCalendarBtn)
      invCalendarBtn.classList.toggle("hidden", mode === "room");
    if (mode === "inventory") {
      selStart = prevSelStart ? prevSelStart.startOf("day") : today();
      currentMonth = selStart.startOf("month");
      selEnd = calcSelEnd(selStart);
    } else {
      selStart = null;
      selEnd = null;
    }
    buildGrid();
    updateCount();
  }

  intervalSelect.addEventListener("change", function () {
    if (mode === "inventory" && selStart) {
      selEnd = calcSelEnd(selStart);
      ensureSelEndVisible();
      applyStyles();
      updateCount();
    }
  });

  root
    .querySelector("#todayBtn")
    .addEventListener("click", function () {
      currentMonth = dayjs();
      selStart = today();
      selEnd = mode === "inventory" ? calcSelEnd(selStart) : selStart;
      buildGrid();
      updateCount();
    });
  root
    .querySelector("#prevBtn")
    .addEventListener("click", function () {
      currentMonth = currentMonth.subtract(1, "month");
      buildGrid();
    });
  root
    .querySelector("#nextBtn")
    .addEventListener("click", function () {
      currentMonth = currentMonth.add(1, "month");
      buildGrid();
    });

  btnRoom.addEventListener("click", function () {
    if (mode !== "room") setMode("room");
  });
  btnInventory.addEventListener("click", function () {
    if (mode !== "inventory") setMode("inventory");
  });

  window.setCalendarMode = setMode;
  buildGrid();

  // 0527: 月曆 button (庫存表 only) -> 開 offcanvas，teleport rb-cal-wrap 進去
  // Stage 1d：本頁為獨立 document，offcanvas 只有單一 instance
  // （partials/room-booking-modals.html 的 invCalendarOffcanvas），
  // 不需要 landing 舊有的 orderEdit_ 副本分流
  var offcanvas = document.getElementById("invCalendarOffcanvas");
  var offcanvasBody =
    offcanvas && offcanvas.querySelector(".inv-offcanvas-body");
  var offcanvasClose = offcanvas && offcanvas.querySelector(
    "[data-inv-calendar-close]",
  );
  var calWrap = invCalendarLeft; // already grabbed above
  var calWrapHomeParent = calWrap && calWrap.parentNode;
  var calWrapHomeNext = calWrap && calWrap.nextSibling;

  function openInvCalendarOffcanvas() {
    if (!offcanvas || !offcanvasBody || !calWrap) return;
    // 把 rb-cal-wrap 移進 offcanvas body；移出時去 hidden 顯示
    calWrap.classList.remove("hidden");
    offcanvasBody.appendChild(calWrap);
    offcanvas.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
  function closeInvCalendarOffcanvas() {
    if (!offcanvas || !calWrap || !calWrapHomeParent) return;
    // 移回原本父層的原本位置
    if (calWrapHomeNext && calWrapHomeNext.parentNode === calWrapHomeParent) {
      calWrapHomeParent.insertBefore(calWrap, calWrapHomeNext);
    } else {
      calWrapHomeParent.appendChild(calWrap);
    }
    // 回到 invCalendarLeft 原位後，依目前 mode 套 hidden 規則
    if (mode === "inventory") calWrap.classList.add("hidden");
    offcanvas.classList.add("hidden");
    // 疊層感知：修改 modal 還開著時 body scroll 維持鎖定
    document.body.style.overflow = document.querySelector(
      ".modal-backdrop.open",
    )
      ? "hidden"
      : "";
  }

  if (invCalendarBtn) {
    invCalendarBtn.addEventListener("click", openInvCalendarOffcanvas);
  }
  if (offcanvasClose) {
    offcanvasClose.addEventListener("click", closeInvCalendarOffcanvas);
  }
  // Calendar 內任一日期 click -> 自動關閉 offcanvas（0527 規則）
  if (grid) {
    grid.addEventListener("click", function (e) {
      if (offcanvas && offcanvas.classList.contains("hidden")) return;
      var dayEl = e.target.closest(".day");
      if (!dayEl || dayEl.classList.contains("disabled")) return;
      closeInvCalendarOffcanvas();
    });
  }
}
