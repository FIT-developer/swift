---
name: frontend-design
description: "Focuses on robust frontend architecture, component design, and best practices for scalable web applications."
---

# Frontend Design - 前端設計與架構指南

本技能旨在提供一套指導原則，確保前端程式碼的結構化、可維護性、可擴展性及效能最佳化，特別適用於複雜的多頁面應用程式。

## 核心原則

1.  **組件化 (Componentization)**:
    - 將 UI 拆分為獨立、可複用的小型組件。
    - 每個組件應有清晰的職責和明確的介面。
    - 避免巨型組件 (God Components)。

2.  **關注點分離 (Separation of Concerns)**:
    - 將結構 (HTML)、樣式 (CSS) 和行為 (JavaScript) 清楚分離。
    - 避免在 HTML 中寫入過多行內樣式或複雜邏輯。

3.  **設計系統一致性 (Design System Consistency)**:
    - 嚴格遵循 `tokens.md` 和 `components/*.md` 中定義的設計規範。
    - 確保所有頁面和組件的視覺和互動行為一致。

4.  **效能最佳化 (Performance Optimization)**:
    - 優化圖片（壓縮、WebP、Lazy Loading）。
    - 最小化 CSS 和 JavaScript 檔案大小。
    - 減少 DOM 操作和重新渲染。

5.  **可訪問性 (Accessibility - A11y)**:
    - 從設計階段就考慮 WCAG 指南。
    - 確保鍵盤導航、語義化 HTML 標籤、足夠的顏色對比度。

6.  **響應式設計 (Responsive Design)**:
    - 優先考量行動裝置 (Mobile-first) 的設計和實作。
    - 確保在不同螢幕尺寸下提供流暢且一致的使用者體驗。
    - 遵循 `start.md` 中定義的斷點。

## 適用情境

- 設計新頁面或複雜的 UI 區塊時。
- 重構現有程式碼，提升其可維護性時。
- 在多個組件中尋找可複用模式時。
- 評估前端效能瓶頸時。
- 將專案從靜態 HTML 擴展到更動態的應用程式架構時。

## 實作指南

### 1. HTML 結構

- 使用語義化 HTML5 標籤 (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`, `<aside>`)。
- 避免過度嵌套，保持 DOM 結構扁平。
- 確保每個頁面只有一個 `<h1>` 標籤，用於標識頁面主題。

### 2. CSS/Tailwind 使用

- 盡量使用 Tailwind CSS 的 Utility-first 方法，減少自定義 CSS 的需求。
- 對於複雜的、需要邏輯判斷的樣式，考慮建立組件類別或使用 `@apply` (在未來階段)。
- 優先使用 `tokens.md` 中定義的 Design Tokens。
- RWD 優先採用 Mobile-first 思維：先寫小螢幕樣式，再用 `sm:`, `md:`, `lg:` 等斷點修飾大螢幕樣式。

### 3. JavaScript 互動 (未來階段)

- 將 JavaScript 邏輯與 HTML 結構和 CSS 樣式分離。
- 使用事件委派 (Event Delegation) 提升效能。
- 避免全域變數，使用模組化模式。

## 限制

- 在純靜態 HTML 階段，主要關注結構和樣式。
- 不涉及框架選型或複雜的狀態管理 (Vue/React 等，除非明確指示)。
- 對於極度客製化的視覺效果，可能需要輔助其他工具或手動調整。
