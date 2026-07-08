# Brief: aside-system-icon-overlap

## 背景

目前 aside menu 已在 Session 96 重整為 6 個父分類，其中第一個父項是
「系統設定」，包含五個子項：

- 系統基本
- 帳號及權限
- 民宿資料
- 房型
- 加購商品

右上角 function icons 也有一個 `system` icon（齒輪）。依
`components/function-icons.md`，`system` 目前標記為「後續功能，尚未有對應
內容，不顯示數字 badge」。目前 `preview/partials/topbar.html` 內的 desktop
system icon 是靜態 `<img>`，不是 button，也沒有 `data-modal-open`；它不會開
modal。mobile drawer 裡同樣有 system icon。

Session 97 剛修正過另一組 function icons（公告 / 訊息 / 會員安全管理）：
這些 icon 三頁都固定顯示，且 modal 也抽成全站共用 partial，避免不同頁同一
入口行為不一致。該輪沒有定義 system icon 的行為。

本題需要判斷：aside 已經有「系統設定」父項後，右上角 function icons 的
`system` icon 是否仍然需要存在，或者它是否會造成語意重疊與使用者困惑。

## 問題

aside 的「系統設定」父項與右上角 function icons 的 `system` icon 是否語意
衝突？如果設定入口已經在 aside，右上角 `system` icon 是否仍應保留？

## 候選方案

### 方案 A：保留 system icon，維持目前狀態

理由可能是 function icons 規格原本就是四顆 icon，system 是後續功能佔位；
保留可維持 topbar 視覺節奏與未來擴充位置。

風險是目前 system icon 沒有可用行為，且語意容易被解讀成「系統設定」入口，
與 aside 父項重疊。

### 方案 B：移除右上角 system icon

理由可能是所有「設定」類入口都已在 aside，右上角不應再提供一個沒有行為且
語意重疊的齒輪 icon。

風險是會改變 function icons component 的四顆 icon 結構，需同步更新
`components/function-icons.md`、`preview/partials/topbar.html`、
`preview/partials/aside.html`，並檢查 spacing / layout / mobile drawer 視覺。

### 方案 C：保留 icon，但重新定義語意，不作為「系統設定」

例如將右上角 `system` icon 定義為全站工具、偏好、快速設定、或後台狀態類
入口，而 aside「系統設定」仍是業務設定分類。

風險是目前沒有 Figma 或產品規格支撐新的語意；若沒有明確內容，容易只是把
模糊保留下來。

### 方案 D：暫時保留視覺，但在規格中標記為待決，不新增行為

理由是避免在沒有 Figma 或產品確認時做視覺移除；但必須明確記錄 system icon
目前不是 current source 的設定入口，避免後續 agent 誤把它當成有效功能。

風險是使用者仍會看到一個沒有行為的 icon；這是否可接受需要使用者拍板。

## 禁止事項

- 不可只因現有 markup 有 system icon 就推論它必須保留；現有 code 不是產品
  決策來源。
- 不可把 `consensus.md` 當成權威來源；使用者拍板後需依性質寫回
  `components/function-icons.md`、`specs/pages/{name}.md`、
  `specs/page-architecture.md` 或 `specs/progress.md`。
- 不可直接修改 preview 實作；本輪先做 decision council，不進 implementation。
- 不可用舊 archive 決策覆蓋 Session 96/97 的最新現況；舊記錄只能作為背景。
- 不可自行假設 system icon 的未來 modal 或頁面內容。

## 需要裁決的問題

1. 右上角 function icons 的 `system` icon 是否與 aside「系統設定」構成使用者
   可感知的語意衝突？
2. 若有衝突，較合理的方向是移除、改名/改語意、還是保留但標記為待決？
3. 如果決定移除或改語意，應收斂到哪些權威檔案？
