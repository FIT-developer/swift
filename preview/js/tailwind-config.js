// 共用 Tailwind Play CDN config - 所有頁面引用同一份
// （specs/page-architecture.md「新頁面骨架」；classic script，
//  必須排在 cdn.tailwindcss.com 之後載入）
// Tailwind class names map to strict Figma-path CSS vars in base.css.
// Class keys (left) are convenience labels; CSS-var values (right) are the
// canonical Figma path. base.css is the single source of truth.
tailwind.config = {
  theme: {
    extend: {
      colors: {
        "text-default": "var(--color-text-800)",
        "text-secondary": "var(--color-text-400)",
        "text-placeholder": "var(--color-text-300)",
        "text-muted": "var(--color-text-500)",
        "text-subtitle": "var(--color-text-700)",
        "text-supporting": "var(--color-text-600)",
        "text-emphasis": "var(--color-text-900)",
        "text-inverse": "var(--color-text-100)",
        "icon-default": "var(--color-icon-default)",
        "surface-default": "var(--color-surface-default)",
        "surface-hover": "var(--color-modal-hover)",
        "surface-action": "var(--color-surface-action-default)",
        "surface-accent": "var(--color-surface-accent)",
        "surface-brand": "var(--color-surface-brand-default)",
        "surface-brand-hover": "var(--color-surface-brand-hover)",
        "bootstrap-focus-background":
          "var(--color-bootstrap-focus-background)",
        "border-default": "var(--color-border-default)",
        "border-disabled": "var(--color-neutral-200)",
        "border-focus": "var(--color-border-focus)",
        "border-plugin": "var(--color-border-plugin-default)",
        "border-plugin-invalid": "var(--color-border-plugin-invalid)",
        menu: "var(--color-menuitem-default)",
        radio: "var(--color-radio-default)",
        "radio-hover": "var(--color-radio-hover)",
        "subitem-selected": "var(--color-subitem-selected)",
        "brand-50": "var(--color-brand-50)",
        "brand-400": "var(--color-brand-400)",
        "brand-500": "var(--color-brand-500)",
        "brand-active": "var(--color-brand-600)",
        "status-positive": "var(--color-surface-status-positive)",
        "status-negative": "var(--color-surface-status-negative)",
        "chart-blue": "var(--color-chart-blue)",
        "chart-green": "var(--color-chart-green)",
        "chart-purple-red": "var(--color-chart-purple-red)",
        "accent-pink": "var(--color-accent-pink)",
        "accent-light-green": "var(--color-accent-light-green)",
        "accent-green": "var(--color-accent-green)",
        "accent-cart-date": "var(--color-accent-cart-date)",
        "accent-cart-time": "var(--color-accent-cart-time)",
        "accent-celebration": "var(--color-accent-celebration)",
        "accent-linear-pos-left": "var(--color-accent-linear-pos-left)",
        "accent-linear-pos-right": "var(--color-accent-linear-pos-right)",
        "accent-float-circle-mixed-1":
          "var(--color-accent-float-circle-mixed-1)",
        "accent-float-circle-mixed-2":
          "var(--color-accent-float-circle-mixed-2)",
        "accent-float-circle-filled-1":
          "var(--color-accent-float-circle-filled-1)",
        "accent-float-circle-filled-2":
          "var(--color-accent-float-circle-filled-2)",
        "tab-yellow": "var(--color-tab-yellow)",
        "table-column1": "var(--color-table-column1)",
        "table-column2": "var(--color-table-column2)",
      },
    },
  },
};
