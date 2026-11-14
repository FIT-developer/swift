export function initCardSort(options) {
  const {
    grid,
    getVisibleIds,
    reorderVisible,
    replaceOrder,
    snapshotOrder,
    saveOrder,
    render,
    announce,
    onSortingChange,
  } = options;
  if (!grid) return { cancel: () => {} };

  const namespace = options.namespace;
  const cardAttribute = `data-${namespace}-card-id`;
  const handleAttribute = `data-${namespace}-sort-id`;
  const cardSelector = `[${cardAttribute}]`;
  const handleSelector = `[data-${namespace}-sort-handle]`;
  const actionSelector = `[data-${namespace}-action], [data-${namespace}-usage-toggle], [data-${namespace}-status], [data-${namespace}-usage]`;
  let sorting = null;

  function setSortingState(activeId) {
    onSortingChange(activeId || null);
  }

  function startSorting(cardId, mode, pointerId) {
    if (sorting) return;
    sorting = {
      cardId,
      mode,
      pointerId,
      originalOrder: snapshotOrder(),
    };
    setSortingState(cardId);
    render();
    announce("開始調整卡片排序。使用方向鍵移動，按 Enter 儲存，按 Escape 取消。");
  }

  function finishSorting(commit) {
    if (!sorting) return;
    const previous = sorting;
    sorting = null;
    setSortingState(null);
    if (commit) {
      saveOrder();
      render();
      announce("卡片排序已更新。");
      return;
    }
    replaceOrder(previous.originalOrder);
    render();
    announce("已取消卡片排序。");
  }

  function moveToTarget(targetId) {
    if (!sorting || !targetId || targetId === sorting.cardId) return;
    const visibleIds = getVisibleIds();
    const fromIndex = visibleIds.indexOf(sorting.cardId);
    const targetIndex = visibleIds.indexOf(targetId);
    if (fromIndex < 0 || targetIndex < 0) return;

    const nextIds = visibleIds.slice();
    nextIds.splice(fromIndex, 1);
    nextIds.splice(targetIndex, 0, sorting.cardId);
    if (nextIds.every((id, index) => id === visibleIds[index])) return;

    reorderVisible(nextIds);
    render();
  }

  function moveByKeyboard(direction) {
    if (!sorting) return;
    const visibleIds = getVisibleIds();
    const index = visibleIds.indexOf(sorting.cardId);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= visibleIds.length) {
      announce(direction < 0 ? "已到排序最前方。" : "已到排序最後方。");
      return;
    }
    const nextIds = visibleIds.slice();
    [nextIds[index], nextIds[targetIndex]] = [nextIds[targetIndex], nextIds[index]];
    reorderVisible(nextIds);
    render();
    announce(`已移至第 ${targetIndex + 1} 張。按 Enter 儲存，按 Escape 取消。`);
  }

  function isInteractiveTarget(target) {
    return Boolean(
      target.closest(
        "button, input, textarea, select, a, label, [contenteditable='true']",
      ),
    );
  }

  grid.addEventListener("pointerdown", (event) => {
    if (event.isPrimary === false) return;
    if (event.button !== undefined && event.button !== 0) return;
    const handle = event.target.closest(handleSelector);
    const card = event.target.closest(cardSelector);
    if (!card) return;
    if (event.pointerType === "touch" && !handle) return;
    if (!handle && isInteractiveTarget(event.target)) return;

    const cardId = card.getAttribute(cardAttribute);
    if (sorting?.mode === "keyboard") finishSorting(false);
    else if (sorting) return;
    event.preventDefault();
    try {
      grid.setPointerCapture(event.pointerId);
    } catch (error) {
      // Pointer capture can be unavailable in older embedded preview browsers.
    }
    startSorting(cardId, "pointer", event.pointerId);
  });

  grid.addEventListener("pointermove", (event) => {
    if (!sorting || sorting.mode !== "pointer" || sorting.pointerId !== event.pointerId) return;
    const edgeSize = 48;
    const scrollStep = 12;
    if (event.clientY < edgeSize) window.scrollBy({ top: -scrollStep, behavior: "auto" });
    if (event.clientY > window.innerHeight - edgeSize) {
      window.scrollBy({ top: scrollStep, behavior: "auto" });
    }
    const target = document.elementFromPoint(event.clientX, event.clientY);
    const targetCard = target && target.closest(cardSelector);
    if (!targetCard || !grid.contains(targetCard)) return;
    moveToTarget(targetCard.getAttribute(cardAttribute));
  });

  grid.addEventListener("pointerup", (event) => {
    if (sorting && sorting.mode === "pointer" && sorting.pointerId === event.pointerId) {
      finishSorting(true);
    }
  });

  grid.addEventListener("pointercancel", (event) => {
    if (sorting && sorting.mode === "pointer" && sorting.pointerId === event.pointerId) {
      finishSorting(false);
    }
  });

  grid.addEventListener("lostpointercapture", (event) => {
    if (sorting && sorting.mode === "pointer" && sorting.pointerId === event.pointerId) {
      finishSorting(false);
    }
  });

  grid.addEventListener("focusout", (event) => {
    if (!sorting || sorting.mode !== "keyboard") return;
    // relatedTarget is available before the browser finishes focusing the next control.
    if (event.relatedTarget?.matches?.(actionSelector)) return;
    const sortingId = sorting.cardId;
    queueMicrotask(() => {
      if (!sorting || sorting.mode !== "keyboard" || sorting.cardId !== sortingId) return;
      // These controls cancel in their action handlers. Rebuilding on pointerdown
      // would remove the pressed control before its click/change can run.
      const focused = document.activeElement;
      if (focused?.matches?.(actionSelector)) return;
      const focusedHandle = document.activeElement?.closest?.(handleSelector);
      if (focusedHandle?.getAttribute(handleAttribute) !== sortingId) finishSorting(false);
    });
  });

  grid.addEventListener("keydown", (event) => {
    const handle = event.target.closest(handleSelector);
    if (!handle) return;
    const card = handle.closest(cardSelector);
    if (!card) return;

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      if (sorting && (sorting.mode !== "keyboard" || sorting.cardId !== card.getAttribute(cardAttribute))) return;
      if (!sorting) {
        startSorting(card.getAttribute(cardAttribute), "keyboard", null);
      }
      moveByKeyboard(event.key === "ArrowUp" ? -1 : 1);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (sorting && sorting.mode === "keyboard") {
        if (sorting.cardId !== card.getAttribute(cardAttribute)) return;
        finishSorting(true);
      } else if (!sorting) {
        startSorting(card.getAttribute(cardAttribute), "keyboard", null);
      }
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sorting) {
      event.preventDefault();
      finishSorting(false);
    }
  });

  return {
    cancel() {
      if (sorting) finishSorting(false);
    },
  };
}
