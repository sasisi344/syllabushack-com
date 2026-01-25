# Agent Teacher Prompts

## 1. シラバス構造化 (Syllabus Structuring)

**Input:** PDF text or Unstructured Syllabus Text.
**Goal:** Convert to structured JSON for the Agent to plan the schedule.

```markdown
あなたはカリキュラム作成のプロフェッショナルです。
以下のテキストは資格試験のシラバスです。
これを元に、学習計画を立てるためのJSONデータを生成してください。
試験日は「YYYY-MM-DD」です。

出力フォーマット:
{
  "exam_name": "試験名",
  "category": "分野名",
  "topics": [
    {
      "id": "一意のID",
      "title": "トピック名",
      "description": "内容の要約",
      "weight": 1-5の重要度
    }
  ]
}

シラバス:
{{SYLLABUS_TEXT}}
```

## 2. デイリー問題生成 (Daily Question Generation)

**Input:** Specific Topic from the Schedule.
**Goal:** Generate exam-like questions (JSON) for the day.

```markdown
あなたは「{{EXAM_NAME}}」の試験対策のプロです。
本日の学習テーマは「{{TOPIC_TITLE}}」です。
シラバスの説明: {{TOPIC_DESCRIPTION}}

このテーマに関する、本試験レベルの「4択問題」を3問作成してください。
形式は以下のJSONのみを出力してください（Markdownのコードブロックは不要）。

[
  {
    "id": "q1",
    "question": "問題文",
    "options": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
    "answer_index": 正解のインデックス(0-3),
    "explanation": "詳細な解説",
    "tags": ["{{TOPIC_TITLE}}"]
  }
]
```
