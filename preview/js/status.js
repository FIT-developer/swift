// Static status pages: the backend owns page selection and return destinations.
export function initStatus(root = document.getElementById("statusRoot")) {
  if (!root || root.dataset.statusReady === "true") return;

  root.addEventListener("click", function (event) {
    const link = event.target.closest("[data-status-return]");
    if (!link || !root.contains(link)) return;

    const href = (link.getAttribute("href") || "").trim();
    if (href && href !== "#") return;

    event.preventDefault();
    link.dispatchEvent(
      new CustomEvent("status:return", {
        bubbles: true,
        detail: {
          page: document.body.dataset.statusPage,
          state: document.body.dataset.statusState,
        },
      }),
    );
  });

  root.dataset.statusReady = "true";
}
