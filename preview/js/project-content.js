import { initProjectWizard } from "./project-content-wizard.js";
import { initProjectPhotoManager } from "./project-content-photo.js";

var PROJECT_CONTENT_MODAL_ID = "modalProjectContentBackdrop";
var PROJECT_GHA_MODAL_ID = "modalProjectGhaBackdrop";
var PROJECT_PHOTO_MODAL_ID = "modalProjectPhotoBackdrop";

var projectDetails = [
  { icon: "night.svg", lines: ["天數：1 夜"] },
  { icon: "deposit.svg", lines: ["訂金：100%"] },
  { icon: "deposit.svg", lines: ["訂金：100%", "續住折扣 - 50%"] },
  { icon: "payment-limited-time.svg", lines: ["1 天內付款"] },
  { icon: "door.svg", lines: ["最少須訂間數：28"] },
  { icon: "refund.svg", lines: ["不可退款"] },
  { icon: "duration.svg", lines: ["開放期間：", "2026-01-01 ~ 長期"] },
  { icon: "lock-time-outline.svg", lines: ["限時：0 ~ 24 時", "30 天內"] },
  { icon: "adding-people.svg", lines: ["人數：1", "總人數限制 5"] },
];

var projectCards = [
  {
    id: "project-199-a",
    number: "199",
    title: "一泊二食",
    status: "online",
    template: true,
    photo: "./assets/images/project-content-hotel.jpg",
    sortValue: "1",
    detailsOpen: true,
    settingsOpen: true,
  },
  {
    id: "project-155-a",
    number: "155",
    title: "台灣的內地是南投",
    status: "offline",
    template: false,
    photo: "./assets/images/project-content-landscape.jpg",
    sortValue: "1",
    detailsOpen: true,
    settingsOpen: true,
  },
  {
    id: "project-199-b",
    number: "199",
    title: "美人魚的家",
    status: "online",
    template: false,
    photo: null,
    sortValue: "1",
    detailsOpen: true,
    settingsOpen: true,
  },
  {
    id: "project-155-b",
    number: "155",
    title: "紅蘿蔔好吃",
    status: "offline",
    template: false,
    photo: "./assets/images/project-content-rabbit.jpg",
    sortValue: "1",
    detailsOpen: true,
    settingsOpen: true,
  },
];

function escapeAttribute(value) {
  return String(value).replace(/[&"<>']/g, function (character) {
    return {
      "&": "&amp;",
      '"': "&quot;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
    }[character];
  });
}

function renderDetails() {
  return projectDetails
    .map(function (detail, index) {
      var content = detail.lines
        .map(function (line) {
          return "<span>" + line + "</span>";
        })
        .join("");
      return (
        '<div class="pc-detail-item" data-pc-detail-item="' +
        String(index + 1) +
        '"><img src="./assets/icons/' +
        detail.icon +
        '" alt="" /><div>' +
        content +
        "</div></div>"
      );
    })
    .join("");
}

function renderSettingsTable(project) {
  return (
    '<div class="pc-table-scroll" data-pc-table-scroll tabindex="0" aria-label="專案設定房型資料水平捲動區">' +
    '<table class="pc-settings-table">' +
    "<thead><tr><th>房型</th><th>已開至</th><th>已設至</th><th>價格</th><th>排序</th></tr></thead>" +
    "<tbody>" +
    '<tr><td><span class="pc-room-index">1</span><span>（SB）威尼斯一百人隨住隨案</span></td><td>0000-00-00</td><td>0000-00-00</td><td>未設定</td><td rowspan="2"><input class="pc-sort-input" type="text" inputmode="numeric" value="' + escapeAttribute(project.sortValue) + '" aria-label="' + escapeAttribute(project.title) + '排序" data-pc-sort data-pc-card-id="' + project.id + '"' + (project.status === 'offline' ? ' disabled' : '') + ' /></td></tr>' +
    '<tr><td><span class="pc-room-index">5</span><span>（TW）台灣好行</span></td><td>0000-00-00</td><td>0000-00-00</td><td>99,000</td></tr>' +
    "</tbody></table></div>"
  );
}

function renderPhoto(project) {
  if (project.photo) {
    return (
      '<div class="pc-photo-wrap">' +
      '<img class="pc-card-photo" src="' +
      project.photo +
      '" alt="' +
      escapeAttribute(project.title) +
      '" />' +
      '<button type="button" class="pc-photo-trigger" data-modal-open="' +
      PROJECT_PHOTO_MODAL_ID +
      '" data-pc-photo-trigger data-pc-card-id="' +
      project.id +
      '" aria-label="管理' +
      escapeAttribute(project.title) +
      '照片"><img src="./assets/icons/image.svg" alt="" /></button></div>'
    );
  }
  return (
    '<button type="button" class="pc-photo-placeholder" data-modal-open="' +
    PROJECT_PHOTO_MODAL_ID +
    '" data-pc-photo-trigger data-pc-card-id="' +
    project.id +
    '" aria-label="管理' +
    escapeAttribute(project.title) +
    '照片"><img src="./assets/icons/image-empty.svg" alt="" /></button>'
  );
}

function renderBadges(project) {
  var badges = [
    '<span class="pc-badge pc-badge--limited">限時</span>',
    '<span class="pc-badge pc-badge--bb">BB</span>',
    '<span class="pc-badge pc-badge--gha">GHA</span>',
  ];
  if (project.template) {
    badges.push('<span class="pc-badge pc-badge--template">範本</span>');
  }
  return badges.join("");
}

function renderCardActions(project) {
  if (project.status === "online") {
    return (
      '<button type="button" class="pc-card-action pc-card-action--edit" data-pc-open-wizard data-pc-modal-mode="edit" data-pc-card-id="' +
      project.id +
      '" data-modal-open="' +
      PROJECT_CONTENT_MODAL_ID +
      '" data-pc-action="edit"><img src="./assets/icons/edit.svg" alt="" /><span>修改</span></button>' +
      '<button type="button" class="pc-card-action pc-card-action--copy" data-pc-action="copy" data-pc-card-id="' +
      project.id +
      '"><img src="./assets/icons/duplicate.svg" alt="" /><span>複製</span></button>' +
      '<button type="button" class="pc-card-action pc-card-action--offline" data-pc-action="offline" data-pc-card-id="' +
      project.id +
      '"><img src="./assets/icons/suspend-outline.svg" alt="" /><span>停用</span></button>'
    );
  }
  return (
    '<button type="button" class="pc-card-action pc-card-action--view" data-pc-open-wizard data-pc-modal-mode="view" data-pc-card-id="' +
    project.id +
    '" data-modal-open="' +
    PROJECT_CONTENT_MODAL_ID +
    '" data-pc-action="view"><img src="./assets/icons/preview-outline.svg" alt="" /><span>查看</span></button>' +
    '<button type="button" class="pc-card-action pc-card-action--online" data-pc-action="online" data-pc-card-id="' +
    project.id +
    '"><img src="./assets/icons/video-play.svg" alt="" /><span>啟用</span></button>'
  );
}

function renderCard(project) {
  var templateBadge = "";
  var card = document.createElement("article");
  card.className = "pc-card";
  card.dataset.pcCard = "";
  card.dataset.pcCardId = project.id;
  card.dataset.pcCardStatus = project.status;
  card.dataset.pcTemplate = String(project.template);
  card.innerHTML =
    '<div class="pc-card-ribbon"><span>' +
    project.number +
    "</span></div>" +
    '<div class="pc-card-head">' +
    '<div class="pc-card-information">' +
    '<div class="pc-card-desktop-title"><h2>' +
    project.title +
    "</h2>" +
    templateBadge +
    "</div>" +
    '<div class="pc-card-mobile-media" data-pc-card-layout="mobile">' +
    renderPhoto(project) +
    '<h2>' +
    project.title +
    "</h2>" +
    templateBadge +
    '<p class="pc-updated">更新時間：0000-00-00</p>' +
    '<div class="pc-badges">' +
    renderBadges(project) +
    "</div></div>" +
    '<div class="pc-card-desktop-meta" data-pc-card-layout="desktop"><p class="pc-updated">更新時間：0000-00-00</p><div class="pc-badges">' +
    renderBadges(project) +
    "</div></div></div>" +
    '<div class="pc-card-desktop-photo" data-pc-card-layout="desktop">' +
    renderPhoto(project) +
    "</div></div>" +
    '<section class="pc-accordion pc-accordion--details">' +
    '<button type="button" class="pc-accordion-toggle" data-pc-accordion-toggle="details" data-pc-card-id="' +
    project.id +
    '" aria-expanded="' +
    String(project.detailsOpen) +
    '" aria-controls="pc-' +
    project.id +
    '-details"><span>專案明細</span><img src="./assets/icons/down.svg" alt="" /></button>' +
    '<div id="pc-' +
    project.id +
    '-details" class="pc-accordion-panel pc-detail-grid" data-pc-accordion-panel="details"' +
    (project.detailsOpen ? "" : " hidden") +
    ">" +
    renderDetails() +
    "</div></section>" +
    '<section class="pc-accordion pc-accordion--settings">' +
    '<button type="button" class="pc-accordion-toggle" data-pc-accordion-toggle="settings" data-pc-card-id="' +
    project.id +
    '" aria-expanded="' +
    String(project.settingsOpen) +
    '" aria-controls="pc-' +
    project.id +
    '-settings"><span>專案設定</span><img src="./assets/icons/down.svg" alt="" /></button>' +
    '<div id="pc-' +
    project.id +
    '-settings" class="pc-accordion-panel pc-settings-panel" data-pc-accordion-panel="settings"' +
    (project.settingsOpen ? "" : " hidden") +
    ">" +
    renderSettingsTable(project) +
    "</div></section>" +
    '<div class="pc-card-footer">' +
    '<div class="pc-card-actions" data-pc-card-actions>' +
    renderCardActions(project) +
    "</div></div>";
  return card;
}

function findProject(id) {
  return projectCards.find(function (project) {
    return project.id === id;
  });
}

export function initProjectContent() {
  var state = {
    kind: "lodging",
    status: "all",
    expiry: "unexpired",
    room: "all",
    savedSorts: {},
  };
  var cardGrid = document.querySelector("[data-pc-card-grid]");
  var sortActions = document.querySelector("[data-pc-sort-actions]");
  var saveSortButton = document.querySelector("[data-pc-save-sort]");
  var modal = document.getElementById(PROJECT_CONTENT_MODAL_ID);
  var wizard = initProjectWizard();
  var photoManager = initProjectPhotoManager({
    getPhoto: function (id) { return findProject(id)?.photo || null; },
    onCommit: function (id, url) {
      var project = findProject(id);
      if (project) { project.photo = url; renderCards(); }
    }
  });
  var kindTabs = Array.prototype.slice.call(document.querySelectorAll("[data-pc-kind]"));
  var statusTabs = Array.prototype.slice.call(document.querySelectorAll("[data-pc-status]"));
  var expiryFilters = Array.prototype.slice.call(document.querySelectorAll("[data-pc-expiry]"));
  var roomFilter = document.querySelector("[data-pc-room-filter]");

  function renderCards() {
    if (!cardGrid) return;
    var counts = { all: projectCards.length, online: 0, offline: 0 };
    projectCards.forEach(function (project) {
      counts[project.status] += 1;
    });
    statusTabs.forEach(function (button) {
      button.querySelector("[data-pc-status-count]").textContent = String(counts[button.dataset.pcStatus]);
    });
    cardGrid.replaceChildren();
    projectCards.forEach(function (project) {
      if (state.status !== "all" && project.status !== state.status) return;
      cardGrid.appendChild(renderCard(project));
    });
    if (sortActions) {
      sortActions.hidden = state.status === "offline";
    }
  }

  function setActiveButtons(buttons, value, key) {
    buttons.forEach(function (button) {
      var active = button.dataset[key] === value;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  renderCards();

  kindTabs.forEach(function (button) {
    button.addEventListener("click", function () {
      state.kind = button.dataset.pcKind;
      setActiveButtons(kindTabs, state.kind, "pcKind");
      kindTabs.forEach(function (tab) {
        tab.setAttribute("aria-selected", String(tab === button));
      });
    });
  });

  statusTabs.forEach(function (button) {
    button.addEventListener("click", function () {
      state.status = button.dataset.pcStatus;
      setActiveButtons(statusTabs, state.status, "pcStatus");
      renderCards();
    });
  });

  expiryFilters.forEach(function (button) {
    button.addEventListener("click", function () {
      state.expiry = button.dataset.pcExpiry;
      setActiveButtons(expiryFilters, state.expiry, "pcExpiry");
    });
  });

  if (roomFilter) {
    roomFilter.addEventListener("change", function () {
      state.room = roomFilter.value;
      document.documentElement.dataset.pcRoomFilter = state.room;
    });
  }

  document.addEventListener("click", function (event) {
    var action = event.target.closest("[data-pc-action]");
    if (action) {
      var project = findProject(action.dataset.pcCardId);
      if (project && action.dataset.pcAction === "offline") {
        project.status = "offline";
        renderCards();
      }
      if (project && action.dataset.pcAction === "online") {
        project.status = "online";
        renderCards();
      }
    }

    var accordion = event.target.closest("[data-pc-accordion-toggle]");
    if (accordion) {
      var accordionProject = findProject(accordion.dataset.pcCardId);
      var panel = document.getElementById(accordion.getAttribute("aria-controls"));
      if (!accordionProject || !panel) return;
      var panelKey = accordion.dataset.pcAccordionToggle === "details" ? "detailsOpen" : "settingsOpen";
      accordionProject[panelKey] = !accordionProject[panelKey];
      panel.hidden = !accordionProject[panelKey];
      accordion.setAttribute("aria-expanded", String(accordionProject[panelKey]));
    }

    var wizardTrigger = event.target.closest("[data-pc-open-wizard]");
    if (wizardTrigger && modal) {
      modal.dataset.pcModalMode = wizardTrigger.dataset.pcModalMode || "new";
      modal.dataset.pcCardId = wizardTrigger.dataset.pcCardId || "";
    }

    var ghaToggle = event.target.closest("[data-pc-gha-toggle]");
    if (ghaToggle) {
      var ghaCard = ghaToggle.closest("[data-pc-gha-card]");
      var ribbon = ghaCard && ghaCard.querySelector("[data-pc-gha-ribbon]");
      if (ribbon) ribbon.dataset.pcGhaEnabled = String(ghaToggle.checked);
    }

    var ghaAccordion = event.target.closest("[data-pc-gha-accordion-toggle]");
    if (ghaAccordion) {
      var ghaPanel = document.getElementById(ghaAccordion.getAttribute("aria-controls"));
      if (ghaPanel) {
        var expanded = ghaAccordion.getAttribute("aria-expanded") === "true";
        ghaAccordion.setAttribute("aria-expanded", String(!expanded));
        ghaPanel.hidden = expanded;
      }
    }
  });

  document.addEventListener("input", function (event) {
    var input = event.target.closest("[data-pc-sort]");
    if (!input) return;
    var project = findProject(input.dataset.pcCardId);
    if (project) project.sortValue = input.value;
  });

  if (saveSortButton) {
    saveSortButton.addEventListener("click", function () {
      var editableProjects = projectCards.filter(function (project) {
        return project.status === "online";
      });
      editableProjects.forEach(function (project) {
        state.savedSorts[project.id] = project.sortValue;
      });
      saveSortButton.dataset.pcSavedCount = String(editableProjects.length);
      saveSortButton.dataset.pcSavedIds = editableProjects
        .map(function (project) {
          return project.id;
        })
        .join(",");
    });
  }

  function beforeOpen(id, element) {
    if (id === PROJECT_CONTENT_MODAL_ID) {
      var opener = element || null;
      if (opener && opener.dataset.pcModalMode) {
        modal.dataset.pcModalMode = opener.dataset.pcModalMode;
        modal.dataset.pcCardId = opener.dataset.pcCardId || "";
      }
      wizard.beforeOpen(id, element);
      return;
    }
    photoManager.beforeOpen(id, element);
  }

  return { beforeOpen: beforeOpen };
}
