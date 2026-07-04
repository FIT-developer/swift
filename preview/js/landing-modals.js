import { createModalController } from "./modal-controller.js";

export function initLandingModals() {
  setModalOpen(
    ["desktopBulletinBtn", "mobileBulletinBtn"],
    "modalBulletinBackdrop",
  );
  setModalOpen(
    ["desktopMessageBtn", "mobileMessageBtn"],
    "modalAdministerBackdrop",
  );
  setModalOpen(
    ["desktopMemberBtn", "mobileMemberBtn"],
    "modalMemberBackdrop",
  );

  createModalController();

  bindTabGroup(".administer-tab", "bg-tab-yellow", "font-medium");
  bindTabGroup(".bulletin-tab", "bg-tab-yellow", "font-medium");
  bindMemberSecurityModal();
  bindBulletinRows();
}

function setModalOpen(ids, modalId) {
  ids.forEach(function (id) {
    var btn = document.getElementById(id);
    if (btn) btn.dataset.modalOpen = modalId;
  });
}

function bindTabGroup(selector, activeBgClass, activeWeightClass) {
  document.querySelectorAll(selector).forEach(function (tab) {
    tab.addEventListener("click", function () {
      document.querySelectorAll(selector).forEach(function (item) {
        item.classList.remove(activeBgClass, activeWeightClass);
        item.classList.add("bg-white");
      });
      tab.classList.remove("bg-white");
      tab.classList.add(activeBgClass, activeWeightClass);
    });
  });
}

function bindMemberSecurityModal() {
  document.querySelectorAll(".member-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      var target = tab.dataset.tab;
      document.querySelectorAll(".member-tab").forEach(function (item) {
        var isActive = item.dataset.tab === target;
        item.classList.toggle("bg-border-default", isActive);
        item.classList.toggle("bg-white", !isActive);
      });
      document.querySelectorAll(".member-panel").forEach(function (panel) {
        panel.classList.toggle("hidden", panel.id !== "memberPanel-" + target);
      });
      var origPwd = document.getElementById("memberOriginalPwd");
      if (origPwd) origPwd.classList.toggle("hidden", target === "ip");
    });
  });

  document.querySelectorAll(".eye-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var input = btn.parentElement.querySelector("input");
      if (input) input.type = input.type === "password" ? "text" : "password";
    });
  });
}

function bindBulletinRows() {
  document.querySelectorAll("[data-bulletin-row-toggle]").forEach(function (row) {
    row.addEventListener("click", function () {
      var detail = document.getElementById(
        "bulletinRow" + row.dataset.bulletinRowToggle + "Content",
      );
      if (detail) detail.classList.toggle("hidden");
    });
  });
}
