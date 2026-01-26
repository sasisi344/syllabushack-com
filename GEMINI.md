# Workspace Rules for GEMINI

## Project Type
This is a Hugo static site project focused on "Syllabus Hack" - using GenAI to conquer qualification exams.

## Content Rules

### Directory Structure & Categories
Articles must be created in `content/blog/{category}/`.
The allowed categories are exactly these three:

1.  **trend** (`content/blog/trend/`)
    -   **Display Name**: トレンド・試験情報
    -   **Content**: Exam news, syllabus updates, Latest AI news related to exams.
2.  **method** (`content/blog/method/`)
    -   **Display Name**: 学習メソッド
    -   **Content**: The "Syllabus Hack" core methods, prompt tools, study hacks, infinite drill generation.
3.  **career** (`content/blog/career/`)
    -   **Display Name**: キャリア戦略
    -   **Content**: Career paths after passing, salary info, portfolio building, success stories.

### Frontmatter Constraint
- `categories`: Must be an array with a SINGLE string value matching the directory name.
  - OK: `categories: ["trend"]`
  - OK: `categories: ["method"]`
  - OK: `categories: ["career"]`
  - NG: `categories: ["Tools"]` (Use 'method' instead)
- `tags`:
  - **Count**: 3 to 5 tags.
  - **Standardization**: MUST use the canonical tag for exam names (see `.skills/tag_rules.md`).
    - OK: `tags: ["基本情報技術者", "アルゴリズム", "SyllabusHack"]`
    - NG: `tags: ["FE", "基本情報", "アルゴリズム"]` (Duplicate meaning, alias used)
