# Syllabus Hack: Essay Trainer (BYOK Edition)

これは、応用情報技術者試験などの記述式（論文）問題のトレーニングを行うためのPythonスクリプトです。
あなたの Google Gemini API Key を使用して、無限に問題を生成し、AIによる即時採点を受けることができます。

## 特徴
- **Bring Your Own Key (BYOK)**: ユーザー自身のAPIキーを使用するため、サーバーコストを気にせず利用可能。
- **Gemini 1.5 Flash**: 高速かつ安価（無料枠内でも利用可能）なモデルを使用。
- **即時フィードバック**: 自分の回答に対して、合否・スコア・模範解答・アドバイスを提示。

## 使い方

1. 必要なライブラリをインストールします:
   ```bash
   pip install -r requirements.txt
   ```

2. スクリプトを実行します:
   ```bash
   python trainer.py
   ```

3. 起動時に API Key の入力を求められます。
   - Google AI Studio (https://aistudio.google.com/) でキーを取得してください。
   - または、`.env` ファイルに `GEMINI_API_KEY=your_key_here` を設定しておくと自動で読み込みます。

4. トレーニングしたいカテゴリを選択し、出題された問題に回答してください。

## 問題の追加方法

`syllabus_data.json` を編集することで、好きな問題をデータセットに追加できます。
以下の形式で記述してください：

```json
"Category Name": [
  {
    "theme": "テーマ名",
    "question": "ここに問題文を記述..."
  }
]
```
