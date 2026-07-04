#!/usr/bin/env bash
# Partial dependency manifest check - 每頁必載 partials / JS module 順序 /
# 組合後 duplicate id 與 modal target（詳見 lint-partials.py 檔頭）
set -e
root_dir="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root_dir"
python3 scripts/lint-partials.py
