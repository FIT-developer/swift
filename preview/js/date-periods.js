// Shared date-only controls: Asia/Taipei today, Monday weeks and UTC math.
export function todayIso() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function periodRange(period, offset = 0) {
  const anchor = new Date(todayIso() + "T12:00:00Z");
  let start = new Date(anchor);
  let end = new Date(anchor);
  if (period === "week") {
    const mondayOffset = (anchor.getUTCDay() + 6) % 7;
    start.setUTCDate(anchor.getUTCDate() - mondayOffset + offset * 7);
    end = new Date(start);
    end.setUTCDate(start.getUTCDate() + 6);
  } else if (period === "month") {
    start = new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth() + offset, 1, 12));
    end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0, 12));
  } else if (period === "year") {
    start = new Date(Date.UTC(anchor.getUTCFullYear() + offset, 0, 1, 12));
    end = new Date(Date.UTC(anchor.getUTCFullYear() + offset, 11, 31, 12));
  } else {
    start.setUTCDate(anchor.getUTCDate() + offset);
    end = new Date(start);
  }
  return [start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)];
}
