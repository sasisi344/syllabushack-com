# Syllabus Hack 公開までのロードマップ

**基本方針:**

* **Vibecoding:** コードは書かずにAIに生成させる。データはExcelで管理し、スクリプトで変換する。
* **Target:** まずは「応用情報技術者試験 (AP)」の「セキュリティ」分野でプロトタイプを完成させる。

## ✅ Phase 0: 基盤構築（完了）

* [x] ドメイン取得 (`syllabushack.com`)
* [x] Hugoプロジェクト作成 & 初期ビルド
* [x] GitHubリポジトリ作成 & 初回コミット

---

## 🏗 Phase 1: データ製造ラインの構築 (最優先)

ここができれば、あとはコンテンツを流し込むだけになります。

* [x] **作業用ディレクトリの作成**
* ルートに `tools/` フォルダを作成（完了）。
* `.gitignore` に `tools/*.xlsx` を追加（完了）。


* [x] **Excelマスターデータの作成**
* `tools/master_data.xlsx` を作成（完了）。
* ヘッダー作成: `ID`, `exam_type`, `category`, `difficulty`, `tags`, `question`, `options_1`~`4`, `answer_index`, `explanation`, `ai_hint`。


* [x] **変換スクリプトの実装 (`convert.py`)**
* `tools/convert.py` を実装（完了）。
* スクリプトを配置し、ダミーデータで動作確認済み。



## 🧩 Phase 2: クイズエンジンの実装 (フロントエンド)

APIを使わず、静的JSONを読み込んで動く仕組みを作ります。

* [x] **TypeScript環境の整備** (Hugoのパイプライン確認)
* `assets/ts/` フォルダ作成（完了）。


* [x] **クイズロジックの実装 (`quiz.ts`)**
* `assets/ts/quiz.ts` を作成。JSON Fetch, ランダム抽出, UIレンダリングを実装（完了）。
* 機能要件: 4択表示、正解判定、解説表示、モックデータフォールバック実装済み。


* [x] **Hugoショートコードの作成**
* `layouts/shortcodes/quiz.html` を作成（完了）。
* 記事内で `{{< quiz category="security" >}}` と書けば動くように実装。CSSもあわせて `assets/css/quiz.css` に用意。



## 🧪 Phase 3: コンテンツ量産 (Vibecoding本番)

NotebookLMとGeminiを使って、データを「生成」します。

* [ ] **シラバス・過去問分析 (NotebookLM)**
* IPAのPDFを読み込ませる。
* プロンプト実行: 「頻出の『セキュリティ』用語20選と、それぞれのひっかけ問題のネタを出して」


* [ ] **Excelデータ入力**
* AIが出したネタをExcelにコピペ。
* `convert.py` を実行してJSON化。


* [ ] **解説記事の作成 (Hugo)**
* `content/ap/security/` 等に記事を作成。
* 記事本文もAIに下書きさせる。
* 記事内にクイズショートコードを埋め込む。



## 🎨 Phase 4: デザイン & 収益化準備

見た目を整え、お金が入る仕組みを作ります。

* [ ] **UI調整**
* クイズ画面のCSS調整（スマホで見やすいボタンサイズにする）。


* [ ] **機能追加: 苦手克服モード**
* `quiz.ts` に `localStorage` を使った苦手タグ保存機能を追加。


* [ ] **アフィリエイト・広告枠の設置**
* 記事下やクイズ結果画面に、仮のバナー画像（Amazonアソシエイト等）を配置する枠を作っておく。


* [ ] **Aboutページ / プライバシーポリシー作成**
* サイトの信頼性担保とAdSense審査用。



## 🚀 Phase 5: デプロイ & 公開

世界に公開します。

* [ ] **ホスティング設定 (Vercel推奨)**
* Vercelアカウント作成 & GitHubリポジトリ連携。
* Build Command: `hugo --gc --minify`


* [ ] **ドメイン接続**
* Vercel側で `syllabushack.com` を追加し、DNS設定を行う。


* [ ] **動作確認**
* PC/スマホでの表示崩れチェック。
* PWA化（manifest.json）の設定（※余裕があれば）。


* [ ] **公開 & SNS告知**
* X (Twitter) で「エンジニアが楽して作った資格サイト」として公開。



---

### 💡 今すぐやるべきこと

**Phase 1** の **「Excelマスターデータの作成」** からです。
まずはExcelを開き、1行目にヘッダーを入れるところから始めましょう！