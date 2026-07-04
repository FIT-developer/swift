# scripts/

Shared dev scripts for this repo.

## `lint-fonts.sh`

全域字體大小 lint：禁止 < 12px 的字（含 `text-[10px]`、`text-[11px]`、`font-size: 10px` 等）。
規範來源：`specs/assets/tokens.md` § 字體 / Font-size 規範。

```bash
./scripts/lint-fonts.sh           # 掃整個 preview/
./scripts/lint-fonts.sh --staged  # 只掃已 staged 的檔案（pre-commit 用）
```

## `lint-conventions.sh` / `lint-conventions.py`

專案 conventions lint，**只檢查新增/修改的行**（不追溯 legacy 內容）：
1. ASCII-only：禁裝飾性 Unicode（box drawing/箭頭/em-dash/emoji），CJK 與全形標點允許
2. min-width mobile-safe：`min-w-[Npx]` 需斷點前綴；CSS `min-width:` 需 @media 或 `/* min-width-ok: 原因 */` 標記
3. no hardcoded hex：HTML 禁 `[#hex]` arbitrary value；app.css 禁 hex 色值（註解引用 Figma 色碼除外）

規範來源：`start.md`。pre-commit hook 會與 lint-fonts 一起自動跑。

```bash
./scripts/lint-conventions.sh            # 檢查 working tree 相對 HEAD 的新增行
./scripts/lint-conventions.sh --staged   # 檢查 staged 新增行（pre-commit 用）
```

## `figma-read.py`

Read-only helper for inspecting large `figma-mcp-go` `get_selection` / `get_screenshot` results（超過 inline token 上限時會存成 `tool-results/*.txt`）。取代逐次寫 `python3` heredoc，讓重複的 `figma-go` 讀取都走同一個固定指令。

```bash
python3 scripts/figma-read.py tree <selection.txt> [--id NODE_ID] [--depth N]        # 階層結構摘要
python3 scripts/figma-read.py texts <selection.txt> [--id NODE_ID]                    # 全部 TEXT node 內容 + 樣式
python3 scripts/figma-read.py node <selection.txt> <NODE_ID> [--depth N]              # 單一 node 完整樣式/結構細節
python3 scripts/figma-read.py screenshot <screenshot.txt> <output.png> [--index N]    # 解碼 get_screenshot 結果存成 PNG
python3 scripts/figma-read.py crop <image.png> <x> <y> <w> <h> <output.png> [--zoom N]  # 裁切+放大局部截圖
python3 scripts/figma-read.py pixel <image.png> <x,y> [<x,y> ...]                     # 讀取指定座標的 RGBA 值
```

`crop` / `pixel` 需要 Pillow（`pip3 install Pillow`）。

## `git-hooks/pre-commit`

Pre-commit hook：commit 前自動跑 `lint-fonts.sh --staged`。違規會 exit 1 擋 commit。

**安裝方式（每台新 clone 的機器跑一次）：**
```bash
cp scripts/git-hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

或設定 `core.hooksPath` 直接指向 repo 內的 hooks 目錄（需 git 2.9+）：
```bash
git config core.hooksPath scripts/git-hooks
```

繞過攔截（緊急情況）：`git commit --no-verify`，但通常應修好違規再 commit。
