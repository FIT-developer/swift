const STORAGE_KEY = "swift.sms-text.order.v1";

const PAYMENT_OPTIONS = [
  "轉帳",
  "傳真刷卡",
  "票券",
  "前台自付",
  "信用交易",
  "支票",
  "訂金",
];

const INITIAL_CARDS = [
  {
    id: "sms-001",
    title: "自定義樣本名稱（1）",
    category: "全部",
    template: "sample",
    condition: "n 預訂單",
    payments: PAYMENT_OPTIONS.slice(),
    content: "我是簡訊內容",
    description: "訂房成功（預訂單）",
    scope: "總部",
    enabled: true,
    automatic: true,
    hasUsageToggle: true,
    used: true,
  },
  {
    id: "sms-002",
    title: "自定義樣本名稱（2）",
    category: "全部",
    template: "sample",
    condition: "n 預訂單",
    payments: PAYMENT_OPTIONS.slice(),
    content: "我是簡訊內容",
    description: "繳款成功（已繳款單）",
    scope: "分館",
    enabled: false,
    automatic: true,
    hasUsageToggle: true,
    used: false,
  },
  {
    id: "sms-003",
    title: "自定義樣本名稱（3）",
    category: "全部",
    template: "sample",
    condition: "n 預訂單",
    payments: PAYMENT_OPTIONS.slice(),
    content: "我是簡訊內容",
    description: "取消訂單（取消單）",
    scope: "分館",
    enabled: false,
    automatic: true,
    hasUsageToggle: true,
    used: false,
  },
  {
    id: "sms-004",
    title: "自定義樣本名稱（4）",
    category: "全部",
    template: "sample",
    condition: "n 預訂單",
    payments: [],
    content: "我是簡訊內容",
    description: "自設文本（手動觸發）",
    scope: "分館",
    enabled: true,
    automatic: false,
    hasUsageToggle: false,
    used: null,
  },
];

function copyCard(card) {
  return { ...card, payments: Array.isArray(card.payments) ? card.payments.slice() : [] };
}

function readSavedOrder(cardIds) {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return cardIds.slice();
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || !parsed.every((id) => typeof id === "string")) {
      return cardIds.slice();
    }
    const validIds = parsed.filter((id, index) => cardIds.includes(id) && parsed.indexOf(id) === index);
    return validIds.concat(cardIds.filter((id) => !validIds.includes(id)));
  } catch (error) {
    return cardIds.slice();
  }
}

export function createSmsTextState() {
  const cards = new Map(INITIAL_CARDS.map((card) => [card.id, copyCard(card)]));
  const order = readSavedOrder(INITIAL_CARDS.map((card) => card.id));
  let newCardSequence = 1;

  function orderedCards() {
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
    if (Array.isArray(patch.payments)) card.payments = patch.payments.slice();
    return copyCard(card);
  }

  function saveCard(id, fields) {
    const savedFields = { ...fields, payments: Array.isArray(fields.payments) ? fields.payments.slice() : [] };
    if (id && cards.has(id)) return update(id, savedFields);

    const newId = id || `sms-new-${Date.now()}-${newCardSequence}`;
    newCardSequence += 1;
    const card = {
      id: newId,
      title: "",
      category: "全部",
      template: "sample",
      condition: "n 預訂單",
      payments: [],
      content: "",
      description: "",
      scope: "分館",
      enabled: true,
      automatic: false,
      hasUsageToggle: false,
      used: null,
      ...savedFields,
      id: newId,
      enabled: true,
    };
    cards.set(newId, card);
    order.push(newId);
    return copyCard(card);
  }

  return {
    listCards: orderedCards,
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
