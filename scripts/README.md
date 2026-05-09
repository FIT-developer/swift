# scripts/

Shared dev scripts for this repo.

## `lint-fonts.sh`

全域字體大小 lint：禁止 < 12px 的字（含 `text-[10px]`、`text-[11px]`、`font-size: 10px` 等）。
規範來源：`specs/assets/tokens.md` § 字體 / Font-size 規範。

```bash
./scripts/lint-fonts.sh           # 掃整個 preview/
./scripts/lint-fonts.sh --staged  # 只掃已 staged 的檔案（pre-commit 用）
```

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
