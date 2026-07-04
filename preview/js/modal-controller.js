export function createModalController(options) {
  var config = options || {};
  var beforeOpen =
    typeof config.beforeOpen === "function" ? config.beforeOpen : function () {};
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

  function resetModalScroll(modal) {
    modal.scrollTop = 0;
    var box = modal.querySelector(".modal-box");
    if (box) box.scrollTop = 0;
    modal.querySelectorAll(".overflow-y-auto").forEach(function (scroller) {
      scroller.scrollTop = 0;
    });
  }

  function openModal(id, returnFocusTarget) {
    var el = document.getElementById(id);
    if (!el) return;
    rememberModalReturnFocus(id, returnFocusTarget);
    var openBackdrops = document.querySelectorAll(
      ".modal-backdrop.open",
    ).length;
    el.style.zIndex = openBackdrops
      ? String(60 + openBackdrops * 5)
      : "";
    beforeOpen(id, el);
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
    document.body.style.overflow = document.querySelector(
      ".modal-backdrop.open",
    )
      ? "hidden"
      : "";
    if (wasOpen) restoreModalReturnFocus(id);
  }

  document.addEventListener("click", function (e) {
    var openBtn = e.target.closest("[data-modal-open]");
    if (openBtn) {
      e.preventDefault();
      openModal(openBtn.dataset.modalOpen, openBtn);
      return;
    }

    var closeBtn = e.target.closest(".modal-close-btn");
    if (!closeBtn) return;
    var id = closeBtn.dataset.modal;
    if (id) closeModal(id);
  });

  document.addEventListener("click", function (e) {
    var el = e.target;
    if (!el.classList || !el.classList.contains("modal-backdrop")) return;
    if (!el.classList.contains("open")) return;
    if (el.hasAttribute("data-no-dismiss")) return;
    closeModal(el.id);
  });

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

  return {
    openModal: openModal,
    closeModal: closeModal,
    resetModalScroll: resetModalScroll,
  };
}
