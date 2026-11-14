const STORAGE_KEY = "swift.scheduled-send.order.v1";

const INITIAL_CARDS = [
  {
    id: "schedule-001",
    title: "自定義樣本名稱（1）",
    category: "全部",
    eventLabel: "入住提醒",
    anchor: "入住日",
    direction: "前",
    days: "2",
    hour: "15",
    content: "我是簡訊內容",
    scope: "總部",
    enabled: true,
    hasUsageToggle: false,
    used: null,
    canAdjust: false,
  },
  {
    id: "schedule-002",
    title: "自定義樣本名稱（2）",
    category: "全部",
    eventLabel: "入住感謝",
    anchor: "退房日",
    direction: "後",
    days: "0",
    hour: "4",
    content: "我是簡訊內容",
    scope: "分館",
    enabled: false,
    hasUsageToggle: true,
    used: true,
    canAdjust: true,
  },
  {
    id: "schedule-003",
    title: "自定義樣本名稱（3）",
    category: "全部",
    eventLabel: "生日祝賀",
    anchor: "入住日",
    direction: "前",
    days: "25",
    hour: "15",
    content: "我是簡訊內容",
    scope: "分館",
    enabled: false,
    hasUsageToggle: false,
    used: null,
    canAdjust: true,
  },
  {
    id: "schedule-004",
    title: "自定義樣本名稱（4）",
    category: "全部",
    eventLabel: "催款通知",
    anchor: "入住日",
    direction: "前",
    days: "0",
    hour: "0",
    content: "我是簡訊內容",
    scope: "分館",
    enabled: true,
    hasUsageToggle: true,
    used: false,
    canAdjust: true,
  },
];

function copyCard(card) {
  return { ...card };
}

function readSavedOrder(cardIds) {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return cardIds.slice();
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || !parsed.every((id) => typeof id === "string")) {
      return cardIds.slice();
    }
    const validIds = parsed.filter(
      (id, index) => cardIds.includes(id) && parsed.indexOf(id) === index,
    );
    return validIds.concat(cardIds.filter((id) => !validIds.includes(id)));
  } catch (error) {
    return cardIds.slice();
  }
}

export function createScheduledSendState() {
  const cards = new Map(INITIAL_CARDS.map((card) => [card.id, copyCard(card)]));
  const order = readSavedOrder(INITIAL_CARDS.map((card) => card.id));
  let newCardSequence = 1;

  function listCards() {
    return order.map((id) => cards.get(id)).filter(Boolean);
  }

  function getCard(id) {
    const card = cards.get(id);
    return card ? copyCard(card) : null;
  }

  function getRank(id) {
    const index = order.indexOf(id);
    return index < 0 ? null : index + 1;
  }

  function saveOrder() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
    } catch (error) {
      return false;
    }
    return true;
  }

  function replaceOrder(nextOrder) {
    const known = new Set(order);
    const nextKnown = nextOrder.filter((id) => known.has(id));
    const nextSet = new Set(nextKnown);
    order.splice(0, order.length, ...nextKnown, ...order.filter((id) => !nextSet.has(id)));
  }

  function reorderVisible(visibleIds) {
    const visible = new Set(visibleIds);
    let position = 0;
    for (let index = 0; index < order.length; index += 1) {
      if (visible.has(order[index])) {
        order[index] = visibleIds[position];
        position += 1;
      }
    }
  }

  function update(id, patch) {
    const card = cards.get(id);
    if (!card) return null;
    Object.assign(card, patch);
    return copyCard(card);
  }

  function saveCard(id, fields) {
    const savedFields = {
      title: fields.title ?? "",
      category: fields.category ?? "全部",
      days: fields.days ?? "",
      hour: fields.hour ?? "",
      content: fields.content ?? "",
    };
    if (id && cards.has(id)) return update(id, savedFields);

    const newId = id || `schedule-new-${Date.now()}-${newCardSequence}`;
    newCardSequence += 1;
    const card = {
      id: newId,
      title: "",
      category: "全部",
      eventLabel: "",
      anchor: "入住日",
      direction: "前",
      days: "",
      hour: "",
      content: "",
      scope: "分館",
      enabled: true,
      hasUsageToggle: false,
      used: null,
      canAdjust: true,
      ...savedFields,
      id: newId,
    };
    cards.set(newId, card);
    order.push(newId);
    return copyCard(card);
  }

  return {
    listCards,
    getCard,
    getRank,
    update,
    saveCard,
    reorderVisible,
    replaceOrder,
    saveOrder,
    snapshotOrder: () => order.slice(),
  };
}
