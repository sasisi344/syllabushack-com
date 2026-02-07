---
name: Post Writer
description: Standard guidelines and template for writing Syllabus Hack blog posts.
---

# Post Writer Skill

Use this skill when creating or editing blog posts for Syllabus Hack.

## 1. Frontmatter Template

All new articles MUST start with this frontmatter structure. copy and paste this template.

```yaml
---
title: "記事タイトル"
description: "記事の概要・メタディスクリプション（120-200文字程度）"
date: 2026-XX-XX
categories: ["category_name"]
tags: ["Tag1", "Tag2", "Tag3"]
image: "cover.jpg"
toc: true
draft: false
---
```

## 2. Field Rules

*   **title**: 読者の興味を惹くキャッチーなタイトル。
*   **description**: 記事の内容を要約し、検索意図を意識した文章。
*   **date**: 作成日（YYYY-MM-DD形式）。
*   **categories**: 以下のいずれか1つを選択（配列形式だが値は単一）。
    *   `"trend"`: トレンド・試験情報
    *   `"method"`: 学習メソッド
    *   `"career"`: キャリア戦略
*   **tags**: 3〜5個。必ず `.skills/tag_rules.md` の標準化タグを使用すること。
*   **image**: 原則として `cover.jpg` を使用。
*   **toc**: 目次を表示する場合は `true`（最初のH2直前に表示）、不要な場合は `false`。
*   **draft**: 公開時は `false`。

## 3. Publication Rules (Before Moving to content/)

*   **Remove Prompts**: When moving an article from `_draft/` to `content/blog/`, you MUST remove any HTML comments containing image generation prompts (e.g., `<!-- Image Generation Prompt: ... -->`).

## 4. Writing Process Reference

*   Directory Structure: See `category_rules.md`
*   Tagging Strategy: See `tag_rules.md`
*   Image Guidelines: See `image_rules.md`
