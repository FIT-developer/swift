<!--
Brief 模板。使用者只寫這一份，複製到
specs/agent-council/{topic}/brief.md 再填內容。
規則見 specs/agent-council.md。
-->

# Brief: {topic}

## 背景

這個問題為什麼出現、跟哪些既有檔案/決策有關。已知的限制條件（技術棧、
既有規格、不能動的東西）。

## 問題

要決定的具體問題是什麼，用一句話講清楚。

## 候選方案

列出目前想到的選項（可以只有一個，也可以列「不知道」）。每個選項簡述
優缺點（如果已經有想法的話）；不確定就留空，讓 Codex/Claude 自己提。

## 禁止事項

這個問題的答案不可以違反哪些既有規則（例如：不可引入框架、不可修改
tokens.md 的值、不可動 X 檔案）。

## 需要裁決的問題

列出目前卡住、需要 council 產出意見才能往下走的具體問題。這份清單會
被 synthesizer 對照最後 consensus.md 的「Needs User Decision」段。
