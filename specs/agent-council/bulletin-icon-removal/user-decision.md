# User Decision: bulletin-icon-removal

Date: 2026-07-08

## Decision

使用者拍板選擇方案 A：整個拔除 bulletin function icon 與其對應 modal。

## User comment

> a 拔除（本來就打算這樣做）
>
> 只是透過這個 chat 來確定你們彼此之間可以 cli 溝通
>
> 看來是沒問題了？

## Scope

使用者補充：拍板後可以直接修改產品實作，不需要延遲。雖然本輪也在驗證
ai-chat 流程，但決定仍是正式決定。

本輪實作依 `consensus.md` 的方案 A action plan 做 scoped audit：

- 移除 desktop topbar 的 bulletin entry。
- 移除 mobile drawer 的 bulletin entry。
- 移除 `modalBulletinBackdrop`。
- 移除 bulletin-only JS binding 與 row expand logic。
- 搜尋並處理不再有 consumer 的 bulletin badge/count source。
- Repo 內 function icons 權威規格收斂為 2 icons；Figma 同步屬外部設計檔操作，
  不在本輪 repo 內執行。
