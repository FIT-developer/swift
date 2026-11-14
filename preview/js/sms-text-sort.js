import { initCardSort } from "./card-sort.js";

export function initSmsTextSort(options) {
  return initCardSort({ ...options, namespace: "sms" });
}
