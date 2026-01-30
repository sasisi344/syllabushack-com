# Workspace Rules for GEMINI

## Project Type
This is a Hugo static site project focused on "Syllabus Hack" - using GenAI to conquer qualification exams.

## Content Rules

### Writing Style & Tone (Updated 2026-01-30)
*   **Target Audience**:
    *   Treat the reader as a **Beginner to GenAI**.
    *   When introducing prompts or AI operations, assume zero prior knowledge. Provide careful, step-by-step guidance (e.g., "Copy this text and paste it into ChatGPT").
*   **Emphasis Guidelines**:
    *   **Do NOT use brackets (`「」`) for emphasis.** Use brackets ONLY for dialogue (conversational content) or direct quotes.
    *   **Limit logic bolding (`**`)**: Use bold text ONLY for critical keywords or absolute takeaways. Avoid over-bolding entire sentences.

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

## Development Rules

### CSS & Styling
When creating new UI components with custom CSS:
- **Dark Mode is Required**: All custom CSS must support both light and dark modes.
- **Follow the Pattern**: See `.skills/dark_mode_css.md` for the standard implementation pattern using `html.dark`, `@media (prefers-color-scheme: dark)`, and `html.light` selectors.
- **Reference**: `assets/css/quiz.css` is the canonical example.

