#!/usr/bin/env bash
# 專案 conventions lint - 只檢查「新增/修改的行」，不追溯 legacy 內容
#
# 檢查項目（規範來源 start.md / AGENTS.md）：
#   1. ASCII-only：新增行禁用裝飾性 Unicode（box drawing、箭頭、em-dash、
#      emoji 等）；CJK 中文與全形標點允許
#   2. min-width mobile-safe：Tailwind `min-w-[Npx]` 必須帶斷點前綴
#      （sm:/md:/lg:/xl:）；CSS `min-width:` 新增行必須帶 @media 或
#      `/* min-width-ok: <原因> */` 標記（如 overflow-x scroll 容器內的表格）
#   3. no hardcoded hex：HTML 的 Tailwind arbitrary value 禁用 `[#hex]`；
#      landing.css 新增行禁止 hex 色值（註解內引用 Figma 色碼除外；
#      token 定義檔 base.css 不在此限）
#
# 用法：
#   ./scripts/lint-conventions.sh            # 檢查 working tree 相對 HEAD 的新增行
#   ./scripts/lint-conventions.sh --staged   # 檢查 staged 新增行（pre-commit hook 用）

set -e

mode="${1:-worktree}"
root_dir="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root_dir"

if [[ "$mode" == "--staged" ]]; then
  git diff --cached --unified=0 --diff-filter=ACMR -- '*.md' '*.html' '*.css' '*.js' \
    | python3 scripts/lint-conventions.py
else
  git diff HEAD --unified=0 --diff-filter=ACMR -- '*.md' '*.html' '*.css' '*.js' \
    | python3 scripts/lint-conventions.py
fi
