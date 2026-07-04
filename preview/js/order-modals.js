// 訂單處理頁 modal module（Stage 1d，specs/page-architecture.md）
// 內容自 landing.html modal 系統 IIFE 搬出：open/close 核心（動態 z-index 疊層）、
// 訂單明細 / 簡訊 / 訂單修改接線、加購渲染系統、會員資料 / 合約公司 / 訂房明細編輯。
// 到店方式 modal 維持靜態 + 開關（與 landing 時期 orderEdit_ 副本等價保真；
// chip 切換 / swiper 行為屬房間預定頁情境，Stage 2 再模組化）。
// landing 保留 inline 版 - 過渡性複製（計畫內），Stage 3 收斂去重。
import { initRoomBookingBehaviors } from "./room-booking-behaviors.js";

export function initOrderModals() {
  var modalReturnFocusTargets = {};
  function rememberModalReturnFocus(id, target) {
    var fallback = document.activeElement;
    var focusTarget =
      target && typeof target.focus === "function" ? target : fallback;
    if (
      focusTarget &&
      focusTarget !== document.body &&
      typeof focusTarget.focus === "function"
    ) {
      modalReturnFocusTargets[id] = focusTarget;
    }
  }
  function restoreModalReturnFocus(id) {
    var focusTarget = modalReturnFocusTargets[id];
    delete modalReturnFocusTargets[id];
    if (!focusTarget || !focusTarget.isConnected) return;
    if (focusTarget.disabled) return;
    try {
      focusTarget.focus({ preventScroll: true });
    } catch (err) {
      focusTarget.focus();
    }
  }
  function openModal(id, returnFocusTarget) {
    var el = document.getElementById(id);
    if (!el) return;
    rememberModalReturnFocus(id, returnFocusTarget);
    // 動態疊層：已有 N 個 modal 開著時，本層 z = 60 + N*5，
    // 任意深度（修改 -> 會員資料 -> 合約公司 = 60/65/70）都正確蓋疊
    var openBackdrops = document.querySelectorAll(
      ".modal-backdrop.open",
    ).length;
    el.style.zIndex = openBackdrops
      ? String(60 + openBackdrops * 5)
      : "";
    if (id === "modalRoomEditBackdrop") resetRoomEditModal();
    if (id === "modalPurchaseAddonBackdrop") resetPurchaseAddonModal();
    if (id === "modalOrderSummaryBackdrop") resetOrderSummaryModal();
    resetModalScroll(el);
    el.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeModal(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var wasOpen = el.classList.contains("open");
    el.classList.remove("open");
    el.style.zIndex = "";
    // 疊層感知：關第二層 modal 時，若下層還有開著的 modal，
    // body scroll 必須維持鎖定
    document.body.style.overflow = document.querySelector(
      ".modal-backdrop.open",
    )
      ? "hidden"
      : "";
    if (wasOpen) restoreModalReturnFocus(id);
  }
  function resetModalScroll(modal) {
    modal.scrollTop = 0;
    var box = modal.querySelector(".modal-box");
    if (box) box.scrollTop = 0;
    modal.querySelectorAll(".overflow-y-auto").forEach(function (scroller) {
      scroller.scrollTop = 0;
    });
  }
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
      var iconPath = locked
        ? "./assets/icons/lock.svg"
        : "./assets/icons/unlock.svg";
      icon.style.webkitMaskImage = "url('" + iconPath + "')";
      icon.style.maskImage = "url('" + iconPath + "')";
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
  function setOrderSummaryAccordion(toggle, expanded) {
    if (!toggle) return;
    var contentId = toggle.getAttribute("aria-controls");
    var content = contentId ? document.getElementById(contentId) : null;
    var icon = toggle.querySelector("[data-order-summary-accordion-icon]");
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    if (content) content.hidden = !expanded;
    if (icon) {
      icon.src = expanded
        ? "./assets/icons/down.svg"
        : "./assets/icons/up.svg";
    }
  }
  function resetOrderSummaryModal() {
    var modal = document.getElementById("modalOrderSummaryBackdrop");
    if (!modal) return;
    modal
      .querySelectorAll("[data-order-summary-accordion-toggle]")
      .forEach(function (toggle) {
        setOrderSummaryAccordion(toggle, true);
      });
  }
  function setOrderSummaryVariant(variant) {
    var modal = document.getElementById("modalOrderSummaryBackdrop");
    if (!modal) return;
    var variants = {
      unpaid: {
        pill: "未付款",
        copy: "此訂單尚未付款",
        pillClass: "bg-status-negative",
        basicStatus: "未付款",
        basicStatusClass: "text-status-negative",
      },
      paid: {
        pill: "已付款",
        copy: "此訂單已付款",
        pillClass: "bg-status-positive",
        basicStatus: "已付款",
        basicStatusClass: "text-status-positive",
      },
      waitlist: {
        pill: "候補單",
        copy: "此訂單尚為候補單",
        pillClass: "bg-brand-active",
        basicStatus: "未付款",
        basicStatusClass: "text-status-negative",
      },
    };
    var state = variants[variant] || variants.unpaid;
    if (!variants[variant]) return false;
    var pill = modal.querySelector("[data-order-summary-status-pill]");
    var copy = modal.querySelector("[data-order-summary-status-copy]");
    var basicStatus = modal.querySelector(
      "[data-order-summary-basic-status]",
    );
    modal.dataset.orderSummaryVariant = variant || "unpaid";
    if (pill) {
      pill.textContent = state.pill;
      pill.classList.remove(
        "bg-status-negative",
        "bg-status-positive",
        "bg-brand-active",
      );
      pill.classList.add(state.pillClass);
    }
    if (copy) copy.textContent = state.copy;
    if (basicStatus) {
      basicStatus.textContent = state.basicStatus;
      basicStatus.classList.remove(
        "text-status-negative",
        "text-status-positive",
      );
      basicStatus.classList.add(state.basicStatusClass);
    }
    return true;
  }
  function getOrderSummaryVariantFromOrderType() {
    var checked = document.querySelector(
      'input[name="rb-order-type"]:checked',
    );
    if (!checked) return "";
    if (checked.value === "none") return "unpaid";
    if (checked.value === "official") return "paid";
    if (checked.value === "substitute") return "waitlist";
    return "";
  }

  var purchaseAddonProducts = [
    {
      id: "breakfast",
      category: "dining",
      title: "早餐",
      subtitle: "套餐組合 a、b 、c",
      notice: "placeholder",
      date: null,
      hour: "1",
      minute: "0",
      timeEnabled: true,
      originalPrice: 1999,
      originalPriceMuted: true,
      inventory: 8,
      cost: 9988,
      defaultQuantity: 2,
    },
    {
      id: "breakfast-disabled-time",
      category: "dining",
      title: "早餐",
      subtitle: "套餐組合 a、b 、c",
      notice: "placeholder",
      date: null,
      hour: "1",
      minute: "0",
      timeEnabled: false,
      originalPrice: 1999,
      originalPriceMuted: true,
      inventory: 8,
      cost: 9988,
      defaultQuantity: 2,
    },
    {
      id: "baby-supplies",
      category: "tailetries",
      title: "嬰兒用品",
      subtitle: "餐具　安全椅",
      notice: "placeholder",
      date: null,
      hour: "1",
      minute: "0",
      timeEnabled: false,
      originalPrice: 1999,
      originalPriceMuted: false,
      inventory: 8,
      cost: 9988,
      defaultQuantity: 1,
    },
    {
      id: "theme-park-ticket",
      category: "tickets",
      title: "主題公園門票",
      subtitle: "全票一日券",
      notice: "placeholder",
      date: null,
      hour: "9",
      minute: "30",
      timeEnabled: true,
      originalPrice: 1500,
      originalPriceMuted: false,
      inventory: 20,
      cost: 1350,
      defaultQuantity: 0,
    },
    {
      id: "fresh-coffee",
      category: "coffee",
      title: "現磨咖啡",
      subtitle: "美式　拿鐵　卡布",
      notice: "placeholder",
      date: null,
      hour: "8",
      minute: "0",
      timeEnabled: true,
      originalPrice: 180,
      originalPriceMuted: false,
      inventory: 50,
      cost: 150,
      defaultQuantity: 0,
    },
    {
      id: "projector-rental",
      category: "tool",
      title: "投影機租借",
      subtitle: "全日　含布幕",
      notice: "placeholder",
      date: null,
      hour: "10",
      minute: "0",
      timeEnabled: false,
      originalPrice: 800,
      originalPriceMuted: false,
      inventory: 5,
      cost: 600,
      defaultQuantity: 0,
    },
    {
      id: "extra-bed",
      category: "bed",
      title: "加床",
      subtitle: "單人折疊床　含寢具",
      notice: "placeholder",
      date: null,
      hour: "15",
      minute: "0",
      timeEnabled: false,
      originalPrice: 1200,
      originalPriceMuted: false,
      inventory: 6,
      cost: 1000,
      defaultQuantity: 0,
    },
    {
      id: "early-bird",
      category: "promotion",
      title: "早鳥優惠",
      subtitle: "提前 30 天預訂九折",
      notice: "placeholder",
      date: null,
      hour: "0",
      minute: "0",
      timeEnabled: false,
      originalPrice: 0,
      originalPriceMuted: true,
      inventory: 99,
      cost: 0,
      defaultQuantity: 0,
    },
    {
      id: "indigo-dye",
      category: "wellness",
      title: "藍染體驗",
      subtitle: "手帕　束口袋",
      notice: "placeholder",
      date: null,
      hour: "14",
      minute: "0",
      timeEnabled: true,
      originalPrice: 980,
      originalPriceMuted: false,
      inventory: 10,
      cost: 880,
      defaultQuantity: 0,
    },
    {
      id: "pineapple-cake",
      category: "gift",
      title: "鳳梨酥禮盒",
      subtitle: "10 入　手工烘焙",
      notice: "placeholder",
      date: null,
      hour: "0",
      minute: "0",
      timeEnabled: false,
      originalPrice: 450,
      originalPriceMuted: false,
      inventory: 30,
      cost: 380,
      defaultQuantity: 0,
    },
    {
      id: "airport-shuttle",
      category: "flight",
      title: "機場接駁",
      subtitle: "桃園機場　單程",
      notice: "placeholder",
      date: null,
      hour: "7",
      minute: "0",
      timeEnabled: true,
      originalPrice: 1800,
      originalPriceMuted: false,
      inventory: 4,
      cost: 1500,
      defaultQuantity: 0,
    },
    {
      id: "meeting-room",
      category: "service",
      title: "會議室租借",
      subtitle: "可容 20 人　投影設備",
      notice: "placeholder",
      date: null,
      hour: "10",
      minute: "0",
      timeEnabled: true,
      originalPrice: 3500,
      originalPriceMuted: false,
      inventory: 3,
      cost: 3000,
      defaultQuantity: 0,
    },
  ];
  var purchaseAddonCategoryLabels = {
    all: "所有",
    dining: "餐飲",
    tickets: "票券",
    coffee: "飲品",
    tool: "設備租借",
    bed: "加床",
    promotion: "優惠促銷",
    wellness: "藍染",
    gift: "伴手禮",
    flight: "住宿",
    tailetries: "盥洗用品",
    service: "會議服務",
  };
  var purchaseAddonState = {
    category: "all",
    editor: {},
    cart: [],
    nextLineId: 0,
  };
  function getPurchaseEditorDefaults(item) {
    return {
      notice: item.notice,
      date: item.date || dayjs().format("YYYY-MM-DD"),
      hour: item.hour,
      minute: item.minute,
      timeEnabled: item.timeEnabled,
      cost: item.cost,
    };
  }
  function getEditorState(item) {
    if (!purchaseAddonState.editor[item.id]) {
      purchaseAddonState.editor[item.id] = getPurchaseEditorDefaults(item);
    }
    return purchaseAddonState.editor[item.id];
  }
  function findCartLine(productId, date) {
    for (var i = 0; i < purchaseAddonState.cart.length; i += 1) {
      var line = purchaseAddonState.cart[i];
      if (line.productId === productId && line.date === date) return line;
    }
    return null;
  }
  function snapshotEditorToCartLine(item) {
    var editor = getEditorState(item);
    purchaseAddonState.nextLineId += 1;
    return {
      lineId: "line-" + purchaseAddonState.nextLineId,
      productId: item.id,
      title: item.title,
      subtitle: item.subtitle,
      date: editor.date,
      hour: editor.hour,
      minute: editor.minute,
      timeEnabled: editor.timeEnabled,
      cost: editor.cost,
      notice: editor.notice,
      quantity: 0,
    };
  }
  function incrementCartFromEditor(item) {
    var editor = getEditorState(item);
    var line = findCartLine(item.id, editor.date);
    if (!line) {
      line = snapshotEditorToCartLine(item);
      purchaseAddonState.cart.push(line);
    }
    line.quantity += 1;
  }
  function decrementCartFromEditor(item) {
    var editor = getEditorState(item);
    var idx = -1;
    for (var i = 0; i < purchaseAddonState.cart.length; i += 1) {
      var line = purchaseAddonState.cart[i];
      if (line.productId === item.id && line.date === editor.date) {
        idx = i;
        break;
      }
    }
    if (idx < 0) return;
    purchaseAddonState.cart[idx].quantity -= 1;
    if (purchaseAddonState.cart[idx].quantity <= 0) {
      purchaseAddonState.cart.splice(idx, 1);
    }
  }
  function removeCartLineById(lineId) {
    for (var i = 0; i < purchaseAddonState.cart.length; i += 1) {
      if (purchaseAddonState.cart[i].lineId === lineId) {
        purchaseAddonState.cart.splice(i, 1);
        return;
      }
    }
  }
  function getEditorQuantity(item) {
    var editor = getEditorState(item);
    var line = findCartLine(item.id, editor.date);
    return line ? line.quantity : 0;
  }
  function resetPurchaseAddonItems() {
    purchaseAddonState.editor = {};
    purchaseAddonState.cart = [];
    purchaseAddonState.nextLineId = 0;
    purchaseAddonProducts.forEach(function (item) {
      getEditorState(item);
      if (item.defaultQuantity > 0) {
        var line = snapshotEditorToCartLine(item);
        line.quantity = item.defaultQuantity;
        purchaseAddonState.cart.push(line);
      }
    });
  }
  function formatPurchaseAmount(value) {
    return "$ " + value.toLocaleString("en-US");
  }
  function formatPurchaseTimePart(value) {
    return String(value).padStart(2, "0");
  }
  function renderPurchaseNumberOptions(start, end, selected) {
    var selectedValue = formatPurchaseTimePart(selected);
    var options = [];
    for (var i = start; i <= end; i += 1) {
      var value = formatPurchaseTimePart(i);
      options.push(
        '<option value="' +
          value +
          '"' +
          (value === selectedValue ? " selected" : "") +
          ">" +
          value +
          "</option>",
      );
    }
    return options.join("");
  }
  function initPurchaseAddonCalendars(root) {
    if (typeof window.activeSimpleCalendar === "undefined") {
      window.activeSimpleCalendar = null;
      document.addEventListener("click", function () {
        if (window.activeSimpleCalendar) {
          window.activeSimpleCalendar.classList.remove("active");
          window.activeSimpleCalendar = null;
        }
      });
    }
    root.querySelectorAll("[data-purchase-calendar-cell]").forEach(function (cell) {
      if (cell.dataset.calInit) return;
      cell.dataset.calInit = "1";
      var btn = cell.querySelector(".rb-cal-btn");
      var displayEl = cell.querySelector(".rb-cal-date");
      if (!btn || !displayEl) return;
      var dropdown = document.createElement("div");
      dropdown.className = "calendar-dropdown p-4";
      dropdown.innerHTML =
        '<div class="mb-4 flex items-center justify-between">' +
        '<button type="button" class="prev-month rounded p-1 text-text-secondary hover:bg-surface-hover">&lt;</button>' +
        '<span class="month-label text-sm font-bold text-text-emphasis"></span>' +
        '<button type="button" class="next-month rounded p-1 text-text-secondary hover:bg-surface-hover">&gt;</button>' +
        "</div>" +
        '<div class="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-bold text-text-secondary">' +
        '<div class="title-highlight py-1">日</div><div class="py-1">一</div><div class="py-1">二</div><div class="py-1">三</div><div class="py-1">四</div><div class="py-1">五</div><div class="title-highlight py-1">六</div>' +
        "</div>" +
        '<div class="days-grid grid grid-cols-7 gap-1"></div>';
      /* portal 到 document.body，避免被祖先 overflow:hidden 裁切 */
      document.body.appendChild(dropdown);
      dropdown.addEventListener("click", function (e) {
        e.stopPropagation();
      });
      var daysGrid = dropdown.querySelector(".days-grid");
      var monthLabel = dropdown.querySelector(".month-label");
      var viewingDate = dayjs(displayEl.textContent.trim());
      function render() {
        daysGrid.innerHTML = "";
        monthLabel.textContent = viewingDate.format("YYYY年 MM月");
        var today = dayjs().startOf("day");
        var selectedStr = displayEl.textContent.trim();
        var startDay = viewingDate.startOf("month").day();
        var daysInMonth = viewingDate.daysInMonth();
        for (var i = 0; i < startDay; i += 1) {
          daysGrid.appendChild(document.createElement("div"));
        }
        for (var d = 1; d <= daysInMonth; d += 1) {
          var current = viewingDate.date(d);
          var dateStr = current.format("YYYY-MM-DD");
          var dayBtn = document.createElement("button");
          dayBtn.type = "button";
          dayBtn.textContent = d;
          dayBtn.className =
            "calendar-day flex h-8 w-8 items-center justify-center rounded-full text-xs transition-all";
          if (dateStr === today.format("YYYY-MM-DD")) {
            dayBtn.classList.add("today");
          }
          if (current.isBefore(today)) {
            dayBtn.disabled = true;
          } else {
            (function (ds) {
              dayBtn.addEventListener("click", function (ev) {
                ev.stopPropagation();
                displayEl.textContent = ds;
                var product = purchaseAddonProducts.find(function (item) {
                  return item.id === cell.dataset.purchaseItem;
                });
                if (product) getEditorState(product).date = ds;
                dropdown.classList.remove("active");
                window.activeSimpleCalendar = null;
                renderPurchaseAddon();
              });
            })(dateStr);
            if (dateStr === selectedStr) dayBtn.classList.add("selected");
          }
          daysGrid.appendChild(dayBtn);
        }
      }
      function positionDropdown() {
        var r = btn.getBoundingClientRect();
        var gutter = 8;
        var dw = dropdown.offsetWidth || 280;
        var dh = dropdown.offsetHeight || 340;
        var left = Math.min(Math.max(r.left, gutter), window.innerWidth - dw - gutter);
        var top = r.bottom + gutter;
        if (top + dh + gutter > window.innerHeight) {
          top = Math.max(gutter, r.top - dh - gutter);
        }
        // viewport 絕對座標（dropdown 已 portal 到 body, position: fixed）
        dropdown.style.left = left + "px";
        dropdown.style.top = top + "px";
      }
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (
          window.activeSimpleCalendar &&
          window.activeSimpleCalendar !== dropdown
        ) {
          window.activeSimpleCalendar.classList.remove("active");
        }
        var cur = displayEl.textContent.trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(cur)) viewingDate = dayjs(cur);
        dropdown.classList.toggle("active");
        window.activeSimpleCalendar = dropdown.classList.contains("active")
          ? dropdown
          : null;
        if (window.activeSimpleCalendar) {
          positionDropdown();
          render();
        }
      });
      dropdown.querySelector(".prev-month").addEventListener("click", function (e) {
        e.stopPropagation();
        viewingDate = viewingDate.subtract(1, "month");
        render();
      });
      dropdown.querySelector(".next-month").addEventListener("click", function (e) {
        e.stopPropagation();
        viewingDate = viewingDate.add(1, "month");
        render();
      });
      // dropdown portal 到 body 後不再自動跟隨 cell；
      // scroll/resize 時重算座標讓 dropdown 持續貼著 trigger button
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
    });
  }
  function getPurchaseItemsForCategory(category) {
    return category === "all"
      ? purchaseAddonProducts
      : purchaseAddonProducts.filter(function (item) {
          return item.category === category;
        });
  }
  function renderPurchaseAddonProducts() {
    var modal = document.getElementById("modalPurchaseAddonBackdrop");
    if (!modal) return;
    var list = modal.querySelector("[data-purchase-products]");
    if (!list) return;
    var items = getPurchaseItemsForCategory(purchaseAddonState.category);
    if (!items.length) {
      list.innerHTML =
        '<p class="rounded-lg border border-border-default bg-white p-4 text-base text-text-supporting">尚無加購項目</p>';
      return;
    }
    list.innerHTML = items
      .map(function (item) {
        var itemState = getEditorState(item);
        var quantity = getEditorQuantity(item);
        var disabled = !itemState.timeEnabled;
        var selectClass = disabled
          ? "bg-border-disabled text-text-secondary"
          : "bg-white text-text-default";
        var originalPriceClass = item.originalPriceMuted
          ? "text-text-placeholder line-through"
          : "font-semibold text-text-default";
        return (
          '<article class="rounded-lg border border-border-default bg-white p-4">' +
          '<div class="purchase-addon-product-grid">' +
          '<div class="space-y-9">' +
          "<div>" +
          '<div class="text-base text-text-default">' +
          item.title +
          "</div>" +
          '<div class="mt-1 text-xs text-text-default">' +
          item.subtitle +
          "</div>" +
          "</div>" +
          "<div>" +
          '<label class="block text-base text-text-default" for="purchase-note-' +
          item.id +
          '">備註</label>' +
          '<textarea id="purchase-note-' +
          item.id +
          '" class="mt-1 block min-h-[34px] w-full resize-y rounded-md border border-border-disabled bg-white px-3 py-1.5 text-xs text-text-default outline-none focus:border-menu" data-purchase-field="notice" data-purchase-item="' +
          item.id +
          '">' +
          itemState.notice +
          "</textarea>" +
          "</div>" +
          "</div>" +
          '<div class="space-y-4">' +
          "<div>" +
          '<div class="text-base text-text-default">日期</div>' +
          '<div class="rb-cal-cell mt-1 min-w-0" data-purchase-calendar-cell data-purchase-item="' +
          item.id +
          '">' +
          '<button type="button" class="rb-cal-btn flex h-9 w-full cursor-pointer items-center gap-1.5 rounded-md border border-border-disabled bg-white px-3 py-1.5 text-base text-text-default">' +
          '<span class="rb-cal-date purchase-addon-date-text flex-1 text-left">' +
          itemState.date +
          "</span>" +
          '<img src="./assets/icons/calendar.svg" alt="" class="h-6 w-6" />' +
          "</button>" +
          "</div>" +
          "</div>" +
          "<div>" +
          '<div class="mb-1 flex items-center justify-between">' +
          '<span class="text-base text-text-default">時 / 分</span>' +
          '<button type="button" class="purchase-addon-time-toggle relative h-5 w-8 rounded-full bg-border-disabled" data-purchase-time-toggle="' +
          item.id +
          '" aria-pressed="' +
          (itemState.timeEnabled ? "true" : "false") +
          '" aria-label="切換時分欄位狀態">' +
          '<span class="toggle-knob absolute left-0 top-[3px] h-3.5 w-3.5 rounded-full border bg-white transition-transform"></span>' +
          "</button>" +
          "</div>" +
          '<div class="flex gap-3">' +
          '<select class="h-9 w-16 rounded-md border border-border-disabled px-3 py-1.5 text-base outline-none ' +
          selectClass +
          '" data-purchase-field="hour" data-purchase-item="' +
          item.id +
          '"' +
          (disabled ? " disabled" : "") +
          ">" +
          renderPurchaseNumberOptions(0, 23, itemState.hour) +
          "</select>" +
          '<select class="h-9 w-16 rounded-md border border-border-disabled px-3 py-1.5 text-base outline-none ' +
          selectClass +
          '" data-purchase-field="minute" data-purchase-item="' +
          item.id +
          '"' +
          (disabled ? " disabled" : "") +
          ">" +
          renderPurchaseNumberOptions(0, 59, itemState.minute) +
          "</select>" +
          "</div>" +
          "</div>" +
          "</div>" +
          '<div class="flex h-[140px] flex-col justify-between">' +
          "<div>" +
          '<div class="mb-1 flex items-center gap-3">' +
          '<span class="text-base ' +
          originalPriceClass +
          '">' +
          formatPurchaseAmount(item.originalPrice) +
          "</span>" +
          '<span class="text-xs text-text-default">庫存：' +
          item.inventory +
          "</span>" +
          "</div>" +
          '<label class="flex h-9 w-full items-center rounded-md border border-border-disabled bg-white py-1.5 pl-1 pr-3">' +
          '<img src="./assets/icons/dollar.svg" alt="" class="h-6 w-6" />' +
          '<input type="number" min="0" class="min-w-0 flex-1 bg-transparent text-base text-text-default outline-none" value="' +
          itemState.cost +
          '" data-purchase-field="cost" data-purchase-item="' +
          item.id +
          '" aria-label="' +
          item.title +
          '費用" />' +
          "</label>" +
          "</div>" +
          "<div>" +
          '<div class="flex h-9 items-center rounded-md bg-tab-yellow px-3 py-1">' +
          '<button type="button" class="flex h-6 w-6 items-center justify-center ' +
          (quantity <= 0 ? "opacity-40" : "") +
          '" data-purchase-step="minus" data-purchase-item="' +
          item.id +
          '" aria-label="減少' +
          item.title +
          '">' +
          '<img src="./assets/icons/outline-minus.svg" alt="" class="h-6 w-6" />' +
          "</button>" +
          '<span class="mx-auto inline-flex h-7 md:min-w-[33px] items-center justify-center rounded-md bg-tab-yellow px-3 py-1.5 text-xs text-text-default" data-purchase-quantity="' +
          item.id +
          '">' +
          quantity +
          "</span>" +
          '<button type="button" class="flex h-6 w-6 items-center justify-center" data-purchase-step="plus" data-purchase-item="' +
          item.id +
          '" aria-label="增加' +
          item.title +
          '">' +
          '<img src="./assets/icons/outline-plus.svg" alt="" class="h-6 w-6" />' +
          "</button>" +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");
    initPurchaseAddonCalendars(modal);
  }
  function purchaseAddonCartCardHtml(line) {
    var quantity = line.quantity;
    var lineAmount = Number(line.cost || 0) * quantity;
    var timeChip = line.timeEnabled
      ? '<span class="inline-flex h-6 items-center rounded-[40px] bg-accent-cart-time px-2 py-1 text-xs text-text-emphasis">' +
        formatPurchaseTimePart(line.hour) +
        "：" +
        formatPurchaseTimePart(line.minute) +
        "</span>"
      : "";
    return (
      '<article class="rounded-lg border border-border-default bg-white p-4">' +
      '<div class="flex items-start justify-between gap-2">' +
      '<div class="flex min-w-0 items-baseline gap-2">' +
      '<span class="text-base text-text-default whitespace-nowrap">' +
      line.title +
      "</span>" +
      '<span class="text-xs text-text-default whitespace-nowrap">$ ' +
      Number(line.cost || 0).toLocaleString("en-US") +
      "</span>" +
      '<span class="text-xs text-text-default whitespace-nowrap">' +
      quantity +
      " 份</span>" +
      "</div>" +
      '<button type="button" class="flex h-6 w-6 shrink-0 items-center justify-center" data-purchase-remove="' +
      line.lineId +
      '" aria-label="刪除' +
      line.title +
      '">' +
      '<img src="./assets/icons/trash-can.svg" alt="" class="h-6 w-6" />' +
      "</button>" +
      "</div>" +
      '<div class="mt-3 flex items-center gap-2">' +
      '<span class="inline-flex h-6 items-center rounded-[40px] bg-accent-cart-date px-2 py-1 text-xs text-text-emphasis">' +
      line.date +
      "</span>" +
      timeChip +
      '<span class="ml-auto text-base text-text-default whitespace-nowrap">' +
      formatPurchaseAmount(lineAmount) +
      "</span>" +
      "</div>" +
      "</article>"
    );
  }
  function renderPurchaseAddonCart() {
    var modal = document.getElementById("modalPurchaseAddonBackdrop");
    if (!modal) return;
    var cards = modal.querySelector("[data-purchase-cart-cards]");
    var details = modal.querySelector("[data-purchase-cart-details]");
    var totalEl = modal.querySelector("[data-purchase-cart-total]");
    var pageCart = document.querySelector("[data-purchase-page-cart]");
    var pageCartWrap = document.querySelector(
      "[data-purchase-page-cart-wrap]",
    );
    var pageTotalEl = document.querySelector("[data-purchase-page-total]");
    if (!cards) return;
    var lines = purchaseAddonState.cart;
    if (!lines.length) {
      cards.innerHTML =
        '<p class="text-base text-text-supporting">尚未選擇加購項目</p>';
      if (details) {
        details.innerHTML =
          '<p class="text-base text-text-supporting">尚未選擇加購項目</p>';
      }
      if (totalEl) totalEl.textContent = "$ 0";
      if (pageCart) pageCart.innerHTML = "";
      if (pageCartWrap) pageCartWrap.hidden = true;
      if (pageTotalEl) {
        pageTotalEl.textContent = "";
        pageTotalEl.hidden = true;
      }
      return;
    }
    var total = lines.reduce(function (sum, line) {
      return sum + Number(line.cost || 0) * line.quantity;
    }, 0);
    var cardsHtml = lines.map(purchaseAddonCartCardHtml).join("");
    cards.innerHTML = cardsHtml;
    if (details) {
      details.innerHTML = lines
        .map(function (line) {
          var quantity = line.quantity;
          return (
            '<div class="flex items-center justify-between gap-3">' +
            '<div class="inline-flex min-w-0 items-center gap-3 text-base text-text-default">' +
            '<span class="truncate">' +
            line.title +
            "</span>" +
            "<span>x " +
            quantity +
            "</span>" +
            "</div>" +
            '<span class="shrink-0 text-base text-text-default">' +
            (Number(line.cost || 0) * quantity).toLocaleString("en-US") +
            "</span>" +
            "</div>"
          );
        })
        .join("");
    }
    if (pageCart) pageCart.innerHTML = cardsHtml;
    if (pageCartWrap) pageCartWrap.hidden = false;
    var totalText = formatPurchaseAmount(total);
    if (totalEl) totalEl.textContent = totalText;
    if (pageTotalEl) {
      pageTotalEl.textContent = totalText;
      pageTotalEl.hidden = false;
    }
  }
  function setPurchaseAddonCategory(category) {
    var modal = document.getElementById("modalPurchaseAddonBackdrop");
    if (!modal) return;
    purchaseAddonState.category = category;
    modal.querySelectorAll("[data-purchase-category]").forEach(function (btn) {
      btn.setAttribute(
        "aria-pressed",
        btn.dataset.purchaseCategory === category ? "true" : "false",
      );
    });
    renderPurchaseAddonProducts();
  }
  function renderPurchaseAddon() {
    renderPurchaseAddonProducts();
    renderPurchaseAddonCart();
  }
  function resetPurchaseAddonModal() {
    purchaseAddonState.category = "all";
    resetPurchaseAddonItems();
    setPurchaseAddonCategory("all");
    var modal = document.getElementById("modalPurchaseAddonBackdrop");
    if (modal) {
      var toggle = modal.querySelector("[data-purchase-category-toggle]");
      var list = modal.querySelector("[data-purchase-category-list]");
      if (toggle) toggle.setAttribute("aria-expanded", "true");
      if (list) {
        list.hidden = false;
        list.classList.remove("is-collapsed");
      }
      var contentToggle = modal.querySelector("[data-purchase-content-toggle]");
      var productList = modal.querySelector("[data-purchase-products]");
      if (contentToggle) contentToggle.setAttribute("aria-expanded", "true");
      if (productList) {
        productList.hidden = false;
        productList.classList.remove("is-collapsed");
      }
    }
    renderPurchaseAddonCart();
  }

  // 訂單修改 modal body：partials/room-booking-sections.html [A]-[E] 注入。
  // 只建一次（示意 demo，不需要 per-order 重置）；規格 components/order-edit-modal.md。
  // 本頁為獨立 document：巢狀 modal 直接開共用 partial 的單一 instance，
  // 疊層由 openModal 動態 z-index 處理，orderEdit_ clone 機制已退役（Stage 1d）
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

  document.addEventListener("click", function (e) {
    var orderSummarySubmit = e.target.closest(
      "[data-order-summary-submit]",
    );
    if (orderSummarySubmit) {
      e.preventDefault();
      var variant = getOrderSummaryVariantFromOrderType();
      if (!setOrderSummaryVariant(variant)) return;
      // 修改 modal 內的 [E] 送出：直接開單一 instance，openModal 動態
      // z-index（60 + N*5）會蓋在修改 modal 之上，不需 orderEdit_ 副本
      openModal("modalOrderSummaryBackdrop", orderSummarySubmit);
      return;
    }
    // 訂單處理頁：狀態 pill 下拉選單動作 -> modal 接線
    // （選單自身的收合由 initSubPageBehaviors 的 item listener 處理）
    var opMenuItem = e.target.closest("[data-op-menu-action]");
    if (opMenuItem) {
      var opAction = opMenuItem.dataset.opMenuAction;
      if (opAction === "訂單") {
        // variant 與訂單實際狀態的對應留給後端，demo 一律開 unpaid
        setOrderSummaryVariant("unpaid");
        openModal("modalOrderSummaryBackdrop", opMenuItem);
      } else if (opAction === "簡訊") {
        openModal("modalSmsBackdrop", opMenuItem);
      } else if (opAction === "修改") {
        // body 首次以 fetch 注入 partial（async），完成後才開 modal
        buildOrderEditModalBody().then(function () {
          openModal("modalOrderEditBackdrop", opMenuItem);
        });
      }
      // 連結 / 複製 / 取消：後端功能，前端僅收合選單
      return;
    }
    var btn = e.target.closest("[data-modal-open]");
    if (!btn) return;
    e.preventDefault();
    openModal(btn.dataset.modalOpen, btn);
  });

  // event-delegated triggers for member-data / contract-company modals
  // 觸發點在訂單修改 modal body（runtime 注入的 partial）內，
  // script-load 時尚不存在，必須 document 委派。
  // 巢狀疊層（修改 -> 會員資料 -> 合約公司）由 openModal 動態 z-index 處理。
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

  // 會員資料 modal - nation-group / honorific / 會員身份 radio handlers
  // Modal lives at body level (outside room-booking template), so wire
  // listeners directly on the modal at script load.
  (function () {
    var modal = document.getElementById("modalMemberDataBackdrop");
    window.__memberDataInit = {modal: !!modal};
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

  // Close buttons (class modal-close-btn, data-modal="id")
  // delegated：涵蓋 runtime 注入的訂單修改 body 與 partial modal
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".modal-close-btn");
    if (!btn) return;
    var id = btn.dataset.modal;
    if (id) closeModal(id);
  });

  document
    .querySelectorAll("[data-order-summary-accordion-toggle]")
    .forEach(function (toggle) {
      toggle.addEventListener("click", function () {
        setOrderSummaryAccordion(
          toggle,
          toggle.getAttribute("aria-expanded") !== "true",
        );
      });
    });

  // Backdrop click - delegated，不維護寫死的 id 清單。
  // data-no-dismiss 標記的 modal 維持不關（會員資料/合約公司）
  document.addEventListener("click", function (e) {
    var el = e.target;
    if (!el.classList || !el.classList.contains("modal-backdrop")) return;
    if (!el.classList.contains("open")) return;
    if (el.hasAttribute("data-no-dismiss")) return;
    closeModal(el.id);
  });

  // ESC key - delegated: 一次只關「最上層」（依 computed z-index 判定，
  // 動態疊層下任意深度成立）。最上層若標 data-no-dismiss 則整個不動作
  // -- 不可穿透去關下層，否則會出現上層開著、底層先消失
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var open = Array.prototype.slice.call(
      document.querySelectorAll(".modal-backdrop.open"),
    );
    if (!open.length) return;
    var top = open.reduce(function (a, b) {
      var za = parseInt(getComputedStyle(a).zIndex, 10) || 0;
      var zb = parseInt(getComputedStyle(b).zIndex, 10) || 0;
      return zb >= za ? b : a;
    });
    if (top.hasAttribute("data-no-dismiss")) return;
    closeModal(top.id);
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

  // Purchase add-on modal state
  (function () {
    var modal = document.getElementById("modalPurchaseAddonBackdrop");
    if (!modal) return;
    var categoryToggle = modal.querySelector("[data-purchase-category-toggle]");
    var categoryList = modal.querySelector("[data-purchase-category-list]");
    var contentToggle = modal.querySelector("[data-purchase-content-toggle]");
    var productList = modal.querySelector("[data-purchase-products]");

    categoryToggle &&
      categoryToggle.addEventListener("click", function () {
        var willCollapse =
          categoryToggle.getAttribute("aria-expanded") !== "false";
        categoryToggle.setAttribute(
          "aria-expanded",
          willCollapse ? "false" : "true",
        );
        if (categoryList) {
          categoryList.hidden = willCollapse;
          categoryList.classList.toggle("is-collapsed", willCollapse);
        }
      });

    contentToggle &&
      contentToggle.addEventListener("click", function () {
        var willCollapse =
          contentToggle.getAttribute("aria-expanded") !== "false";
        contentToggle.setAttribute(
          "aria-expanded",
          willCollapse ? "false" : "true",
        );
        if (productList) {
          productList.hidden = willCollapse;
          productList.classList.toggle("is-collapsed", willCollapse);
        }
      });

    modal.querySelectorAll("[data-purchase-category]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setPurchaseAddonCategory(btn.dataset.purchaseCategory);
      });
    });

    modal.addEventListener("click", function (e) {
      var step = e.target.closest("[data-purchase-step]");
      if (step) {
        var id = step.dataset.purchaseItem;
        var product = purchaseAddonProducts.find(function (item) {
          return item.id === id;
        });
        if (!product) return;
        if (step.dataset.purchaseStep === "plus") {
          incrementCartFromEditor(product);
        } else {
          decrementCartFromEditor(product);
        }
        renderPurchaseAddon();
        return;
      }

      var remove = e.target.closest("[data-purchase-remove]");
      if (remove) {
        removeCartLineById(remove.dataset.purchaseRemove);
        renderPurchaseAddon();
        return;
      }

      var timeToggle = e.target.closest("[data-purchase-time-toggle]");
      if (timeToggle) {
        var toggleProduct = purchaseAddonProducts.find(function (item) {
          return item.id === timeToggle.dataset.purchaseTimeToggle;
        });
        if (toggleProduct) {
          var editor = getEditorState(toggleProduct);
          editor.timeEnabled = !editor.timeEnabled;
        }
        renderPurchaseAddonProducts();
      }
    });

    modal.addEventListener("input", function (e) {
      var field = e.target.closest("[data-purchase-field]");
      if (!field) return;
      var product = purchaseAddonProducts.find(function (item) {
        return item.id === field.dataset.purchaseItem;
      });
      if (!product) return;
      getEditorState(product)[field.dataset.purchaseField] = field.value;
    });

    modal.addEventListener("change", function (e) {
      var field = e.target.closest("[data-purchase-field]");
      if (!field) return;
      var product = purchaseAddonProducts.find(function (item) {
        return item.id === field.dataset.purchaseItem;
      });
      if (!product) return;
      getEditorState(product)[field.dataset.purchaseField] = field.value;
    });

    // Page-level cart trash (outside modal scope) - remove that specific cart line
    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-purchase-remove]");
      if (!trigger) return;
      if (modal && modal.contains(trigger)) return;
      removeCartLineById(trigger.dataset.purchaseRemove);
      renderPurchaseAddon();
    });

    // Expose render so dynamically-injected page templates can rehydrate the page cart
    window.renderPurchaseAddonCart = renderPurchaseAddonCart;

    resetPurchaseAddonItems();
    renderPurchaseAddon();
  })();

  // 供其他 module 使用同一套開關（單一來源），例如
  // arrival-method-modal.js 的確定 commit 後關閉
  return { openModal: openModal, closeModal: closeModal };
}
