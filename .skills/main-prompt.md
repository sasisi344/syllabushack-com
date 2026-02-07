# Main Prompt Annex (Syllabus Hack Project)

This document serves as a high-level operational directive, supplementing `GEMINI.md`. It defines the specific writing and development standards for the "Syllabus Hack" project. 

**IMPORTANT: LANGUAGE PROTOCOL**
- **Internal Reasoning/Instruction**: Defined in English for maximum efficiency and precision.
- **Output Content**: All reader-facing content (articles, descriptions, specific text within UI/images) MUST be in **Japanese**.

---

## 1. Core Mission & Philosophy
The core of Syllabus Hack is to **break through the barriers of qualification exams and learning using the latest GenAI technology**.

- **Tool-First Approach**: Treat AI (ChatGPT, Claude, etc.) strictly as tools. Avoid personification or suggesting the AI has "will" or "intent."
- **100% Reproducibility**: Ensure that if a reader copies a prompt provided in an article, they achieve exactly the same high-quality result.

---

## 2. Writing Rules (Content Strategy)

### 2.1 Tone and Structure
- **Audience**: Complete beginners curious about AI. Always explain technical terms in plain Japanese.
- **Introduction Pattern**: Start with a "Pain Point" (Why this exam/topic is hard) -> "AI Solution" -> "Immediate Benefit."
- **Unambiguous Steps**: Use numbered lists for AI operations to ensure the reader is never lost.

### 2.2 Formatting & Markdown (Crucial)
- **Header Brackets**: NEVER use brackets (`「」`) in headers. 
  - *Fine*: `## 合格への道`
  - *Bad*: `## 「合格」への道`
- **Bold Usage**: Bold **keywords only**. 
  - To prevent Japanese markdown rendering errors, always insert a half-width space or a zero-width space before and after the bold markers: ` **キーワード** `.
- **Bold Bracketing**: Do NOT wrap brackets in bold (`**「text」**`). Use `「**text**」`.
- **Rhythm & Visuals**: Avoid overly long text blocks. Periodically insert infographics or eye-catch images.

### 2.3 Visual Content & Image Generation
- **Infographics**: Focus on explaining items/concepts visually. Standard aspect ratio: **6:4**.
- **Eye-catch Images**: Symbolic/atmospheric, matching the article's mood.
- **Generation Workflow**:
  - During the draft phase, insert the English image generation prompt as a comment block where the image should be placed.
  - **Script Usage**: MUST use the dedicated script for image generation.
    - Path: `.skills/script/Antigravity-nanobana/generate-image.js`
    - Execution Example: `node .skills/script/Antigravity-nanobana/generate-image.js "english prompt here" "path/to/cover.jpg"`

### 2.4 Prompt Documentation
When introducing AI prompts in articles, use this 3-part structure:
1. **Description**: One line in Japanese explaining what the prompt does.
2. **Code Block**: The prompt itself in a markdown code block.
3. **User Guide**: Clear instructions in Japanese (e.g., "Copy this and replace [ ] with your topic").

---

## 3. Development & Tooling Rules

### 3.1 UI/UX Standards
- **Dark Mode Mandatory**: All CSS must follow the pattern in `.skills/dark_mode_css.md` (supporting both `html.dark` and `prefers-color-scheme`).
- **Simplicity**: Interactive elements (buttons, forms, quizzes) must be intuitive and minimalist.

### 3.2 Prompt Tool Standardization
Prompts provided in `blog/method/` should function as "tools," including:
- **System Role**: Explicitly defining the AI's persona/role.
- **Output Format**: Specifying Markdown, CSV, or JSON for easy downstream use.

---

## 4. Operational Workflow (Skill Integration)

Always reference the `.skills` directory based on the task:
1. **Article Setup**: Use `post_writer.md` for the template.
2. **Pathing**: Consult `content-directory.md`.
3. **Tags**: Use `tag_rules.md` to prevent notation inconsistencies.
4. **Visuals**: strictly follow `image_rules.md`.

---

## Change Log
- 2026-02-06: Initial version created. Defined core writing and development rules.
- 2026-02-06 (Revision): Optimized for English efficiency. Clarified Japanese output requirements.
