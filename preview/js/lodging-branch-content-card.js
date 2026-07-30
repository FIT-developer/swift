// 分館資料編輯 modal - 飯店介紹文案完整 SunEditor 編輯流程（task 補充，
// 2026-07-30 使用者指定只補這一張，飯店設施/提醒事項/交通文案維持靜態
// 空狀態）。規格來源：components/lodging-branch-suneditor.md，跟主頁
// 須知與聲明卡（lodging-notice-card.js）差異只有沒有「來源/範本」按鈕
// 這個維度（本元件從一開始就沒有這個功能，不是拿掉）。
import { mountSunEditorPlaceholder } from "./suneditor-instance.js";
import { showToast } from "./toast.js";

const LANG_LABELS = { zh: "繁體中文", en: "英文", ko: "韓文" };
const LANGUAGES = ["zh", "en", "ko"];

function emptyLangMap(languages) {
  var map = {};
  languages.forEach(function (lang) {
    map[lang] = { status: "empty", content: "" };
  });
  return map;
}

var state = {
  saved: emptyLangMap(LANGUAGES),
  activeLang: LANGUAGES[0],
  edit: null,
};

function cloneLangMapToDraft(savedMap) {
  var draft = {};
  LANGUAGES.forEach(function (lang) {
    draft[lang] = savedMap[lang] ? savedMap[lang].content : "";
  });
  return draft;
}

function buildLangTabs(activeLang) {
  var wrap = document.createElement("div");
  wrap.className = "flex items-center gap-5";
  LANGUAGES.forEach(function (lang) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.introLang = lang;
    var isActive = lang === activeLang;
    btn.className =
      "lodging-notice-lang-tab text-base pb-1" +
      (isActive ? " is-active text-text-default" : " text-text-secondary");
    btn.textContent = LANG_LABELS[lang] || lang;
    wrap.appendChild(btn);
  });
  return wrap;
}

function buildTranslateRow(lang) {
  var zhContent = (state.edit.draft.zh || "").trim();
  var enabled = zhContent.length > 0;
  var wrap = document.createElement("div");
  wrap.className =
    "lodging-notice-translate-row flex items-center justify-between gap-3 pl-3";
  var label = document.createElement("span");
  label.className = "text-base text-text-default";
  label.textContent = "從繁中譯為" + (LANG_LABELS[lang] || lang);
  wrap.appendChild(label);

  var btnWrap = document.createElement("div");
  btnWrap.className = "lodging-notice-tooltip-wrap relative inline-flex";
  var btn = document.createElement("button");
  btn.type = "button";
  btn.dataset.introTranslate = "1";
  btn.disabled = !enabled;
  btn.setAttribute("aria-label", "翻譯");
  btn.className =
    "lodging-notice-translate-btn inline-flex h-9 w-9 items-center justify-center rounded-md";
  btn.classList.add(enabled ? "cursor-pointer" : "cursor-not-allowed");
  btn.innerHTML = '<img src="./assets/icons/translation.svg" alt="" class="w-5 h-5" />';
  btnWrap.appendChild(btn);
  if (!enabled) {
    var tip = document.createElement("div");
    tip.className = "lodging-notice-tooltip";
    tip.textContent = "請先填寫繁體中文";
    btnWrap.appendChild(tip);
  }
  wrap.appendChild(btnWrap);
  return wrap;
}

function buildEditFooter(isMulti) {
  var footer = document.createElement("div");
  footer.className = "flex justify-end gap-2 pt-1";
  var cancel = document.createElement("button");
  cancel.type = "button";
  cancel.dataset.introCancel = "1";
  cancel.className =
    "shrink-0 whitespace-nowrap inline-flex h-9 items-center rounded-md border border-border-disabled bg-border-disabled px-3 text-base text-text-default cursor-pointer";
  cancel.textContent = "取消";
  var save = document.createElement("button");
  save.type = "button";
  save.dataset.introSave = "1";
  save.className =
    "shrink-0 whitespace-nowrap inline-flex h-9 items-center rounded-md border border-border-disabled bg-text-default px-3 text-base text-text-inverse cursor-pointer";
  save.textContent = isMulti ? "全部儲存" : "儲存";
  footer.appendChild(cancel);
  footer.appendChild(save);
  return footer;
}

function buildEditButton() {
  var btn = document.createElement("button");
  btn.type = "button";
  btn.dataset.introEdit = "1";
  btn.className =
    "mx-auto inline-flex items-center gap-2 h-[42px] px-4 rounded-full border border-border-disabled bg-white text-base text-text-default cursor-pointer";
  btn.innerHTML =
    '<img src="./assets/icons/edit.svg" alt="" class="w-6 h-6" /><span>編輯</span>';
  return btn;
}

function render() {
  var container = document.getElementById("lodgingBranchIntroCard");
  if (!container) return;
  container.innerHTML = "";
  var isMulti = LANGUAGES.length > 1;
  var area = document.createElement("div");
  area.className =
    "flex flex-col gap-4 rounded-xl border border-border-default bg-surface-hover p-5";

  if (state.edit) {
    var lang = state.edit.activeLang;
    if (isMulti) area.appendChild(buildLangTabs(lang));
    if (lang === "zh") {
      if (!isMulti) {
        var zhLabel = document.createElement("span");
        zhLabel.className = "text-base font-semibold text-text-default";
        zhLabel.textContent = "繁體中文";
        area.appendChild(zhLabel);
      }
    } else {
      area.appendChild(buildTranslateRow(lang));
    }
    var editorHost = document.createElement("div");
    area.appendChild(editorHost);
    mountSunEditorPlaceholder(editorHost, {
      value: state.edit.draft[lang],
      onInput: function (value) {
        state.edit.draft[lang] = value;
      },
    });
    area.appendChild(buildEditFooter(isMulti));
    container.appendChild(area);
    return;
  }

  var activeLang = state.activeLang;
  var entry = state.saved[activeLang];
  if (isMulti) area.appendChild(buildLangTabs(activeLang));

  area.className =
    "flex flex-col items-center gap-5 rounded-xl border border-border-default bg-surface-hover p-5";
  if (entry.status === "saved") {
    var tag = document.createElement("span");
    tag.className = "text-base text-brand-400";
    tag.textContent = "已儲存內容";
    area.appendChild(tag);
    var p = document.createElement("p");
    p.className = "text-base text-text-default";
    p.textContent = entry.content;
    area.appendChild(p);
  } else {
    var empty = document.createElement("span");
    empty.className = "text-base text-text-default";
    empty.textContent = "尚未填寫";
    area.appendChild(empty);
  }
  area.appendChild(buildEditButton());
  container.appendChild(area);
}

export function initLodgingBranchContentCard() {
  var container = document.getElementById("lodgingBranchIntroCard");
  if (!container) return;

  document.addEventListener("click", function (e) {
    if (!container.contains(e.target)) return;

    var langTab = e.target.closest("[data-intro-lang]");
    if (langTab) {
      var lang = langTab.dataset.introLang;
      if (state.edit) {
        state.edit.activeLang = lang;
      } else {
        state.activeLang = lang;
      }
      render();
      return;
    }

    var editBtn = e.target.closest("[data-intro-edit]");
    if (editBtn) {
      state.edit = {
        activeLang: state.activeLang,
        draft: cloneLangMapToDraft(state.saved),
      };
      render();
      return;
    }

    var cancelBtn = e.target.closest("[data-intro-cancel]");
    if (cancelBtn) {
      state.edit = null;
      render();
      return;
    }

    var saveBtn = e.target.closest("[data-intro-save]");
    if (saveBtn) {
      LANGUAGES.forEach(function (lang) {
        var content = (state.edit.draft[lang] || "").trim();
        state.saved[lang] = {
          status: content ? "saved" : "empty",
          content: content,
        };
      });
      state.activeLang = state.edit.activeLang;
      state.edit = null;
      render();
      return;
    }

    var translateBtn = e.target.closest("[data-intro-translate]");
    if (translateBtn && !translateBtn.disabled) {
      showToast("翻譯功能尚未串接");
      return;
    }
  });

  render();
}
