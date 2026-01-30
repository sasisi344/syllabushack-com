# Syllabus Hack Soft Launch Checklist (2026-01-31)

## 1. Development & Build Check
*   [x] **Hugo Build Success**: `hugo` command runs without errors.
*   [x] **No Broken Links**: Check for 404s using a link checker or manual check.
*   [ ] **Mobile Responsiveness**: Verify layout on mobile view (Chrome DevTools).
*   [ ] **Dark/Light Mode**: Ensure theme switching works correctly (if applicable) or default styling is legible.
*   [x] **Favicon**: Verify favicon appears correctly.

## 2. Content & Metadata (SEO)
*   **Article Status**:
    *   [x] `concept-manifesto`: `draft: false`
    *   [x] `practice-guide-ipa`: `draft: false`
    *   [x] `trend-meaningless-controversy`: `draft: false`
    *   [x] `trend-cbt-news` (if exists): `draft: false`
*   **Frontmatter Check**:
    *   [x] `title`: Compelling and correct?
    *   [x] `description`: Present and optimal length?
    *   [x] `categories`: Correctly assigned (Trend, Method, Career)?
    *   [x] `tags`: standardized?
    *   [x] `date`: Set to launch date or recent?
*   **OGP/Cards**:
    *   [x] All articles have `cover.jpg` (or valid image source).
    *   [ ] Twitter Card / OGP tags are rendering correctly.

## 3. Deployment Flow (Vercel/GitHub Pages)
*   [ ] **Repository**: Clean `git status`. All changes committed.
*   [ ] **Build Command**: Verify Vercel/Netlify build settings (usually `hugo`).
*   [ ] **Environment Variables**: HUGO_VERSION set (production).
*   [ ] **Deploy**: Push to `main` and verify successful deployment.
*   [ ] **Domain**: Verify custom domain (syllabushack.com) resolution.

## 4. Post-Launch
*   [ ] **Google Search Console**: Submit sitemap (sitemap.xml).
*   [ ] **Analytics**: Verify GA4/counter script is firing.
*   [ ] **Social Share**: Post link on X (Twitter) / Note.
