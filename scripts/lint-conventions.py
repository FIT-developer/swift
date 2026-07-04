# Conventions lint core - stdin 接收 git diff --unified=0 輸出，只檢查新增行。
# 由 scripts/lint-conventions.sh 呼叫，不直接執行。
# 檢查項目與規範出處見 lint-conventions.sh 檔頭註解。
import re
import sys

violations = []
cur_file = None
cur_line = 0

ALLOWED_RANGES = [
    (0x2018, 0x201D),  # curly quotes（既有內容常見，不擋）
    (0x3000, 0x303F),  # CJK 標點（、。「」等）
    (0x4E00, 0x9FFF),  # CJK 統一漢字
    (0xFF00, 0xFFEF),  # 全形字元（：（）？等）
]


def bad_unicode(text):
    for ch in text:
        o = ord(ch)
        if o <= 127:
            continue
        if any(lo <= o <= hi for lo, hi in ALLOWED_RANGES):
            continue
        return ch
    return None


def strip_comments(line):
    # 移除單行內註解片段（註解引用 Figma hex / min-width 是允許的，不列入檢查）
    line = re.sub(r'/\*.*?\*/', '', line)
    line = re.sub(r'/\*.*$', '', line)
    line = re.sub(r'^\s*\*.*$', '', line)
    line = re.sub(r'//.*$', '', line)
    line = re.sub(r'<!--.*?-->', '', line)
    line = re.sub(r'<!--.*$', '', line)
    return line


for raw in sys.stdin:
    m = re.match(r'\+\+\+ b/(.*)', raw)
    if m:
        cur_file = m.group(1)
        # 歷史封存檔豁免：內容為搬移的舊交接紀錄，start.md 明文
        # 「既有歷史內容可保留到被編輯時再清理」
        if 'progress-archive' in cur_file:
            cur_file = None
        continue
    if cur_file is None and not raw.startswith('@@') and not raw.startswith('+++'):
        continue
    m = re.match(r'@@ -\d+(?:,\d+)? \+(\d+)', raw)
    if m:
        cur_line = int(m.group(1))
        continue
    if not raw.startswith('+') or raw.startswith('+++'):
        continue
    line = raw[1:].rstrip('\n')
    loc = '%s:%d' % (cur_file, cur_line)
    cur_line += 1

    # 1. ASCII-only
    ch = bad_unicode(line)
    if ch is not None:
        violations.append((loc, '裝飾性 Unicode U+%04X %r' % (ord(ch), ch), line.strip()[:70]))

    # 2a. Tailwind min-w-[Npx] 未帶斷點前綴
    for m2 in re.finditer(r'[\w:-]*min-w-\[\d', line):
        token = m2.group(0)
        if not re.match(r'(sm|md|lg|xl|2xl):', token):
            violations.append((loc, 'min-w-[Npx] 缺斷點前綴（md:/lg:/xl:）', line.strip()[:70]))

    code = strip_comments(line)

    # 2b. CSS min-width: 新增行需 @media 同行或 min-width-ok 標記（註解不算）
    if cur_file and cur_file.endswith('.css'):
        if re.search(r'min-width\s*:\s*[1-9]', code):
            if '@media' not in line and 'min-width-ok' not in line:
                violations.append((loc, 'CSS min-width 未 gate（需 @media 包或 /* min-width-ok: 原因 */ 標記）', line.strip()[:70]))

    # 3. hardcoded hex
    if cur_file and cur_file.endswith('.html'):
        if re.search(r'\sstyle\s*=', code):
            violations.append((loc, '禁止 inline style（改用 scoped class / CSS variable）', line.strip()[:70]))
        if re.search(r'\[#[0-9a-fA-F]{3,8}\]', code):
            violations.append((loc, 'Tailwind arbitrary hex（改用 var(--color-*) token）', line.strip()[:70]))
    if cur_file and cur_file.startswith('preview/assets/css/') and cur_file.endswith('.css'):
        if re.search(r':\s*[^;{]*#[0-9a-fA-F]{3,8}', code) and '--color-' not in code:
            violations.append((loc, 'CSS hardcoded hex（顏色走 base.css token）', line.strip()[:70]))
        if re.search(r':\s*[^;{]*rgba?\(', code):
            violations.append((loc, 'CSS raw rgb/rgba（改用 base.css --effect-* 或 --color-*）', line.strip()[:70]))

if violations:
    print('Conventions lint failed - %d violation(s)（只檢查新增行）' % len(violations))
    print('規範：start.md ASCII-only / min-width mobile-safe / no hardcoded hex')
    print()
    for loc, why, ctx in violations:
        print('  %s' % loc)
        print('    %s' % why)
        print('    > %s' % ctx)
    sys.exit(1)
