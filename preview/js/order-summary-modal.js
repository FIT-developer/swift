// 訂單明細 modal module（自 order-modals.js 拆出，Session 87）
// variant（未付款/已付款/候補單）+ accordion + [E] 送出委派開啟。
// reset 由 orchestrator 的 beforeOpen 呼叫。
export function initOrderSummaryModal(modalApi) {
  var openModal = modalApi.openModal;
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

  // [E] 送出：拆自原與 op-menu 合併的 document listener；
  // 兩者目標節點互斥（closest 各自不同 data attr），拆開後行為等價
  document.addEventListener("click", function (e) {
    var orderSummarySubmit = e.target.closest(
      "[data-order-summary-submit]",
    );
    if (!orderSummarySubmit) return;
    e.preventDefault();
    var variant = getOrderSummaryVariantFromOrderType();
    if (!setOrderSummaryVariant(variant)) return;
    // 修改 modal 內的 [E] 送出：直接開單一 instance，openModal 動態
    // z-index（60 + N*5）會蓋在修改 modal 之上，不需 orderEdit_ 副本
    openModal("modalOrderSummaryBackdrop", orderSummarySubmit);
  });

  return {
    reset: resetOrderSummaryModal,
    setVariant: setOrderSummaryVariant,
  };
}
