# 2026/01/25 現在のHugoフォルダ構成

content/
├── _index.md                    # サイトトップ (LP)
├── test-quiz.md                 # (旧ファイル・削除推奨)
│
├── blog/                        # 📝 記事・読み物エリア
│   └── _index.md                # ブログ一覧ページ
│
└── docs/                        # 🛠️ ハックツール・問題集エリア
    ├── _index.md                # ツール一覧ページ
    │
    └── hack_prototype/          # [プロトタイプ] IPAセキュリティ
        ├── _index.md            # プロトタイプの説明
        ├── day_001.md           # Day 1: 情報セキュリティの基礎
        ├── day_002.md           # Day 2: 脅威とマルウェア
        └── day_003.md           # Day 3: 暗号技術


## フォルダおよびファイル構成ルール

### Page Bundle構成の徹底
`content/` 配下のすべての記事は、以下の **Page Bundle** 構成（フォルダ + `index.md`）で作成する必要があります。単独の `.md` ファイルとしての配置は禁止します。

**Good:**
```
content/blog/category/article-slug/
├── index.md        # 記事本文
├── cover.jpg       # アイキャッチ画像
└── image.png       # 記事内画像
```

**Bad:**
```
content/blog/category/article-slug.md  # 禁止
```

## 今後の指針
- ブログとして公開するため50記事を作成する
- 簡易的なクイズツールを改良する

### クイズツールの改良案
クイズツールは出題と解答を、例題ファイル（シラバス）を入力（選択）することで、複数の資格試験に対応可能なようにする。
資格の名称
出題率
採点ー合格点数
例題