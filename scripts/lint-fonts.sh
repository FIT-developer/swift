#!/usr/bin/env bash
# 全域字體大小規範 lint：禁止 < 12px 的字體
# - text-[10px] / text-[11px] / text-[Npx] where N < 12
# - font-size: 10px / font-size: 11px / inline style font-size < 12
#
# 用法：
#   ./scripts/lint-fonts.sh           # 掃整個 preview/ 目錄
#   ./scripts/lint-fonts.sh --staged  # 只掃 git 已 staged 的檔案（pre-commit hook 用）
#
# 規範：specs/assets/tokens.md § 字體 / Font-size 規範

set -e

mode="${1:-all}"
root_dir="$(cd "$(dirname "$0")/.." && pwd)"

# Collect target files
if [[ "$mode" == "--staged" ]]; then
  files=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(html|css|js|jsx|ts|tsx)$' || true)
else
  files=$(find "$root_dir/preview" -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" \) 2>/dev/null || true)
fi

[[ -z "$files" ]] && exit 0

# Forbidden patterns:
#  - text-[Npx] where N is single digit (1-9) or 10/11
#  - font-size: 10px / 11px / 1px..9px  (with optional spaces)
violations=$(echo "$files" | xargs -I {} grep -HnE \
  'text-\[([1-9]|1[01])px\]|font-size:[[:space:]]*([1-9]|1[01])px' \
  {} 2>/dev/null || true)

if [[ -n "$violations" ]]; then
  echo "❌ Font-size lint failed — < 12px 字體不允許（最小 text-xs / 12px）"
  echo "   規範：specs/assets/tokens.md § 字體 / Font-size 規範"
  echo
  echo "$violations"
  echo
  echo "修法：text-[10px] → text-xs；font-size: 10px → font-size: var(--font-size-min)"
  exit 1
fi

exit 0
