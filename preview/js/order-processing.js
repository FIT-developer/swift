// 訂單處理頁 page module（Stage 1c，specs/page-architecture.md）
// 內容自 landing.html initSubPageBehaviors 逐塊搬出，root-scoped 原樣保留。
// 共用行為（accordion/simple calendar/nation-group）為計畫內的過渡性複製，
// landing 保留 inline 版，Stage 3 收斂去重。
// modal 開啟接線（訂單/修改/簡訊）屬 Stage 1d，本檔的選單項目點擊僅收合選單。
export function initOrderProcessing(root) {
  // == Accordion toggles（更多條件收合） ==
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

  // == op 快篩 button 單選 ==
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

  // == op 訂單編號 pill 下拉選單（開/關/定位；modal 接線在 1d） ==
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

  // == op 狀態 tabs 單選 ==
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

  // == op tooltip（click 開/外部關 + 視窗夾取） ==
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

  // == op 專案 toggle 標籤文字 ==
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

  // == simple calendar（rb-cal-cell 日期格 popup） ==
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

  // == nation-group 國籍連動 ==
  // 訂房資料 國籍 radio -> toggle 地址結構 (taiwan vs foreign) + 國家 select
  (function () {
    root.querySelectorAll(".nation-group").forEach(function (group) {
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
}
