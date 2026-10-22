// Shared gestures only; each photo manager owns its working and saved slots.
export function initPhotoSort(grid, onMove) {
  if (!grid) return;
  const modal = grid.closest(".modal-backdrop");
  const scroller = grid.closest(".lodging-photo-modal-body");
  let nativeSource = null;
  let gesture = null;
  let animation = 0;

  function clearTarget() {
    grid.querySelectorAll(".is-photo-drop-target").forEach((card) => card.classList.remove("is-photo-drop-target"));
  }
  function updateTarget() {
    if (!gesture?.ghost) return;
    const bounds = scroller.getBoundingClientRect();
    if (gesture.x < bounds.left || gesture.x > bounds.right || gesture.y < bounds.top || gesture.y > bounds.bottom) {
      gesture.target = null;
      clearTarget();
      return;
    }
    const cards = [...grid.querySelectorAll("[data-slot]")];
    const nearest = cards.reduce((best, card) => {
      const box = card.getBoundingClientRect();
      const dx = Math.max(box.left - gesture.x, 0, gesture.x - box.right);
      const dy = Math.max(box.top - gesture.y, 0, gesture.y - box.bottom);
      const distance = dx * dx + dy * dy;
      return !best || distance < best.distance ? { card, distance } : best;
    }, null)?.card;
    gesture.target = nearest ? Number(nearest.dataset.slot) : null;
    clearTarget();
    if (nearest && gesture.target !== gesture.source) nearest.classList.add("is-photo-drop-target");
  }
  function autoScroll(time) {
    if (!gesture?.ghost) return;
    const bounds = scroller.getBoundingClientRect();
    const edge = 56;
    let speed = 0;
    if (gesture.y >= bounds.top - edge && gesture.y < bounds.top + edge) speed = -Math.min(1, (bounds.top + edge - gesture.y) / edge);
    else if (gesture.y <= bounds.bottom + edge && gesture.y > bounds.bottom - edge) speed = Math.min(1, (gesture.y - bounds.bottom + edge) / edge);
    const elapsed = gesture.lastTime ? Math.min(32, time - gesture.lastTime) : 16;
    gesture.lastTime = time;
    if (speed) scroller.scrollTop += speed * elapsed * 0.6;
    updateTarget();
    animation = requestAnimationFrame(autoScroll);
  }
  function finish(apply) {
    if (!gesture) return;
    const ended = gesture;
    gesture = null;
    cancelAnimationFrame(animation);
    ended.ghost?.remove();
    clearTarget();
    if (grid.hasPointerCapture(ended.pointerId)) grid.releasePointerCapture(ended.pointerId);
    if (apply && ended.ghost && ended.target !== null && ended.target !== ended.source) onMove(ended.source, ended.target);
  }

  grid.addEventListener("dragstart", (event) => {
    const card = event.target.closest("[data-slot]");
    if (!card || gesture) { event.preventDefault(); return; }
    nativeSource = Number(card.dataset.slot);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(nativeSource));
  });
  grid.addEventListener("dragover", (event) => event.preventDefault());
  grid.addEventListener("drop", (event) => {
    event.preventDefault();
    const card = event.target.closest("[data-slot]");
    const source = nativeSource;
    nativeSource = null;
    if (card && source !== null && Number(card.dataset.slot) !== source) onMove(source, Number(card.dataset.slot));
  });
  grid.addEventListener("dragend", () => { nativeSource = null; });

  grid.addEventListener("pointerdown", (event) => {
    const handle = event.target.closest("[data-photo-sort-handle]");
    if (!handle || event.button !== 0 || !event.isPrimary || gesture) return;
    const card = handle.closest("[data-slot]");
    const bounds = card.getBoundingClientRect();
    event.preventDefault();
    gesture = { source: Number(card.dataset.slot), target: null, card, pointerId: event.pointerId,
      x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY,
      left: bounds.left, top: bounds.top, width: bounds.width, ghost: null, lastTime: 0 };
    grid.setPointerCapture(event.pointerId);
  });
  grid.addEventListener("pointermove", (event) => {
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    event.preventDefault();
    gesture.x = event.clientX;
    gesture.y = event.clientY;
    if (!gesture.ghost && Math.hypot(gesture.x - gesture.startX, gesture.y - gesture.startY) >= 4) {
      const ghost = gesture.card.cloneNode(true);
      ghost.removeAttribute("data-slot");
      ghost.classList.add("photo-sort-ghost");
      ghost.setAttribute("aria-hidden", "true");
      ghost.querySelectorAll("button, input").forEach((control) => { control.disabled = true; });
      ghost.querySelectorAll("[tabindex]").forEach((node) => node.removeAttribute("tabindex"));
      ghost.style.width = `${gesture.width}px`;
      document.body.appendChild(ghost);
      gesture.ghost = ghost;
      animation = requestAnimationFrame(autoScroll);
    }
    if (gesture.ghost) {
      gesture.ghost.style.left = `${gesture.left + gesture.x - gesture.startX}px`;
      gesture.ghost.style.top = `${gesture.top + gesture.y - gesture.startY}px`;
      updateTarget();
    }
  });
  grid.addEventListener("pointerup", (event) => { if (event.pointerId === gesture?.pointerId) finish(true); });
  grid.addEventListener("pointercancel", (event) => { if (event.pointerId === gesture?.pointerId) finish(false); });
  grid.addEventListener("lostpointercapture", () => finish(false));
  grid.addEventListener("contextmenu", (event) => { if (event.target.closest("[data-photo-sort-handle]")) event.preventDefault(); });
  grid.addEventListener("keydown", (event) => {
    const handle = event.target.closest("[data-photo-sort-handle]");
    if (!handle || !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const index = Number(handle.closest("[data-slot]").dataset.slot);
    const target = index + (["ArrowUp", "ArrowLeft"].includes(event.key) ? -1 : 1);
    if (target < 0 || target >= grid.children.length) return;
    onMove(index, target);
    grid.querySelector(`[data-slot="${target}"] [data-photo-sort-handle]`)?.focus({ preventScroll: true });
  });
  new MutationObserver(() => {
    if (!modal.classList.contains("open")) { finish(false); nativeSource = null; }
  }).observe(modal, { attributes: true, attributeFilter: ["class"] });
}
