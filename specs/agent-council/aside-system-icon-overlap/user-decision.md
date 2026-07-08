# User Decision: aside-system-icon-overlap

## 拍板

候選 1：移除 topbar/mobile drawer 的 `system` icon，讓 aside「系統設定」
成為目前唯一的設定入口。

## 補充說明

使用者會到 Figma 把原版 function icons 裡的 `system` icon 移除，只保留
三個 function icons。

因此這不是 code-only override；Figma 也會跟進同步成三顆 function icons。

## 收斂要求

後續實作不可只停在本檔或 `consensus.md`。執行時需依 Decision Convergence
寫回：

- `components/function-icons.md`
- 受影響的 page spec（若仍列 function icons x4）
- `preview/partials/topbar.html`
- `preview/partials/aside.html`
- `specs/progress.md`
