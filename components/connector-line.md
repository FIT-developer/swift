# Component Specification: `Connector line`

**Figma Node ID**: `194:6721`（CONNECTOR）  
**Type**: CONNECTOR（Figma 原生）  
**最後同步**: 2026-04-15

---

## 概述

`Connector line` 是 Figma 原生的連接線元件，**設計稿交付標注專用，不實作到 HTML**。

通常與黃色 `Tooltips`（`state=md *` 系列）搭配使用：
- Connector line 從標注說明指向目標 UI 元件
- Tooltip md 作為說明文字泡泡顯示在連接線端點

---

## 外觀

| 屬性 | 值 |
|---|---|
| 顏色 | `#f9e616`（黃色，同 Tooltip md 背景） |
| Corner radius | `24px`（圓弧轉折） |
| 類型 | Figma CONNECTOR node |

---

## 使用情境

| 搭配元件 | 說明 |
|---|---|
| `Tooltips` state=md up/down/left/right | 黃色標注泡泡 + 黃色箭頭，共同構成設計稿說明標注 |

---

> ⚠️ **不實作到 HTML**：此元件僅存在於 Figma 設計稿的標注層，產出 HTML 時忽略。

---

*Generated from Figma · Updated 2026-04-15*
