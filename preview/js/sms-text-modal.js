const MODAL_ID = "modalSmsTextBackdrop";

const DEMO_DEFAULTS = {
  title: "",
  category: "全部",
  template: "sample",
  condition: "n 預訂單",
  payments: ["轉帳", "傳真刷卡", "票券", "前台自付", "訂金"],
  content: "我是簡訊內容",
};

function cloneFields(fields) {
  return {
    title: fields.title || "",
    category: fields.category || DEMO_DEFAULTS.category,
    template: fields.template || DEMO_DEFAULTS.template,
    condition: fields.condition || DEMO_DEFAULTS.condition,
    payments: Array.isArray(fields.payments)
      ? fields.payments.slice()
      : DEMO_DEFAULTS.payments.slice(),
    content: fields.content == null ? DEMO_DEFAULTS.content : fields.content,
  };
}

export function initSmsTextModal(options) {
  const config = options || {};
  const openModal = typeof config.openModal === "function" ? config.openModal : function () {};
  const closeModal = typeof config.closeModal === "function" ? config.closeModal : function () {};
  const getCard = typeof config.getCard === "function" ? config.getCard : function () { return null; };
  const getRank = typeof config.getRank === "function" ? config.getRank : function () { return ""; };
  const onSave = typeof config.onSave === "function" ? config.onSave : function () {};
  const modal = document.getElementById(MODAL_ID);
  const form = document.getElementById("smsTextForm");
  let activeId = null;

  if (!modal || !form) return { open: function () {} };

  const rankInput = form.elements.namedItem("rank");
  const clearButton = modal.querySelector("[data-sms-modal-clear]");
  const saveButton = modal.querySelector("[data-sms-modal-save]");
  const closeButton = modal.querySelector(".sms-close-button");
  const preview = modal.querySelector(".sms-preview");
  const title = modal.querySelector("#smsTextModalTitle");

  function setFields(fields) {
    const values = cloneFields(fields);
    form.elements.namedItem("title").value = values.title;
    form.elements.namedItem("category").value = values.category;
    form.elements.namedItem("template").value = values.template;
    form.elements.namedItem("condition").value = values.condition;
    form.elements.namedItem("content").value = values.content;

    modal.querySelectorAll("[data-sms-payment]").forEach(function (button) {
      const selected = values.payments.includes(button.dataset.smsPayment);
      button.setAttribute("aria-pressed", String(selected));
      button.classList.toggle("is-selected", selected);
    });
  }

  function setMode(mode) {
    const isView = mode === "view";
    modal.dataset.smsMode = isView ? "view" : mode;
    title.textContent = isView ? "資料查看" : "新增 / 修改";

    modal.querySelectorAll("input, select, textarea, [data-sms-payment], [data-sms-phrase]").forEach(function (control) {
      control.disabled = isView || control === rankInput;
    });

    clearButton.hidden = isView;
    saveButton.hidden = isView;
    closeButton.hidden = !isView;
  }

  function readFields() {
    return {
      title: form.elements.namedItem("title").value,
      category: form.elements.namedItem("category").value,
      template: form.elements.namedItem("template").value,
      condition: form.elements.namedItem("condition").value,
      payments: Array.from(modal.querySelectorAll('[data-sms-payment][aria-pressed="true"]')).map(function (button) {
        return button.dataset.smsPayment;
      }),
      content: form.elements.namedItem("content").value,
    };
  }

  function saveCurrent(event) {
    if (event) event.preventDefault();
    if (modal.dataset.smsMode === "view") return;
    onSave(activeId, readFields());
    closeModal(MODAL_ID);
  }

  form.addEventListener("submit", saveCurrent);

  modal.addEventListener("click", function (event) {
    const paymentButton = event.target.closest("[data-sms-payment]");
    if (paymentButton && modal.contains(paymentButton)) {
      if (paymentButton.disabled || modal.dataset.smsMode === "view") return;
      const selected = paymentButton.getAttribute("aria-pressed") === "true";
      paymentButton.setAttribute("aria-pressed", String(!selected));
      paymentButton.classList.toggle("is-selected", !selected);
      return;
    }

    const clear = event.target.closest("[data-sms-modal-clear]");
    if (clear && modal.contains(clear)) {
      if (modal.dataset.smsMode === "view") return;
      setFields(DEMO_DEFAULTS);
      return;
    }

    const save = event.target.closest("[data-sms-modal-save]");
    if (save && modal.contains(save)) {
      saveCurrent(event);
    }
  });

  return {
    open: function (mode, id, trigger) {
      const normalizedMode = mode === "view" ? "view" : mode === "edit" ? "edit" : "new";
      const card = normalizedMode !== "new" && id != null ? getCard(id) : null;
      const fields = card ? cloneFields(card) : cloneFields(DEMO_DEFAULTS);

      activeId = normalizedMode === "new" || id == null ? null : id;
      modal.dataset.smsId = activeId == null ? "" : String(activeId);
      form.elements.namedItem("rank").value = String(getRank(activeId) ?? "");
      setFields(fields);
      setMode(normalizedMode);
      if (preview) preview.open = true;
      openModal(MODAL_ID, trigger);
    },
  };
}
