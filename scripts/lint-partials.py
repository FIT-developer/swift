# Partial dependency manifest check - 每頁必載的 partials 與 JS module 順序
# 由 scripts/lint-partials.sh 或 pre-commit hook 呼叫。
#
# 目的（start.md「規則要機器攔截」）：
# - multi-page + partials 架構下，「某頁漏載 partial / JS」的結果是死按鈕，
#   肉眼與單檔 review 都看不出來（Session 84/85 兩次教訓）
# - 本 script 把每頁的依賴宣告成 MANIFEST（權威，見 specs/page-architecture.md
#   「Partial dependency manifest」段），並對組合後的 DOM 做機器檢查
#
# 檢查項：
# 1. preview/ 頂層每個 .html 必須登記在 MANIFEST（app page 或 STANDALONE）
# 2. 頁面的 data-partial 集合 == manifest 宣告（多載、漏載都 fail）
# 3. manifest 宣告的 partial 檔案必須存在於 preview/partials/
# 4. 頁面 inline module script 的 import 順序 == manifest modules 順序
#    （init 順序有相依：loadPartials -> initPageShell -> 頁面 behaviors -> modals）
# 5. 組合後（頁面 + 全部 partials）duplicate id = 0
# 6. 組合後每個 data-modal-open 目標 id 都存在
# 7. 組合後每個 .modal-close-btn 的 data-modal 目標 id 都存在
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PREVIEW = ROOT / 'preview'
PARTIALS = PREVIEW / 'partials'

# --- 權威 manifest ---
# 新頁面上線時必須在此登記 partials 與 module import 順序；
# 說明文件在 specs/page-architecture.md「Partial dependency manifest」段。
MANIFEST = {
    'landing.html': {
        'partials': ['aside', 'topbar', 'topbar-modals', 'session-modals'],
        'modules': [
            './js/partials.js',
            './js/page-shell.js',
            './js/page-tabs.js',
            './js/landing-modals.js',
            './js/topbar-modals.js',
            './js/landing-charts.js',
        ],
    },
    'order-processing.html': {
        'partials': [
            'aside',
            'topbar',
            'room-booking-modals',
            'session-modals',
            'topbar-modals',
        ],
        'modules': [
            './js/partials.js',
            './js/page-shell.js',
            './js/page-tabs.js',
            './js/order-processing.js',
            './js/order-modals.js',
            './js/topbar-modals.js',
        ],
    },
    'system-basic.html': {
        'partials': [
            'aside',
            'topbar',
            'session-modals',
            'topbar-modals',
        ],
        'modules': [
            './js/partials.js',
            './js/page-shell.js',
            './js/page-tabs.js',
            './js/system-basic.js',
            './js/modal-controller.js',
            './js/topbar-modals.js',
        ],
    },
    'account-permission.html': {
        'partials': [
            'aside',
            'topbar',
            'session-modals',
            'topbar-modals',
        ],
        'modules': [
            './js/partials.js',
            './js/page-shell.js',
            './js/page-tabs.js',
            './js/account-permission.js',
            './js/modal-controller.js',
            './js/topbar-modals.js',
        ],
    },
    'room-booking.html': {
        'partials': [
            'aside',
            'topbar',
            'room-booking-sections',
            'room-booking-modals',
            'session-modals',
            'topbar-modals',
        ],
        'modules': [
            './js/partials.js',
            './js/page-shell.js',
            './js/page-tabs.js',
            './js/room-booking-behaviors.js',
            './js/order-modals.js',
            './js/arrival-method-modal.js',
            './js/topbar-modals.js',
        ],
    },
    'lodging-info.html': {
        'partials': [
            'aside',
            'topbar',
            'session-modals',
            'topbar-modals',
            'lodging-info-modals',
        ],
        'modules': [
            './js/partials.js',
            './js/page-shell.js',
            './js/page-tabs.js',
            './js/modal-controller.js',
            './js/topbar-modals.js',
            './js/lodging-info-modals.js',
            './js/lodging-notice-card.js',
            './js/lodging-branch-content-card.js',
        ],
    },
    'room-type.html': {
        'partials': [
            'aside',
            'topbar',
            'session-modals',
            'topbar-modals',
            'room-type-modals',
        ],
        'modules': [
            './js/partials.js',
            './js/page-shell.js',
            './js/page-tabs.js',
            './js/modal-controller.js',
            './js/topbar-modals.js',
            './js/room-type.js',
            './js/room-type-modals.js',
            './js/room-type-photo-modal.js',
        ],
    },
    'purchase-addon.html': {
        'partials': [
            'aside',
            'topbar',
            'session-modals',
            'topbar-modals',
            'purchase-addon-modals',
        ],
        'modules': [
            './js/partials.js',
            './js/page-shell.js',
            './js/page-tabs.js',
            './js/purchase-addon.js',
            './js/modal-controller.js',
            './js/topbar-modals.js',
        ],
    },
    'project-content.html': {
        'partials': [
            'aside',
            'topbar',
            'session-modals',
            'topbar-modals',
            'project-content-modals',
        ],
        'modules': [
            './js/partials.js',
            './js/page-shell.js',
            './js/page-tabs.js',
            './js/project-content.js',
            './js/modal-controller.js',
            './js/topbar-modals.js',
        ],
    },
}

# 舊單元件 preview（無 partial 架構），僅豁免不檢查；
# 若之後開始用 data-partial，必須搬進 MANIFEST
STANDALONE = {'chartjs-diverging.html', 'chartjs-doughnut.html', 'toggle.html'}

errors = []


def err(msg):
    errors.append(msg)


def page_partials(html):
    return re.findall(r'data-partial="([^"]+)"', html)


def module_imports(html):
    # 取 inline <script type="module"> 內的 import 路徑（依出現順序）
    blocks = re.findall(
        r'<script type="module">(.*?)</script>', html, flags=re.S
    )
    imports = []
    for block in blocks:
        imports.extend(re.findall(r'import\s+.*?from\s+"([^"]+)"', block))
    return imports


def compose(html):
    combined = html
    for name in page_partials(html):
        f = PARTIALS / (name + '.html')
        if f.exists():
            combined += f.read_text(encoding='utf-8')
    return combined


# 1. 未登記頁面
for f in sorted(PREVIEW.glob('*.html')):
    if f.name not in MANIFEST and f.name not in STANDALONE:
        err(f'{f.name}: 未登記於 lint-partials.py MANIFEST（app page）'
            f' 或 STANDALONE（單元件 preview）')

for page, spec in MANIFEST.items():
    path = PREVIEW / page
    if not path.exists():
        err(f'{page}: MANIFEST 有登記但檔案不存在')
        continue
    html = path.read_text(encoding='utf-8')

    # 2. data-partial 集合
    actual = page_partials(html)
    expected = spec['partials']
    missing = [p for p in expected if p not in actual]
    extra = [p for p in actual if p not in expected]
    if missing:
        err(f'{page}: 漏載 partial: {", ".join(missing)}')
    if extra:
        err(f'{page}: 載入未宣告 partial: {", ".join(extra)}（請更新 MANIFEST）')
    dup_mounts = {p for p in actual if actual.count(p) > 1}
    if dup_mounts:
        err(f'{page}: partial 重複掛載: {", ".join(sorted(dup_mounts))}')

    # 3. partial 檔案存在
    for name in expected:
        if not (PARTIALS / (name + '.html')).exists():
            err(f'{page}: partial 檔案不存在: partials/{name}.html')

    # 4. module import 順序
    actual_modules = module_imports(html)
    if actual_modules != spec['modules']:
        err(f'{page}: module import 順序不符 MANIFEST\n'
            f'  預期: {spec["modules"]}\n'
            f'  實際: {actual_modules}')

    # 5-7. 組合後檢查
    combined = compose(html)
    ids = re.findall(r'\bid="([^"]+)"', combined)
    dups = sorted({i for i in ids if ids.count(i) > 1})
    if dups:
        err(f'{page}: 組合後 duplicate id: {", ".join(dups)}')
    id_set = set(ids)
    for target in sorted(set(re.findall(r'data-modal-open="([^"]+)"', combined))):
        if target not in id_set:
            err(f'{page}: data-modal-open 目標不存在: {target}')
    for target in sorted(set(re.findall(r'data-modal="([^"]+)"', combined))):
        if target not in id_set:
            err(f'{page}: modal-close-btn data-modal 目標不存在: {target}')

if errors:
    print('lint-partials FAIL:')
    for e in errors:
        print('  - ' + e)
    sys.exit(1)

print(f'partial manifest ok（{len(MANIFEST)} pages, {len(STANDALONE)} standalone）')
