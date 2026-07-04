// 到店方式 modal 行為 module（Stage 2，specs/page-architecture.md）
// 內容自 landing.html arrival IIFE 全量搬出（13 個 event bindings 全搬，
// 無略過項 - 依 start.md「JS 搬移/略搬 audit」規則）：chip 切換、開啟時
// label->chip 同步、確定 commit + 關閉、車輛 stepper、接送雙 swiper 卡片
// （新增/刪除/箭頭/dots）、生效日 simple calendar。
// 依賴：Swiper CDN（swiper-bundle）+ dayjs；modalApi 由 initOrderModals() 回傳
// （closeModal 的單一來源，避免重複實作關閉邏輯）。
// landing 已於 Stage 3 清為 dashboard；此 module 僅由 room-booking.html 載入。
// 注意：order-processing.html 不載入本 module（使用者同意該頁到店 modal
// 維持靜態 + 開關；其確定關閉由 order-modals.js delegated handler 提供）。
// -- Arrival method modal: chip switch + stepper + commit --
// 注意：trigger button (#arrivalMethodTrigger) 位於 runtime 注入的內容
// （sections partial / 訂單修改 modal body），所以 trigger / triggerLabel
// 用 document 委派查找，不能在 init 時直接 getElementById。
export function initArrivalMethodModal(modalApi) {
  var modal = document.getElementById("modalArrivalMethodBackdrop");
  if (!modal) return;
  var box = modal.querySelector(".am-modal-box");
  var chipRow = modal.querySelector(".am-chip-row");
  if (!chipRow) return;

  // Map: chip data-key <-> display text. Single source of truth.
  var chipText = {
    general: "自行到店",
    "self-drive": "自駕",
    charter: "包車或專車",
    transfer: "接送",
  };
  var textToKey = Object.keys(chipText).reduce(function (m, k) {
    m[chipText[k]] = k;
    return m;
  }, {});

  function setActiveChip(method) {
    chipRow.querySelectorAll(".rb-pay-chip").forEach(function (c) {
      c.classList.toggle(
        "rb-pay-active",
        c.dataset.amChip === method,
      );
    });
    modal.querySelectorAll(".am-panel").forEach(function (p) {
      p.classList.toggle("hidden", p.dataset.amPanel !== method);
    });
    if (box) box.dataset.amState = method;
  }

  // Sync modal state FROM trigger when opening (so cancel can discard staging)
  document.addEventListener("click", function (e) {
    if (!e.target.closest("#arrivalMethodTrigger")) return;
    var label = document.getElementById("arrivalMethodTriggerLabel");
    var text = label ? label.textContent.trim() : "";
    setActiveChip(textToKey[text] || "general");
  });

  // Chip click -> switch staging state (not committed until 確定)
  chipRow.addEventListener("click", function (e) {
    var btn = e.target.closest(".rb-pay-chip[data-am-chip]");
    if (!btn) return;
    setActiveChip(btn.dataset.amChip);
  });

  // 確定 -> commit staging to trigger + close
  // 只切換文字，icon 維持 road.svg（per user 2026-05-08 確認）
  var confirmBtn = modal.querySelector('[data-am-action="confirm"]');
  if (confirmBtn) {
    confirmBtn.addEventListener("click", function () {
      var active = chipRow.querySelector(".rb-pay-chip.rb-pay-active");
      var label = document.getElementById("arrivalMethodTriggerLabel");
      if (active && label) {
        label.textContent = chipText[active.dataset.amChip];
      }
      modalApi.closeModal("modalArrivalMethodBackdrop");
    });
  }

  // Vehicle stepper: split-half click - upper +1 / lower -1, min 0 (no max).
  // JS 邏輯由後端後續實作（min/max/disabled state）。
  // 注意：delegated 在 modal 上，所以 transfer panel 內 card 的 stepper
  // 也共用此 handler；只判斷 .am-stepper-icon -> .am-stepper 結構即可。
  modal.addEventListener("click", function (e) {
    var icon = e.target.closest(".am-stepper-icon");
    if (!icon) return;
    var stepper = icon.closest(".am-stepper");
    if (!stepper) return;
    var valueEl = stepper.querySelector(".am-stepper-value");
    if (!valueEl) return;
    var rect = icon.getBoundingClientRect();
    var direction =
      e.clientY < rect.top + rect.height / 2 ? 1 : -1;
    var current = parseInt(valueEl.textContent, 10) || 0;
    var next = Math.max(0, current + direction);
    valueEl.textContent = String(next);
  });

  // -- Phase C: 接送 雙 swiper card stack ------------------------
  // Spec: components/arrival-method-modal.md L145-244
  var swiperInstances = {}; // { pickup: Swiper, dropoff: Swiper }
  var indexLabels = { pickup: "接待單", dropoff: "送客單" };

  function getCardTemplate() {
    return modal.querySelector("[data-am-transfer-card-template]");
  }
  function getCol(kind) {
    return modal.querySelector(
      '[data-am-transfer-col="' + kind + '"]',
    );
  }
  function getWrapper(kind) {
    return modal.querySelector(
      '[data-am-swiper="' + kind + '"] .swiper-wrapper',
    );
  }
  function refreshCol(kind) {
    var col = getCol(kind);
    if (!col) return;
    var wrap = getWrapper(kind);
    var cards = wrap.querySelectorAll(".am-transfer-card");
    var swiper = swiperInstances[kind];
    var activeIdx = swiper ? swiper.activeIndex : 0;
    // Clamp index after delete
    if (activeIdx >= cards.length) activeIdx = cards.length - 1;
    if (activeIdx < 0) activeIdx = 0;
    // Index label
    var idxEl = col.querySelector(
      '[data-am-transfer-index="' + kind + '"]',
    );
    if (idxEl) {
      idxEl.textContent =
        indexLabels[kind] + " " + (cards.length ? activeIdx + 1 : 0);
    }
    // Dots
    var dotsEl = col.querySelector(
      '[data-am-transfer-dots="' + kind + '"]',
    );
    if (dotsEl) {
      dotsEl.innerHTML = "";
      cards.forEach(function (_, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className =
          "am-transfer-dot" + (i === activeIdx ? " is-active" : "");
        b.setAttribute("aria-label", "第 " + (i + 1) + " 筆");
        b.addEventListener("click", function () {
          if (swiperInstances[kind]) swiperInstances[kind].slideTo(i);
        });
        dotsEl.appendChild(b);
      });
    }
    // Delete button enabled iff 2+ cards
    cards.forEach(function (card) {
      var del = card.querySelector("[data-am-transfer-delete]");
      if (del) del.disabled = cards.length <= 1;
    });
    // Arrow disabled state：首頁時 prev disabled、末頁時 next disabled
    var prevBtn = col.querySelector(
      '[data-am-transfer-prev="' + kind + '"]',
    );
    var nextBtn = col.querySelector(
      '[data-am-transfer-next="' + kind + '"]',
    );
    if (prevBtn) prevBtn.disabled = activeIdx <= 0;
    if (nextBtn) nextBtn.disabled = activeIdx >= cards.length - 1;
  }

  // Default-variant simple calendar init for 生效日 cell
  // (本 modal 特規：無 trailing icon)；過去 disabled、今日 / 未來可選。
  // 結構與行為對齊 components/calendar-simple.md，互斥透過全域
  // window.activeSimpleCalendar，dayjs 為全域 CDN 提供。
  function initEffectiveDateCell(cell) {
    if (cell.dataset.calInit) return;
    cell.dataset.calInit = "1";
    var btn = cell.querySelector(".rb-cal-btn");
    var displayEl = cell.querySelector(".rb-cal-date");
    if (!btn || !displayEl) return;
    if (typeof window.activeSimpleCalendar === "undefined") {
      window.activeSimpleCalendar = null;
      document.addEventListener("click", function () {
        if (window.activeSimpleCalendar) {
          window.activeSimpleCalendar.classList.remove("active");
          window.activeSimpleCalendar = null;
        }
      });
    }
    var dropdown = document.createElement("div");
    dropdown.className = "calendar-dropdown am-card-date-dropdown p-4";
    dropdown.innerHTML =
      '<div class="flex justify-between items-center mb-4">' +
      '<button type="button" class="prev-month p-1 hover:bg-surface-hover rounded text-text-secondary">&lt;</button>' +
      '<span class="month-label font-bold text-text-emphasis text-sm"></span>' +
      '<button type="button" class="next-month p-1 hover:bg-surface-hover rounded text-text-secondary">&gt;</button>' +
      "</div>" +
      '<div class="grid grid-cols-7 gap-1 text-center text-xs font-bold text-text-secondary mb-2">' +
      '<div class="title-highlight py-1">日</div>' +
      '<div class="py-1">一</div><div class="py-1">二</div><div class="py-1">三</div>' +
      '<div class="py-1">四</div><div class="py-1">五</div>' +
      '<div class="title-highlight py-1">六</div>' +
      "</div>" +
      '<div class="days-grid grid grid-cols-7 gap-1"></div>';
    // Append to body - swiper-wrapper uses transform which breaks
    // position:fixed for descendants; portaling out fixes that.
    // Bump z above modal (modal=60, popover=30 預設低於 modal)
    dropdown.style.zIndex = "100";
    document.body.appendChild(dropdown);
    dropdown.addEventListener("click", function (e) {
      e.stopPropagation();
    });
    var daysGrid = dropdown.querySelector(".days-grid");
    var monthLabel = dropdown.querySelector(".month-label");
    // Default 今日
    displayEl.textContent = dayjs().format("YYYY-MM-DD");
    var viewingDate = dayjs(displayEl.textContent.trim());
    function render() {
      daysGrid.innerHTML = "";
      monthLabel.textContent = viewingDate.format("YYYY年 MM月");
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
        if (current.isBefore(today)) {
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
      var left = r.left;
      if (left + dw + gutter > vw) left = vw - dw - gutter;
      if (left < gutter) left = gutter;
      var top = r.bottom + gutter;
      if (top + dh + gutter > vh) {
        var above = r.top - dh - gutter;
        top = above > gutter ? above : Math.max(gutter, vh - dh - gutter);
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
      window.activeSimpleCalendar = dropdown.classList.contains("active")
        ? dropdown
        : null;
      if (window.activeSimpleCalendar) {
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
    render();
  }
  function appendCard(kind) {
    var tpl = getCardTemplate();
    var wrap = getWrapper(kind);
    if (!tpl || !wrap) return;
    var clone = tpl.content.firstElementChild.cloneNode(true);
    wrap.appendChild(clone);
    var calCell = clone.querySelector(
      '[data-am-card-field="effective-date"]',
    );
    if (calCell) initEffectiveDateCell(calCell);
    if (swiperInstances[kind]) {
      swiperInstances[kind].update();
      swiperInstances[kind].slideTo(
        wrap.querySelectorAll(".am-transfer-card").length - 1,
        300,
      );
    }
    refreshCol(kind);
  }

  function deleteCard(kind, slideEl) {
    var wrap = getWrapper(kind);
    if (!wrap) return;
    var cards = Array.prototype.slice.call(
      wrap.querySelectorAll(".am-transfer-card"),
    );
    if (cards.length <= 1) return; // safety
    var idx = cards.indexOf(slideEl);
    if (idx < 0) return;
    // UX (使用者 2026-05-08 確認)：刪當前卡 -> 留在原 idx，自動指向下一張；
    // 若是最後一張被刪，swiper 會自動 clamp 到前一張。removeSlide 處理此邏輯。
    var sw = swiperInstances[kind];
    if (sw && typeof sw.removeSlide === "function") {
      sw.removeSlide(idx);
    } else {
      slideEl.remove();
      if (sw) sw.update();
    }
    refreshCol(kind);
  }

  function initSwiper(kind) {
    var el = modal.querySelector(
      '[data-am-swiper="' + kind + '"]',
    );
    if (!el || swiperInstances[kind] || typeof Swiper === "undefined") {
      return;
    }
    swiperInstances[kind] = new Swiper(el, {
      effect: "cards",
      grabCursor: true,
      cardsEffect: {
        perSlideOffset: 8,
        perSlideRotate: 0,
        slideShadows: false,
      },
      on: {
        slideChange: function () { refreshCol(kind); },
      },
    });
  }

  function ensureTransferInit() {
    ["pickup", "dropoff"].forEach(function (kind) {
      var wrap = getWrapper(kind);
      if (!wrap) return;
      if (!wrap.querySelector(".am-transfer-card")) {
        appendCard(kind);
      }
      initSwiper(kind);
      refreshCol(kind);
    });
  }

  // Lazy init when transfer panel becomes visible
  chipRow.addEventListener("click", function (e) {
    var btn = e.target.closest(
      '.rb-pay-chip[data-am-chip="transfer"]',
    );
    if (btn) {
      // Defer to next tick so panel hidden->visible has applied
      setTimeout(ensureTransferInit, 0);
    }
  });

  // Add card
  modal.addEventListener("click", function (e) {
    var addBtn = e.target.closest("[data-am-transfer-add]");
    if (!addBtn) return;
    appendCard(addBtn.dataset.amTransferAdd);
  });
  // Delete card
  modal.addEventListener("click", function (e) {
    var delBtn = e.target.closest("[data-am-transfer-delete]");
    if (!delBtn || delBtn.disabled) return;
    var slide = delBtn.closest(".swiper-slide.am-transfer-card");
    var col = delBtn.closest("[data-am-transfer-col]");
    if (!slide || !col) return;
    deleteCard(col.dataset.amTransferCol, slide);
  });
  // Arrows (delegated)
  modal.addEventListener("click", function (e) {
    var prev = e.target.closest("[data-am-transfer-prev]");
    var next = e.target.closest("[data-am-transfer-next]");
    if (prev && swiperInstances[prev.dataset.amTransferPrev]) {
      swiperInstances[prev.dataset.amTransferPrev].slidePrev();
    }
    if (next && swiperInstances[next.dataset.amTransferNext]) {
      swiperInstances[next.dataset.amTransferNext].slideNext();
    }
  });
}
