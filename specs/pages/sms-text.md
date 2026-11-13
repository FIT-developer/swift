# 簡訊文本與發送

## Current source / implementation contract

- Read / confirmed: 2026-11-13, swift / components.
- Main FRAME `2780:106315`, 簡訊文本與發送 1111 v1.1, 1440 x 1160.
- Root child FRAME `2780:106316` / Frame 427319138 / 1400 x 1136.
- Content FRAME `2786:110115` / content / 1140 x 1052.
- 本輪使用者確認實作, 並授權參照房型頁與自行調整 RWD.
- Full modal current source: INSTANCE `2797:111443`, 800 x 988.
  規格見 [sms-text-modal.md](../../components/sms-text-modal.md).
- 舊無條件 modal `2790:110652` / 800 x 924 僅為 reference, 不另行實作.
- 2026-11-13 早期讀取的藍色啟用 / 未啟用文字已過期,
  必須使用最新 frame 的使用 / 不使用.

## Children checklist

Content direct children:

| # | ID | Name | Type | Size | Content |
|---|---|---|---|---|---|
| 1 | 2786:110116 | Frame 427318959 | FRAME | 1100 x 54 | 通數說明 / 新增 |
| 2 | 2786:110131 | Frame 622 | FRAME | 1100 x 36 | 類別 |
| 3 | 2786:110134 | Frame 653 | FRAME | 336 x 46 | 生命週期 / 使用篩選 |
| 4 | 2786:110494 | Frame 427319036 | FRAME | 320 x 32 | 拖曳提示 |
| 5 | 2786:110147 | Frame 427318960 | FRAME | 1100 x 796 | 卡片 grid |

Grid children 皆為 FRAME, 每張 544 x 392:

| ID | Name | Order | Title | Description | Scope | Automatic | Enabled | Used |
|---|---|---|---|---|---|---|---|---|
| 2786:110149 | Frame 427319047 | 001 | 自定義樣本名稱(1) | 訂房成功(預訂單) | 總部 | yes | yes | yes |
| 2786:110174 | Frame 427319054 | 002 | 自定義樣本名稱(2) | 繳款成功(已繳款單) | 分館 | yes | no | no |
| 2786:110365 | Frame 427319056 | 003 | 自定義樣本名稱(3) | 取消訂單(取消單) | 分館 | yes | no | no |
| 2786:110304 | Frame 427319055 | 004 | 自定義樣本名稱(4) | 自設文本(手動觸發) | 分館 | no | yes | n/a |

表格括號為文件 ASCII 寫法, UI 文案保留 Figma 原字元.
每張內容為我是簡訊內容. 前三張完整列出轉帳 / 傳真刷卡 / 票券 /
前台自付 / 信用交易 / 支票 / 訂金. 第四張沒有自動 badge / 付款標籤 / switch.

## Content and visual contract

- 順序: 剩餘通數 0 與總部 / 分館說明 + 新增, 類別全部, 生命週期 tabs +
  使用控制, 拖曳卡片更新排序提示, 卡片列表.
- 總部說明所有分館適用, 分館說明只適用該分館.
- Content padding Spacing/20, gap Spacing/12, Radius/12,
  Color/Neutral/75 底, Color/Neutral/200 的 1px border.
- 通數說明只有左邊框; tab 只有選中時的下底線, 不使用四邊框.
- Grid gap Spacing/12; 卡片 padding Spacing/16, Radius/12,
  Color/Neutral/0 底, Color/Neutral/300 邊框, 原稿輕陰影.
- 卡片標題 24px / 600, 內文 16px / 400, 編號 20px / 400;
  使用 tokens.md 的字體變數, Noto Sans TC.
- 卡片頂部先標題 + 總部/分館 badge + 自動 badge, 再描述與付款標籤,
  再 switch / 操作, 下方 textarea 型展示內容; 內容區隨同列高度伸展.
- 卡片左上角編號 ribbon 使用當前 SVG 的精確 path,
  啟用為 Brand-100 -> Neutral/0, 停用為 Neutral-100 -> Neutral/0,
  距卡片左上 Spacing/8.
- 總部 badge 為 Accent/float-circle-filled-2 的 50% 混白,
  分館 badge 為 Accent/float-circle-mixed-2 的 50% 混白,
  自動 badge 為 Bootstrap/components/focus 的 50% 混白.
  不新建近似顏色 token.
- 修改 / 停用 / 查看 / 啟動 pill 分別使用 SVG 核對的橘 / 粉 / 灰 / 綠漸層,
  對應 Brand-200, Accent/linear-function-button-delete, Neutral/200,
  Accent/light-green, 下緣皆 Neutral/0. Border 依各節點的當前 token.
- 付款標籤使用 Radius/2, Neutral/500 邊框文字, 原稿白 -> Neutral/50 漸層.
  2026-11-13 使用者覆核要求補回圓角; 來源為卡片內 Status buttons
  `2786:110156` 至 `2786:110162`, 七顆皆 cornerRadius 2.
  本輪 MCP 暫離線, 以 session-183 保存的 selection JSON / PNG / SVG
  交叉比對: SVG 的首顆付款標籤 path 亦保留 2px 圓角輪廓.
- 使用 switch 遵循 html-conventions.md 的共用 iOS switch;
  on Accent/Green, off --color-switch-off-track, knob Neutral/0.
- Icon 使用既有 outline-plus / down / dots-line / edit / suspend-outline /
  preview-outline / video-play / close SVG.

## Confirmed interaction and demo defaults

- Enabled / used / automatic / hasUsageToggle 均為獨立資料, 不可互相推導.
  使用者補充 toggle 依業務資料決定, 不保證每張都有, 不與手動/自動綁定.
- 生命週期邏輯完整沿用房型頁: 預設啟用, 停用 / 啟動即時移至另一分類;
  數量即時重算, Figma 的 2 / 8 是狀態示意. 四張初始資料為 2 / 2.
- 啟用卡片有修改 / 停用, 停用卡片有查看 / 啟動;
  卡片的使用 switch 在兩種生命週期皆可操作, 不因停用而 disabled.
  房型頁的全 disabled 慣例只套用查看 modal 的表單, 不套用卡片 switch.
- 藍色使用 / 不使用為 used 狀態篩選, 預設使用;
  僅篩選資料有 hasUsageToggle 的卡片, 未提供 toggle 的卡片不推導 used,
  示範保留顯示. hasUsageToggle 與 automatic 無關, 後端可分別設定.
  toggle 改變後即時重算可見集合, 不改變 enabled 數量.
- 類別目前只提供稿面全部選項; 不臆造業務類別清單.
- 新增 / 修改 / 查看一律使用 full modal, 查看全部表單與語塊 disabled.
  總部/分館權限不在前端臆造, 當前顯示範例標記, 後端後續套資料.
- 範本與通數 / 字元 / 預覽先呈現稿面 demo, 不自行制定簡訊計費或插值規則.
- 清除重置當前 modal 表單至展示預設, 不改動排序與已保存資料.
  儲存更新前端示範資料並關閉, 關閉未儲存不修改列表.
- 卡片可拖曳排序, 放開立即更新順序及唯讀排序號, 不另設儲存按鈕.
  Demo 以 localStorage 保存順序, 僅本機示範; 不宣稱有正式 API.
  篩選只操作目前可見卡片的相對順序, 其他卡片維持相對順序.
- 觸控從編號 ribbon 把手拖曳, 卡片其他區域保留原生垂直捲動;
  desktop 可從非表單區拖曳, 把手支援方向鍵排序 / Enter 保存,
  Escape / pointercancel / lost capture 取消. 篩選或表單操作會取消未確認排序;
  焦點移至有自身取消 handler 的控制項時, 延至其 action handler 處理,
  避免 focusout 重新渲染吞掉第一次點擊或 Tab 焦點.
- 2026-11-13 使用者回報桌面從編號 / 標題拖曳沒有換位.
  已重現舊判定在目標中央仍維持原位; 改為進入另一張卡片即移至其索引,
  不要求越過目標後半部. 桌面編號 / 標題 / 非表單空白處均可起拖,
  使用 grab / grabbing 游標提示. textarea / buttons / switches 保留原互動.
  拖曳期間列表直接顯示換位, 放開即保存; 未新增浮動 ghost 畫面.

## Responsive and shared shell

- 沿用現行 aside / topbar / session / topbar modals 與 page tabs.
  Figma sidebar 佔位文字 / xxoo / 隱藏 badge 不作新產品內容.
- 原生獨立 sms-text.html + modules + partial, landing 維持 dashboard-only.
- 頁殼採房型頁的 md:p-3, mobile header px-3 pt-3, content 滿可用寬度.
- Content 可用寬度足以容納兩張卡片時兩欄, 不足時單欄;
  依容器寬度判斷, 不固定 375px 或用 viewport 對側欄內欄位硬切.
- 卡片自身為 named container, 可用寬度 <=420px 時標題上方改 Spacing/40,
  避免編號 ribbon 與標題覆蓋. 窄卡片的標題 / badges / 付款方式 / 操作列自然 wrap,
  不縮到 12px 以下, 不製造頁面水平溢出.
- 詳細 modal RWD 見 component spec, 使用者明確授權自適應.

## Difference checkpoint

- 沿用: 房型生命週期 / live count / disabled view / 共用 shell / modal controller.
- 以最新 Figma 覆蓋: 簡訊卡片內容, full modal, 使用 / 不使用名稱與 toggle label,
  雙欄卡片幾何, badge / gradient / 排序提示.
- 不沿用: 房型資料欄位 / 複製與照片功能, 原簡訊訂單 modal 的發送業務.
- 沒有既有簡訊主頁 HTML 或 page spec 衝突; 歷史讀取疑點由本輪使用者答覆更新.
- 正式 API / 權限 / 業務選項 / 通數計算 / 範本插值保留後端接線範圍.

## Validation contract

- 狀態切換 / live counts / usage 與 lifecycle 獨立 / hasUsageToggle 決定 toggle, 不以手動/自動判斷.
- 新增 / 修改 / 清除 / 儲存關閉 / 查看全 disabled + 單顆關閉 / 所有關閉路徑.
- 真實 pointer 與 touch 排序, readonly rank, 重載順序與篩選不丟失資料.
- 360 / 375 / 600 / 768 / 900 / 1024 / 1200 / 1440 無頁面水平溢出;
  375 / 768 / 1440 的狀態與 modal 截圖.
- 四項 lint / JS syntax / partial manifest / browser smoke / diff whitespace.
