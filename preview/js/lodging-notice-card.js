// 須知與聲明卡完整編輯流程（task 8）
// 規格來源：components/lodging-branch-notice-card.md +
// components/lodging-branch-suneditor.md（富文本編輯核心/多語系/翻譯/
// 全部儲存-取消暫存規則，兩檔行為相同，本檔套用到「分類 x 語言」兩個維度）
//
// 狀態完全由本檔管理、DOM 由 render() 重建（同 lodging-info-modals.js
// 照片管理 modal 的 render pattern），HTML 只留容器 id
// `lodgingNoticeCard-{rowKey}`（見 lodging-info.html）。
import { mountSunEditorPlaceholder } from "./suneditor-instance.js";
import { showToast } from "./toast.js";

const CATEGORIES = [
  { key: "booking", label: "訂房" },
  { key: "membership", label: "成為會員" },
  { key: "group", label: "團體訂房" },
  { key: "refund", label: "不退款聲明" },
];

const LANG_LABELS = { zh: "繁體中文", en: "英文", ko: "韓文" };

// 系統/總部範本示意文字：本輪不接真實 API，固定示意內容，內容本身不影響
// 規格判讀（components/lodging-branch-notice-card.md「本輪實作範圍」）
const TEMPLATES = {
  system:
    "本館提供舒適的住宿環境與親切的服務，詳細訂房規則請參考館內公告，如有任何問題歡迎隨時與我們聯繫。",
  headquarters:
    "依總部規範，訂房相關事項須遵循總部統一規定辦理，各分館如需調整請先向總部提出申請，經核准後始得公告執行。",
};

function emptyLangMap(languages) {
  var map = {};
  languages.forEach(function (lang) {
    map[lang] = { status: "empty", content: "" };
  });
  return map;
}

function makeCategoryState(languages, savedOverride) {
  return {
    saved: savedOverride || emptyLangMap(languages),
    activeLang: languages[0],
    edit: null,
  };
}

// Demo 資料：row1（headquarters）示範單語系全空狀態；row2（分館）示範多語系
// （繁中已儲存 / 英韓未填寫），涵蓋 tabs、翻譯按鈕 enabled/disabled 兩態
const rowsState = {
  row1: {
    languages: ["zh"],
    activeCategory: "booking",
    categories: {
      booking: makeCategoryState(["zh"]),
      membership: makeCategoryState(["zh"]),
      group: makeCategoryState(["zh"]),
      refund: makeCategoryState(["zh"]),
    },
  },
  row2: {
    languages: ["zh", "en", "ko"],
    activeCategory: "booking",
    categories: {
      booking: makeCategoryState(["zh", "en", "ko"], {
        zh: {
          status: "saved",
          content:
            "入住前請再次確認訂房日期、房型、入住人數及取消規定，並攜帶身分證件辦理登記。若有停車、加床、嬰兒用品或特殊飲食需求，建議事先聯繫飯店。入住後請留意退房時間、早餐地點、館內設施開放時段及客房安全，離房時記得關閉電器並妥善保管貴重物品。",
        },
        en: { status: "empty", content: "" },
        ko: { status: "empty", content: "" },
      }),
      membership: makeCategoryState(["zh", "en", "ko"]),
      group: makeCategoryState(["zh", "en", "ko"]),
      refund: makeCategoryState(["zh", "en", "ko"]),
    },
  },
};

function getRow(rowKey) {
  return rowsState[rowKey];
}
function getCategory(rowKey, catKey) {
  return rowsState[rowKey].categories[catKey];
}
function cloneLangMapToDraft(savedMap, languages) {
  var draft = {};
  languages.forEach(function (lang) {
    draft[lang] = savedMap[lang] ? savedMap[lang].content : "";
  });
  return draft;
}

// ---- DOM 建構 ----

function buildCategoryTabs(row) {
  var wrap = document.createElement("div");
  wrap.className = "flex items-end gap-4 overflow-x-auto overflow-y-hidden";
  CATEGORIES.forEach(function (cat) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.noticeTab = cat.key;
    var isActive = row.activeCategory === cat.key;
    btn.className = isActive
      ? "relative z-10 -mb-px shrink-0 whitespace-nowrap rounded-t-xl border border-border-default bg-white px-5 py-2.5 text-base text-text-default"
      : "mt-1 shrink-0 whitespace-nowrap rounded-t-xl border border-border-default bg-border-disabled px-5 py-2.5 text-base text-text-default";
    btn.textContent = cat.label;
    wrap.appendChild(btn);
  });
  return wrap;
}

function buildLangTabs(languages, activeLang) {
  var wrap = document.createElement("div");
  wrap.className = "flex items-center gap-5";
  languages.forEach(function (lang) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.noticeLang = lang;
    var isActive = lang === activeLang;
    btn.className =
      "lodging-notice-lang-tab text-base pb-1" +
      (isActive ? " is-active text-text-default" : " text-text-secondary");
    btn.textContent = LANG_LABELS[lang] || lang;
    wrap.appendChild(btn);
  });
  return wrap;
}

function buildSourceRow() {
  var wrap = document.createElement("div");
  wrap.className = "flex flex-wrap gap-3";
  [
    { key: "system", label: "從系統範本建立" },
    { key: "headquarters", label: "從總部範本建立" },
  ].forEach(function (src) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.noticeSource = src.key;
    btn.className =
      "inline-flex items-center gap-2 h-[42px] px-4 rounded-full border border-border-disabled bg-white text-base text-text-default cursor-pointer";
    btn.innerHTML =
      '<img src="./assets/icons/document.svg" alt="" class="w-6 h-6" /><span>' +
      src.label +
      "</span>";
    wrap.appendChild(btn);
  });
  return wrap;
}

function buildSourceHint(sourceKey) {
  var label = sourceKey === "headquarters" ? "總部" : "系統";
  var bar = document.createElement("div");
  bar.className =
    "inline-flex h-9 items-center rounded-md border-0 border-l-4 border-border-disabled bg-white";
  bar.innerHTML =
    '<span class="px-3 py-1.5 text-base text-muted">內容來自' +
    label +
    "範本，儲存後為本館自訂</span>";
  return bar;
}

// 翻譯列（無外框，純文字 label + icon-only 翻譯按鈕；2026-07-30 使用者
// 對照 Figma 訂正：本輪先前版本誤加了列外框、按鈕誤用純文字「翻譯」）
function buildTranslateRow(category, lang) {
  var zhContent = (category.edit.draft.zh || "").trim();
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
  btn.dataset.noticeTranslate = "1";
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

// Footer：取消/儲存(全部儲存)；若有來源提示（sourceHint），提示跟按鈕
// 同一列（左提示右按鈕），不是提示獨立一行在上方（2026-07-30 使用者
// 對照 Figma 訂正）
function buildEditFooter(isMulti, hintEl) {
  var footer = document.createElement("div");
  var cancel = document.createElement("button");
  cancel.type = "button";
  cancel.dataset.noticeCancel = "1";
  cancel.className =
    "shrink-0 whitespace-nowrap inline-flex h-9 items-center rounded-md border border-border-disabled bg-border-disabled px-3 text-base text-text-default cursor-pointer";
  cancel.textContent = "取消";
  var save = document.createElement("button");
  save.type = "button";
  save.dataset.noticeSave = "1";
  save.className =
    "shrink-0 whitespace-nowrap inline-flex h-9 items-center rounded-md border border-border-disabled bg-text-default px-3 text-base text-text-inverse cursor-pointer";
  save.textContent = isMulti ? "全部儲存" : "儲存";

  if (hintEl) {
    footer.className = "flex flex-wrap items-center justify-between gap-3 pt-1";
    hintEl.classList.add("min-w-0");
    footer.appendChild(hintEl);
    var btnGroup = document.createElement("div");
    btnGroup.className = "flex shrink-0 gap-2";
    btnGroup.appendChild(cancel);
    btnGroup.appendChild(save);
    footer.appendChild(btnGroup);
  } else {
    footer.className = "flex justify-end gap-2 pt-1";
    footer.appendChild(cancel);
    footer.appendChild(save);
  }
  return footer;
}

function buildEditButton() {
  var btn = document.createElement("button");
  btn.type = "button";
  btn.dataset.noticeEdit = "1";
  btn.className =
    "mx-auto inline-flex items-center gap-2 h-[42px] px-4 rounded-full border border-border-disabled bg-white text-base text-text-default cursor-pointer";
  btn.innerHTML =
    '<img src="./assets/icons/edit.svg" alt="" class="w-6 h-6" /><span>編輯</span>';
  return btn;
}

function buildContentArea(rowKey, row) {
  var catKey = row.activeCategory;
  var category = getCategory(rowKey, catKey);
  var isMulti = row.languages.length > 1;
  var area = document.createElement("div");
  area.className =
    "flex flex-col gap-4 rounded-xl border border-border-default bg-white p-5";

  if (category.edit) {
    // 編輯中（002/003/004/005/007）
    var lang = category.edit.activeLang;
    var hintEl = null;
    if (isMulti) area.appendChild(buildLangTabs(row.languages, lang));
    if (lang === "zh") {
      area.appendChild(buildSourceRow());
      if (category.edit.sourceHint) {
        hintEl = buildSourceHint(category.edit.sourceHint);
      }
      if (!isMulti) {
        // 樣式等同多語系版 active tab：文字 Neutral/800 + 粗體
        // （2026-07-30 使用者對照 Figma 訂正為粗體）
        var zhLabel = document.createElement("span");
        zhLabel.className = "text-base font-semibold text-text-default";
        zhLabel.textContent = "繁體中文";
        area.appendChild(zhLabel);
      }
    } else {
      area.appendChild(buildTranslateRow(category, lang));
    }
    var editorHost = document.createElement("div");
    area.appendChild(editorHost);
    mountSunEditorPlaceholder(editorHost, {
      value: category.edit.draft[lang],
      onInput: function (value) {
        category.edit.draft[lang] = value;
      },
    });
    // 來源提示跟「取消/儲存」同一列（左提示右按鈕），不是獨立一行
    area.appendChild(buildEditFooter(isMulti, hintEl));
    return area;
  }

  // 檢視模式：空狀態（001/006 空）或已儲存內容（006）
  var activeLang = category.activeLang;
  var entry = category.saved[activeLang];
  if (isMulti) area.appendChild(buildLangTabs(row.languages, activeLang));

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
    empty.className =
      "w-full rounded-md bg-white px-3 py-1.5 text-center text-base text-text-default";
    empty.textContent = "尚未填寫";
    area.appendChild(empty);
  }
  area.appendChild(buildEditButton());
  return area;
}

function renderNoticeCard(rowKey) {
  var row = getRow(rowKey);
  var container = document.getElementById("lodgingNoticeCard-" + rowKey);
  if (!container || !row) return;
  container.innerHTML = "";
  container.appendChild(buildCategoryTabs(row));
  container.appendChild(buildContentArea(rowKey, row));
}

function renderAll() {
  Object.keys(rowsState).forEach(renderNoticeCard);
}

function findRowKey(el) {
  var root = el.closest("[data-notice-row]");
  return root ? root.dataset.noticeRow : null;
}

function clampTooltip(tip) {
  tip.style.marginLeft = "";
  var rect = tip.getBoundingClientRect();
  var viewportW = document.documentElement.clientWidth;
  var margin = 12;
  var shift = 0;
  if (rect.right > viewportW - margin) {
    shift = viewportW - margin - rect.right;
  }
  if (rect.left + shift < margin) {
    shift = margin - rect.left;
  }
  if (shift) tip.style.marginLeft = shift + "px";
}

export function initLodgingNoticeCards() {
  // Tooltip：hover 觸發、非常駐（跟訂單處理頁 click 版 tooltip 不同套），
  // 遵循 start.md「Tooltip 視窗自適應」：開啟時量測夾取，基準用
  // documentElement.clientWidth
  document.addEventListener("mouseover", function (e) {
    var wrap = e.target.closest(".lodging-notice-tooltip-wrap");
    if (!wrap) return;
    var tip = wrap.querySelector(".lodging-notice-tooltip");
    if (!tip) return;
    tip.classList.add("is-visible");
    clampTooltip(tip);
  });
  document.addEventListener("mouseout", function (e) {
    var wrap = e.target.closest(".lodging-notice-tooltip-wrap");
    if (!wrap) return;
    if (wrap.contains(e.relatedTarget)) return;
    var tip = wrap.querySelector(".lodging-notice-tooltip");
    if (tip) tip.classList.remove("is-visible");
  });

  document.addEventListener("click", function (e) {
    var rowKey = findRowKey(e.target);
    if (!rowKey) return;
    var row = getRow(rowKey);

    var catTab = e.target.closest("[data-notice-tab]");
    if (catTab) {
      row.activeCategory = catTab.dataset.noticeTab;
      renderNoticeCard(rowKey);
      return;
    }

    var langTab = e.target.closest("[data-notice-lang]");
    if (langTab) {
      var category = getCategory(rowKey, row.activeCategory);
      var lang = langTab.dataset.noticeLang;
      if (category.edit) {
        category.edit.activeLang = lang;
        category.edit.sourceHint = null;
      } else {
        category.activeLang = lang;
      }
      renderNoticeCard(rowKey);
      return;
    }

    var editBtn = e.target.closest("[data-notice-edit]");
    if (editBtn) {
      var cat = getCategory(rowKey, row.activeCategory);
      cat.edit = {
        activeLang: cat.activeLang,
        draft: cloneLangMapToDraft(cat.saved, row.languages),
        sourceHint: null,
      };
      renderNoticeCard(rowKey);
      return;
    }

    var cancelBtn = e.target.closest("[data-notice-cancel]");
    if (cancelBtn) {
      getCategory(rowKey, row.activeCategory).edit = null;
      renderNoticeCard(rowKey);
      return;
    }

    var saveBtn = e.target.closest("[data-notice-save]");
    if (saveBtn) {
      var saveCat = getCategory(rowKey, row.activeCategory);
      row.languages.forEach(function (lang) {
        var content = (saveCat.edit.draft[lang] || "").trim();
        saveCat.saved[lang] = {
          status: content ? "saved" : "empty",
          content: content,
        };
      });
      saveCat.activeLang = saveCat.edit.activeLang;
      saveCat.edit = null;
      renderNoticeCard(rowKey);
      return;
    }

    var sourceBtn = e.target.closest("[data-notice-source]");
    if (sourceBtn) {
      var srcCat = getCategory(rowKey, row.activeCategory);
      var srcKey = sourceBtn.dataset.noticeSource;
      srcCat.edit.draft.zh = TEMPLATES[srcKey] || "";
      srcCat.edit.sourceHint = srcKey;
      renderNoticeCard(rowKey);
      return;
    }

    var translateBtn = e.target.closest("[data-notice-translate]");
    if (translateBtn && !translateBtn.disabled) {
      showToast("翻譯功能尚未串接");
      return;
    }
  });

  renderAll();
}
