# 簡訊文本 full modal

## Current source

- INSTANCE `2797:111443`, Modal(有分資料設定與資料修改 title), 800 x 988.
- Read / user-confirmed: 2026-11-13. 使用者明確要求 full 版全上,
  新增 / 修改均渲染條件與付款方式, 實際套用由後端決定.
- 無條件版 `2790:110652` / 800 x 924 僅作 reference, 不另建 variant.
- 共用 Modal 的外框 / controller / scroll / focus / RWD 見 [modal.md](modal.md).
  disabled view 與 footer 沿用該檔 state=room-type 的確認規則.

## Children checklist

Root children:

| ID | Name | Type | Size |
|---|---|---|---|
| I2797:111443;73:627 | Frame 12 | FRAME | 800 x 930 |
| I2797:111443;73:632 | Slot 2 | SLOT | 800 x 58 |

Frame 12 包含 header Slot `I2797:111443;73:628` / 800 x 77,
content swap `I2797:111443;73:678` / 800 x 853.
下表 ID 前綴皆為 I2797:111443;73:678;.

| # | ID suffix | Name | Type | Size | Content |
|---|---|---|---|---|---|
| 1 | 2797:111445 | Frame 427319025 | FRAME | 776 x 42 | 類別 / 文本標題 |
| 2 | 2797:111455 | Frame 427318959 | FRAME | 776 x 42 | 範本 / 通數 |
| 3 | 2797:111680 | Frame 427319218 | FRAME | 776 x 36 | 排序 / 條件 |
| 4 | 2797:111741 | Frame 427319217 | FRAME | 664 x 42 | 付款方式 |
| 5 | 2797:111473 | Frame 427319217 | FRAME | 776 x 181 | 簡訊內容 |
| 6 | 2797:111476 | Accordion | INSTANCE | 776 x 122 | 簡訊預覽 |
| 7 | 2797:111477 | Frame 427319017 | FRAME | 776 x 244 | 組合語塊 |

## Ordered content

- Header: 新增 / 修改, 副標總部 / 僅適用分館, 右上 close.
  查看標題資料查看, 全 disabled, 不憑空新增權限說明.
- Row 1: 類別 Select 全部; 文本標題 input, 提示非簡訊內容,
  原稿 placeholder 作為輸入框提示, 實際標題為真實文字節點與 label.
- Row 2: 範本 Select sample; 扣除通數 1, 下方已使用 52 字元.
- Row 3: 排序 1, 任何模式均 disabled / 唯讀展示且隨列表順序更新;
  條件 Select n 預訂單.
- Payment chips: 轉帳 / 傳真刷卡 / 票券 / 前台自付 / 信用交易 / 支票 / 訂金.
  當前展示選中前四者與訂金, 信用交易及支票未選中.
- 簡訊內容: textarea 我是簡訊內容, 原稿 776 x 147.
- 簡訊預覽: 原稿展開, 內文我是簡訊內容(完整預覽).
  可開合以瀏覽; 不擅自替換成計費計算或真實訂單插值.
- 組合發送語塊, 提示點選文字按鈕，系統將自動套用與單位相關的訂單條件.
  16 顆完整語塊依序為姓名 / 入住日 / 單位 / 繳款帳號 / 應付訂金 /
  繳款期限 / 訂單總金額 / 入住日(帶上星期幾) / 生日 / 入住夜數 /
  訂單編號 / 銀行 / 已付金額 / 繳款期限僅日期 / 訂單取消日 / 訂房內容.
- Footer 新增 / 修改為清除 + 儲存; 查看只有關閉.
- 文件括號為 ASCII, UI 字串逐字採 Figma 原字元.

## Visual contract

- Width 800px reference, Radius/8, Neutral/0 底, Neutral/300 邊框.
- Header 77px / padding12, 標題20px/600, 副標16px/400, gap4;
  只使用下 border Neutral/300, SVG 這兩稿沒有可見 shadow filter.
- Content padding12, rows gap20; 兩欄各378px / gap20, 輸入欄位34或36高.
- 2026-11-13 使用者訂正排序列對齊: 排序沿用相鄰欄位的 .sms-field,
  label 欄寬 4em + Spacing/16 gap; 不另設排序專用欄寬或 gap.
  新增 / 修改 / 查看及雙欄 / 單欄皆對齊類別與範本的 input 起點.
- Textarea Radius/6, border Neutral/200, value Text/800;
  disabled input Neutral/100, disabled select/chip Neutral/200.
- Preview Radius/12 / padding20 / Neutral/75 底 / Neutral/200 border;
  展開內文 Neutral/0 底 / padding10 / Radius/12.
- 語塊容器 Neutral/75 / Neutral/100 border / Radius/12 / padding20.
  buttons 42px高 / Radius/28 / padding10,16 / gap20橫向,12縱向.
- Payment selected SubItem/Selected 黃底 / 未選 Neutral/0;
  語塊白底, border Neutral/200, Text/500. 查看全部 disabled 灰底.
- 通數 Brand-400, 字元數 Brand-500. 輔助字12px, 內文16px.
- Footer 58px / padding12 / buttons34高 / Radius/6,
  清除 Neutral/200, 儲存或關閉 Neutral/800 + Text/100.

## Behavior and responsive

- 新增 / 修改使用同一 full form, 修改載入目前卡片資料;
  每次開啟重設為目前資料, 不保留未儲存的草稿.
- 清除回到本表單示意預設, 排序保持實際唯讀值, 不修改已保存資料.
- 儲存更新 demo 並關閉; 不建立正式 API / 權限 / 通數或插值計算.
- 查看: 所有 input / select / textarea / payment chips / 語塊 disabled,
  footer 僅關閉; header close / backdrop / Escape 關閉仍有效.
- 範本僅 sample, 類別僅全部, 條件保留原稿 n 預訂單,
  不自行加入未定義的業務選項.
- 通數與字元保持 1 / 52 示意, 語塊不模擬未確認的模板語法或替換規則.
- 大螢幕 max-width800, viewport不足採calc(100vw - 24px),
  mobile <640 使用共用滿版規則. Header/footer固定, body原生垂直捲動.
- form依自身容器可用寬度由雙欄轉單欄; payment / 語塊自然換行.
  不固定375px, 不產生頁面或 modal 水平溢出.
