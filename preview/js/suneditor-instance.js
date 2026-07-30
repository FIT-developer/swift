// 共用 SunEditor placeholder instance helper
// (components/lodging-branch-suneditor.md「實際串接時的架構原則」)
//
// 本輪不安裝、不串接真實 SunEditor，用 textarea 佔位；但先把「建立/掛載單一
// instance」的介面定好，之後正式串接時只需把 mount() 內部換成
// `SUNEDITOR.create()`，呼叫端（lodging-notice-card.js 等）不需要改寫。
//
// 工具列 icon 清單、分組依 components/lodging-branch-suneditor.md
// 「SunEditor 工具列」段；本輪工具列按鈕全部裝飾用、不接行為。

const TOOLBAR_GROUPS = [
  [
    { icon: "suneditor-rotate-to-left", label: "復原" },
    { icon: "suneditor-rotate-to-right", label: "重做" },
  ],
  [{ icon: "down", label: "格式", text: "Paragraph" }],
  [
    { icon: "suneditor-bold", label: "粗體" },
    { icon: "suneditor-italics", label: "斜體" },
    { icon: "suneditor-underline", label: "底線" },
    { icon: "suneditor-s-slash", label: "刪除線" },
  ],
  [
    { icon: "suneditor-word-color", label: "文字顏色" },
    { icon: "suneditor-filled-a", label: "反白色" },
  ],
  [
    { icon: "suneditor-number-list", label: "編號清單" },
    { icon: "suneditor-outdent", label: "減縮排" },
    { icon: "suneditor-indent", label: "增縮排" },
  ],
  [
    { icon: "ckeditor-align", label: "對齊" },
    { icon: "suneditor-horizontal-line", label: "分隔線" },
    { icon: "suneditor-quote", label: "引言" },
  ],
  [{ icon: "ckeditor-link-bold", label: "連結" }],
  [{ icon: "eraser", label: "清除格式" }],
  [{ icon: "suneditor-code", label: "原始碼檢視" }],
];

function buildToolbar() {
  var bar = document.createElement("div");
  bar.className = "lodging-suneditor-toolbar";
  TOOLBAR_GROUPS.forEach(function (group) {
    var groupEl = document.createElement("div");
    groupEl.className = "lodging-suneditor-toolbar-group";
    group.forEach(function (btn) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "lodging-suneditor-toolbar-btn";
      b.setAttribute("aria-label", btn.label);
      b.disabled = true;
      if (btn.text) {
        b.innerHTML =
          '<span class="text-sm text-text-default">' +
          btn.text +
          '</span><img src="./assets/icons/' +
          btn.icon +
          '.svg" alt="" class="w-4 h-4" />';
      } else {
        b.innerHTML =
          '<img src="./assets/icons/' +
          btn.icon +
          '.svg" alt="" class="w-5 h-5" />';
      }
      groupEl.appendChild(b);
    });
    bar.appendChild(groupEl);
  });
  return bar;
}

// mount(container, { value, placeholder, onInput }) -> { getValue, setValue, destroy }
// container 內容會被清空並重建；每次呼叫都是新的 instance（跟真正 SunEditor
// 串接後「每個語言各自獨立 instance」的模型一致，見 spec）。
export function mountSunEditorPlaceholder(container, options) {
  var opts = options || {};
  container.innerHTML = "";
  container.classList.add("lodging-suneditor");

  var toolbar = buildToolbar();
  container.appendChild(toolbar);

  var textarea = document.createElement("textarea");
  textarea.className = "lodging-suneditor-textarea";
  textarea.placeholder = opts.placeholder || "請輸入內容";
  textarea.value = opts.value || "";
  textarea.addEventListener("input", function () {
    if (opts.onInput) opts.onInput(textarea.value);
  });
  container.appendChild(textarea);

  return {
    getValue: function () {
      return textarea.value;
    },
    setValue: function (value) {
      textarea.value = value || "";
    },
    destroy: function () {
      container.innerHTML = "";
    },
    focus: function () {
      textarea.focus();
    },
  };
}
