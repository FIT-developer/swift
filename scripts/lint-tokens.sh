#!/usr/bin/env bash
# Token mirror drift check - tokens.md vs base.css（詳見 lint-tokens.py 檔頭）
set -e
root_dir="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root_dir"
python3 scripts/lint-tokens.py
