// Login page behavior shared by login1.html through login4.html.
// The page is a visual/integration prototype: no auth, network, storage, or
// navigation is performed here.

var LOGIN_ICON_PATH = "./assets/icons/";

function emitLoginEvent(form, name, detail) {
  form.dispatchEvent(
    new CustomEvent(name, {
      bubbles: true,
      detail: detail,
    }),
  );
}

function setFieldsetActive(fieldset, active) {
  if (!fieldset) return;

  fieldset.disabled = !active;
  fieldset.hidden = !active;
  fieldset.setAttribute("aria-hidden", active ? "false" : "true");
  fieldset.querySelectorAll("input, select, textarea, button").forEach(
    function (control) {
      control.disabled = !active;
    },
  );
}

function setPasswordVisibility(password, eye, revealed) {
  if (!password || !eye) return;

  password.type = revealed ? "text" : "password";
  eye.setAttribute("aria-pressed", revealed ? "true" : "false");

  var icon = eye.querySelector("[data-login-eye-icon]");
  if (icon) {
    icon.src =
      LOGIN_ICON_PATH + (revealed ? "eye-open.svg" : "eye-close.svg");
    icon.alt = revealed ? "eye-open" : "eye-close";
  }

  var showLabel = eye.querySelector("[data-login-eye-show]");
  var hideLabel = eye.querySelector("[data-login-eye-hide]");
  if (showLabel) showLabel.hidden = revealed;
  if (hideLabel) hideLabel.hidden = !revealed;
}

function updateDisclosureArrow(details) {
  if (!details) return;

  var icon = details.querySelector(
    '[data-login-disclosure-icon], summary img[src$="up.svg"], summary img[src$="down.svg"]',
  );
  if (!icon || icon.tagName !== "IMG") return;

  icon.src = LOGIN_ICON_PATH + (details.open ? "down.svg" : "up.svg");
  icon.alt = details.open ? "down" : "up";
}

function setDetailsClosed(details) {
  if (!details) return;
  details.removeAttribute("open");
  updateDisclosureArrow(details);
  details.addEventListener("toggle", function () {
    updateDisclosureArrow(details);
  });
}

function setDetailsHidden(details, hidden) {
  if (!details) return;

  details.hidden = hidden;
  details.setAttribute("aria-hidden", hidden ? "true" : "false");
  details.querySelectorAll("button, input, select, textarea").forEach(
    function (control) {
      if ("disabled" in control) control.disabled = hidden;
    },
  );
  if (hidden) details.removeAttribute("open");
  updateDisclosureArrow(details);
}

export function initLogin() {
  var root = document.getElementById("loginRoot");
  if (!root || root.dataset.loginReady === "true") return root || null;
  if (root.dataset.loginInitializing === "true") return root;

  var form = document.getElementById("loginForm");
  if (!form) return null;

  root.dataset.loginInitializing = "true";

  var page = document.body.dataset.loginPage || "";
  var state = document.body.dataset.loginState || "";
  var isVerification = state === "verification";
  var credentials = root.querySelector("[data-login-credentials]");
  var verification = root.querySelector("[data-login-verification]");
  setFieldsetActive(credentials, !isVerification);
  setFieldsetActive(verification, isVerification);

  var password = document.getElementById("loginPassword");
  var eye = root.querySelector("[data-login-eye]");
  setPasswordVisibility(password, eye, false);
  if (eye && password) {
    eye.addEventListener("click", function (event) {
      event.preventDefault();
      setPasswordVisibility(password, eye, password.type === "password");
    });
  }

  var googleDetails = document.getElementById("loginGoogle");
  var contactDetails = document.getElementById("loginContact");
  setDetailsClosed(googleDetails);
  setDetailsClosed(contactDetails);
  setDetailsHidden(googleDetails, isVerification);
  setDetailsHidden(contactDetails, false);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var fields = Object.fromEntries(new FormData(form).entries());
    emitLoginEvent(form, "login:submit", {
      page: page,
      state: state,
      fields: fields,
    });
  });

  root.querySelectorAll("[data-login-google]").forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      emitLoginEvent(form, "login:google", {
        page: page,
        state: state,
      });
    });
  });

  root.querySelectorAll("[data-login-policy]").forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      emitLoginEvent(form, "login:policy", {
        page: page,
        state: state,
        policy: button.dataset.loginPolicy,
      });
    });
  });

  root.querySelectorAll("[data-login-refresh]").forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      emitLoginEvent(form, "login:refresh", {
        page: page,
        state: state,
      });
    });
  });

  root.querySelectorAll("[data-login-clear]").forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();

      var activeFieldset = isVerification ? verification : credentials;
      if (activeFieldset) {
        activeFieldset
          .querySelectorAll("input, select, textarea")
          .forEach(function (control) {
            if (!control.disabled) control.value = "";
          });
      }

      setPasswordVisibility(password, eye, false);

      var firstActive = activeFieldset && activeFieldset.querySelector(
        "input:not(:disabled), select:not(:disabled), textarea:not(:disabled)",
      );
      if (firstActive) firstActive.focus();
    });
  });

  delete root.dataset.loginInitializing;
  root.dataset.loginReady = "true";
  return root;
}
