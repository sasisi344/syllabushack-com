# CSS Dark Mode Styling Rules for Syllabus Hack

This skill defines the standard approach for implementing dark mode in custom CSS components within the Syllabus Hack Hugo project (using the Hextra theme).

## Theme Detection Method

The Hextra theme applies the `.dark` class to the `<html>` element when dark mode is active. Custom CSS must target this selector.

## Required Selectors

When creating new CSS components, implement dark mode support using **all three** of the following methods for maximum compatibility:

### 1. `html.dark` Selector (Primary)
This is the primary method, triggered when the user explicitly selects "Dark" mode in the theme toggle.

```css
html.dark .your-component {
    background: #1e293b;
    color: #e2e8f0;
    border-color: #334155;
}
```

### 2. `@media (prefers-color-scheme: dark)` (Fallback)
This handles users whose system is set to dark mode and who haven't explicitly chosen a theme (i.e., "System" preference).

```css
@media (prefers-color-scheme: dark) {
    .your-component {
        background: #1e293b;
        color: #e2e8f0;
        border-color: #334155;
    }
}
```

### 3. `html.light` Selector (Override - Optional)
This explicitly resets styles when the user selects "Light" mode, ensuring the media query fallback doesn't override it.

```css
html.light .your-component {
    background: #ffffff;
    color: #333333;
    border-color: #e0e0e0;
}
```

## Standard Color Palette

Use the following Tailwind-inspired Slate palette for consistency:

| Purpose             | Light Mode     | Dark Mode      |
| :------------------ | :------------- | :------------- |
| Background (Card)   | `#ffffff`      | `#1e293b`      |
| Background (Hover)  | `#f5f5f5`      | `#475569`      |
| Text (Primary)      | `#333333`      | `#e2e8f0`      |
| Text (Secondary)    | `#555555`      | `#cbd5e1`      |
| Border (Default)    | `#e0e0e0`      | `#334155`      |
| Border (Hover)      | `#bbbbbb`      | `#64748b`      |
| Success (BG)        | `#d1e7dd`      | `#14532d`      |
| Success (Text)      | `#0f5132`      | `#86efac`      |
| Error (BG)          | `#f8d7da`      | `#7f1d1d`      |
| Error (Text)        | `#842029`      | `#fca5a5`      |
| Accent (Badge BG)   | `#e3f2fd`      | `#1e3a5f`      |
| Accent (Badge Text) | `#1565c0`      | `#93c5fd`      |

## Example: Full Component Template

```css
/* ========================================
   Component: .my-new-widget
   ======================================== */

/* --- Base (Light Mode Default) --- */
.my-new-widget {
    background: #ffffff;
    border: 1px solid #e0e0e0;
    color: #333333;
    border-radius: 8px;
    padding: 1rem;
}

.my-new-widget:hover {
    border-color: #bbbbbb;
}

/* --- Dark Mode: html.dark --- */
html.dark .my-new-widget {
    background: #1e293b;
    border-color: #334155;
    color: #e2e8f0;
}

html.dark .my-new-widget:hover {
    border-color: #64748b;
}

/* --- Dark Mode: System Preference Fallback --- */
@media (prefers-color-scheme: dark) {
    .my-new-widget {
        background: #1e293b;
        border-color: #334155;
        color: #e2e8f0;
    }
    .my-new-widget:hover {
        border-color: #64748b;
    }
}

/* --- Light Mode: Explicit Override --- */
html.light .my-new-widget {
    background: #ffffff;
    border-color: #e0e0e0;
    color: #333333;
}
```

## Reference Implementation

See `assets/css/quiz.css` for a full working example of this pattern applied to the quiz component.
