# Token mirror drift check - 比對 tokens.md 的 Color hex 定義與 base.css 的
# --color-* 值是否一致（strict mirror 承諾的機器檢核）。
# 由 scripts/lint-tokens.sh 或 pre-commit hook 呼叫。
#
# 規則：
# - 只比對 tokens.md 中「| Color/... | `#HEX` |」形式的 raw hex 定義列
#   （alias 列如 "`#EF6F25` -> Brand-500" 或引用列不在此限）
# - token 名轉 CSS var：去掉 "Color/"、各段 lowercase、"/" 轉 "-"
#   例：Color/Brand/Brand-100 -> --color-brand-brand-100
#       Color/SubItem/Selected -> --color-subitem-selected
# - base.css 缺 var 或 hex 不一致都算 drift
import re
import sys

TOKENS_MD = 'specs/assets/tokens.md'
BASE_CSS = 'preview/assets/css/base.css'

with open(TOKENS_MD, encoding='utf-8') as f:
    md = f.read()
with open(BASE_CSS, encoding='utf-8') as f:
    css = f.read()

# base.css 的所有 --color-* vars（raw hex 或 var() alias，alias 遞迴解析成 hex）
raw = {}
for m in re.finditer(r'(--color-[\w-]+)\s*:\s*([^;]+);', css):
    raw[m.group(1)] = m.group(2).strip()

def resolve(name, seen=None):
    seen = seen or set()
    if name in seen:
        return None  # 循環引用
    seen.add(name)
    val = raw.get(name)
    if val is None:
        return None
    hx = re.match(r'#[0-9a-fA-F]{3,8}$', val)
    if hx:
        return val.lower()
    ref = re.match(r'var\((--color-[\w-]+)\)$', val)
    if ref:
        return resolve(ref.group(1), seen)
    return None  # rgba 等非 hex 值不比對

css_vars = {}
for name in raw:
    v = resolve(name)
    if v:
        css_vars[name] = v

# tokens.md 的 raw hex 定義列
drift = []
checked = 0
for m in re.finditer(r'^\|\s*(Color/[\w/-]+)\s*\|\s*`(#[0-9a-fA-F]{6})`', md, re.M):
    path, hexval = m.group(1), m.group(2).lower()
    var = '--color-' + path[len('Color/'):].lower().replace('/', '-')
    checked += 1
    if var not in css_vars:
        drift.append('%s -> %s 不存在於 base.css（tokens.md 定義 %s）' % (path, var, hexval))
    elif css_vars[var] != hexval:
        drift.append('%s：tokens.md %s != base.css %s（%s）' % (path, hexval, css_vars[var], var))

if drift:
    print('Token mirror drift - %d 筆不一致（共檢查 %d 個 raw hex token）' % (len(drift), checked))
    print('規範：specs/assets/tokens.md 為權威，base.css 必須為其 strict mirror')
    print()
    for d in drift:
        print('  ' + d)
    sys.exit(1)

print('token mirror ok（%d raw hex tokens 一致）' % checked)
