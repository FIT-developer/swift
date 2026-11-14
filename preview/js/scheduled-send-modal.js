const MODAL_ID = "modalScheduledSendBackdrop";
const FORM_ID = "scheduledSendModalForm";

const DEMO_DEFAULTS = {
  title: "",
  category: "全部",
  days: "",
  hour: "",
  content: "我是簡訊內容",
};

function cloneFields(fields) {
  const source = fields || {};
  return {
    title: source.title == null ? DEMO_DEFAULTS.title : String(source.title),
    category: source.category == null ? DEMO_DEFAULTS.category : String(source.category),
    days: source.days == null ? DEMO_DEFAULTS.days : String(source.days),
    hour: source.hour == null ? DEMO_DEFAULTS.hour : String(source.hour),
    content: source.content == null ? DEMO_DEFAULTS.content : String(source.content),
  };
}

function getDateHint(record) {
  if (!record) return "入住日前";

  const anchor = record.anchor == null ? "入住日" : String(record.anchor);
  const direction = record.direction == null ? "前" : String(record.direction);
  if (!anchor) return "入住日前";
  if (!direction) return anchor;
  if (direction.includes(anchor)) return direction;
  return `${anchor}${direction}`;
}

export function initScheduledSendModal(options) {
  const config = options || {};
  const openModal = typeof config.openModal === "function" ? config.openModal : function () {};
  const closeModal = typeof config.closeModal === "function" ? config.closeModal : function () {};
  const getCard = typeof config.getCard === "function" ? config.getCard : function () { return null; };
  const onSave = typeof config.onSave === "function" ? config.onSave : function () {};
  const modal = document.getElementById(MODAL_ID);
  const form = document.getElementById(FORM_ID);
  let activeId = null;

  if (!modal || !form) return { open: function () {} };

  const clearButton = modal.querySelector("[data-schedule-modal-clear]");
  const saveButton = modal.querySelector("[data-schedule-modal-save]");
  const footerCloseButton = modal.querySelector(".schedule-close-button");
  const title = modal.querySelector("#scheduledSendModalTitle");
  const dateHint = modal.querySelector("[data-schedule-date-hint]");
  const preview = modal.querySelector("[data-schedule-preview]");

  function setFields(fields) {
    const values = cloneFields(fields);
    form.elements.namedItem("title").value = values.title;
    form.elements.namedItem("category").value = values.category;
    form.elements.namedItem("days").value = values.days;
    form.elements.namedItem("hour").value = values.hour;
    form.elements.namedItem("content").value = values.content;
  }

  function setMode(mode) {
    const isView = mode === "view";
    modal.dataset.scheduleMode = isView ? "view" : mode;
    title.textContent = isView ? "查看" : "新增 / 修改";

    modal.querySelectorAll("input, select, textarea, [data-schedule-phrase], [data-schedule-example]").forEach(function (control) {
      control.disabled = isView;
    });

    clearButton.hidden = isView;
    saveButton.hidden = isView;
    footerCloseButton.hidden = !isView;
  }

  function readFields() {
    return {
      title: form.elements.namedItem("title").value,
      category: form.elements.namedItem("category").value,
      days: form.elements.namedItem("days").value,
      hour: form.elements.namedItem("hour").value,
      content: form.elements.namedItem("content").value,
    };
  }

  function saveCurrent(event) {
    if (event) event.preventDefault();
    if (modal.dataset.scheduleMode === "view") return;
    onSave(activeId, readFields());
    closeModal(MODAL_ID);
  }

  form.addEventListener("submit", saveCurrent);

  modal.addEventListener("click", function (event) {
    const clear = event.target.closest("[data-schedule-modal-clear]");
    if (clear && modal.contains(clear)) {
      if (modal.dataset.scheduleMode === "view") return;
      setFields(DEMO_DEFAULTS);
      return;
    }

    const save = event.target.closest("[data-schedule-modal-save]");
    if (save && modal.contains(save)) saveCurrent(event);
  });

  return {
    open: function (mode, id, trigger) {
      const normalizedMode = mode === "view" ? "view" : mode === "edit" ? "edit" : "new";
      const card = normalizedMode !== "new" && id != null ? getCard(id) : null;
      const fields = card ? cloneFields(card) : cloneFields(DEMO_DEFAULTS);

      activeId = normalizedMode === "new" || id == null ? null : id;
      modal.dataset.scheduleId = activeId == null ? "" : String(activeId);
      setFields(fields);
      if (dateHint) dateHint.textContent = getDateHint(card);
      setMode(normalizedMode);
      if (preview) preview.open = true;
      openModal(MODAL_ID, trigger);
    },
  };
}
