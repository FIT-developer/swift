// 加購 modal module（自 order-modals.js 拆出，Session 87）
// 產品資料 + 分類 + editor/cart state + 渲染 + simple calendar + 頁面層 cart。
// modal reset 由 orchestrator（order-modals.js）的 beforeOpen 呼叫 reset()。
// window.renderPurchaseAddonCart 維持既有對外暴露（order-edit-modal.js 的
// body 注入後 rehydrate 頁面 cart 用）。
export function initPurchaseAddonModal() {
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

  return { reset: resetPurchaseAddonModal };
}
